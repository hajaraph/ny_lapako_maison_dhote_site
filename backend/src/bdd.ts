import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { hash } from "argon2";
import { DEFAULT_SITE_SETTINGS } from "./lib/siteSettings";
import * as schema from "./db/schema";
import { dbLogger, errorLogger } from "./lib/logger";

// Support DB_PATH pour tests (fichier temporaire), sinon maison.sqlite par défaut
const DB_PATH = process.env.DB_PATH || "maison.sqlite";
const sqlite = new Database(DB_PATH, { create: true });
export const db = drizzle(sqlite, { schema });

/**
 * Initialisation des données de base.
 * Note : La structure des tables est désormais gérée par Drizzle Kit.
 * Utilisez 'bunx drizzle-kit push' pour synchroniser le schéma avec la base SQLite.
 */
export async function initialiserTables() {
    try {
        sqlite.exec(`
            CREATE TABLE IF NOT EXISTS site_settings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                address TEXT NOT NULL,
                contact_phone TEXT NOT NULL,
                contact_whatsapp TEXT NOT NULL,
                contact_email TEXT NOT NULL,
                opening_hours TEXT NOT NULL,
                check_in TEXT NOT NULL,
                copyright_owner TEXT NOT NULL,
                copyright_url TEXT NOT NULL
            );
        `);

        const siteSettingsExistant = db.select().from(schema.siteSettings).limit(1).get();

        if (!siteSettingsExistant) {
            db.insert(schema.siteSettings).values(DEFAULT_SITE_SETTINGS).run();
            dbLogger.info({}, 'Informations du site initialisées');
        }
    } catch (e) {
        errorLogger.error({ error: e }, 'Impossible d\'initialiser les informations du site');
    }

    try {
        sqlite.exec(`
            CREATE TRIGGER IF NOT EXISTS avis_clients_commentaire_limit_insert
            BEFORE INSERT ON avis_clients
            FOR EACH ROW
            WHEN NEW.commentaire IS NOT NULL AND length(NEW.commentaire) > 500
            BEGIN
                SELECT RAISE(ABORT, 'Le message client ne peut pas dépasser 500 caractères.');
            END;

            CREATE TRIGGER IF NOT EXISTS avis_clients_commentaire_limit_update
            BEFORE UPDATE OF commentaire ON avis_clients
            FOR EACH ROW
            WHEN NEW.commentaire IS NOT NULL AND length(NEW.commentaire) > 500
            BEGIN
                SELECT RAISE(ABORT, 'Le message client ne peut pas dépasser 500 caractères.');
            END;
        `);
    } catch (e) {
        errorLogger.error({ error: e }, 'Impossible de créer la contrainte de longueur des avis');
    }

    // Créer un admin par défaut si la table existe et est vide
    try {
        const verifAdmin = await db.select().from(schema.administrateurs).limit(1).get();
        
        if (!verifAdmin) {
            const hashedPassword = await hash("admin123");
            db.insert(schema.administrateurs).values({
                nom: "Gestionnaire",
                email: "admin@nylapako.fr",
                mot_de_passe: hashedPassword
            }).run();
            dbLogger.info({ email: 'admin@nylapako.fr' }, 'Compte admin par défaut créé');
        }
    } catch (e) {
        errorLogger.error({ error: e }, 'Impossible de vérifier l\'admin');
    }
}
