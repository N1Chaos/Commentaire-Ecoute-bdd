// -------------------------
// GESTION DES MOTS
// -------------------------
function deleteWord(word) {
    let selectedWords = JSON.parse(localStorage.getItem('selectedWords')) || [];
    selectedWords = selectedWords.filter(w => w !== word);
    localStorage.setItem('selectedWords', JSON.stringify(selectedWords));

    const wordContainer = document.querySelector(`[data-word="${word}"]`);
    wordContainer.classList.add('removed');
    setTimeout(() => {
        wordContainer.remove();
        displaySelectedWords();
    }, 300);
}

function clearSelectedWords() {
    if (confirm('Voulez-vous vraiment effacer toute la sélection ?')) {
        const selectedWordsDisplay = document.getElementById('selectedWordsDisplay');
        selectedWordsDisplay.innerHTML = '';
        localStorage.removeItem('selectedWords');
    }
}

function displaySelectedWords() {
    const selectedWordsDisplay = document.getElementById('selectedWordsDisplay');
    const selectedWords = JSON.parse(localStorage.getItem('selectedWords')) || [];
    selectedWordsDisplay.innerHTML = '';

    selectedWords.forEach(word => {
        const wordContainer = document.createElement('div');
        wordContainer.classList.add('word-container');
        wordContainer.setAttribute('data-word', word);

        const wordText = document.createElement('span');
        wordText.textContent = word;

        const deleteIcon = document.createElement('span');
        deleteIcon.textContent = '✖';
        deleteIcon.classList.add('delete-icon');
        deleteIcon.onclick = () => {
            if (confirm(`Voulez-vous vraiment supprimer "${word}" ?`)) {
                deleteWord(word);
            }
        };

        wordContainer.appendChild(wordText);
        wordContainer.appendChild(deleteIcon);
        selectedWordsDisplay.appendChild(wordContainer);
    });
}

// -------------------------
// GESTION DE LA VIDÉO YOUTUBE
// -------------------------
function loadVideo() {
    const videoUrl = document.getElementById('videoUrl').value;
    const videoID = extractVideoID(videoUrl);
    if (videoID) {
        document.getElementById('youtubePlayer').src = `https://www.youtube.com/embed/${videoID}`;
        localStorage.setItem('youtubeVideoID', videoID);
    } else {
        alert('Veuillez entrer une URL YouTube valide.');
    }
}

function extractVideoID(url) {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?|watch)\S*?[?&]v=)|youtu\.be\/)([^&\n]{11})/;
    const matches = url.match(regex);
    return matches ? matches[1] : null;
}

// -------------------------
// DOMContentLoaded
// -------------------------
document.addEventListener('DOMContentLoaded', function () {
    // Affiche les mots sélectionnés
    displaySelectedWords();

    // Recharge la vidéo YouTube
    const savedVideoID = localStorage.getItem('youtubeVideoID');
    if (savedVideoID) {
        document.getElementById('youtubePlayer').src = `https://www.youtube.com/embed/${savedVideoID}`;
        document.getElementById('videoUrl').value = `https://www.youtube.com/watch?v=${savedVideoID}`;
    }

    // Enregistrement audio (micro)
    let audioBlob;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
            const mediaRecorder = new MediaRecorder(stream);
            let audioChunks = [];

            mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
            mediaRecorder.onstop = () => {
                audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(audioBlob);
                document.getElementById('audioPlayback').src = audioUrl;
                document.getElementById('audioPlayback').style.display = 'block';
                document.getElementById('status').textContent = 'Enregistrement terminé';
            };

            document.getElementById('recordButton').onclick = function () {
                if (mediaRecorder.state === 'inactive') {
                    audioChunks = [];
                    mediaRecorder.start();
                    this.textContent = "Arrêter l'enregistrement";
                } else {
                    mediaRecorder.stop();
                    this.textContent = "Démarrer l'enregistrement";
                }
            };
        }).catch(error => {
            alert("Une erreur est survenue lors de l'accès au microphone.");
            console.error("Erreur d'accès au micro : ", error);
        });
    }

    // Téléchargement du commentaire audio
    document.getElementById('downloadButton').onclick = function () {
        if (!audioBlob) {
            alert('Aucun enregistrement audio disponible pour le téléchargement.');
            return;
        }
        const fileName = document.getElementById('fileName').value || 'audio';
        const link = document.createElement('a');
        link.href = URL.createObjectURL(audioBlob);
        link.download = `${fileName}.wav`;
        link.click();
    };

    // -------------------------
    // AUDIO UTILISATEUR AVEC SAUVEGARDE BASE64
    // -------------------------
    const audioPlayer = document.getElementById('audioPlayer');
    const audioSource = document.getElementById('audioSource');
    const audioFileInput = document.getElementById('audioFile');

    // Restaure audio
    const savedBase64 = localStorage.getItem('userAudioBase64');
    const savedTime = localStorage.getItem('userAudioTime');

    if (savedBase64) {
        audioSource.src = savedBase64;
        audioPlayer.load();

        audioPlayer.addEventListener('loadedmetadata', () => {
            if (savedTime) {
                audioPlayer.currentTime = parseFloat(savedTime);
            }
        });

        audioPlayer.addEventListener('timeupdate', () => {
            localStorage.setItem('userAudioTime', audioPlayer.currentTime);
        });
    }

    // Lors de sélection d’un nouveau fichier
    audioFileInput.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (e) {
            const base64Audio = e.target.result;
            audioSource.src = base64Audio;
            audioPlayer.load();

            localStorage.setItem('userAudioBase64', base64Audio);
            localStorage.setItem('userAudioTime', '0');
        };
        reader.readAsDataURL(file);
    });
});

// -------------------------
// GÉNÉRER UN FICHIER TEXTE (COMMENTAIRE)
// -------------------------
function generateTextFile() {
    const textContent = document.getElementById('commentText').value;
    if (textContent.trim() === '') {
        alert('Veuillez écrire quelque chose avant de générer le fichier.');
        return;
    }
    const blob = new Blob([textContent], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'commentaire.txt';
    link.click();
}
