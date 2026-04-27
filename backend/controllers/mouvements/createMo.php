<?php
require_once __DIR__ . '/../../config/database.php';
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

// Vérification des champs obligatoires
if (!isset($data['id_materiel'], $data['quantite'], $data['type_mouvement'], $data['date_mouvement'])) {
    echo json_encode(["success"=>false, "message"=>"Champs manquants"]);
    exit;
}

try {
    $pdo->beginTransaction();

    // Vérifier stock si affectation
    if ($data['type_mouvement'] === "affectation") {
        $stmtStock = $pdo->prepare("SELECT qte_stock FROM stock WHERE id_materiel = ?");
        $stmtStock->execute([$data['id_materiel']]);
        $stock = $stmtStock->fetchColumn();

        if ($stock === false) throw new Exception("Matériel introuvable dans le stock");
        if ($data['quantite'] > $stock) throw new Exception("Impossible d'affecter plus que le stock disponible ($stock)");
    }

    // Insérer le mouvement
    $stmt = $pdo->prepare("
        INSERT INTO mouvements (id_materiel, id_affe, id_bs, quantite, type_mouvement, date_mouvement)
        VALUES (?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([
        $data['id_materiel'],
        $data['id_affe'] ?? null,
        $data['id_bs'] ?? null,
        $data['quantite'],
        $data['type_mouvement'],
        $data['date_mouvement']
    ]);

    $id_mouv = $pdo->lastInsertId();

    // Récupérer les données complètes du mouvement créé
    $stmt = $pdo->prepare("
        SELECT 
            m.*,
            mat.designation,
            a.nom AS affectation,
            bs.code_bs AS bs_numero
        FROM mouvements m
        LEFT JOIN materiel mat ON m.id_materiel = mat.id_materiel
        LEFT JOIN affectation a ON m.id_affe = a.id_affe
        LEFT JOIN bon_sortie bs ON m.id_bs = bs.id_bs
        WHERE m.id_mouv = ?
    ");
    $stmt->execute([$id_mouv]);
    $mouvement = $stmt->fetch(PDO::FETCH_ASSOC);

    // Mettre à jour le stock
    if ($data['type_mouvement'] === "affectation") {
        $pdo->prepare("UPDATE stock SET qte_stock = qte_stock - ? WHERE id_materiel = ?")
            ->execute([$data['quantite'], $data['id_materiel']]);
    } else {
        $pdo->prepare("UPDATE stock SET qte_stock = qte_stock + ? WHERE id_materiel = ?")
            ->execute([$data['quantite'], $data['id_materiel']]);
    }

    $pdo->commit();

    echo json_encode([
        "success" => true,
        "data" => [
            "id_mouv" => $mouvement['id_mouv'],
            "id_materiel" => $mouvement['id_materiel'],
            "designation" => $mouvement['designation'],
            "id_affe" => $mouvement['id_affe'],
            "affectation" => $mouvement['affectation'],
            "id_bs" => $mouvement['id_bs'],
            "bs_numero" => $mouvement['bs_numero'],
            "quantite" => $mouvement['quantite'],
            "type_mouvement" => $mouvement['type_mouvement'],
            "date_mouvement" => $mouvement['date_mouvement'],
            "justificatifs" => []
        ]
    ]);

} catch (Exception $e) {
    $pdo->rollBack();
    echo json_encode(["success"=>false, "message"=>$e->getMessage()]);
}
?>