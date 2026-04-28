<?php
declare(strict_types=1);

$isHttps = !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off';
$scheme = $isHttps ? 'https' : 'http';
$host = $_SERVER['HTTP_HOST'] ?? 'localhost';
$scriptDirectory = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? '/'));
$scriptDirectory = $scriptDirectory === '.' ? '' : rtrim($scriptDirectory, '/');
$baseUrl = $scheme . '://' . $host . $scriptDirectory;

$apiFiles = [
    'affectationApi.php',
    'bon_sortieApi.php',
    'categorieApi.php',
    'demandesApi.php',
    'justificatifApi.php',
    'materielApi.php',
    'mouvementsApi.php',
    'servicesApi.php',
    'stockApi.php',
    'usersApi.php',
];
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Stock ONDA API</title>
    <style>
        body {
            margin: 0;
            font-family: Arial, sans-serif;
            background: #0f172a;
            color: #e2e8f0;
        }

        main {
            max-width: 860px;
            margin: 48px auto;
            padding: 32px;
            background: #111c34;
            border-radius: 16px;
            box-shadow: 0 18px 50px rgba(2, 6, 23, 0.35);
        }

        h1 {
            margin-top: 0;
            font-size: 30px;
        }

        p, li {
            line-height: 1.6;
        }

        code {
            color: #bfdbfe;
        }

        a {
            color: #93c5fd;
            text-decoration: none;
        }

        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
<main>
    <h1>Backend Stock ONDA</h1>
    <p>L'API PHP est joignable. Base detectee : <code><?= htmlspecialchars($baseUrl, ENT_QUOTES, 'UTF-8') ?></code></p>
    <p>Les routes applicatives sont exposees dans le dossier <code>/api</code> et utilisent le parametre <code>endpoint</code>.</p>

    <ul>
        <?php foreach ($apiFiles as $apiFile): ?>
            <?php $apiUrl = $baseUrl . '/api/' . $apiFile; ?>
            <li><a href="<?= htmlspecialchars($apiUrl, ENT_QUOTES, 'UTF-8') ?>"><?= htmlspecialchars($apiUrl, ENT_QUOTES, 'UTF-8') ?></a></li>
        <?php endforeach; ?>
    </ul>
</main>
</body>
</html>
