<?php
require_once __DIR__ . '/../../config/database.php';

if (!isset($_GET['id'])) {
    header("HTTP/1.0 404 Not Found");
    echo "ID manquant";
    exit;
}

$id_justificatif = intval($_GET['id']);

try {
    $stmt = $pdo->prepare("SELECT * FROM justificatifs WHERE id_justificatif = ?");
    $stmt->execute([$id_justificatif]);
    $justificatif = $stmt->fetch();

    if (!$justificatif) {
        header("HTTP/1.0 404 Not Found");
        echo "Justificatif non trouvé";
        exit;
    }

    // Construction du chemin absolu
    // Le script est à: backend/controllers/justificatif/download.php
    // Les fichiers sont à: backend/gestion_de_stock/backend/gestion_de_stock/stock-app/uploads/
    $scriptDir = dirname(__FILE__);  // C:\xampp\htdocs\gestion_stock-master-main\backend\controllers\justificatif
    $backendDir = dirname(dirname($scriptDir));  // C:\xampp\htdocs\gestion_stock-master-main\backend
    $uploadDir = $backendDir . DIRECTORY_SEPARATOR . 'gestion_de_stock' . DIRECTORY_SEPARATOR . 'backend' . DIRECTORY_SEPARATOR . 'gestion_de_stock' . DIRECTORY_SEPARATOR . 'stock-app' . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR;
    $filePath = $uploadDir . $justificatif['chemin_fichier'];

    // DEBUG
    error_log("DEBUG: scriptDir = " . $scriptDir);
    error_log("DEBUG: backendDir = " . $backendDir);
    error_log("DEBUG: uploadDir = " . $uploadDir);
    error_log("DEBUG: filePath = " . $filePath);
    error_log("DEBUG: file_exists = " . (file_exists($filePath) ? 'true' : 'false'));

    if (!file_exists($filePath)) {
        header("HTTP/1.0 404 Not Found");
        echo "Fichier non trouvé: " . $filePath;
        exit;
    }

    // Déterminer le type MIME
    $mimeType = 'application/octet-stream';
    $extension = strtolower(pathinfo($justificatif['nom_fichier'], PATHINFO_EXTENSION));
    
    $mimeTypes = [
        'pdf' => 'application/pdf',
        'jpg' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'png' => 'image/png',
        'doc' => 'application/msword',
        'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    
    if (isset($mimeTypes[$extension])) {
        $mimeType = $mimeTypes[$extension];
    }

    // Nettoyer le nom du fichier
    $filename = basename($justificatif['nom_fichier']);
    
    // Émettre les en-têtes
    header('Content-Type: ' . $mimeType);
    header('Content-Disposition: attachment; filename="' . $filename . '"');
    header('Content-Length: ' . filesize($filePath));
    header('Cache-Control: no-cache, no-store, must-revalidate');
    header('Pragma: no-cache');
    header('Expires: 0');
    
    // Lire et envoyer le fichier
    readfile($filePath);
    exit;

} catch (Exception $e) {
    header("HTTP/1.0 500 Internal Server Error");
    echo "Erreur: " . $e->getMessage();
    exit;
}
?>