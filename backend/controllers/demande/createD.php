<?php

require_once __DIR__ . '/../../config/database.php';
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if(!isset($data['id_user'],$data['id_materiel'],$data['quantite'])){
echo json_encode([
"success"=>false,
"message"=>"Champs manquants"
]);
exit;
}

$stmt = $pdo->prepare("
INSERT INTO demandes
(id_user,id_materiel,quantite,date_demande,statut,solde,reste_livrer,observation)
VALUES (?,?,?,?,?,?,?,?)
");

$success = $stmt->execute([
$data['id_user'],
$data['id_materiel'],
$data['quantite'],
date("Y-m-d"),
"en_attente",
$data['solde'] ?? 0,
0,  // Au départ, reste_livrer sera calculé à la création du bon de sortie
$data['observation'] ?? ''
]);

if($success) {
    $id_demande = $pdo->lastInsertId();
    $stmt = $pdo->prepare("
        SELECT d.*, u.username, m.designation, COALESCE(s.qte_stock, 0) as qte_stock
        FROM demandes d
        LEFT JOIN utilisateurs u ON d.id_user = u.id_user
        LEFT JOIN materiel m ON d.id_materiel = m.id_materiel
        LEFT JOIN stock s ON m.id_materiel = s.id_materiel
        WHERE d.id_demande = ?
    ");
    $stmt->execute([$id_demande]);
    $demande = $stmt->fetch(PDO::FETCH_ASSOC);
    echo json_encode(["success"=>true,"message"=>"Demande créée","data"=>$demande]);
} else {
    echo json_encode(["success"=>false,"message"=>"Erreur création"]);
}