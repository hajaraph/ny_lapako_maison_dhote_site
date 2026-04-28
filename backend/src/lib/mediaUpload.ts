/**
 * Utilitaires communs pour l'upload de médias (images événements et actualités)
 * Factorise la logique commune pour réduire la duplication
 */

import path from 'node:path';
import { mkdir, unlink } from 'node:fs/promises';
import { validerImage, extensionDepuisType, type FileValidationResult } from './fileValidation';

export interface UploadResult {
	url: string | null;
	imageRemplacee: string | null;
	error?: string;
}

export interface MediaConfig {
	rootDir: string;
	publicPrefix: string;
}

/**
 * Enregistre un fichier uploadé après validation
 */
export async function enregistrerFichierUpload(
	fichier: File | null,
	config: MediaConfig,
	imageExistante: string = ''
): Promise<UploadResult> {
	if (!fichier || fichier.size === 0) {
		return { url: null, imageRemplacee: null };
	}

	// Validation du fichier
	const validation = await validerImage(fichier);
	if (!validation.valid) {
		return { url: null, imageRemplacee: null, error: validation.error };
	}

	await mkdir(config.rootDir, { recursive: true });

	const extension = validation.detectedType
		? extensionDepuisType(validation.detectedType)
		: extensionDepuisType(fichier.type);

	const nomFichier = `${crypto.randomUUID()}${extension}`;
	const cheminFichier = path.join(config.rootDir, nomFichier);

	await Bun.write(cheminFichier, fichier);

	return {
		url: `${config.publicPrefix}/${nomFichier}`,
		imageRemplacee: imageExistante || null,
	};
}

/**
 * Supprime un fichier uploadé localement avec vérification de sécurité
 */
export async function supprimerFichierUpload(
	imageUrl: string | null | undefined,
	config: MediaConfig
): Promise<void> {
	if (!imageUrl || !imageUrl.startsWith(config.publicPrefix)) {
		return;
	}

	const cheminRelatif = imageUrl.replace(/^\/+/, '');
	const cheminAbsolu = path.resolve(process.cwd(), cheminRelatif);

	// Sécurité: vérifier que le fichier est bien dans le répertoire autorisé
	const uploadsRoot = path.resolve(process.cwd(), 'uploads');
	const relatifAuRoot = path.relative(uploadsRoot, cheminAbsolu);

	if (relatifAuRoot.startsWith('..') || path.isAbsolute(relatifAuRoot)) {
		console.warn('Tentative de suppression hors répertoire:', imageUrl);
		return;
	}

	try {
		await unlink(cheminAbsolu);
	} catch {
		// Le fichier peut déjà avoir été supprimé; on ignore silencieusement.
	}
}

type FormDataValue = string | File | null;

/**
 * Extrait une valeur texte d'un FormData
 */
export function lireChaineFormData(valeur: FormDataValue): string {
	return typeof valeur === 'string' ? valeur.trim() : '';
}

/**
 * Extrait un fichier d'un FormData
 */
export function lireFichierFormData(valeur: FormDataValue): File | null {
	if (!valeur || typeof valeur === 'string') {
		return null;
	}
	return valeur.size > 0 ? valeur : null;
}
