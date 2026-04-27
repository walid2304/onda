<?php

require_once __DIR__ . '/../../config/database.php';
header("Content-Type: application/json");

$stmt = $pdo->query("
SELECT 
m.id_materiel,
m.designation,
s.qte_stock
FROM materiel m
JOIN stock s ON m.id_materiel = s.id_materiel
WHERE s.qte_stock > 0
");

$data = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
"success" => true,
"data" => $data
]);