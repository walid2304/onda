<?php
require_once __DIR__ . '/../../config/database.php';

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if(!isset($data['id_materiel'])){
    echo json_encode([
        "success"=>false,
        "message"=>"ID requis"
    ]);
    exit;
}

$stmt = $pdo->prepare("DELETE FROM materiel WHERE id_materiel=?");

$success = $stmt->execute([$data['id_materiel']]);

echo json_encode(
    $success
    ? ["success"=>true,"message"=>"Materiel supprime"]
    : ["success"=>false,"message"=>"Erreur suppression"]
);