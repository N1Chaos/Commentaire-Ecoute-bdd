<?php
header('Content-Type: application/json');

// Connexion à la base de données
try {
    $pdo = new PDO('mysql:host=localhost;dbname=vocabulaire_musical;charset=utf8', 'root', '');
} catch (PDOException $e) {
    echo json_encode(["error" => "Erreur de connexion : " . $e->getMessage()]);
    exit;
}

// Requête
$stmt = $pdo->query('SELECT mot, definition, image, audio FROM definitions');

// Construction du tableau
$definitions = [];
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $definitions[$row['mot']] = [
        'definition' => $row['definition'],
        'image' => $row['image'],
        'audio' => $row['audio']
    ];
}

// Envoi JSON
echo json_encode($definitions);
?>
