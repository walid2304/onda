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
    case "createM":
        require "../controllers/materiel/createM.php";
        break;

    case "lectureM":
        require "../controllers/materiel/lectureM.php";
        break;

    case "readM":
        require "../controllers/materiel/readM.php";
        break;

    case "updateM":
        require "../controllers/materiel/updateM.php";
        break;

    case "deleteM":
        require "../controllers/materiel/deleteM.php";
        break;

    default:
        echo json_encode(["error" => "Endpoint non trouve"]);
        break;
}
