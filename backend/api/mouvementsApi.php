<?php
require_once __DIR__ . '/../config/cors.php';
apply_cors();

$request = $_GET['endpoint'] ?? '';

switch ($request) {
    case "createMo":
        require "../controllers/mouvements/createMo.php";
        break;

    case "readMo":
        require "../controllers/mouvements/readMo.php";
        break;

    case "updateMo":
        require "../controllers/mouvements/updateMo.php";
        break;

    case "deleteMo":
        require "../controllers/mouvements/deleteMo.php";
        break;

    default:
        echo json_encode(["error" => "Endpoint non trouve"]);
        break;
}
