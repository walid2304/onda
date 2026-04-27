<?php

require_once __DIR__ . '/../../config/database.php';
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if(!isset($data['id_demande'])){
echo json_encode([
"success"=>false,
"message"=>"ID requis"
]);
exit;
}

$stmt = $pdo->prepare("DELETE FROM demandes WHERE id_demande=?");

$success = $stmt->execute([$data['id_demande']]);

echo json_encode(
$success
? ["success"=>true,"message"=>"Demande supprimée"]
: ["success"=>false,"message"=>"Erreur suppression"]
);