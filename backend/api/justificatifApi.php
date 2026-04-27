<?php
// Gestion du CORS - les téléchargements ne nécessitent pas CORS
if ($_GET['endpoint'] !== 'download') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$request = $_GET['endpoint'] ?? '';

switch ($request) {

    // Upload / Ajouter un justificatif
    case "createJ":
        require "../controllers/justificatif/uploadJustificatif.php";
        break;
    case "download":
        require "../controllers/justificatif/download.php";
        break;

    // Lire tous les justificatifs pour un mouvement
    case "readJ":
        require "../controllers/justificatif/getJustificatifs.php";
        break;

    // Supprimer un justificatif
    case "deleteJ":
        require "../controllers/justificatif/deleteJustificatif.php";
        break;

    default:
        echo json_encode(["error" => "Endpoint non trouvé"]);
        break;
}
?>