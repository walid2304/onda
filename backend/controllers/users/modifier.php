<?php
require_once __DIR__ . '/../../config/database.php';

header("Content-Type: application/json");

$data = json_decode(file_get_contents('php://input'), true);

// Vérification des champs obligatoires
if (
    !isset($data['id_user'], $data['fullname'], $data['email'], $data['username']) ||
    empty($data['id_user']) ||
    empty($data['fullname']) ||
    empty($data['email']) ||
    empty($data['username'])
) {
    echo json_encode([
        "success" => false,
        "message" => "Données invalides."
    ]);
    exit;
}

$id = $data['id_user'];
$fullname = trim($data['fullname']);
$email = trim($data['email']);
$username = trim($data['username']);
$password = isset($data['password']) ? trim($data['password']) : "";
$updated_at = date('Y-m-d H:i:s');

// Génération automatique de l'avatar basé sur le nom
$avatar = "https://ui-avatars.com/api/?name=" . urlencode($fullname);

try {

    if (!empty($password)) {
        // Hash du mot de passe
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        $stmt = $pdo->prepare("
            UPDATE utilisateurs
            SET full_name = ?, email = ?, username = ?, password = ?, profile_photo = ?, updated_at = ?
            WHERE id_user = ?
        ");

        $success = $stmt->execute([
            $fullname,
            $email,
            $username,
            $hashedPassword,
            $avatar,
            $updated_at,
            $id
        ]);

    } else {
        // Modifier sans changer le mot de passe
        $stmt = $pdo->prepare("
            UPDATE utilisateurs
            SET full_name = ?, email = ?, username = ?, profile_photo = ?, updated_at = ?
            WHERE id_user = ?
        ");

        $success = $stmt->execute([
            $fullname,
            $email,
            $username,
            $avatar,
            $updated_at,
            $id
        ]);
    }

    echo json_encode(
        $success
        ? ["success" => true, "message" => "Utilisateur modifié avec succès."]
        : ["success" => false, "message" => "Erreur lors de la modification."]
    );

} catch (Exception $e) {

    echo json_encode([
        "success" => false,
        "message" => "Erreur serveur.",
        "error" => $e->getMessage()
    ]);
}