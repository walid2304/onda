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

$stmt = $pdo->prepare("
UPDATE materiel SET
designation=?,
id_fourniture=?
WHERE id_materiel=?
");

$success = $stmt->execute([
    $data['designation'],
    $data['id_fourniture'],
    $data['id_materiel']
]);

if ($success) {
    // Récupérer matériel complet après modification
    $stmt2 = $pdo->prepare("
        SELECT m.*, f.nom_fourniture
        FROM materiel m
        JOIN fournitures f ON m.id_fourniture = f.id_fourniture
        WHERE m.id_materiel = ?
    ");
    $stmt2->execute([$data['id_materiel']]);
    $materiel = $stmt2->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "data" => $materiel,
        "message" => "Materiel modifié"
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Erreur modification"
    ]);
}