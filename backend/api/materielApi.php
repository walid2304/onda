<?php
require_once __DIR__ . '/../config/cors.php';
apply_cors();

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
