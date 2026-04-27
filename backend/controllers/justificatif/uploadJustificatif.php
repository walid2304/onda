<?php
require_once __DIR__ . '/../../config/database.php';
header("Content-Type: application/json");

if (!isset($_POST['id_mouvement']) || !isset($_FILES['fichier'])) {
    echo json_encode(["success" => false, "message" => "ID mouvement ou fichier manquant"]);
    exit;
}

$id_mouvement = intval($_POST['id_mouvement']);
$fichier = $_FILES['fichier'];

// Vérifier que le mouvement existe
$stmtCheck = $pdo->prepare("SELECT id_mouv FROM mouvements WHERE id_mouv = ?");
$stmtCheck->execute([$id_mouvement]);
if (!$stmtCheck->fetch()) {
    echo json_encode(["success" => false, "message" => "Mouvement introuvable"]);
    exit;
}

// Chemin absolu pour sauvegarder le fichier
$uploadDir = __DIR__ . '/../../uploads/';

if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

$originalName = basename($fichier['name']);
$uniqueName = time() . "_" . preg_replace("/[^a-zA-Z0-9._-]/", "_", $originalName);
$targetFile = $uploadDir . $uniqueName;

try {
    if ($fichier['error'] !== 0) {
        throw new Exception("Erreur upload: " . $fichier['error']);
    }
    
    if (!move_uploaded_file($fichier['tmp_name'], $targetFile)) {
        throw new Exception("Impossible de sauvegarder le fichier");
    }

    $stmt = $pdo->prepare("INSERT INTO justificatifs (id_mouv, nom_fichier, chemin_fichier, type_fichier, taille_fichier, date_upload) VALUES (?, ?, ?, ?, ?, NOW())");
    $stmt->execute([$id_mouvement, $originalName, $uniqueName, $fichier['type'], $fichier['size']]);
    
    $id_justificatif = $pdo->lastInsertId();

    echo json_encode([
        "success" => true,
        "data" => [
            "id_justificatif" => $id_justificatif,
            "nom_fichier" => $originalName,
            "chemin_fichier" => $uniqueName,
            "date_upload" => date('Y-m-d H:i:s'),
            "download_url" => '/gestion_de_stock/backend/api/justificatifApi.php?endpoint=download&id=' . $id_justificatif
        ]
    ]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>