/**
 * Middleware de validation Zod pour Hono
 */

import type { Context, Next } from "hono";
import type { ZodSchema } from "zod";

export function validate(schema: ZodSchema) {
    return async (c: Context, next: Next) => {
        try {
            const body = await c.req.json();
            const validated = await schema.parseAsync(body);
            
            // Stocker les données validées pour les routes
            c.set('validated', validated);
            
            await next();
        } catch (error: any) {
            // Format ZodError en réponse JSON
            if (error.errors) {
                const messages = error.errors.map((e: any) => ({
                    field: e.path.join('.'),
                    message: e.message
                }));
                return c.json({ error: "Validation échouée", details: messages }, 400);
            }
            
            return c.json({ error: "Corps JSON invalide" }, 400);
        }
    };
}

export function getValidated<T>(c: Context): T {
    return c.get('validated') as T;
}
