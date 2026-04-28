import { Hono } from 'hono';
import { db } from '../bdd';
import { evenements } from '../db/schema';
import { asc, count } from 'drizzle-orm';
import { adminAuth } from '../middleware/adminAuth';
import { lireEvenementDepuisRequete } from '../lib/evenementMedia';
import { getPaginationParams, getOffset, createPaginatedResult } from '../lib/pagination';

const routeEvenements = new Hono();

routeEvenements.get('/', async (c) => {
    const { page, limit } = getPaginationParams(c.req.url);
    const offset = getOffset(page, limit);
    
    const countResult = await db.select({ value: count() }).from(evenements);
    const total = countResult[0]?.value ?? 0;
    
    const data = await db.select()
        .from(evenements)
        .orderBy(asc(evenements.date_evenement))
        .limit(limit)
        .offset(offset)
        .all();
    
    return c.json(createPaginatedResult(data, total, { page, limit }));
});

routeEvenements.post('/', adminAuth, async (c) => {
    const { evenement } = await lireEvenementDepuisRequete(c);

    if (!evenement.titre || evenement.titre.trim().length === 0) {
        return c.json({ error: "Le titre est requis" }, 400);
    }

    await db.insert(evenements).values({
        titre: evenement.titre.trim(),
        description: evenement.description,
        date_evenement: evenement.date_evenement,
        image_url: evenement.image_url,
        statut: evenement.statut
    }).run();
    return c.json({ message: "Événement créé" }, 201);
});

export default routeEvenements;
