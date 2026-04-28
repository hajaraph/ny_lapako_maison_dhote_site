import { Hono } from 'hono';
import { db } from '../bdd';
import { avisClients } from '../db/schema';
import { desc, eq, count, isNull } from 'drizzle-orm';
import { adminAuth } from '../middleware/adminAuth';
import { avisClientSchema, avisModerationSchema, type AvisClientInput, type AvisModerationInput } from '../lib/validation';
import { validate, getValidated } from '../middleware/validate';
import { getPaginationParams, getOffset, createPaginatedResult } from '../lib/pagination';

const routeAvis = new Hono();

routeAvis.get('/', async (c) => {
    const { page, limit } = getPaginationParams(c.req.url);
    const offset = getOffset(page, limit);
    
    // Récupérer le total pour la pagination
    const countResult = await db.select({ value: count() }).from(avisClients).where(isNull(avisClients.deleted_at));
    const total = countResult[0]?.value ?? 0;
    
    // Récupérer les données paginées
    const data = await db.select()
        .from(avisClients)
        .where(isNull(avisClients.deleted_at))
        .orderBy(desc(avisClients.id))
        .limit(limit)
        .offset(offset)
        .all();
    
    return c.json(createPaginatedResult(data, total, { page, limit }));
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
