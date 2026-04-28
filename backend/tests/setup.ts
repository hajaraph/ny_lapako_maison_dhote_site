/**
 * Configuration globale pour les tests
 * Crée une base de données de test isolée (fichier temporaire)
 */

import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import * as schema from "../src/db/schema";
import { unlinkSync } from "node:fs";

// Fichier temporaire unique pour chaque suite de tests
export const TEST_DB_PATH = `test-${Date.now()}-${Math.random().toString(36).substring(7)}.sqlite`;

export function createTestDb() {
    // Supprimer fichier existant s'il existe
    try {
        unlinkSync(TEST_DB_PATH);
    } catch {
        // Fichier n'existe pas, c'est OK
    }
    
    const sqlite = new Database(TEST_DB_PATH);
    const db = drizzle(sqlite, { schema });
    
    // Créer les tables
    sqlite.exec(`
        CREATE TABLE IF NOT EXISTS administrateurs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nom TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            mot_de_passe TEXT NOT NULL,
            deleted_at INTEGER
        );
        
        CREATE TABLE IF NOT EXISTS actualites (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titre TEXT NOT NULL,
            contenu TEXT,
            image_url TEXT,
            date_publication TEXT,
            statut TEXT DEFAULT 'brouillon',
            deleted_at INTEGER
        );
        
        CREATE TABLE IF NOT EXISTS evenements (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titre TEXT NOT NULL,
            description TEXT,
            date_evenement TEXT,
            image_url TEXT,
            statut TEXT DEFAULT 'planifie',
            deleted_at INTEGER
        );
        
        CREATE TABLE IF NOT EXISTS avis_clients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nom_client TEXT NOT NULL,
            commentaire TEXT,
            note INTEGER DEFAULT 5,
            date_sejour TEXT,
            statut TEXT DEFAULT 'en_attente',
            deleted_at INTEGER
        );
        
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
    
    return { db, sqlite };
}

export function closeTestDb(sqlite: Database) {
    sqlite.close();
    
    // Supprimer le fichier temporaire
    try {
        unlinkSync(TEST_DB_PATH);
    } catch {
        // Fichier peut déjà être supprimé ou n'existe pas
    }
}
