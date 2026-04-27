<?php

require_once __DIR__ . '/../../config/database.php';
header("Content-Type: application/json");

$stmt = $pdo->query("
SELECT 
        s.id_stock,
        s.id_materiel,
        s.qte_stock,
        s.date_maj,
        m.designation
FROM stock s
JOIN materiel m ON s.id_materiel = m.id_materiel
");

$data = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
        "success" => true,
        "data" => $data
]);