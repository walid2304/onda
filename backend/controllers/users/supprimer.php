<?php
require_once __DIR__ . '/../../config/database.php';


header("Content-Type: application/json");


$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id_user']) || empty($data['id_user'])) {
    echo json_encode([
        "success" => false,
        "message" => "ID utilisateur requis."
    ]);
    exit;
}

$id = $data['id_user'];

$stmt = $pdo->prepare("DELETE FROM utilisateurs WHERE id_user = ?");
$success = $stmt->execute([$id]);

echo json_encode(
    $success
    ? ["success" => true, "message" => "Utilisateur supprimé."]
    : ["success" => false, "message" => "Erreur lors de la suppression."]
);