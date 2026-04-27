<?php
require_once __DIR__ . '/../config/cors.php';
apply_cors();

$request = $_GET['endpoint'] ?? '';

switch ($request) {
    case "createS":
        require "../controllers/stock/createS.php";
        break;

    case "readS":
        require "../controllers/stock/readS.php";
        break;

    case "updateS":
        require "../controllers/stock/updateS.php";
        break;

    case "deleteS":
        require "../controllers/stock/deleteS.php";
        break;

    default:
        echo json_encode(["error" => "Endpoint non trouve"]);
        break;
}
