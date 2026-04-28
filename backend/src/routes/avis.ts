import { Hono } from 'hono';
import { db } from '../bdd';
import { avisClients } from '../db/schema';
import { desc, eq } from 'drizzle-orm';
import { adminAuth } from '../middleware/adminAuth';
import { avisClientSchema, avisModerationSchema, type AvisClientInput, type AvisModerationInput } from '../lib/validation';
import { validate, getValidated } from '../middleware/validate';

const routeAvis = new Hono();

routeAvis.get('/', async (c) => {
    const data = await db.select().from(avisClients).orderBy(desc(avisClients.id)).all();
    return c.json(data);
});

routeAvis.post('/', validate(avisClientSchema), async (c) => {
    const { nom_client, commentaire, note, date_sejour } = getValidated<AvisClientInput>(c);

    await db.insert(avisClients).values({
        nom_client,
        commentaire,
        note,
        date_sejour,
    }).run();

    return c.json({ message: "Avis soumis avec succès" }, 201);
});

routeAvis.patch('/:id/statut', adminAuth, validate(avisModerationSchema), async (c) => {
    const id = Number(c.req.param('id'));

    if (!Number.isFinite(id)) {
        return c.json({ error: 'Identifiant invalide' }, 400);
    }

    const { statut } = getValidated<AvisModerationInput>(c);
    await db.update(avisClients)
        .set({ statut })
        .where(eq(avisClients.id, id))
        .run();
    return c.json({ message: "Statut mis à jour" });
});

export default routeAvis;
