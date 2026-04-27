<?php

require_once __DIR__ . '/../../config/database.php';
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if(!isset($data['nom_service']) || empty($data['nom_service'])){
    echo json_encode([
        "success"=>false,
        "message"=>"Nom du service requis"
    ]);
    exit;
}

$stmt = $pdo->prepare("
INSERT INTO services (nom_service, description)
VALUES (?,?)
");

$success = $stmt->execute([
$data['nom_service'],
$data['description'] ?? null
]);

echo json_encode(
$success
? ["success"=>true,"message"=>"Service ajouté"]
: ["success"=>false,"message"=>"Erreur ajout"]
);