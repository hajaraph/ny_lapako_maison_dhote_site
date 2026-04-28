CREATE TABLE `actualites` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`titre` text NOT NULL,
	`contenu` text,
	`image_url` text,
	`date_publication` text,
	`statut` text DEFAULT 'brouillon'
);
--> statement-breakpoint
CREATE TABLE `administrateurs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nom` text NOT NULL,
	`email` text NOT NULL,
	`mot_de_passe` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `administrateurs_email_unique` ON `administrateurs` (`email`);--> statement-breakpoint
CREATE TABLE `avis_clients` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nom_client` text NOT NULL,
	`commentaire` text,
	`note` integer DEFAULT 5,
	`date_sejour` text,
	`statut` text DEFAULT 'en_attente'
);
--> statement-breakpoint
CREATE TABLE `evenements` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`titre` text NOT NULL,
	`description` text,
	`date_evenement` text,
	`image_url` text,
	`statut` text DEFAULT 'actif'
);
--> statement-breakpoint
CREATE TABLE `site_settings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`address` text NOT NULL,
	`contact_phone` text NOT NULL,
	`contact_whatsapp` text NOT NULL,
	`contact_email` text NOT NULL,
	`opening_hours` text NOT NULL,
	`check_in` text NOT NULL,
	`copyright_owner` text NOT NULL,
	`copyright_url` text NOT NULL
);
