<?php
require_once __DIR__ . '/../../config/database.php';
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id_justificatif'])) {
    echo json_encode(["success" => false, "message" => "ID requis"]);
    exit;
}

try {
    // Démarrer une transaction
    $pdo->beginTransaction();

    // Récupérer les informations du fichier
    $stmt = $pdo->prepare("SELECT nom_fichier, chemin_fichier FROM justificatifs WHERE id_justificatif = ?");
    $stmt->execute([$data['id_justificatif']]);
    $file = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$file) {
        throw new Exception("Fichier introuvable dans la base de données");
    }

    // Définir le chemin du dossier uploads
    $uploadDir = $_SERVER['DOCUMENT_ROOT'] . '/gestion_de_stock/backend/gestion_de_stock/stock-app/uploads/';
    
    // Construire le chemin complet du fichier
    // Si chemin_fichier contient déjà le chemin complet, l'utiliser directement
    if (file_exists($file['chemin_fichier'])) {
        $filePath = $file['chemin_fichier'];
    } else {
        // Sinon, supposer que c'est juste le nom du fichier
        $filePath = $uploadDir . $file['chemin_fichier'];
    }

    // Supprimer le fichier physique s'il existe
    if (file_exists($filePath)) {
        if (!unlink($filePath)) {
            throw new Exception("Impossible de supprimer le fichier physique");
        }
    } else {
        error_log("Fichier non trouvé pour suppression : " . $filePath);
    }

    // Supprimer l'enregistrement dans la BDD
    $stmt = $pdo->prepare("DELETE FROM justificatifs WHERE id_justificatif = ?");
    $stmt->execute([$data['id_justificatif']]);
    
    if ($stmt->rowCount() === 0) {
        throw new Exception("Aucun enregistrement supprimé dans la base de données");
    }

    $pdo->commit();

    echo json_encode([
        "success" => true,
        "message" => "Fichier supprimé avec succès"
    ]);

} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    
    echo json_encode([
        "success" => false,
        "message" => "Erreur lors de la suppression : " . $e->getMessage()
    ]);
}
?>