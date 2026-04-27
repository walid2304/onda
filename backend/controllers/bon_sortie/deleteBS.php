<?php
require_once __DIR__ . '/../../config/database.php';

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

$sql = "DELETE FROM bon_sortie WHERE id_bs = :id_bs";

$stmt = $pdo->prepare($sql);

$result = $stmt->execute([
    ':id_bs' => $data['id_bs']
]);

echo json_encode([
    "success" => $result,
    "message" => $result ? "Bon sortie supprimé" : "Erreur"
]);