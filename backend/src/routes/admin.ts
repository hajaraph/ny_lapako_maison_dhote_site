import { Hono } from 'hono';
import { db } from '../bdd';
import { actualites, administrateurs, avisClients, evenements } from '../db/schema';
import { asc, desc, eq } from 'drizzle-orm';
import { adminAuth } from '../middleware/adminAuth';
import { lireEvenementDepuisRequete, supprimerImageLocale } from '../lib/evenementMedia';

const routeAdmin = new Hono();

// Protection de toutes les routes admin
routeAdmin.use('/*', adminAuth);

function lireAdminId(c: { get: (key: string) => unknown }) {
    const payload = c.get('jwtPayload') as { sub?: string | number } | undefined;
    const adminId = Number(payload?.sub);

    return Number.isFinite(adminId) ? adminId : null;
}

function formatStatsAvis(avis: Array<{ note?: number | null; statut?: string | null }>) {
    const avisApprouves = avis.filter((item) => item.statut === 'approuve' || item.statut === 'Approuvé').length;
    const avisEnAttente = avis.length - avisApprouves;
    const moyenneNote = avis.length
        ? Number((avis.reduce((total, item) => total + (Number(item.note) || 0), 0) / avis.length).toFixed(1))
        : 0;

    return { avisApprouves, avisEnAttente, moyenneNote };
}

routeAdmin.get('/stats', async (c) => {
    const [actualitesData, evenementsData, avisData] = await Promise.all([
        db.select().from(actualites).all(),
        db.select().from(evenements).all(),
        db.select().from(avisClients).all(),
    ]);

    const { avisApprouves, avisEnAttente, moyenneNote } = formatStatsAvis(avisData);

    return c.json({
        actualitesTotal: actualitesData.length,
        evenementsTotal: evenementsData.length,
        avisApprouves,
        avisEnAttente,
        moyenneNote,
    });
});

// Récupérer le profil admin unique
routeAdmin.get('/profil', async (c) => {
    const adminId = lireAdminId(c);

    if (adminId === null) {
        return c.json({ error: 'Jeton administrateur invalide' }, 401);
    }

    const profil = await db.select({
        id: administrateurs.id,
        nom: administrateurs.nom,
        email: administrateurs.email
    }).from(administrateurs).where(eq(administrateurs.id, adminId)).limit(1).get();
    
    return c.json(profil);
});

// Mettre à jour le profil admin
routeAdmin.patch('/profil', async (c) => {
    const corps = await c.req.json();
    const { nom, email, mot_de_passe } = corps;
    const adminId = lireAdminId(c);

    if (adminId === null) {
        return c.json({ error: 'Jeton administrateur invalide' }, 401);
    }

    const updateData: { nom?: string; email?: string; mot_de_passe?: string } = { nom, email };
    if (mot_de_passe && mot_de_passe.trim() !== "") {
        updateData.mot_de_passe = mot_de_passe;
    }

    await db.update(administrateurs)
        .set(updateData)
        .where(eq(administrateurs.id, adminId))
        .run();
    
    return c.json({ message: "Profil admin mis à jour avec succès" });
});

routeAdmin.get('/actualites', async (c) => {
    const data = await db.select().from(actualites).orderBy(desc(actualites.id)).all();
    return c.json(data);
});

routeAdmin.post('/actualites', async (c) => {
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

routeAdmin.delete('/actualites/:id', async (c) => {
    const id = Number(c.req.param('id'));

    if (!Number.isFinite(id)) {
        return c.json({ error: 'Identifiant invalide' }, 400);
    }

    await db.delete(actualites).where(eq(actualites.id, id)).run();
    return c.json({ message: "Actualité supprimée" });
});

routeAdmin.get('/evenements', async (c) => {
    const data = await db.select().from(evenements).orderBy(asc(evenements.date_evenement)).all();
    return c.json(data);
});

routeAdmin.post('/evenements', async (c) => {
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

routeAdmin.patch('/evenements/:id', async (c) => {
    const id = Number(c.req.param('id'));

    if (!Number.isFinite(id)) {
        return c.json({ error: 'Identifiant invalide' }, 400);
    }

    const evenementExistant = await db.select({ image_url: evenements.image_url })
        .from(evenements)
        .where(eq(evenements.id, id))
        .limit(1)
        .get();

    const { evenement, imageRemplacee } = await lireEvenementDepuisRequete(c, evenementExistant?.image_url ?? '');

    await db.update(evenements)
        .set({
            titre: evenement.titre,
            description: evenement.description,
            date_evenement: evenement.date_evenement,
            image_url: evenement.image_url,
            statut: evenement.statut,
        })
        .where(eq(evenements.id, id))
        .run();

    if (imageRemplacee) {
        await supprimerImageLocale(imageRemplacee);
    }

    return c.json({ message: "Événement mis à jour" });
});

routeAdmin.delete('/evenements/:id', async (c) => {
    const id = Number(c.req.param('id'));

    if (!Number.isFinite(id)) {
        return c.json({ error: 'Identifiant invalide' }, 400);
    }

    const evenementExistant = await db.select({ image_url: evenements.image_url })
        .from(evenements)
        .where(eq(evenements.id, id))
        .limit(1)
        .get();

    await db.delete(evenements).where(eq(evenements.id, id)).run();

    await supprimerImageLocale(evenementExistant?.image_url ?? '');

    return c.json({ message: "Événement supprimé" });
});

routeAdmin.get('/avis', async (c) => {
    const data = await db.select().from(avisClients).orderBy(desc(avisClients.id)).all();
    return c.json(data);
});

routeAdmin.patch('/avis/:id/statut', async (c) => {
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

export default routeAdmin;
