// Définir les définitions des mots
let wordDefinitions = {};

fetch('../get_definitions.php')
    .then(response => response.json())
    .then(data => {
        wordDefinitions = data;
    })
    .catch(error => {
        console.error('Erreur lors du chargement des définitions:', error);
    });


// Fonction pour gérer la sélection des mots
const words = document.querySelectorAll('.selectable');
const definitionContainer = document.getElementById('definition-container');
const definitionTitle = document.getElementById('definition-title');
const definitionText = document.getElementById('definition-text');
const definitionImage = document.getElementById('definition-image');
const definitionAudio = document.getElementById('definition-audio');
const definitionAudioSource = document.getElementById('definition-audio-source');

// Redimensionnement du conteneur
let isResizing = false;
let startX, startY, startWidth, startHeight;

definitionContainer.addEventListener('mousedown', (e) => {
    const rect = definitionContainer.getBoundingClientRect();
    const handleSize = 20; // Taille de la zone de redimensionnement

    if (
        e.clientX >= rect.left &&
        e.clientX <= rect.left + handleSize &&
        e.clientY >= rect.bottom - handleSize &&
        e.clientY <= rect.bottom
    ) {
        isResizing = true;
        startX = e.clientX;
        startY = e.clientY;
        startWidth = parseFloat(getComputedStyle(definitionContainer).width);
        startHeight = parseFloat(getComputedStyle(definitionContainer).height);
        e.preventDefault();
    }
});

document.addEventListener('mousemove', (e) => {
    if (isResizing) {
        const newWidth = startWidth - (e.clientX - startX); // Réduire la largeur vers la gauche
        const newHeight = startHeight + (e.clientY - startY); // Augmenter la hauteur vers le bas
        definitionContainer.style.width = `${Math.max(250, Math.min(newWidth, 600))}px`;
        definitionContainer.style.height = `${Math.max(200, Math.min(newHeight, 800))}px`;
    }
});

document.addEventListener('mouseup', () => {
    isResizing = false;
});

// Gestion de la sélection des mots
words.forEach(word => {
    word.addEventListener('click', () => {
        word.classList.toggle('selected'); // Toggling de la classe 'selected'

        if (word.classList.contains('selected')) {
            const wordData = wordDefinitions[word.textContent];
            if (wordData) {
                // Afficher la définition
                definitionTitle.textContent = word.textContent;
                definitionText.innerHTML = wordData.definition.replace(/\n/g, '<br>');

                // Gérer l'image
                if (wordData.image) {
                    definitionImage.src = wordData.image;
                    definitionImage.style.display = 'block';
                } else {
                    definitionImage.style.display = 'none';
                }

                // Gérer l'audio
                if (wordData.audio) {
                    definitionAudioSource.src = wordData.audio;
                    definitionAudio.style.display = 'block';
                    definitionAudio.load();
                } else {
                    definitionAudio.style.display = 'none';
                }
            }
            definitionContainer.style.display = 'block'; // Afficher le cadre de définition
        } else {
            definitionContainer.style.display = 'none'; // Masquer le cadre
        }
    });
});

// Fonction pour annuler la sélection
function clearSelection() {
    if (confirm('Êtes-vous sûr de vouloir annuler toutes vos sélections ?')) {
        words.forEach(word => word.classList.remove('selected'));
        definitionContainer.style.display = 'none';
    }
}

// Fonction pour retourner les mots sélectionnés
function returnWords() {
    const selectedWordsOnPage = Array.from(document.querySelectorAll('.selected')).map(el => el.textContent);
    let selectedWords = JSON.parse(localStorage.getItem('selectedWords')) || [];
    selectedWordsOnPage.forEach(word => {
        if (!selectedWords.includes(word)) selectedWords.push(word);
    });
    localStorage.setItem('selectedWords', JSON.stringify(selectedWords));
    window.location.href = "../index.html";
}

// Fonction pour fermer le cadre de définition
function closeDefinition() {
    definitionContainer.style.display = 'none';
}

// Fonction pour retourner à la page d'accueil
function goToHomePage() {
    window.location.href = "../index.html";
}