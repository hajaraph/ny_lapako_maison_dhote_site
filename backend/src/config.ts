const DEFAULT_JWT_SECRET = crypto.randomUUID() + crypto.randomUUID();

export const JWT_SECRET = process.env.JWT_SECRET || DEFAULT_JWT_SECRET;
export const JWT_ALG = "HS256";

if (!process.env.JWT_SECRET) {
    console.warn("⚠ JWT_SECRET non défini. Utilisation d'une valeur aléatoire. Définissez JWT_SECRET en production.");
}
