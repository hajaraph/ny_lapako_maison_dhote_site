import { Hono } from 'hono';
import { db } from '../bdd';
import { evenements } from '../db/schema';
import { asc } from 'drizzle-orm';

const routeEvenements = new Hono();

routeEvenements.get('/', async (c) => {
    const data = await db.select().from(evenements).orderBy(asc(evenements.date_evenement)).all();
    return c.json(data);
});

routeEvenements.post('/', async (c) => {
    const corps = await c.req.json();
    await db.insert(evenements).values({
        titre: corps.titre,
        description: corps.description,
        date_evenement: corps.date_evenement,
        image_url: corps.image_url,
        statut: corps.statut
    }).run();
    return c.json({ message: "Événement créé" }, 201);
});

export default routeEvenements;
