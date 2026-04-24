import { Hono } from 'hono';
import { jwt } from 'hono/jwt';
import { db } from '../bdd';
import { administrateurs } from '../db/schema';
import { eq } from 'drizzle-orm';
import { JWT_SECRET } from '../config';

const routeAdmin = new Hono();

// Protection de toutes les routes admin
routeAdmin.use('/*', jwt({ secret: JWT_SECRET }));

// Récupérer le profil admin unique
routeAdmin.get('/profil', async (c) => {
    const payload = c.get('jwtPayload');
    const profil = await db.select({
        id: administrateurs.id,
        nom: administrateurs.nom,
        email: administrateurs.email
    }).from(administrateurs).where(eq(administrateurs.id, payload.sub)).limit(1).get();
    
    return c.json(profil);
});

// Mettre à jour le profil admin
routeAdmin.patch('/profil', async (c) => {
    const corps = await c.req.json();
    const { nom, email, mot_de_passe } = corps;

    const updateData: any = { nom, email };
    if (mot_de_passe && mot_de_passe.trim() !== "") {
        updateData.mot_de_passe = mot_de_passe;
    }

    await db.update(administrateurs)
        .set(updateData)
        .where(eq(administrateurs.id, 1))
        .run();
    
    return c.json({ message: "Profil admin mis à jour avec succès" });
});

export default routeAdmin;
