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
    case "createA":
        require "../controllers/affectation/createA.php";
        break;

    case "readA":
        require "../controllers/affectation/readA.php";
        break;

    case "updateA":
        require "../controllers/affectation/updateA.php";
        break;

    case "deleteA":
        require "../controllers/affectation/deleteA.php";
        break;

    default:
        echo json_encode(["error" => "Endpoint non trouve"]);
        break;
}
