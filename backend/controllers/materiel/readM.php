<?php
require_once __DIR__ . '/../../config/database.php';

header("Content-Type: application/json");

// Sélectionner uniquement les matériels avec stock > 0
$stmt = $pdo->query("
    SELECT m.*, f.nom_fourniture
    FROM materiel m
    JOIN fournitures f ON m.id_fourniture = f.id_fourniture
");

$materiels = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    "success" => true,
    "data" => $materiels
]);
?>