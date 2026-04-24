import { Hono } from 'hono';
import { db } from '../bdd';
import { avisClients } from '../db/schema';
import { desc, eq } from 'drizzle-orm';

const routeAvis = new Hono();

routeAvis.get('/', async (c) => {
    const data = await db.select().from(avisClients).orderBy(desc(avisClients.id)).all();
    return c.json(data);
});

routeAvis.post('/', async (c) => {
    const corps = await c.req.json();
    await db.insert(avisClients).values({
        nom_client: corps.nom_client,
        commentaire: corps.commentaire,
        note: corps.note,
        date_sejour: corps.date_sejour
    }).run();
    return c.json({ message: "Avis soumis avec succès" }, 201);
});

routeAvis.patch('/:id/statut', async (c) => {
    const id = parseInt(c.req.param('id'));
    const { statut } = await c.req.json();
    await db.update(avisClients)
        .set({ statut })
        .where(eq(avisClients.id, id))
        .run();
    return c.json({ message: "Statut mis à jour" });
});

export default routeAvis;
