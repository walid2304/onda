<?php
require_once __DIR__ . '/../../config/database.php';
header("Content-Type: application/json");

$sql = "
SELECT bs.*, d.quantite, d.date_demande, d.statut, m.designation, u.username, s.qte_stock
FROM bon_sortie bs
JOIN demandes d ON bs.id_demande = d.id_demande
JOIN materiel m ON d.id_materiel = m.id_materiel
JOIN utilisateurs u ON d.id_user = u.id_user
LEFT JOIN stock s ON m.id_materiel = s.id_materiel
";

$stmt = $pdo->prepare($sql);
$stmt->execute();

$data = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($data);