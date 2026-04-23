import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { initialiserTables } from './src/bdd';

// Importation des modules de routes
import routeAdmin from './src/routes/admin';
import routeActualites from './src/routes/actualites';
import routeEvenements from './src/routes/evenements';
import routeAvis from './src/routes/avis';

const app = new Hono();

// Configuration globale
app.use('/*', cors());

// Initialisation de la base de données
initialiserTables();

// Montage des routes (Versioning ou simple préfixe)
app.route('/admin', routeAdmin);
app.route('/actualites', routeActualites);
app.route('/evenements', routeEvenements);
app.route('/avis', routeAvis);

// Route de base pour vérifier que tout fonctionne
app.get('/', (c) => c.text('Bienvenue sur l\'API de Verdant Refuge (Opérationnelle 🚀)'));

export default {
    port: 3000,
    fetch: app.fetch,
};

console.log("✔ Serveur démarré sur http://localhost:3000");
