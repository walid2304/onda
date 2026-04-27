<?php
require_once __DIR__ . '/../../config/database.php';
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id_materiel'], $data['qte_stock'])) {
    echo json_encode(["success" => false, "message" => "Champs manquants"]);
    exit;
}

$stmt = $pdo->prepare("INSERT INTO stock (id_materiel, qte_stock) VALUES (?, ?)");
$success = $stmt->execute([$data['id_materiel'], $data['qte_stock']]);

if (!$success) {
    echo json_encode(["success" => false, "message" => "Erreur ajout"]);
    exit;
}

// Récupérer le stock ajouté avec la jointure
$id_stock = $pdo->lastInsertId();
$stmt = $pdo->prepare("
    SELECT s.id_stock, s.qte_stock, s.date_maj,
            m.designation
    FROM stock s
    JOIN materiel m ON s.id_materiel = m.id_materiel
    WHERE s.id_stock = ?
");
$stmt->execute([$id_stock]);
$stock = $stmt->fetch(PDO::FETCH_ASSOC);

echo json_encode(["success" => true, "data" => $stock]);