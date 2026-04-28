<?php

function apply_cors(array $methods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']): void
{
    header("Access-Control-Allow-Origin: https://onda-delta.vercel.app");
    header("Vary: Origin");
    header('Access-Control-Allow-Methods: ' . implode(', ', $methods));
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
        http_response_code(200);
        exit();
    }
}
