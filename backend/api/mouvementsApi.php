<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

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
echo json_encode(["error"=>"Endpoint non trouvé"]);
break;
}