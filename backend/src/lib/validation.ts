/**
 * Schémas de validation Zod pour toutes les entités
 */

import { z } from "zod";

// ============================================================================
// SCHÉMAS COMMUNS
// ============================================================================

const idSchema = z.number().int().positive();

const emailSchema = z.string()
    .min(1, "L'email est requis")
    .email("Format d'email invalide")
    .max(255, "L'email ne peut pas dépasser 255 caractères");

const passwordSchema = z.string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .max(255, "Le mot de passe ne peut pas dépasser 255 caractères");

const nomSchema = z.string()
    .min(1, "Le nom est requis")
    .max(100, "Le nom ne peut pas dépasser 100 caractères");

const texteLongSchema = z.string()
    .max(500, "Le texte ne peut pas dépasser 500 caractères")
    .optional();

const urlSchema = z.string()
    .url("Format d'URL invalide")
    .max(500, "L'URL ne peut pas dépasser 500 caractères")
    .optional();

const statutSchema = z.enum(["approuve", "Approuvé", "en_attente", "brouillon", "planifie", "termine", "annule"]);

// ============================================================================
// SCHÉMAS ADMINISTRATEURS
// ============================================================================

export const adminCreateSchema = z.object({
    nom: nomSchema,
    email: emailSchema,
    mot_de_passe: passwordSchema,
});

export const adminUpdateSchema = z.object({
    nom: nomSchema.optional(),
    email: emailSchema.optional(),
    mot_de_passe: passwordSchema.optional(),
}).refine(data => Object.keys(data).length > 0, {
    message: "Au moins un champ doit être fourni pour la mise à jour"
});

// ============================================================================
// SCHÉMAS ACTUALITÉS
// ============================================================================

export const actualiteSchema = z.object({
    titre: z.string()
        .min(1, "Le titre est requis")
        .max(200, "Le titre ne peut pas dépasser 200 caractères"),
    contenu: z.string()
        .max(10000, "Le contenu ne peut pas dépasser 10000 caractères")
        .optional(),
    image_url: urlSchema,
    date_publication: z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date invalide (YYYY-MM-DD)")
        .optional(),
    statut: z.enum(["brouillon", "publie"]).default("brouillon"),
});

export const actualiteUpdateSchema = actualiteSchema.partial().refine(data => Object.keys(data).length > 0, {
    message: "Au moins un champ doit être fourni pour la mise à jour"
});

// ============================================================================
// SCHÉMAS ÉVÉNEMENTS
// ============================================================================

export const evenementSchema = z.object({
    titre: z.string()
        .min(1, "Le titre est requis")
        .max(200, "Le titre ne peut pas dépasser 200 caractères"),
    description: z.string()
        .max(10000, "La description ne peut pas dépasser 10000 caractères")
        .optional(),
    date_evenement: z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date invalide (YYYY-MM-DD)")
        .optional(),
    image_url: urlSchema,
    statut: z.enum(["planifie", "termine", "annule"]).default("planifie"),
});

export const evenementUpdateSchema = evenementSchema.partial().refine(data => Object.keys(data).length > 0, {
    message: "Au moins un champ doit être fourni pour la mise à jour"
});

// ============================================================================
// SCHÉMAS AVIS CLIENTS
// ============================================================================

export const avisClientSchema = z.object({
    nom_client: z.string()
        .min(1, "Le nom du client est requis")
        .max(100, "Le nom ne peut pas dépasser 100 caractères"),
    commentaire: z.string()
        .max(500, "Le commentaire ne peut pas dépasser 500 caractères")
        .optional(),
    note: z.number()
        .int()
        .min(1, "La note minimum est 1")
        .max(5, "La note maximum est 5")
        .default(5),
    date_sejour: z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date invalide (YYYY-MM-DD)"),
});

export const avisModerationSchema = z.object({
    statut: z.enum(["approuve", "Approuvé", "en_attente"]),
});

// ============================================================================
// SCHÉMAS SITE SETTINGS
// ============================================================================

export const siteSettingsSchema = z.object({
    address: z.string().max(500).optional(),
    contact_phone: z.string().max(50).optional(),
    contact_whatsapp: z.string().max(50).optional(),
    contact_email: emailSchema.optional(),
    opening_hours: z.string().max(500).optional(),
    check_in: z.string().max(100).optional(),
    copyright_owner: z.string().max(100).optional(),
    copyright_url: urlSchema,
}).refine(data => Object.keys(data).length > 0, {
    message: "Au moins une information doit être fournie"
});

// ============================================================================
// SCHÉMAS AUTH
// ============================================================================

export const loginSchema = z.object({
    email: emailSchema,
    mot_de_passe: z.string().min(1, "Le mot de passe est requis"),
});

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type AdminCreateInput = z.infer<typeof adminCreateSchema>;
export type AdminUpdateInput = z.infer<typeof adminUpdateSchema>;
export type ActualiteInput = z.infer<typeof actualiteSchema>;
export type EvenementInput = z.infer<typeof evenementSchema>;
export type AvisClientInput = z.infer<typeof avisClientSchema>;
export type AvisModerationInput = z.infer<typeof avisModerationSchema>;
export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
