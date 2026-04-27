<?php
require_once __DIR__ . '/../../config/database.php';
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);
if (!isset($data['id_mouv'])) {
    echo json_encode(["success"=>false,"message"=>"ID requis"]);
    exit;
}

try {
    $pdo->beginTransaction();

    $stmt = $pdo->prepare("SELECT id_materiel, quantite, type_mouvement FROM mouvements WHERE id_mouv = ?");
    $stmt->execute([$data['id_mouv']]);
    $mouv = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$mouv) throw new Exception("Mouvement introuvable");

    // Mettre à jour stock
    if ($mouv['type_mouvement'] === "affectation") {
        $pdo->prepare("UPDATE stock SET qte_stock = qte_stock + ? WHERE id_materiel = ?")
            ->execute([$mouv['quantite'], $mouv['id_materiel']]);
    } else {
        $pdo->prepare("UPDATE stock SET qte_stock = qte_stock - ? WHERE id_materiel = ?")
            ->execute([$mouv['quantite'], $mouv['id_materiel']]);
    }

    // Supprimer mouvement
    $pdo->prepare("DELETE FROM mouvements WHERE id_mouv = ?")
        ->execute([$data['id_mouv']]);

    $pdo->commit();
    echo json_encode(["success"=>true, "message"=>"Mouvement supprimé"]);

} catch (Exception $e) {
    $pdo->rollBack();
    echo json_encode(["success"=>false,"message"=>$e->getMessage()]);
}
?>