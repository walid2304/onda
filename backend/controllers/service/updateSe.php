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

// Update
$stmt = $pdo->prepare("
UPDATE services
SET nom_service=?, description=?
WHERE id_service=?
");

$success = $stmt->execute([
    $data['nom_service'],
    $data['description'],
    $data['id_service']
]);

if($success){
    // Récupère le service mis à jour
    $stmt2 = $pdo->prepare("SELECT * FROM services WHERE id_service=?");
    $stmt2->execute([$data['id_service']]);
    $updatedService = $stmt2->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "message" => "Service modifié",
        "data" => $updatedService
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Erreur modification"
    ]);
}
?>