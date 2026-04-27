<?php

require_once __DIR__ . '/../../config/database.php';
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['nom'],$data['email'],$data['phone'],$data['id_service'])) {
    echo json_encode([
        "success" => false,
        "message" => "Champs manquants"
    ]);
    exit;
}
$stmt = $pdo->prepare("
INSERT INTO affectation (nom,email,phone,id_service)
VALUES (?,?,?,?)
");

$success = $stmt->execute([
    $data['nom'],
    $data['email'],
    $data['phone'],
    $data['id_service']
]);

if($success){
    // Récupérer la dernière ligne insérée avec la jointure
    $lastId = $pdo->lastInsertId();
    $stmt2 = $pdo->prepare("
        SELECT a.*, s.nom_service
        FROM affectation a
        JOIN services s ON a.id_service = s.id_service
        WHERE a.id_affe = ?
    ");
    $stmt2->execute([$lastId]);
    $newAffectation = $stmt2->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "message" => "Affectation ajoutée",
        "data" => $newAffectation // <-- contient maintenant nom_service
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Erreur ajout"
    ]);
}