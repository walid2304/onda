<?php
// Simples script para servir arquivos da pasta uploads

$filename = basename($_GET['file'] ?? '');

if (empty($filename)) {
    header("HTTP/1.0 400 Bad Request");
    echo "Nome de arquivo inválido";
    exit;
}

// Caminho seguro para o arquivo
$uploadDir = __DIR__ . '/uploads/';
$filePath = $uploadDir . $filename;

// Segurança simples: não permitir traversal
if (strpos($filename, '..') !== false || strpos($filename, '/') !== false) {
    header("HTTP/1.0 403 Forbidden");
    echo "Acesso negado";
    exit;
}

if (!file_exists($filePath)) {
    header("HTTP/1.0 404 Not Found");
    echo "Arquivo não encontrado";
    exit;
}

// Determinar tipo MIME
$mimeType = 'application/octet-stream';
$extension = strtolower(pathinfo($filename, PATHINFO_EXTENSION));

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

// Servir o arquivo
header('Content-Type: ' . $mimeType);
header('Content-Disposition: attachment; filename="' . $filename . '"');
header('Content-Length: ' . filesize($filePath));
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');

readfile($filePath);
exit;
?>