<?php

require_once __DIR__ . '/../../config/database.php';
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if(!isset($data['id_stock'],$data['id_materiel'],$data['qte_stock'])){
    echo json_encode([
        "success"=>false,
        "message"=>"Champs manquants"
    ]);
    exit;
}

$stmt = $pdo->prepare("
UPDATE stock
SET id_materiel=?, qte_stock=?, date_maj=NOW()
WHERE id_stock=?
");

$stmt->execute([
$data['id_materiel'],
$data['qte_stock'],
$data['id_stock']
]);

$stmt = $pdo->prepare("
SELECT s.id_stock, s.id_materiel, s.qte_stock, s.date_maj,
        m.designation
FROM stock s
JOIN materiel m ON s.id_materiel = m.id_materiel
WHERE s.id_stock=?
");

$stmt->execute([$data['id_stock']]);
$stock = $stmt->fetch(PDO::FETCH_ASSOC);

echo json_encode([
"success"=>true,
"data"=>$stock
]);