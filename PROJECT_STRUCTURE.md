# Structure du Projet Maison

Ce document décrit l'organisation et les technologies utilisées dans le projet Maison.

## 🏗️ Architecture Globale

Le projet est divisé en deux parties principales :
- `backend/` : API et logique serveur.
- `frontend/` : Interface utilisateur.

---

## 🖥️ Backend (`/backend`)

Le backend est construit avec **Bun** et le framework **Hono**. Il utilise **SQLite** comme base de données.

### Technologies
- **Runtime** : [Bun](https://bun.sh/)
- **Framework Web** : [Hono](https://hono.dev/)
- **Base de données** : SQLite (`maison.sqlite`)
- **Langage** : TypeScript

### Structure des dossiers
- `index.ts` : Point d'entrée de l'application.
- `src/` :
    - `bdd.ts` : Configuration et gestion de la base de données.
    - `routes/` : Définition des points de terminaison de l'API.
        - `actualites.ts` : Gestion des actualités.
        - `admin.ts` : Routes protégées pour l'administration.
        - `avis.ts` : Gestion des avis clients.
        - `evenements.ts` : Gestion des événements.

---

## 🎨 Frontend (`/frontend`)

Le frontend est une application moderne construite avec **Preact** et **Vite**.

### Technologies
- **Framework** : [Preact](https://preactjs.com/)
- **Build Tool** : [Vite](https://vitejs.dev/)
- **Styling** : [Tailwind CSS](https://tailwindcss.com/)
- **Routage** : [preact-iso](https://github.com/preactjs/preact-iso)

### Structure des dossiers
- `src/` :
    - `index.jsx` : Point d'entrée de l'application.
    - `api.js` : Fonctions pour interagir avec le backend.
    - `style.css` : Styles globaux (Tailwind).
    - `components/` : Composants réutilisables (Header, Footer).
    - `pages/` : Composants de page complets.
        - `Home/` : Page d'accueil.
        - `Auth/` : Pages d'authentification (Login).
        - `Admin/` : Tableau de bord d'administration.
        - `_404.jsx` : Page d'erreur 404.

---

## 🛠️ Commandes Utiles

### Backend
- `bun run dev` : Lance le serveur en mode développement avec rechargement automatique.
- `bun run start` : Lance le serveur en production.

### Frontend
- `npm run dev` : Lance le serveur de développement Vite.
- `npm run build` : Construit l'application pour la production.
- `npm run preview` : Prévisualise la version de production localement.
