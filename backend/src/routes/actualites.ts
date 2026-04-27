import { Hono } from 'hono';
import { db } from '../bdd';
import { actualites } from '../db/schema';
import { desc, eq } from 'drizzle-orm';
import { adminAuth } from '../middleware/adminAuth';
import { lireActualiteDepuisRequete, supprimerImageActualiteLocale } from '../lib/actualiteMedia';

const routeActualites = new Hono();

routeActualites.get('/', async (c) => {
    const data = await db.select().from(actualites).orderBy(desc(actualites.id)).all();
    return c.json(data);
});

routeActualites.post('/', adminAuth, async (c) => {
    const { actualite } = await lireActualiteDepuisRequete(c);

    if (!actualite.titre) {
        return c.json({ error: 'Le titre est requis' }, 400);
    }

    await db.insert(actualites).values({
        titre: actualite.titre,
        contenu: actualite.contenu,
        image_url: actualite.image_url,
        date_publication: actualite.date_publication,
        statut: actualite.statut
    }).run();
    return c.json({ message: "Actualité créée" }, 201);
});

routeActualites.delete('/:id', adminAuth, async (c) => {
    const id = Number(c.req.param('id'));

    if (!Number.isFinite(id)) {
        return c.json({ error: 'Identifiant invalide' }, 400);
    }

    const actualiteExistant = await db.select({ image_url: actualites.image_url })
        .from(actualites)
        .where(eq(actualites.id, id))
        .limit(1)
        .get();

    await db.delete(actualites).where(eq(actualites.id, id)).run();
    await supprimerImageActualiteLocale(actualiteExistant?.image_url ?? '');
    return c.json({ message: "Actualité supprimée" });
});

export default routeActualites;
