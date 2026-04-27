<?php
require_once __DIR__ . '/../config/cors.php';

$request = $_GET['endpoint'] ?? '';

if ($request !== 'download') {
    apply_cors(['GET', 'POST', 'DELETE', 'OPTIONS']);
}

switch ($request) {
    case "createJ":
        require "../controllers/justificatif/uploadJustificatif.php";
        break;

    case "download":
        require "../controllers/justificatif/download.php";
        break;

    case "readJ":
        require "../controllers/justificatif/getJustificatifs.php";
        break;

    case "deleteJ":
        require "../controllers/justificatif/deleteJustificatif.php";
        break;

    default:
        echo json_encode(["error" => "Endpoint non trouve"]);
        break;
}
