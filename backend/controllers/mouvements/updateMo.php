<?php
require_once __DIR__ . '/../../config/database.php';
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id_mouv'], $data['id_materiel'], $data['quantite'], $data['type_mouvement'], $data['date_mouvement'])) {
    echo json_encode(["success"=>false, "message"=>"Champs manquants"]);
    exit;
}

try {
    $pdo->beginTransaction();

    // Récupérer l'ancien mouvement
    $stmtOld = $pdo->prepare("SELECT id_materiel, quantite, type_mouvement FROM mouvements WHERE id_mouv = ?");
    $stmtOld->execute([$data['id_mouv']]);
    $old = $stmtOld->fetch(PDO::FETCH_ASSOC);
    if (!$old) throw new Exception("Mouvement introuvable");

    // Récupérer stock actuel
    $stmtStock = $pdo->prepare("SELECT qte_stock FROM stock WHERE id_materiel = ?");
    $stmtStock->execute([$data['id_materiel']]);
    $currentStock = $stmtStock->fetchColumn() ?: 0;

    // Calculer stock effectif
    $effectiveStock = $currentStock;
    if ($old['type_mouvement'] === "affectation") $effectiveStock += $old['quantite'];
    else $effectiveStock -= $old['quantite'];

    // Vérifier stock
    if ($data['type_mouvement'] === "affectation" && $data['quantite'] > $effectiveStock) {
        throw new Exception("Quantité supérieure au stock disponible");
    }

    // Annuler ancien mouvement
    if ($old['type_mouvement'] === "affectation") {
        $pdo->prepare("UPDATE stock SET qte_stock = qte_stock + ? WHERE id_materiel = ?")
            ->execute([$old['quantite'], $old['id_materiel']]);
    } else {
        $pdo->prepare("UPDATE stock SET qte_stock = qte_stock - ? WHERE id_materiel = ?")
            ->execute([$old['quantite'], $old['id_materiel']]);
    }

    // Modifier le mouvement
    $stmtUpdate = $pdo->prepare("
        UPDATE mouvements
        SET id_materiel = ?, id_affe = ?, id_bs = ?, quantite = ?, type_mouvement = ?, date_mouvement = ?
        WHERE id_mouv = ?
    ");
    $stmtUpdate->execute([
        $data['id_materiel'],
        $data['id_affe'] ?? null,
        $data['id_bs'] ?? null,
        $data['quantite'],
        $data['type_mouvement'],
        $data['date_mouvement'],
        $data['id_mouv']
    ]);

    // Appliquer nouveau mouvement
    if ($data['type_mouvement'] === "affectation") {
        $pdo->prepare("UPDATE stock SET qte_stock = qte_stock - ? WHERE id_materiel = ?")
            ->execute([$data['quantite'], $data['id_materiel']]);
    } else {
        $pdo->prepare("UPDATE stock SET qte_stock = qte_stock + ? WHERE id_materiel = ?")
            ->execute([$data['quantite'], $data['id_materiel']]);
    }

    $pdo->commit();
    echo json_encode(["success"=>true, "message"=>"Mouvement modifié avec succès"]);

} catch (Exception $e) {
    $pdo->rollBack();
    echo json_encode(["success"=>false, "message"=>$e->getMessage()]);
}
?>