import { Hono } from 'hono';
import { db } from '../bdd';
import { actualites, administrateurs, avisClients, evenements, siteSettings } from '../db/schema';
import { asc, desc, eq } from 'drizzle-orm';
import { adminAuth } from '../middleware/adminAuth';
import { lireActualiteDepuisRequete, supprimerImageActualiteLocale } from '../lib/actualiteMedia';
import { lireEvenementDepuisRequete, supprimerImageLocale } from '../lib/evenementMedia';
import {
	estEmailValide,
	estUrlValide,
	formaterSiteSettingsResponse,
	fusionnerSiteSettings,
	normaliserSiteSettingsPayload,
} from '../lib/siteSettings';

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

routeAdmin.patch('/site-info', async (c) => {
    const corps = await c.req.json();
    const payload = normaliserSiteSettingsPayload(corps);

    if (!payload) {
        return c.json({ error: 'Au moins une information valide est requise' }, 400);
    }

    const siteInfoActuel = await db.select().from(siteSettings).limit(1).get();
    const siteInfoFusionne = fusionnerSiteSettings(siteInfoActuel ?? null, payload);

    if (!siteInfoFusionne.address || !siteInfoFusionne.contact_phone || !siteInfoFusionne.contact_whatsapp || !siteInfoFusionne.contact_email) {
        return c.json({ error: 'Adresse, téléphone, WhatsApp et email sont requis' }, 400);
    }

    if (!estEmailValide(siteInfoFusionne.contact_email)) {
        return c.json({ error: 'Adresse email de contact invalide' }, 400);
    }

    if (!estUrlValide(siteInfoFusionne.copyright_url)) {
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
        updateData.mot_de_passe = mot_de_passe;
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

routeAdmin.post('/comptes', async (c) => {
    const corps = await c.req.json();
    const nom = normaliserTexte(corps?.nom);
    const email = normaliserTexte(corps?.email).toLowerCase();
    const motDePasse = normaliserTexte(corps?.mot_de_passe);

    if (!nom || !email || !motDePasse) {
        return c.json({ error: 'Nom, email et mot de passe sont requis' }, 400);
    }

    if (!emailValide(email)) {
        return c.json({ error: 'Adresse email invalide' }, 400);
    }

    if (motDePasse.length < 8) {
        return c.json({ error: 'Le mot de passe doit contenir au moins 8 caractères' }, 400);
    }

    try {
        await db.insert(administrateurs).values({
            nom,
            email,
            mot_de_passe: motDePasse,
        }).run();
    } catch (erreur) {
        if (estErreurEmailUnique(erreur)) {
            return c.json({ error: 'Un compte avec cet email existe déjà' }, 409);
        }

        throw erreur;
    }

    return c.json({ message: 'Compte administrateur créé' }, 201);
});

routeAdmin.patch('/comptes/:id', async (c) => {
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

    const corps = await c.req.json();
    const updateData: { nom?: string; email?: string; mot_de_passe?: string } = {};

    if (corps?.nom !== undefined) {
        const nom = normaliserTexte(corps.nom);
        if (!nom) {
            return c.json({ error: 'Le nom ne peut pas être vide' }, 400);
        }
        updateData.nom = nom;
    }

    if (corps?.email !== undefined) {
        const email = normaliserTexte(corps.email).toLowerCase();
        if (!email || !emailValide(email)) {
            return c.json({ error: 'Adresse email invalide' }, 400);
        }
        updateData.email = email;
    }

    if (corps?.mot_de_passe !== undefined) {
        const motDePasse = normaliserTexte(corps.mot_de_passe);
        if (!motDePasse) {
            return c.json({ error: 'Le mot de passe ne peut pas être vide' }, 400);
        }

        if (motDePasse.length < 8) {
            return c.json({ error: 'Le mot de passe doit contenir au moins 8 caractères' }, 400);
        }

        updateData.mot_de_passe = motDePasse;
    }

    if (Object.keys(updateData).length === 0) {
        return c.json({ error: 'Aucune donnée à mettre à jour' }, 400);
    }

    try {
        await db.update(administrateurs)
            .set(updateData)
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
    const data = await db.select().from(actualites).orderBy(desc(actualites.id)).all();
    return c.json(data);
});

routeAdmin.post('/actualites', async (c) => {
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

    await db.update(actualites)
        .set(actualite)
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

    await db.delete(actualites).where(eq(actualites.id, id)).run();
    await supprimerImageActualiteLocale(actualiteExistant?.image_url ?? '');
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
