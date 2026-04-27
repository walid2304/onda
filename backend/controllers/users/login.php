<?php
require_once __DIR__ . '/../../config/database.php';


header("Content-Type: application/json");



$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['username'], $data['password']) || empty($data['username']) || empty($data['password'])) {
    echo json_encode(['success' => false, 'message' => 'Nom d’utilisateur et mot de passe sont obligatoires.']);
    exit;
}

$usernameOrEmail = trim($data['username']);
$password = $data['password'];


$stmt = $pdo->prepare("SELECT * FROM utilisateurs WHERE username = ? OR email = ?");
$stmt->execute([$usernameOrEmail, $usernameOrEmail]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    echo json_encode(['success' => false, 'message' => 'Utilisateur non trouvé.']);
    exit;
}


if (!password_verify($password, $user['password'])) {
    echo json_encode(['success' => false, 'message' => 'Mot de passe incorrect.']);
    exit;
}



$response = [
    'success' => true,
    'message' => 'Connexion réussie.',
    'user' => [
        'id_user' => $user['id_user'],
        'username' => $user['username'],
        'email' => $user['email'],
        'role' => $user['role']
    ]
];

echo json_encode($response);