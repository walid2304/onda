<?php
require_once __DIR__ . '/../../config/cors.php';

session_start();

session_unset();
session_destroy();

header("Content-Type: application/json");
apply_cors();

echo json_encode(['success' => true, 'message' => 'Deconnexion reussie.']);
