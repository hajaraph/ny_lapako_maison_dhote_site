import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import { Hono } from "hono";
import { hash } from "argon2";
import routeAuth from "../src/routes/auth";
import { createTestDb, closeTestDb } from "./setup";
import type { Database } from "bun:sqlite";
import { administrateurs } from "../src/db/schema";

describe("Auth Routes", () => {
    let db: any;
    let sqlite: Database;
    let app: Hono;
    
    beforeAll(async () => {
        const testDb = createTestDb();
        db = testDb.db;
        sqlite = testDb.sqlite;
        
        // Créer un admin de test
        const hashedPassword = await hash("testpassword123");
        db.insert(administrateurs).values({
            nom: "Test Admin",
            email: "test@example.com",
            mot_de_passe: hashedPassword
        }).run();
        
        // Monter les routes sur l'app de test
        app = new Hono();
        app.route('/auth', routeAuth);
    });
    
    afterAll(() => {
        closeTestDb(sqlite);
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
        });
    });
});
