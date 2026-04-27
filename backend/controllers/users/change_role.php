<?php
require_once __DIR__ . '/../../config/database.php';

header("Content-Type: application/json");



$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['id_user'], $data['role']) || empty($data['id_user']) || empty($data['role'])) {
    echo json_encode(['success' => false, 'message' => 'ID utilisateur et rôle sont obligatoires.']);
    exit;
}

$id_user = (int) $data['id_user'];
$role = trim($data['role']);


$valid_roles = ['admin', 'user'];
if (!in_array($role, $valid_roles)) {
    echo json_encode(['success' => false, 'message' => 'Rôle invalide.']);
    exit;
}

$stmt = $pdo->prepare("SELECT * FROM utilisateurs WHERE id_user = ?");
$stmt->execute([$id_user]);
$user = $stmt->fetch();

if (!$user) {
    echo json_encode(['success' => false, 'message' => 'Utilisateur non trouvé.']);
    exit;
}


$stmt = $pdo->prepare("UPDATE utilisateurs SET role = ?, updated_at = ? WHERE id_user = ?");
$updated_at = date('Y-m-d H:i:s');
$success = $stmt->execute([$role, $updated_at, $id_user]);

echo json_encode($success ? ['success' => true, 'message' => 'Rôle mis à jour avec succès.'] : ['success' => false, 'message' => 'Erreur lors de la mise à jour du rôle.']);