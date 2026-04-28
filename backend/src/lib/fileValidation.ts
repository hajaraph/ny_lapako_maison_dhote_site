/**
 * Validation de fichiers par magic numbers (bytes signatures)
 * Détecte le vrai type du fichier indépendamment de l'extension
 */

const ALLOWED_IMAGE_TYPES = new Set([
	'image/jpeg',
	'image/png',
	'image/webp',
	'image/gif',
]);

const MAGIC_NUMBERS: Record<string, number[]> = {
	'image/jpeg': [0xff, 0xd8, 0xff],
	'image/png': [0x89, 0x50, 0x4e, 0x47],
	'image/webp': [0x52, 0x49, 0x46, 0x46], // RIFF header, puis WEBP à offset 8
	'image/gif': [0x47, 0x49, 0x46], // GIF87a ou GIF89a
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export interface FileValidationResult {
	valid: boolean;
	error?: string;
	detectedType?: string;
}

async function lireMagicBytes(fichier: File, nombreBytes: number): Promise<Uint8Array> {
	// Lire le début du fichier pour vérifier les magic numbers
	const stream = fichier.stream();
	const reader = stream.getReader();
	const result = await reader.read();
	await reader.cancel();

	if (!result.value || result.value.length === 0) {
		return new Uint8Array(0);
	}

	return result.value.slice(0, nombreBytes);
}

function verifierMagicBytes(bytes: Uint8Array, signature: number[]): boolean {
	if (bytes.length < signature.length) return false;
	return signature.every((byte, index) => bytes[index] === byte);
}

function detecterTypeFichier(bytes: Uint8Array): string | null {
	// WebP spécial: RIFF header + WEBP à offset 8
	const webpSignature = MAGIC_NUMBERS['image/webp'];
	if (bytes.length >= 12 && webpSignature &&
		verifierMagicBytes(bytes, webpSignature) &&
		bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50) {
		return 'image/webp';
	}

	for (const [type, signature] of Object.entries(MAGIC_NUMBERS)) {
		if (type !== 'image/webp' && signature && verifierMagicBytes(bytes, signature)) {
			return type;
		}
	}

	return null;
}

/**
 * Valide un fichier image uploadé
 * Vérifie: taille, type MIME déclaré, magic numbers
 */
export async function validerImage(
	fichier: File | null,
	options: { maxSize?: number } = {}
): Promise<FileValidationResult> {
	if (!fichier) {
		return { valid: true };
	}

	const maxSize = options.maxSize ?? MAX_FILE_SIZE;

	// Vérification taille
	if (fichier.size === 0) {
		return { valid: false, error: 'Le fichier est vide' };
	}

	if (fichier.size > maxSize) {
		return { valid: false, error: `Fichier trop volumineux (max ${maxSize / 1024 / 1024}MB)` };
	}

	// Vérification type MIME déclaré
	if (!ALLOWED_IMAGE_TYPES.has(fichier.type)) {
		return {
			valid: false,
			error: `Type de fichier non autorisé: ${fichier.type}. Types acceptés: JPEG, PNG, WebP, GIF`
		};
	}

	// Vérification magic numbers (vrai type du fichier)
	const bytes = await lireMagicBytes(fichier, 12);
	const detectedType = detecterTypeFichier(bytes);

	if (!detectedType) {
		return { valid: false, error: 'Format de fichier non reconnu ou corrompu' };
	}

	if (detectedType !== fichier.type) {
		return {
			valid: false,
			error: `Le fichier ne correspond pas à son type déclaré. Détecté: ${detectedType}, déclaré: ${fichier.type}`,
			detectedType
		};
	}

	return { valid: true, detectedType };
}

/**
 * Génère une extension sûre à partir du type MIME vérifié
 */
export function extensionDepuisType(type: string): string {
	switch (type) {
		case 'image/jpeg': return '.jpg';
		case 'image/png': return '.png';
		case 'image/webp': return '.webp';
		case 'image/gif': return '.gif';
		default: return '.bin';
	}
}
