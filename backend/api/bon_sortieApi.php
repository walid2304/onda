<?php
header("Access-Control-Allow-Origin: https://onda-delta.vercel.app");
header("Vary: Origin");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$request = $_GET['endpoint'] ?? '';

switch ($request) {
    case "createBS":
        require "../controllers/bon_sortie/createBS.php";
        break;

    case "readBS":
        require "../controllers/bon_sortie/readBS.php";
        break;

    case "updateBS":
        require "../controllers/bon_sortie/updateBS.php";
        break;

    case "deleteBS":
        require "../controllers/bon_sortie/deleteBS.php";
        break;

    default:
        echo json_encode(["error" => "Endpoint non trouve"]);
        break;
}
