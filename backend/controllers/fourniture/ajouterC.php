<?php
require_once __DIR__ . '/../../config/database.php';

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if(!isset($data['nom_fourniture']) || empty($data['nom_fourniture'])){
    echo json_encode([
        "success" => false,
        "message" => "Nom de fourniture obligatoire"
    ]);
    exit;
}

$nom = trim($data['nom_fourniture']);

$stmt = $pdo->prepare("INSERT INTO fournitures (nom_fourniture) VALUES (?)");
$success = $stmt->execute([$nom]);

if ($success) {
    $id = $pdo->lastInsertId();
    echo json_encode([
        "success" => true,
        "message" => "Fourniture ajoutee",
        "fourniture" => ["id" => $id, "nom_fourniture" => $nom]
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Erreur ajout fourniture"
    ]);
}