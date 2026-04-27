<?php
require_once __DIR__ . '/../config/cors.php';
apply_cors();

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
