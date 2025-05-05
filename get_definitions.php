<?php
header('Content-Type: application/json');

// Connexion à la base de données
try {
    $pdo = new PDO('mysql:host=localhost;dbname=vocabulaire_musical;charset=utf8', 'root', '');
} catch (PDOException $e) {
    echo json_encode(["error" => "Erreur de connexion à la base de données: " . $e->getMessage()]);
    exit;
}

// Requête
$stmt = $pdo->query('SELECT nom, definition, image, audio FROM vocabulaire_musical');

// Construction du tableau
$vocabulaire_musical = [];
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $definitions[$row['nom']] = [
        'definition' => $row['definition'],
        'image' => $row['image'],
        'audio' => $row['audio']
    ];
}

// Envoi JSON
echo json_encode($definitions);
