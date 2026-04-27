<?php
require_once __DIR__ . '/../../config/database.php';

header("Content-Type: application/json");

$stmt = $pdo->query("SELECT * FROM fournitures");

$fournitures = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    "success" => true,
    "data" => $fournitures
]);