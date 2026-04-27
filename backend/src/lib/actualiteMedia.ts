import path from 'node:path';
import { mkdir, unlink } from 'node:fs/promises';
import { UPLOADS_ROOT } from './evenementMedia';

export const ACTUALITE_UPLOADS_ROOT = path.join(UPLOADS_ROOT, 'actualites');
export const ACTUALITE_UPLOADS_PUBLIC_PREFIX = '/uploads/actualites';

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

async function enregistrerFichierActualite(fichier: File | null) {
	if (!fichier || fichier.size === 0) {
		return null;
	}

	await mkdir(ACTUALITE_UPLOADS_ROOT, { recursive: true });

	const nomFichier = `${crypto.randomUUID()}${extensionDepuisFichier(fichier)}`;
	const cheminFichier = path.join(ACTUALITE_UPLOADS_ROOT, nomFichier);

	await Bun.write(cheminFichier, fichier);

	return `${ACTUALITE_UPLOADS_PUBLIC_PREFIX}/${nomFichier}`;
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

export async function lireActualiteDepuisRequete(c: {
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
		const imageTelechargee = await enregistrerFichierActualite(fichier);

		return {
			actualite: {
				titre: lireChaine(formData.get('titre')),
				contenu: lireChaine(formData.get('contenu')),
				date_publication: lireChaine(formData.get('date_publication')),
				image_url: imageTelechargee || imageExistante || '',
				statut: lireChaine(formData.get('statut')) || 'brouillon',
			},
			imageRemplacee: imageTelechargee ? imageExistante : null,
		};
	}

	const corps = await c.req.json();

	return {
		actualite: {
			titre: String(corps?.titre ?? '').trim(),
			contenu: String(corps?.contenu ?? '').trim(),
			date_publication: String(corps?.date_publication ?? '').trim(),
			image_url: String(corps?.image_url ?? imageExistante ?? '').trim(),
			statut: String(corps?.statut ?? 'brouillon').trim() || 'brouillon',
		},
		imageRemplacee: null,
	};
}

export async function supprimerImageActualiteLocale(imageUrl?: string | null) {
	if (!imageUrl || !imageUrl.startsWith(ACTUALITE_UPLOADS_PUBLIC_PREFIX)) {
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
