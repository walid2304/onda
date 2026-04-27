<?php
require_once __DIR__ . '/../../config/database.php';
header("Content-Type: application/json");

$stmt = $pdo->query("
    SELECT 
        m.*,
        mat.designation,
        a.nom AS affectation,
        bs.code_bs AS bs_numero,
        j.id_justificatif,
        j.nom_fichier,
        j.chemin_fichier,
        j.type_fichier,
        j.taille_fichier,
        j.date_upload
    FROM mouvements m
    JOIN materiel mat ON m.id_materiel = mat.id_materiel
    LEFT JOIN affectation a ON m.id_affe = a.id_affe
    LEFT JOIN bon_sortie bs ON m.id_bs = bs.id_bs
    LEFT JOIN justificatifs j ON j.id_mouv = m.id_mouv
    ORDER BY m.date_mouvement DESC, j.date_upload ASC
");

$dataRaw = $stmt->fetchAll(PDO::FETCH_ASSOC);

$mouvements = [];
foreach ($dataRaw as $row) {
    $id_mouv = $row['id_mouv'];

    if (!isset($mouvements[$id_mouv])) {
        $mouvements[$id_mouv] = [
            "id_mouv" => $row['id_mouv'],
            "id_materiel" => $row['id_materiel'],
            "designation" => $row['designation'],
            "id_affe" => $row['id_affe'],
            "affectation" => $row['affectation'],
            "id_bs" => $row['id_bs'],
            "bs_numero" => $row['bs_numero'],
            "quantite" => $row['quantite'],
            "type_mouvement" => $row['type_mouvement'],
            "date_mouvement" => $row['date_mouvement'],
            "justificatifs" => [],
        ];
    }

    if ($row['id_justificatif']) {
        $mouvements[$id_mouv]['justificatifs'][] = [
            "id_justificatif" => $row['id_justificatif'],
            "nom_fichier" => $row['nom_fichier'],
            "chemin_fichier" => $row['chemin_fichier'],
            "type_fichier" => $row['type_fichier'],
            "taille_fichier" => $row['taille_fichier'],
            "date_upload" => $row['date_upload'],
            "download_url" => $row['chemin_fichier'], // lien direct pour téléchargement
        ];
    }
}

// Ajouter nb_justificatifs
foreach ($mouvements as &$mouv) {
    $mouv['nb_justificatifs'] = count($mouv['justificatifs']);
}
unset($mouv);

$mouvements = array_values($mouvements);

echo json_encode([
    "success" => true,
    "data" => $mouvements
]);
?>