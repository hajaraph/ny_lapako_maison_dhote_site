import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import { Hono } from "hono";
import { hash } from "argon2";
import { createTestDb, closeTestDb, TEST_DB_PATH } from "./setup";
import type { Database } from "bun:sqlite";

describe("Auth Routes", () => {
    let db: any;
    let sqlite: Database;
    let app: Hono;
    let routeAuth: any;
    
    beforeAll(async () => {
        // 1. Créer la DB de test et définir DB_PATH AVANT d'importer les routes
        const testDb = createTestDb();
        db = testDb.db;
        sqlite = testDb.sqlite;
        
        // Définir la variable d'environnement pour que bdd.ts utilise la bonne DB
        process.env.DB_PATH = TEST_DB_PATH;
        
        // 2. Importer dynamiquement les routes (pour qu'elles utilisent la bonne DB)
        const authModule = await import("../src/routes/auth");
        routeAuth = authModule.default;
        
        // 3. Créer un admin de test dans la DB de test
        const { administrateurs } = await import("../src/db/schema");
        const hashedPassword = await hash("testpassword123");
        db.insert(administrateurs).values({
            nom: "Test Admin",
            email: "test@example.com",
            mot_de_passe: hashedPassword
        }).run();
        
        // 4. Monter les routes sur l'app de test
        app = new Hono();
        app.route('/auth', routeAuth);
    });
    
    afterAll(() => {
        closeTestDb(sqlite);
        delete process.env.DB_PATH;
    });
    
    describe("POST /auth/login", () => {
        it("devrait retourner un token pour des identifiants valides", async () => {
            const req = new Request("http://localhost/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: "test@example.com",
                    mot_de_passe: "testpassword123"
                })
            });
            
            const res = await app.fetch(req);
            expect(res.status).toBe(200);
            
            const data: any = await res.json();
            expect(data.token).toBeDefined();
            expect(data.admin).toBeDefined();
            expect(data.admin.email).toBe("test@example.com");
        });
        
        it("devrait retourner 401 pour un email invalide", async () => {
            const req = new Request("http://localhost/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: "invalide@example.com",
                    mot_de_passe: "testpassword123"
                })
            });
            
            const res = await app.fetch(req);
            expect(res.status).toBe(401);
            
            const data: any = await res.json();
            expect(data.error).toBe("Identifiants invalides");
        });
        
        it("devrait retourner 401 pour un mot de passe invalide", async () => {
            const req = new Request("http://localhost/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: "test@example.com",
                    mot_de_passe: "mauvaispassword"
                })
            });
            
            const res = await app.fetch(req);
            expect(res.status).toBe(401);
            
            const data: any = await res.json();
            expect(data.error).toBe("Identifiants invalides");
        });
        
        it("devrait retourner 400 pour un corps JSON invalide", async () => {
            const req = new Request("http://localhost/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: "corps invalide"
            });
            
            const res = await app.fetch(req);
            expect(res.status).toBe(400);
            
            const data: any = await res.json();
            expect(data.error).toBeDefined(); // Zod retourne "Validation échouée" ou erreur parsing
        });
    });
});
