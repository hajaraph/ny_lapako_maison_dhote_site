import { Hono } from 'hono';
import { db } from '../bdd';
import { actualites } from '../db/schema';
import { desc, eq } from 'drizzle-orm';

const routeActualites = new Hono();

routeActualites.get('/', async (c) => {
    const data = await db.select().from(actualites).orderBy(desc(actualites.id)).all();
    return c.json(data);
});

routeActualites.post('/', async (c) => {
    const corps = await c.req.json();
    await db.insert(actualites).values({
        titre: corps.titre,
        contenu: corps.contenu,
        image_url: corps.image_url,
        date_publication: corps.date_publication,
        statut: corps.statut
    }).run();
    return c.json({ message: "Actualité créée" }, 201);
});

routeActualites.delete('/:id', async (c) => {
    const id = parseInt(c.req.param('id'));
    await db.delete(actualites).where(eq(actualites.id, id)).run();
    return c.json({ message: "Actualité supprimée" });
});

export default routeActualites;
