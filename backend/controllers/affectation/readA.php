<?php

require_once __DIR__ . '/../../config/database.php';
header("Content-Type: application/json");

$stmt = $pdo->query("
SELECT a.*, s.nom_service
FROM affectation a
JOIN services s ON a.id_service = s.id_service
");

$data = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
"success"=>true,
"data"=>$data
]);