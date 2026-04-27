<?php
require_once __DIR__ . '/../config/cors.php';
apply_cors();

$request = $_GET['endpoint'] ?? '';

switch ($request) {
    case "ajouterC":
        require "../controllers/fourniture/ajouterC.php";
        break;

    case "readC":
        require "../controllers/fourniture/readC.php";
        break;

    case "updateC":
        require "../controllers/fourniture/updateC.php";
        break;

    case "deleteC":
        require "../controllers/fourniture/deleteC.php";
        break;

    default:
        echo json_encode(["error" => "Endpoint non trouve"]);
        break;
}
