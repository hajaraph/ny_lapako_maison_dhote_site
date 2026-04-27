# Structure du Projet Maison

Ce document décrit l'organisation et les technologies utilisées dans le projet Maison.

## Suivi des Dernières Modifications

Ce journal doit être mis à jour à chaque changement important pour garder une trace claire de la dernière évolution livrée.

### 2026-04-27 - Déploiement frontend via Nginx (Docker)
- Frontend Docker migré vers Nginx :
  - build statique Vite dans une étape dédiée,
  - service Nginx pour servir l'application en production.
- Reverse proxy Nginx ajouté :
  - `/api/*` redirigé vers `backend:3000` dans le réseau Docker.
- Docker Compose ajusté :
  - target frontend : `frontend-nginx`,
  - port frontend : `80` (configurable via `FRONTEND_PORT`),
  - `VITE_API_BASE_URL` par défaut sur `/api`,
  - backend non exposé publiquement (accès interne Docker uniquement).
- Fichiers modifiés :
  - `Dockerfile`
  - `docker-compose.yml`
  - `frontend/.env.exemple`
  - `docker/nginx/default.conf`

### 2026-04-27 - Stack Docker unifiée frontend + backend
- Ajout d'un `Dockerfile` racine multi-target :
  - target `backend` (Bun + API Hono),
  - target `frontend` (build Vite + serveur preview).
- Ajout d'un `docker-compose.yml` unique qui orchestre les deux services (`frontend`, `backend`).
- Ajout d'un `.dockerignore` racine pour réduire le contexte de build.
- Fichiers ajoutés :
  - `Dockerfile`
  - `docker-compose.yml`
  - `.dockerignore`

### 2026-04-27 - Configuration `BASE_URL` via variable d'environnement frontend
- Frontend :
  - Remplacement du `BASE_URL` hardcodé dans `frontend/src/api.js` par une variable d'environnement `VITE_API_BASE_URL`.
  - Fallback conservé sur `http://localhost:3000` si la variable n'est pas définie.
  - Ajout d'un fichier d'exemple `frontend/.env.exemple`.
- Fichiers modifiés :
  - `frontend/src/api.js`
  - `frontend/.env.exemple`

### 2026-04-27 - Gestion multi-comptes administrateurs
- Backend :
  - Ajout des endpoints protégés JWT pour gérer les comptes admin :
    - `GET /admin/comptes`
    - `POST /admin/comptes`
    - `PATCH /admin/comptes/:id`
    - `DELETE /admin/comptes/:id`
  - Ajout de validations (email valide, mot de passe minimum 8 caractères, email unique).
  - Garde-fous ajoutés :
    - suppression de son propre compte interdite,
    - suppression du dernier compte administrateur interdite.
- Frontend :
  - Ajout d’un onglet `Comptes admin` dans le dashboard.
  - Ajout d’une interface de création, édition et suppression des comptes administrateurs.
  - Intégration API côté frontend (`api.admin.comptes`).
- Fichiers modifiés :
  - `backend/src/routes/admin.ts`
  - `frontend/src/api.js`
  - `frontend/src/pages/Admin/Dashboard.jsx`

## Architecture Globale

Le projet est divisé en deux parties principales :
- backend/ : API et logique serveur.
- frontend/ : Interface utilisateur.

---

## Backend (/backend)

Le backend est construit avec Bun et le framework Hono. Il utilise SQLite comme base de données.

### Technologies
- Runtime : Bun
- Framework Web : Hono
- Base de données : SQLite (maison.sqlite)
- Langage : TypeScript

### Structure des dossiers
- index.ts : Point d'entrée de l'application.
- src/ :
    - bdd.ts : Configuration et gestion de la base de données.
    - routes/ : Définition des points de terminaison de l'API.
        - actualites.ts : Gestion des actualités.
        - admin.ts : Routes protégées pour l'administration.
        - avis.ts : Gestion des avis clients.
        - evenements.ts : Gestion des événements.

---

## Frontend (/frontend)

Le frontend est une application moderne construite avec Preact et Vite.

### Technologies
- Framework : Preact
- Build Tool : Vite
- Styling : Tailwind CSS (v4)
- Routage : preact-iso

### Structure des dossiers
- src/ :
    - index.jsx : Point d'entrée de l'application.
    - api.js : Fonctions pour interagir avec le backend.
    - style.css : Styles globaux (Tailwind).
    - components/ : Composants réutilisables (Header, Footer).
    - pages/ : Composants de page complets.
        - Home/ : Page d'accueil.
        - Auth/ : Pages d'authentification (Login).
        - Admin/ : Tableau de bord d'administration.
        - _404.jsx : Page d'erreur 404.

---

## Commandes Utiles

### Backend
- bun run dev : Lance le serveur en mode développement avec rechargement automatique.
- bun run start : Lance le serveur en production.

### Frontend
- npm run dev : Lance le serveur de développement Vite.
- npm run build : Construit l'application pour la production.
- npm run preview : Prévisualise la version de production localement.

### Docker (Racine du projet)
- docker compose build : Construit les images frontend et backend.
- docker compose up -d : Démarre la stack complète en arrière-plan.
- docker compose down : Arrête et supprime les conteneurs.

Variables utiles pour Docker Compose (optionnelles) :
- `FRONTEND_PORT` (défaut `80`)
- `VITE_API_BASE_URL` (défaut `/api` en mode Docker/Nginx)
