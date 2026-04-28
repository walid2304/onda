<?php
declare(strict_types=1);

$scriptDirectory = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? '/'));
$scriptDirectory = $scriptDirectory === '.' ? '' : rtrim($scriptDirectory, '/');

$backendPath = __DIR__ . DIRECTORY_SEPARATOR . 'backend' . DIRECTORY_SEPARATOR . 'index.php';
$backendUrl = ($scriptDirectory === '' ? '' : $scriptDirectory) . '/backend/';
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Stock ONDA</title>
    <style>
        body {
            margin: 0;
            font-family: Arial, sans-serif;
            background: #f5f7fb;
            color: #1f2937;
        }

        main {
            max-width: 760px;
            margin: 48px auto;
            padding: 32px;
            background: #ffffff;
            border-radius: 16px;
            box-shadow: 0 12px 40px rgba(15, 23, 42, 0.08);
        }

        h1 {
            margin-top: 0;
            font-size: 32px;
        }

        p {
            line-height: 1.6;
        }

        a {
            color: #0f62fe;
            text-decoration: none;
        }

        a:hover {
            text-decoration: underline;
        }

        .card {
            margin-top: 24px;
            padding: 20px;
            border-radius: 12px;
            background: #eef4ff;
        }
    </style>
</head>
<body>
<main>
    <h1>Stock ONDA</h1>
    <p>Cette page existe pour que l'hebergement trouve bien un fichier <code>index.php</code> dans <code>htdocs</code>.</p>

    <?php if (is_file($backendPath)): ?>
        <div class="card">
            <p>Le backend PHP est disponible ici :</p>
            <p><a href="<?= htmlspecialchars($backendUrl, ENT_QUOTES, 'UTF-8') ?>"><?= htmlspecialchars($backendUrl, ENT_QUOTES, 'UTF-8') ?></a></p>
        </div>
    <?php else: ?>
        <div class="card">
            <p>Le dossier <code>backend</code> n'a pas ete detecte a cote de cette page.</p>
            <p>Si tu heberges seulement l'API, tu peux aussi deposer directement le contenu du dossier <code>backend</code> a la racine du site.</p>
        </div>
    <?php endif; ?>
</main>
</body>
</html>
