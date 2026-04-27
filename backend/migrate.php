<?php
require_once __DIR__ . '/../config/database.php';

try {
    // Vérifier si la colonne existe déjà
    $stmt = $pdo->query("SHOW COLUMNS FROM bon_sortie LIKE 'reste_livrer'");
    $columnExists = $stmt->rowCount() > 0;
    
    if (!$columnExists) {
        // Ajouter la colonne
        $pdo->exec("ALTER TABLE bon_sortie ADD COLUMN reste_livrer VARCHAR(50) DEFAULT NULL");
        echo json_encode([
            "success" => true,
            "message" => "Colonne 'reste_livrer' ajoutée avec succès à la table bon_sortie"
        ]);
    } else {
        echo json_encode([
            "success" => true,
            "message" => "La colonne 'reste_livrer' existe déjà"
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Erreur: " . $e->getMessage()
    ]);
}
?>
