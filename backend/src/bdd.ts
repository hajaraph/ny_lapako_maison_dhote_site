import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import * as schema from "./db/schema";

const sqlite = new Database("maison.sqlite", { create: true });
export const db = drizzle(sqlite, { schema });

/**
 * Initialisation des données de base.
 * Note : La structure des tables est désormais gérée par Drizzle Kit.
 * Utilisez 'bunx drizzle-kit push' pour synchroniser le schéma avec la base SQLite.
 */
export function initialiserTables() {
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
