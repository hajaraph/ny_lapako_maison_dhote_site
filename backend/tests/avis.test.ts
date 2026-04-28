import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import { Hono } from "hono";
import routeAvis from "../src/routes/avis";
import { createTestDb, closeTestDb } from "./setup";
import type { Database } from "bun:sqlite";
import { avisClients } from "../src/db/schema";

describe("Avis Routes", () => {
    let db: any;
    let sqlite: Database;
    let app: Hono;
    
    beforeAll(() => {
        const testDb = createTestDb();
        db = testDb.db;
        sqlite = testDb.sqlite;
        
        // Monter les routes sur l'app de test
        app = new Hono();
        app.route('/avis', routeAvis);
        
        // Insérer des avis de test
        db.insert(avisClients).values([
            {
                nom_client: "Jean Dupont",
                commentaire: "Excellent séjour",
                note: 5,
                date_sejour: "2026-04-15",
                statut: "approuve"
            },
            {
                nom_client: "Marie Martin",
                commentaire: "Très belle maison",
                note: 4,
                date_sejour: "2026-03-20",
                statut: "en_attente"
            }
        ]).run();
    });
    
    afterAll(() => {
        closeTestDb(sqlite);
    });
    
    describe("GET /avis", () => {
        it("devrait retourner la liste des avis", async () => {
            const req = new Request("http://localhost/avis");
            const res = await app.fetch(req);
            
            expect(res.status).toBe(200);
            
            const data = await res.json() as any[];
            expect(data.length).toBe(2);
            expect(data[0].nom_client).toBe("Marie Martin"); // Ordre desc
            expect(data[1].nom_client).toBe("Jean Dupont");
        });
    });
    
    describe("POST /avis", () => {
        it("devrait créer un nouvel avis", async () => {
            const nouvelAvis = {
                nom_client: "Pierre Durand",
                commentaire: "Magnifique endroit",
                note: 5,
                date_sejour: "2026-05-01"
            };
            
            const req = new Request("http://localhost/avis", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nouvelAvis)
            });
            
            const res = await app.fetch(req);
            expect(res.status).toBe(201);
            
            const data: any = await res.json();
            expect(data.message).toBe("Avis soumis avec succès");
        });
        
        it("devrait retourner 400 si nom_client manquant", async () => {
            const avisInvalide = {
                commentaire: "Test",
                note: 3,
                date_sejour: "2026-05-01"
            };
            
            const req = new Request("http://localhost/avis", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(avisInvalide)
            });
            
            const res = await app.fetch(req);
            expect(res.status).toBe(400);
            
            const data: any = await res.json();
            expect(data.error).toBe("Le nom du client est requis");
        });
        
        it("devrait retourner 400 si date_sejour manquante", async () => {
            const avisInvalide = {
                nom_client: "Test",
                commentaire: "Test",
                note: 3
            };
            
            const req = new Request("http://localhost/avis", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(avisInvalide)
            });
            
            const res = await app.fetch(req);
            expect(res.status).toBe(400);
            
            const data: any = await res.json();
            expect(data.error).toBe("La date de séjour est requise");
        });
        
        it("devrait retourner 400 si commentaire trop long", async () => {
            const avisInvalide = {
                nom_client: "Test",
                commentaire: "a".repeat(501),
                note: 3,
                date_sejour: "2026-05-01"
            };
            
            const req = new Request("http://localhost/avis", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(avisInvalide)
            });
            
            const res = await app.fetch(req);
            expect(res.status).toBe(400);
            
            const data: any = await res.json();
            expect(data.error).toContain("500 caractères");
        });
    });
});
