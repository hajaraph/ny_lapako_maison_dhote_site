import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { rateLimiter } from 'hono-rate-limiter';
import path from 'node:path';
import { stat } from 'node:fs/promises';
import { initialiserTables } from './src/bdd';
import { UPLOADS_ROOT } from './src/lib/evenementMedia';

// Importation des modules de routes
import routeAuth from './src/routes/auth';
import routeAdmin from './src/routes/admin';
import routeActualites from './src/routes/actualites';
import routeEvenements from './src/routes/evenements';
import routeAvis from './src/routes/avis';
import routeSiteInfo from './src/routes/siteInfo';

const app = new Hono();

app.get('/uploads/*', async (c) => {
  const { pathname } = new URL(c.req.url);
  const cheminRelatif = pathname.replace(/^\/uploads\//, '');
  const cheminAbsolu = path.resolve(UPLOADS_ROOT, cheminRelatif);
  const cheminDansUploads = path.relative(UPLOADS_ROOT, cheminAbsolu);

  if (cheminDansUploads.startsWith('..') || path.isAbsolute(cheminDansUploads)) {
    return c.text('Not Found', 404);
  }

  try {
    await stat(cheminAbsolu);
  } catch {
    return c.text('Not Found', 404);
  }

  const fichier = Bun.file(cheminAbsolu);

  return new Response(fichier, {
    headers: {
      'Content-Type': fichier.type || 'application/octet-stream',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
});

// Configuration CORS basée sur l'environnement
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : ['http://localhost:5173', 'http://localhost:4173', 'http://localhost:80', 'http://localhost'];

app.use('/*', cors({
  origin: (origin) => {
    // En production: vérifier l'origin, en dev: autoriser si pas d'origin ou localhost
    if (!origin || allowedOrigins.includes(origin)) {
      return origin;
    }
    // Bloquer les origins non autorisés
    return null;
  },
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
  maxAge: 600,
  credentials: true,
}));

// Initialisation de la base de données
await initialiserTables();

// Rate limiting pour l'authentification (5 tentatives par 15 minutes par IP)
const authRateLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 5, // 5 requêtes max
  standardHeaders: true,
  keyGenerator: (c) => c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'unknown',
});

app.use('/auth/login', authRateLimiter);

// Montage des routes (Versioning ou simple préfixe)
app.route('/auth', routeAuth);
app.route('/admin', routeAdmin);
app.route('/actualites', routeActualites);
app.route('/evenements', routeEvenements);
app.route('/avis', routeAvis);
app.route('/site-info', routeSiteInfo);

// Route de base pour vérifier que tout fonctionne
app.get('/', (c) => c.text('Bienvenue sur l\'API de Ny Lapako (Opérationnelle 🚀)'));

export default {
    port: 3000,
    fetch: app.fetch,
};

console.log("✔ Serveur démarré sur http://localhost:3000");
