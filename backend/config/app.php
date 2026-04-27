<?php

function app_base_url(): string
{
    $configuredUrl = getenv('APP_BASE_URL');
    if ($configuredUrl) {
        return rtrim($configuredUrl, '/');
    }

    $isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || (isset($_SERVER['SERVER_PORT']) && (string) $_SERVER['SERVER_PORT'] === '443');

    $scheme = $isHttps ? 'https' : 'http';
    $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
    $scriptDir = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? ''));
    $basePath = preg_replace('#/api$#', '', rtrim($scriptDir, '/.'));

    return $basePath ? sprintf('%s://%s%s', $scheme, $host, $basePath) : sprintf('%s://%s', $scheme, $host);
}

function uploads_dir(): string
{
    return __DIR__ . '/../uploads/';
}

function justificatif_download_url(int $idJustificatif): string
{
    return app_base_url() . '/api/justificatifApi.php?endpoint=download&id=' . $idJustificatif;
}

function justificatif_file_url(string $fileName): string
{
    return app_base_url() . '/serve-file.php?file=' . rawurlencode($fileName);
}
