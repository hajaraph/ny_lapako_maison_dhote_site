import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const administrateurs = sqliteTable("administrateurs", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    nom: text("nom").notNull(),
    email: text("email").unique().notNull(),
    mot_de_passe: text("mot_de_passe").notNull(),
});

export const actualites = sqliteTable("actualites", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    titre: text("titre").notNull(),
    contenu: text("contenu"),
    image_url: text("image_url"),
    date_publication: text("date_publication"),
    statut: text("statut").default("brouillon"),
});

export const evenements = sqliteTable("evenements", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    titre: text("titre").notNull(),
    description: text("description"),
    date_evenement: text("date_evenement"),
    image_url: text("image_url"),
    statut: text("statut").default("actif"),
});

export const avisClients = sqliteTable("avis_clients", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    nom_client: text("nom_client").notNull(),
    commentaire: text("commentaire"),
    note: integer("note").default(5),
    date_sejour: text("date_sejour"),
    statut: text("statut").default("en_attente"),
});

export const siteSettings = sqliteTable("site_settings", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    address: text("address").notNull(),
    contact_phone: text("contact_phone").notNull(),
    contact_whatsapp: text("contact_whatsapp").notNull(),
    contact_email: text("contact_email").notNull(),
    opening_hours: text("opening_hours").notNull(),
    check_in: text("check_in").notNull(),
    copyright_owner: text("copyright_owner").notNull(),
    copyright_url: text("copyright_url").notNull(),
});
