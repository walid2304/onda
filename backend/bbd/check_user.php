<?php
// check_user.php : Affiche tous les utilisateurs de la base gestion_materiel_it
$pdo = new PDO('mysql:host=localhost;dbname=gestion_materiel_it;charset=utf8mb4', 'root', '');
$sql = "SELECT full_name, id_user, username, email, password, role FROM utilisateurs";
$stmt = $pdo->query($sql);
$users = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo '<pre>';
print_r($users);
echo '</pre>';
?>