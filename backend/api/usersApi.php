<?php
require_once __DIR__ . '/../config/cors.php';
apply_cors();

if (!isset($_GET['endpoint']) || empty($_GET['endpoint'])) {
    echo json_encode(["error" => "Parametre 'endpoint' manquant ou vide dans l'URL."]);
    exit();
}

$request = $_GET['endpoint'];

switch ($request) {
    case "login":
        require "../controllers/users/login.php";
        break;
    case "register":
        require "../controllers/users/register.php";
        break;
    case "change_role":
        require "../controllers/users/change_role.php";
        break;
    case "toutUtilisateur":
        require "../controllers/users/toutUtilisateur.php";
        break;
    case "modifier":
        require "../controllers/users/modifier.php";
        break;
    case "supprimer":
        require "../controllers/users/supprimer.php";
        break;
    case "deconnexion":
        require "../controllers/users/deconnexion.php";
        break;
    default:
        echo json_encode(["error" => "Endpoint non trouve"]);
        break;
}
