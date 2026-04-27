<?php

require_once __DIR__ . '/../../config/database.php';
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if(!isset($data['id_service'])){
    echo json_encode([
        "success"=>false,
        "message"=>"ID service requis"
    ]);
    exit;
}

$stmt = $pdo->prepare("DELETE FROM services WHERE id_service=?");

$success = $stmt->execute([$data['id_service']]);

echo json_encode(
$success
? ["success"=>true,"message"=>"Service supprimé"]
: ["success"=>false,"message"=>"Erreur suppression"]
);