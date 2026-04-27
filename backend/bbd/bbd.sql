-- ==========================================
-- GESTION DE STOCK - BASE DE DONNÉES
-- ==========================================

-- 1. TABLE UTILISATEURS
DROP TABLE IF EXISTS utilisateurs;
CREATE TABLE utilisateurs (
    id_user INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin','user') DEFAULT 'user',
    profile_photo VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO utilisateurs (full_name, username, email, password, role)
VALUES ('Ilham', 'ilham', 'admin@example.com', '$2y$10$xwcnUjnP0lp0iKRKfQu3Ze3XHowiaBo4ErYHX8de9ZnfQaEsQTNc6', 'admin');

-- 2. TABLE FOURNITURES
DROP TABLE IF EXISTS fournitures;
CREATE TABLE fournitures (
    id_fourniture INT AUTO_INCREMENT PRIMARY KEY,
    nom_fourniture VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. TABLE SERVICES
DROP TABLE IF EXISTS services;
CREATE TABLE services (
    id_service INT AUTO_INCREMENT PRIMARY KEY,
    nom_service VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. TABLE AFFECTATION
DROP TABLE IF EXISTS affectation;
CREATE TABLE affectation (
    id_affe INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    id_service INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_service) REFERENCES services(id_service) ON DELETE CASCADE
);

-- 5. TABLE MATERIEL
DROP TABLE IF EXISTS materiel;
CREATE TABLE materiel (
    id_materiel INT AUTO_INCREMENT PRIMARY KEY,
    designation VARCHAR(150) NOT NULL,
    id_fourniture INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_fourniture) REFERENCES fournitures(id_fourniture) ON DELETE CASCADE
);

-- 6. TABLE STOCK
DROP TABLE IF EXISTS stock;
CREATE TABLE stock (
    id_stock INT AUTO_INCREMENT PRIMARY KEY,
    id_materiel INT NOT NULL UNIQUE,
    qte_stock INT DEFAULT 0,
    date_maj TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_materiel) REFERENCES materiel(id_materiel) ON DELETE CASCADE
);

-- 7. TABLE DEMANDES
DROP TABLE IF EXISTS demandes;
CREATE TABLE demandes (
    id_demande INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT NOT NULL,
    id_materiel INT NOT NULL,
    quantite INT NOT NULL,
    date_demande DATE NOT NULL,
    date_reception DATE,
    statut ENUM('en_attente','acceptee','refusee') DEFAULT 'en_attente',
    solde DECIMAL(10,2) DEFAULT 0,
    reste_livrer VARCHAR(50) DEFAULT '0',
    observation TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_user) REFERENCES utilisateurs(id_user) ON DELETE CASCADE,
    FOREIGN KEY (id_materiel) REFERENCES materiel(id_materiel) ON DELETE CASCADE
);

-- 8. TABLE BON_SORTIE
DROP TABLE IF EXISTS bon_sortie;
CREATE TABLE bon_sortie (
    id_bs INT AUTO_INCREMENT PRIMARY KEY,
    code_bs VARCHAR(50) NOT NULL UNIQUE,
    id_demande INT NOT NULL,
    date_sortie DATE NOT NULL,
    nb_sortie INT NOT NULL,
    reste_livrer VARCHAR(50) DEFAULT '0',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_demande) REFERENCES demandes(id_demande) ON DELETE CASCADE
);

-- 9. TABLE MOUVEMENTS
DROP TABLE IF EXISTS mouvements;
CREATE TABLE mouvements (
    id_mouv INT AUTO_INCREMENT PRIMARY KEY,
    id_materiel INT NOT NULL,
    id_affe INT,
    id_bs INT,
    type_mouvement ENUM('affectation','retour','sortie') NOT NULL,
    quantite INT NOT NULL,
    date_mouvement DATE NOT NULL,
    observation TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_materiel) REFERENCES materiel(id_materiel) ON DELETE CASCADE,
    FOREIGN KEY (id_affe) REFERENCES affectation(id_affe) ON DELETE SET NULL,
    FOREIGN KEY (id_bs) REFERENCES bon_sortie(id_bs) ON DELETE SET NULL
);

-- 10. TABLE JUSTIFICATIFS
DROP TABLE IF EXISTS justificatifs;
CREATE TABLE justificatifs (
    id_justificatif INT AUTO_INCREMENT PRIMARY KEY,
    id_mouv INT NOT NULL,
    nom_fichier VARCHAR(255) NOT NULL,
    chemin_fichier VARCHAR(255) NOT NULL,
    type_fichier VARCHAR(50),
    taille_fichier INT,
    date_upload TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_mouv) REFERENCES mouvements(id_mouv) ON DELETE CASCADE
);