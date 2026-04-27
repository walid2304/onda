<?php
require_once __DIR__ . '/../../config/database.php';

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

// Récupérer la quantité demandée et le stock disponible
$stmtDemande = $pdo->prepare("
    SELECT d.quantite, m.id_materiel
    FROM demandes d
    JOIN materiel m ON d.id_materiel = m.id_materiel
    WHERE d.id_demande = ?
");
$stmtDemande->execute([$data['id_demande']]);
$demande = $stmtDemande->fetch(PDO::FETCH_ASSOC);

if (!$demande) {
    echo json_encode(["success" => false, "message" => "Demande non trouvée"]);
    exit;
}

// Récupérer la quantité en stock
$stmtStock = $pdo->prepare("SELECT qte_stock FROM stock WHERE id_materiel = ?");
$stmtStock->execute([$demande['id_materiel']]);
$stock = $stmtStock->fetch(PDO::FETCH_ASSOC);
$quantite_stock = $stock['qte_stock'] ?? 0;

// Calculer le reste à livrer = quantité stock - quantité demandée
$quantite_demandee = $demande['quantite'];
$quantite_livree_ce_bon = $data['nb_sortie'];
$reste_livrer = $quantite_stock - $quantite_demandee;

$sql = "UPDATE bon_sortie 
        SET code_bs = :code_bs,
            id_demande = :id_demande,
            date_sortie = :date_sortie,
            nb_sortie = :nb_sortie,
            reste_livrer = :reste_livrer
        WHERE id_bs = :id_bs";

$stmt = $pdo->prepare($sql);

$result = $stmt->execute([
    ':code_bs' => $data['code_bs'],
    ':id_demande' => $data['id_demande'],
    ':date_sortie' => $data['date_sortie'],
    ':nb_sortie' => $quantite_livree_ce_bon,
    ':reste_livrer' => $reste_livrer,
    ':id_bs' => $data['id_bs']
]);

if ($result) {
    // Mettre à jour le reste_livrer dans la table demandes
    $stmtUpdate = $pdo->prepare("UPDATE demandes SET reste_livrer = ? WHERE id_demande = ?");
    $stmtUpdate->execute([$reste_livrer, $data['id_demande']]);
}

echo json_encode([
    "success" => $result,
    "message" => $result ? "Bon sortie modifié" : "Erreur"
]);