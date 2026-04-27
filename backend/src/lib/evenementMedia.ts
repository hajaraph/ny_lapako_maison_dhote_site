import path from 'node:path';
import { mkdir, unlink } from 'node:fs/promises';

export const UPLOADS_ROOT = path.resolve(process.cwd(), 'uploads');
export const EVENT_UPLOADS_ROOT = path.join(UPLOADS_ROOT, 'evenements');
export const EVENT_UPLOADS_PUBLIC_PREFIX = '/uploads/evenements';

function extensionDepuisFichier(fichier: File) {
	const extension = path.extname(fichier.name || '').toLowerCase();
	if (extension) {
		return extension;
	}

	switch (fichier.type) {
		case 'image/jpeg':
			return '.jpg';
		case 'image/png':
			return '.png';
		case 'image/webp':
			return '.webp';
		case 'image/gif':
			return '.gif';
		default:
			return '.bin';
	}
}

async function enregistrerFichierEvenement(fichier: File | null) {
	if (!fichier || fichier.size === 0) {
		return null;
	}

	await mkdir(EVENT_UPLOADS_ROOT, { recursive: true });

	const nomFichier = `${crypto.randomUUID()}${extensionDepuisFichier(fichier)}`;
	const cheminFichier = path.join(EVENT_UPLOADS_ROOT, nomFichier);

	await Bun.write(cheminFichier, fichier);

	return `${EVENT_UPLOADS_PUBLIC_PREFIX}/${nomFichier}`;
}

function lireChaine(valeur: FormDataEntryValue | null) {
	return typeof valeur === 'string' ? valeur.trim() : '';
}

function lireFichier(valeur: FormDataEntryValue | null) {
	if (!valeur || typeof valeur === 'string') {
		return null;
	}

	return valeur.size > 0 ? valeur : null;
}

export async function lireEvenementDepuisRequete(c: {
	req: {
		header: (name: string) => string | undefined;
		formData: () => Promise<FormData>;
		json: () => Promise<any>;
	};
}, imageExistante = '') {
	const contentType = c.req.header('content-type') || '';

	if (contentType.includes('multipart/form-data')) {
		const formData = await c.req.formData();
		const fichier = lireFichier(formData.get('image'));
		const imageTelechargee = await enregistrerFichierEvenement(fichier);

		return {
			evenement: {
				titre: lireChaine(formData.get('titre')),
				description: lireChaine(formData.get('description')),
				date_evenement: lireChaine(formData.get('date_evenement')),
				image_url: imageTelechargee || lireChaine(formData.get('image_url')) || imageExistante || '',
				statut: lireChaine(formData.get('statut')) || 'planifie',
			},
			imageRemplacee: imageTelechargee ? imageExistante : null,
		};
	}

	const corps = await c.req.json();

	return {
		evenement: {
			titre: String(corps?.titre ?? '').trim(),
			description: String(corps?.description ?? '').trim(),
			date_evenement: String(corps?.date_evenement ?? '').trim(),
			image_url: String(corps?.image_url ?? imageExistante ?? '').trim(),
			statut: String(corps?.statut ?? 'planifie').trim() || 'planifie',
		},
		imageRemplacee: null,
	};
}

export async function supprimerImageLocale(imageUrl?: string | null) {
	if (!imageUrl || !imageUrl.startsWith(EVENT_UPLOADS_PUBLIC_PREFIX)) {
		return;
	}

	const cheminRelatif = imageUrl.replace(/^\/+/, '');
	const cheminAbsolu = path.resolve(process.cwd(), cheminRelatif);
	const relatifAuRoot = path.relative(UPLOADS_ROOT, cheminAbsolu);

	if (relatifAuRoot.startsWith('..') || path.isAbsolute(relatifAuRoot)) {
		return;
	}

	try {
		await unlink(cheminAbsolu);
	} catch {
		// Le fichier peut déjà avoir été supprimé; on ignore silencieusement.
	}
}
