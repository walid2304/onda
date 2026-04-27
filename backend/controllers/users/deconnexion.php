<?php
session_start();

session_unset();
session_destroy();


header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

echo json_encode(['success' => true, 'message' => 'Déconnexion réussie.']);