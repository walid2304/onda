<?php
require_once __DIR__ . '/../../config/database.php';
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['designation'],$data['id_fourniture'])) {
    echo json_encode([
        "success" => false,
        "message" => "Champs manquants"
    ]);
    exit;
}

// Insertion
$stmt = $pdo->prepare("
INSERT INTO materiel (designation, id_fourniture)
VALUES (?, ?)
");

$success = $stmt->execute([
    $data['designation'],
    $data['id_fourniture']
]);

if ($success) {
    // Récupérer l'ID du matériel ajouté
    $id = $pdo->lastInsertId();

    // Récupérer le matériel complet avec la fourniture
    $stmt2 = $pdo->prepare("
        SELECT m.*, f.nom_fourniture
        FROM materiel m
        JOIN fournitures f ON m.id_fourniture = f.id_fourniture
        WHERE m.id_materiel = ?
    ");
    $stmt2->execute([$id]);
    $materiel = $stmt2->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "data" => $materiel,
        "message" => "Materiel ajouté"
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Erreur ajout"
    ]);
}