<?php
// hash.php : Génère un hash sécurisé pour un mot de passe
// Utilisation : Modifier la variable $motDePasse puis exécuter ce fichier avec PHP

$motDePasse = 'admin2003'; // Remplacez par le mot de passe souhaité
$hash = password_hash($motDePasse, PASSWORD_DEFAULT);
echo "Mot de passe : $motDePasse\n";
echo "Hash généré : $hash\n";
