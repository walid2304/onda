<?php
require_once __DIR__ . '/../../config/database.php';

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if(!isset($data['id_fourniture'],$data['nom_fourniture'])){
    echo json_encode([
        "success"=>false,
        "message"=>"Donnees manquantes"
    ]);
    exit;
}

$stmt = $pdo->prepare("UPDATE fournitures SET nom_fourniture=? WHERE id_fourniture=?");

$success = $stmt->execute([
    $data['nom_fourniture'],
    $data['id_fourniture']
]);

echo json_encode(
    $success
    ? ["success"=>true,"message"=>"Fourniture modifiee"]
    : ["success"=>false,"message"=>"Erreur modification"]
);