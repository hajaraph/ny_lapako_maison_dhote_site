import { Hono } from 'hono';
import { db } from '../bdd';
import { evenements } from '../db/schema';
import { asc } from 'drizzle-orm';
import { adminAuth } from '../middleware/adminAuth';
import { lireEvenementDepuisRequete } from '../lib/evenementMedia';

const routeEvenements = new Hono();

routeEvenements.get('/', async (c) => {
    const data = await db.select().from(evenements).orderBy(asc(evenements.date_evenement)).all();
    return c.json(data);
});

routeEvenements.post('/', adminAuth, async (c) => {
    const { evenement } = await lireEvenementDepuisRequete(c);
    await db.insert(evenements).values({
        titre: evenement.titre,
        description: evenement.description,
        date_evenement: evenement.date_evenement,
        image_url: evenement.image_url,
        statut: evenement.statut
    }).run();
    return c.json({ message: "Événement créé" }, 201);
});

export default routeEvenements;
