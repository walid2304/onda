<?php

require_once __DIR__ . '/../../config/database.php';
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if(empty($data['id_affe'])){
    echo json_encode([
        "success"=>false,
        "message"=>"ID requis"
    ]);
    exit;
}

$stmt = $pdo->prepare("
UPDATE affectation
SET nom=?, email=?, phone=?, id_service=?
WHERE id_affe=?
");

$success = $stmt->execute([
    $data['nom'],
    $data['email'],
    $data['phone'],
    $data['id_service'],
    $data['id_affe']
]);

if($success){
    // Récupère l'affectation mise à jour
    $stmt2 = $pdo->prepare("SELECT a.*, s.nom_service FROM affectation a JOIN services s ON a.id_service=s.id_service WHERE id_affe=?");
    $stmt2->execute([$data['id_affe']]);
    $updated = $stmt2->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        "success"=>true,
        "message"=>"Affectation modifiée",
        "updated" => $updated
    ]);
} else {
    echo json_encode([
        "success"=>false,
        "message"=>"Erreur modification"
    ]);
}