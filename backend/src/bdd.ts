import { Database } from "bun:sqlite";

// Initialisation de la connexion
export const bdd = new Database("maison.sqlite", { create: true });

// Fonction pour initialiser les tables si elles n'existent pas
export function initialiserTables() {
    bdd.run(`
        CREATE TABLE IF NOT EXISTS administrateurs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nom TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            mot_de_passe TEXT NOT NULL
        )
    `);

    bdd.run(`
        CREATE TABLE IF NOT EXISTS actualites (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titre TEXT NOT NULL,
            contenu TEXT,
            image_url TEXT,
            date_publication TEXT,
            statut TEXT DEFAULT 'brouillon'
        )
    `);

    bdd.run(`
        CREATE TABLE IF NOT EXISTS evenements (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titre TEXT NOT NULL,
            description TEXT,
            date_evenement TEXT,
            image_url TEXT,
            statut TEXT DEFAULT 'actif'
        )
    `);

    bdd.run(`
        CREATE TABLE IF NOT EXISTS avis_clients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nom_client TEXT NOT NULL,
            commentaire TEXT,
            note INTEGER DEFAULT 5,
            date_sejour TEXT,
            statut TEXT DEFAULT 'en_attente'
        )
    `);

    // Créer un admin par défaut si vide
    const verifAdmin = bdd.query("SELECT id FROM administrateurs LIMIT 1").get();
    if (!verifAdmin) {
        bdd.run(
            "INSERT INTO administrateurs (nom, email, mot_de_passe) VALUES (?, ?, ?)",
            ["Gestionnaire", "admin@verdantrefuge.fr", "admin123"]
        );
        console.log("✔ Compte admin par défaut prêt.");
    }
}
