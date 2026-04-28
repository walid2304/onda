<?php
$request = $_GET['endpoint'] ?? '';

if ($request !== 'download') {
    header("Access-Control-Allow-Origin: https://onda-delta.vercel.app");
    header("Vary: Origin");
    header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
        http_response_code(200);
        exit();
    }
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
