<?php
require_once __DIR__ . '/../../config/database.php';

header("Content-Type: application/json");


$data = json_decode(file_get_contents('php://input'), true);

if (
    !isset($data['fullname'], $data['email'], $data['username'], $data['password']) ||
    empty($data['fullname']) ||
    empty($data['email']) ||
    empty($data['username']) ||
    empty($data['password'])
) {
    echo json_encode(['success' => false, 'message' => 'Tous les champs sont obligatoires.']);
    exit;
}


$fullname = trim($data['fullname']);
$email = trim($data['email']);
$username = trim($data['username']);
$password = $data['password'];
$role = isset($data['role']) ? $data['role'] : 'user';
$hash = password_hash($password, PASSWORD_DEFAULT);


$stmt = $pdo->prepare("SELECT id_user FROM utilisateurs WHERE username = ? OR email = ?");
$stmt->execute([$username, $email]);

if ($stmt->fetch()) {
    echo json_encode(['success' => false, 'message' => "Nom d'utilisateur ou email déjà utilisé."]);
    exit;
}


$avatar = "https://ui-avatars.com/api/?name=" . urlencode($fullname);
$created_at = date('Y-m-d H:i:s');
$updated_at = date('Y-m-d H:i:s');


$stmt = $pdo->prepare("INSERT INTO utilisateurs (full_name, email, username, password, role, profile_photo, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
$success = $stmt->execute([$fullname, $email, $username, $hash, $role, $avatar, $created_at, $updated_at]);

echo json_encode($success ? ['success' => true, 'message' => 'Inscription réussie.'] : ['success' => false, 'message' => "Erreur lors de l'inscription."]);