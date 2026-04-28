import { Hono } from 'hono';
import { sign } from 'hono/jwt';
import { verify } from 'argon2';
import { db } from '../bdd';
import { administrateurs } from '../db/schema';
import { eq, and } from 'drizzle-orm';
import { JWT_ALG, JWT_SECRET } from '../config';

const auth = new Hono();

auth.post('/login', async (c) => {
    const { email, mot_de_passe } = await c.req.json();

    const admin = await db.select()
        .from(administrateurs)
        .where(eq(administrateurs.email, email))
        .limit(1)
        .get();

    if (!admin) {
        return c.json({ error: "Identifiants invalides" }, 401);
    }

    const isValidPassword = await verify(admin.mot_de_passe, mot_de_passe).catch(() => false);
    if (!isValidPassword) {
        return c.json({ error: "Identifiants invalides" }, 401);
    }

    const payload = {
        sub: admin.id,
        email: admin.email,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 // 24 heures
    };

    const token = await sign(payload, JWT_SECRET, JWT_ALG);

    return c.json({ 
        token,
        admin: {
            id: admin.id,
            nom: admin.nom,
            email: admin.email
        }
    });
});

export default auth;
