import { Hono } from 'hono';
import { db } from '../bdd';
import { avisClients } from '../db/schema';
import { desc, eq } from 'drizzle-orm';
import { adminAuth } from '../middleware/adminAuth';

const routeAvis = new Hono();
const MAX_COMMENTAIRE_LENGTH = 500;
const COMMENTAIRE_TROP_LONG = `Le message client ne peut pas dépasser ${MAX_COMMENTAIRE_LENGTH} caractères.`;

routeAvis.get('/', async (c) => {
    const data = await db.select().from(avisClients).orderBy(desc(avisClients.id)).all();
    return c.json(data);
});

routeAvis.post('/', async (c) => {
    let corps;

    try {
        corps = await c.req.json();
    } catch {
        return c.json({ error: 'Corps JSON invalide' }, 400);
    }

    const nomClient = typeof corps?.nom_client === 'string' ? corps.nom_client.trim() : '';
    const commentaire = typeof corps?.commentaire === 'string' ? corps.commentaire.trim() : '';
    const dateSejour = typeof corps?.date_sejour === 'string' ? corps.date_sejour.trim() : '';
    const noteBrute = Number.parseInt(corps?.note, 10);
    const note = Number.isFinite(noteBrute) ? Math.min(5, Math.max(1, noteBrute)) : 5;

    if (!nomClient) {
        return c.json({ error: 'Le nom du client est requis' }, 400);
    }

    if (!commentaire) {
        return c.json({ error: 'Le message du client est requis' }, 400);
    }

    if (commentaire.length > MAX_COMMENTAIRE_LENGTH) {
        return c.json({ error: COMMENTAIRE_TROP_LONG }, 400);
    }

    try {
        await db.insert(avisClients).values({
            nom_client: nomClient,
            commentaire,
            note,
            date_sejour: dateSejour,
        }).run();
    } catch (error) {
        if (typeof error?.message === 'string' && error.message.includes('500 caractères')) {
            return c.json({ error: COMMENTAIRE_TROP_LONG }, 400);
        }

        throw error;
    }

    return c.json({ message: "Avis soumis avec succès" }, 201);
});

routeAvis.patch('/:id/statut', adminAuth, async (c) => {
    const id = Number(c.req.param('id'));

    if (!Number.isFinite(id)) {
        return c.json({ error: 'Identifiant invalide' }, 400);
    }

    const { statut } = await c.req.json();
    await db.update(avisClients)
        .set({ statut })
        .where(eq(avisClients.id, id))
        .run();
    return c.json({ message: "Statut mis à jour" });
});

export default routeAvis;
