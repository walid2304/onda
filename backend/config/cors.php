<?php

function cors_allowed_origins(): array
{
    $configured = getenv('CORS_ALLOWED_ORIGINS') ?: '';
    $origins = array_filter(array_map('trim', explode(',', $configured)));

    if (!$origins) {
        $origins = [
            'https://onda-delta.vercel.app',
            'http://localhost:3000',
            'http://127.0.0.1:3000',
        ];
    }

    return array_values(array_unique($origins));
}

function apply_cors(array $methods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']): void
{
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    $allowedOrigins = cors_allowed_origins();

    if ($origin && in_array($origin, $allowedOrigins, true)) {
        header("Access-Control-Allow-Origin: $origin");
        header("Vary: Origin");
    }

    header('Access-Control-Allow-Methods: ' . implode(', ', $methods));
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
        http_response_code(200);
        exit();
    }
}
