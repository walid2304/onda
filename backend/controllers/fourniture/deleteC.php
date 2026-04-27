<?php
require_once __DIR__ . '/../../config/database.php';

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if(!isset($data['id_fourniture'])){
    echo json_encode([
        "success"=>false,
        "message"=>"ID requis"
    ]);
    exit;
}

$stmt = $pdo->prepare("DELETE FROM fournitures WHERE id_fourniture=?");

$success = $stmt->execute([$data['id_fourniture']]);

echo json_encode(
    $success
    ? ["success"=>true,"message"=>"Fourniture supprimee"]
    : ["success"=>false,"message"=>"Erreur suppression"]
);