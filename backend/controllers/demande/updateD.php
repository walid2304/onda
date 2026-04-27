<?php

require_once __DIR__ . '/../../config/database.php';
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if(
    !isset(
        $data['id_demande'],
        $data['quantite']
    )
){
    echo json_encode([
        "success"=>false,
        "message"=>"Champs manquants"
    ]);
    exit;
}

// Récupérer les valeurs actuelles et le stock
$stmt = $pdo->prepare("
    SELECT d.id_materiel, m.id_materiel as mat_id
    FROM demandes d
    JOIN materiel m ON d.id_materiel = m.id_materiel
    WHERE d.id_demande = ?
");
$stmt->execute([$data['id_demande']]);
$current = $stmt->fetch(PDO::FETCH_ASSOC);

// Récupérer la quantité en stock
$stmtStock = $pdo->prepare("SELECT qte_stock FROM stock WHERE id_materiel = ?");
$stmtStock->execute([$current['id_materiel']]);
$stock = $stmtStock->fetch(PDO::FETCH_ASSOC);
$quantite_stock = $stock['qte_stock'] ?? 0;

// Calculer le reste à livrer = stock - quantité demandée
$quantite_demandee = $data['quantite'];
$reste_livrer_value = $quantite_stock - $quantite_demandee;

$stmt = $pdo->prepare("
UPDATE demandes
SET quantite = ?, reste_livrer = ?, date_reception = ?, statut = ?, observation = ?
WHERE id_demande = ?
");

$success = $stmt->execute([
    $data['quantite'],
    $reste_livrer_value,
    $data['date_reception'] ?? null,
    $data['statut'] ?? 'en_attente',
    $data['observation'] ?? '',
    $data['id_demande']
]);

if($success) {
    $stmt = $pdo->prepare("
        SELECT d.*, u.username, m.designation, COALESCE(s.qte_stock, 0) as qte_stock
        FROM demandes d
        LEFT JOIN utilisateurs u ON d.id_user = u.id_user
        LEFT JOIN materiel m ON d.id_materiel = m.id_materiel
        LEFT JOIN stock s ON m.id_materiel = s.id_materiel
        WHERE d.id_demande = ?
    ");
    $stmt->execute([$data['id_demande']]);
    $demande = $stmt->fetch(PDO::FETCH_ASSOC);
    echo json_encode(["success"=>true,"message"=>"Demande modifiée","data"=>$demande]);
} else {
    echo json_encode(["success"=>false,"message"=>"Erreur modification"]);
}