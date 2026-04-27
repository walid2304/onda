# Deploiement front Vercel + back Infinity

## 1. Backend PHP sur Infinity

Place le dossier `backend` sur ton hebergement Infinity.

Ton URL finale peut ressembler a l'un de ces formats :

- `https://ton-site.infinityfreeapp.com/backend`
- `https://api.ton-domaine.com`

Si tu gardes le dossier `backend` visible dans l'URL, il faut conserver ce suffixe dans l'adresse du back.

## 2. Base de donnees backend

Le fichier [backend/config/database.php](C:\xampp\htdocs\gestion_stock-onda-2fd7d866fcd83965731011b3115bc0186dd89b16\backend\config\database.php) accepte maintenant :

- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASS`
- `DB_CHARSET`

Si Infinity ne permet pas de definir des variables d'environnement PHP, tu peux simplement remplacer les valeurs par defaut dans ce fichier.

## 3. URL publique du backend

Le backend peut aussi lire `APP_BASE_URL` pour generer les liens de telechargement des justificatifs.

Exemple :

```env
APP_BASE_URL=https://ton-site.infinityfreeapp.com/backend
```

Si tu ne defines pas cette variable, le backend essaiera de reconstruire l'URL automatiquement.

## 3.b CORS pour Vercel

Le backend lit maintenant `CORS_ALLOWED_ORIGINS` pour autoriser le front Vercel.

Exemple :

```env
CORS_ALLOWED_ORIGINS=https://ton-front.vercel.app
```

Si tu veux autoriser plusieurs origines :

```env
CORS_ALLOWED_ORIGINS=https://ton-front.vercel.app,https://ton-domaine.com,http://localhost:3000
```

## 4. Dossier uploads

Verifie que le dossier `backend/uploads` existe et qu'il est accessible en ecriture sur Infinity.

## 5. Front React sur Vercel

Dans Vercel :

1. importe le repo
2. choisis `frontend` comme Root Directory
3. garde la commande de build `npm run build`
4. garde le dossier de sortie `build`
5. ajoute la variable d'environnement `REACT_APP_BACKEND_BASE_URL`

Exemple :

```env
REACT_APP_BACKEND_BASE_URL=https://ton-site.infinityfreeapp.com/backend
```

Le fichier [frontend/vercel.json](C:\xampp\htdocs\gestion_stock-onda-2fd7d866fcd83965731011b3115bc0186dd89b16\frontend\vercel.json) gere deja la redirection SPA pour React Router.

## 6. Exemple local

Tu peux copier [frontend/.env.example](C:\xampp\htdocs\gestion_stock-onda-2fd7d866fcd83965731011b3115bc0186dd89b16\frontend\.env.example) vers `.env.local` dans `frontend` et y mettre ton URL de backend.
