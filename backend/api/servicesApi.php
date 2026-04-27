<?php
require_once __DIR__ . '/../config/cors.php';
apply_cors();

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
