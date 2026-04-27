import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { DEFAULT_SITE_SETTINGS } from "./lib/siteSettings";
import * as schema from "./db/schema";

const sqlite = new Database("maison.sqlite", { create: true });
export const db = drizzle(sqlite, { schema });

/**
 * Initialisation des données de base.
 * Note : La structure des tables est désormais gérée par Drizzle Kit.
 * Utilisez 'bunx drizzle-kit push' pour synchroniser le schéma avec la base SQLite.
 */
export function initialiserTables() {
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
            console.log("✔ Informations du site prêtes.");
        }
    } catch (e) {
        console.log("⚠ Impossible d'initialiser les informations du site.");
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
        console.log("⚠ Impossible de créer la contrainte de longueur des avis.");
    }

    // Créer un admin par défaut si la table existe et est vide
    try {
        const verifAdmin = db.select().from(schema.administrateurs).limit(1).get();
        
        if (!verifAdmin) {
            db.insert(schema.administrateurs).values({
                nom: "Gestionnaire",
                email: "admin@nylapako.fr",
                mot_de_passe: "admin123"
            }).run();
            console.log("✔ Compte admin par défaut prêt.");
        }
    } catch (e) {
        console.log("⚠ Impossible de vérifier l'admin. Assurez-vous que les migrations sont appliquées.");
    }
}
