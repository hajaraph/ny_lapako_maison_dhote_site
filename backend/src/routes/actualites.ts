import { Hono } from 'hono';
import { db } from '../bdd';
import { actualites } from '../db/schema';
import { desc, eq } from 'drizzle-orm';
import { adminAuth } from '../middleware/adminAuth';

const routeActualites = new Hono();

routeActualites.get('/', async (c) => {
    const data = await db.select().from(actualites).orderBy(desc(actualites.id)).all();
    return c.json(data);
});

routeActualites.post('/', adminAuth, async (c) => {
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

routeActualites.delete('/:id', adminAuth, async (c) => {
    const id = Number(c.req.param('id'));

    if (!Number.isFinite(id)) {
        return c.json({ error: 'Identifiant invalide' }, 400);
    }

    await db.delete(actualites).where(eq(actualites.id, id)).run();
    return c.json({ message: "Actualité supprimée" });
});

export default routeActualites;
