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
    case "createSe":
        require "../controllers/service/createSe.php";
        break;

    case "readSe":
        require "../controllers/service/readSe.php";
        break;

    case "updateSe":
        require "../controllers/service/updateSe.php";
        break;

    case "deleteSe":
        require "../controllers/service/deleteSe.php";
        break;

    default:
        echo json_encode(["error" => "Endpoint non trouve"]);
        break;
}
