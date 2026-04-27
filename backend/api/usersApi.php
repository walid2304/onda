<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}


if (!isset($_GET['endpoint']) || empty($_GET['endpoint'])) {
    echo json_encode(["error" => "Paramètre 'endpoint' manquant ou vide dans l'URL."]);
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
        echo json_encode(["error" => "Endpoint non trouvé"]);
        break;
}