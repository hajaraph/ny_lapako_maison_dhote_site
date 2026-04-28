import { Hono } from 'hono';
import { hash } from 'argon2';
import sanitizeHtml from 'sanitize-html';
import { db } from '../bdd';
import { actualites, administrateurs, avisClients, evenements, siteSettings } from '../db/schema';
import { asc, desc, eq, isNull } from 'drizzle-orm';
import { adminAuth } from '../middleware/adminAuth';
import { lireActualiteDepuisRequete, supprimerImageActualiteLocale } from '../lib/actualiteMedia';
import { lireEvenementDepuisRequete, supprimerImageLocale } from '../lib/evenementMedia';
import {
	estUrlValide,
	formaterSiteSettingsResponse,
} from '../lib/siteSettings';
import {
	adminCreateSchema,
	adminUpdateSchema,
	siteSettingsSchema,
	type AdminCreateInput,
	type AdminUpdateInput,
	type SiteSettingsInput,
} from '../lib/validation';
import { validate, getValidated } from '../middleware/validate';

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

function normaliserTexte(valeur: unknown) {
    return typeof valeur === 'string' ? valeur.trim() : '';
}

function emailValide(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function estErreurEmailUnique(erreur: unknown) {
    return erreur instanceof Error && erreur.message.includes('UNIQUE constraint failed: administrateurs.email');
}

/**
 * Sanitize HTML pour prévenir XSS
 * Configuration permissive pour l'admin (autorise formatage de base)
 */
function sanitiserHtml(texte: string): string {
    if (!texte) return '';

    return sanitizeHtml(texte, {
        allowedTags: ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li', 'h1', 'h2', 'h3', 'a', 'span'],
        allowedAttributes: {
            'a': ['href', 'target'],
            'span': ['class']
        },
        allowedSchemes: ['http', 'https'],
        selfClosing: ['br'],
    });
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

routeAdmin.get('/site-info', async (c) => {
    const siteInfo = await db.select().from(siteSettings).limit(1).get();

    return c.json(formaterSiteSettingsResponse(siteInfo ?? null));
});

routeAdmin.patch('/site-info', validate(siteSettingsSchema), async (c) => {
    const payload = getValidated<SiteSettingsInput>(c);
    const siteInfoActuel = await db.select().from(siteSettings).limit(1).get();
    
    // Fusionner avec les données existantes si présentes
    const siteInfoFusionne: any = siteInfoActuel 
        ? { ...siteInfoActuel, ...payload }
        : { ...payload };

    // Validations additionnelles qui dépendent de la fusion
    if (!siteInfoFusionne.address || !siteInfoFusionne.contact_phone || !siteInfoFusionne.contact_whatsapp || !siteInfoFusionne.contact_email) {
        return c.json({ error: 'Adresse, téléphone, WhatsApp et email sont requis' }, 400);
    }

    if (!estUrlValide(siteInfoFusionne.copyright_url || '')) {
        return c.json({ error: 'Lien de copyright invalide' }, 400);
    }

    if (siteInfoActuel) {
        await db.update(siteSettings)
            .set(siteInfoFusionne)
            .where(eq(siteSettings.id, siteInfoActuel.id))
            .run();
    } else {
        await db.insert(siteSettings).values(siteInfoFusionne).run();
    }

    return c.json({
        message: 'Informations du site mises à jour',
        siteInfo: formaterSiteSettingsResponse(siteInfoFusionne),
    });
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
        updateData.mot_de_passe = await hash(mot_de_passe.trim());
    }

    await db.update(administrateurs)
        .set(updateData)
        .where(eq(administrateurs.id, adminId))
        .run();
    
    return c.json({ message: "Profil admin mis à jour avec succès" });
});

routeAdmin.get('/comptes', async (c) => {
    const comptes = await db.select({
        id: administrateurs.id,
        nom: administrateurs.nom,
        email: administrateurs.email,
    }).from(administrateurs).orderBy(asc(administrateurs.nom)).all();

    return c.json(comptes);
});

routeAdmin.post('/comptes', validate(adminCreateSchema), async (c) => {
    const { nom, email, mot_de_passe } = getValidated<AdminCreateInput>(c);
    const emailLower = email.toLowerCase();

    try {
        const hashedPassword = await hash(mot_de_passe);
        await db.insert(administrateurs).values({
            nom,
            email: emailLower,
            mot_de_passe: hashedPassword,
        }).run();
    } catch (erreur) {
        if (estErreurEmailUnique(erreur)) {
            return c.json({ error: 'Un compte avec cet email existe déjà' }, 409);
        }

        throw erreur;
    }

    return c.json({ message: 'Compte administrateur créé' }, 201);
});

routeAdmin.patch('/comptes/:id', validate(adminUpdateSchema), async (c) => {
    const id = Number(c.req.param('id'));

    if (!Number.isFinite(id)) {
        return c.json({ error: 'Identifiant invalide' }, 400);
    }

    const compteExistant = await db.select({ id: administrateurs.id })
        .from(administrateurs)
        .where(eq(administrateurs.id, id))
        .limit(1)
        .get();

    if (!compteExistant) {
        return c.json({ error: 'Compte introuvable' }, 404);
    }

    const updateData = getValidated<AdminUpdateInput>(c);
    const dbUpdate: any = {};

    if (updateData.nom !== undefined) dbUpdate.nom = updateData.nom;
    if (updateData.email !== undefined) dbUpdate.email = updateData.email.toLowerCase();
    if (updateData.mot_de_passe !== undefined) dbUpdate.mot_de_passe = await hash(updateData.mot_de_passe);

    try {
        await db.update(administrateurs)
            .set(dbUpdate)
            .where(eq(administrateurs.id, id))
            .run();
    } catch (erreur) {
        if (estErreurEmailUnique(erreur)) {
            return c.json({ error: 'Un compte avec cet email existe déjà' }, 409);
        }

        throw erreur;
    }

    return c.json({ message: 'Compte administrateur mis à jour' });
});

routeAdmin.delete('/comptes/:id', async (c) => {
    const id = Number(c.req.param('id'));

    if (!Number.isFinite(id)) {
        return c.json({ error: 'Identifiant invalide' }, 400);
    }

    const adminIdConnecte = lireAdminId(c);
    if (adminIdConnecte === null) {
        return c.json({ error: 'Jeton administrateur invalide' }, 401);
    }

    if (adminIdConnecte === id) {
        return c.json({ error: 'Vous ne pouvez pas supprimer votre propre compte' }, 400);
    }

    const compteExistant = await db.select({ id: administrateurs.id })
        .from(administrateurs)
        .where(eq(administrateurs.id, id))
        .limit(1)
        .get();

    if (!compteExistant) {
        return c.json({ error: 'Compte introuvable' }, 404);
    }

    const tousLesComptes = await db.select({ id: administrateurs.id }).from(administrateurs).all();
    if (tousLesComptes.length <= 1) {
        return c.json({ error: 'Impossible de supprimer le dernier compte administrateur' }, 400);
    }

    await db.delete(administrateurs).where(eq(administrateurs.id, id)).run();

    return c.json({ message: 'Compte administrateur supprimé' });
});

routeAdmin.get('/actualites', async (c) => {
    const data = await db.select()
        .from(actualites)
        .where(isNull(actualites.deleted_at))
        .orderBy(desc(actualites.id))
        .all();
    return c.json(data);
});

routeAdmin.post('/actualites', async (c) => {
    const { actualite } = await lireActualiteDepuisRequete(c);

    if (!actualite.titre) {
        return c.json({ error: 'Le titre est requis' }, 400);
    }

    await db.insert(actualites).values({
        titre: sanitiserHtml(actualite.titre),
        contenu: sanitiserHtml(actualite.contenu || ''),
        image_url: actualite.image_url,
        date_publication: actualite.date_publication,
        statut: actualite.statut
    }).run();
    return c.json({ message: "Actualité créée" }, 201);
});

routeAdmin.patch('/actualites/:id', async (c) => {
    const id = Number(c.req.param('id'));

    if (!Number.isFinite(id)) {
        return c.json({ error: 'Identifiant invalide' }, 400);
    }

    const actualiteExistant = await db.select({ image_url: actualites.image_url })
        .from(actualites)
        .where(eq(actualites.id, id))
        .limit(1)
        .get();

    if (!actualiteExistant) {
        return c.json({ error: 'Actualité introuvable' }, 404);
    }

    const { actualite, imageRemplacee } = await lireActualiteDepuisRequete(c, actualiteExistant.image_url ?? '');

    if (!actualite.titre) {
        return c.json({ error: 'Le titre est requis' }, 400);
    }

    const actualiteSanitisee = {
        titre: sanitiserHtml(actualite.titre),
        contenu: actualite.contenu ? sanitiserHtml(actualite.contenu) : undefined,
        image_url: actualite.image_url,
        date_publication: actualite.date_publication,
        statut: actualite.statut,
    };

    await db.update(actualites)
        .set(actualiteSanitisee)
        .where(eq(actualites.id, id))
        .run();

    if (imageRemplacee) {
        await supprimerImageActualiteLocale(imageRemplacee);
    }

    return c.json({ message: 'Actualité mise à jour' });
});

routeAdmin.delete('/actualites/:id', async (c) => {
    const id = Number(c.req.param('id'));

    if (!Number.isFinite(id)) {
        return c.json({ error: 'Identifiant invalide' }, 400);
    }

    const actualiteExistant = await db.select({ image_url: actualites.image_url })
        .from(actualites)
        .where(eq(actualites.id, id))
        .limit(1)
        .get();

    if (!actualiteExistant) {
        return c.json({ error: 'Actualité introuvable' }, 404);
    }

    // Soft delete
    await db.update(actualites)
        .set({ deleted_at: Math.floor(Date.now() / 1000) })
        .where(eq(actualites.id, id))
        .run();
    
    await supprimerImageActualiteLocale(actualiteExistant?.image_url ?? '');
    return c.json({ message: "Actualité supprimée" });
});

routeAdmin.get('/evenements', async (c) => {
    const data = await db.select()
        .from(evenements)
        .where(isNull(evenements.deleted_at))
        .orderBy(asc(evenements.date_evenement))
        .all();
    return c.json(data);
});

routeAdmin.post('/evenements', async (c) => {
    const { evenement } = await lireEvenementDepuisRequete(c);
    await db.insert(evenements).values({
        titre: sanitiserHtml(evenement.titre),
        description: sanitiserHtml(evenement.description || ''),
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
            titre: sanitiserHtml(evenement.titre),
            description: evenement.description ? sanitiserHtml(evenement.description) : undefined,
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

routeAdmin.delete('/avis/:id', async (c) => {
    const id = Number(c.req.param('id'));

    if (!Number.isFinite(id)) {
        return c.json({ error: 'Identifiant invalide' }, 400);
    }

    const avisExistant = await db.select({ id: avisClients.id })
        .from(avisClients)
        .where(eq(avisClients.id, id))
        .limit(1)
        .get();

    if (!avisExistant) {
        return c.json({ error: 'Avis introuvable' }, 404);
    }

    await db.delete(avisClients)
        .where(eq(avisClients.id, id))
        .run();
    return c.json({ message: "Avis supprimé" });
});

export default routeAdmin;
