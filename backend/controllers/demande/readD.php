<?php

require_once __DIR__ . '/../../config/database.php';
header("Content-Type: application/json");

$stmt = $pdo->query("
SELECT d.*, u.username, m.designation, COALESCE(s.qte_stock, 0) as qte_stock
FROM demandes d
LEFT JOIN utilisateurs u ON d.id_user = u.id_user
LEFT JOIN materiel m ON d.id_materiel = m.id_materiel
LEFT JOIN stock s ON m.id_materiel = s.id_materiel
");

$data = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
"success"=>true,
"data"=>$data
]);