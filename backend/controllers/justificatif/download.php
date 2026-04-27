<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/app.php';

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
        echo "Justificatif non trouve";
        exit;
    }

    $filePath = uploads_dir() . $justificatif['chemin_fichier'];

    if (!file_exists($filePath)) {
        header("HTTP/1.0 404 Not Found");
        echo "Fichier non trouve";
        exit;
    }

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

    $filename = basename($justificatif['nom_fichier']);

    header('Content-Type: ' . $mimeType);
    header('Content-Disposition: attachment; filename="' . $filename . '"');
    header('Content-Length: ' . filesize($filePath));
    header('Cache-Control: no-cache, no-store, must-revalidate');
    header('Pragma: no-cache');
    header('Expires: 0');

    readfile($filePath);
    exit;
} catch (Exception $e) {
    header("HTTP/1.0 500 Internal Server Error");
    echo "Erreur: " . $e->getMessage();
    exit;
}
