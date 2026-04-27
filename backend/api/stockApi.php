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
echo json_encode([
"error"=>"Endpoint non trouvé"
]);
break;
}