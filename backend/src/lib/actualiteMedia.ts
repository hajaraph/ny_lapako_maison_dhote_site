import path from 'node:path';
import {
	enregistrerFichierUpload,
	supprimerFichierUpload,
	lireChaineFormData,
	lireFichierFormData,
	type MediaConfig,
} from './mediaUpload';

// Définir UPLOADS_ROOT localement pour éviter dépendance circulaire
export const UPLOADS_ROOT = path.resolve(process.cwd(), 'uploads');
export const ACTUALITE_UPLOADS_ROOT = path.join(UPLOADS_ROOT, 'actualites');
export const ACTUALITE_UPLOADS_PUBLIC_PREFIX = '/uploads/actualites';

const actualiteConfig: MediaConfig = {
	rootDir: ACTUALITE_UPLOADS_ROOT,
	publicPrefix: ACTUALITE_UPLOADS_PUBLIC_PREFIX,
};

interface RequestContext {
	req: {
		header: (name: string) => string | undefined;
		formData: () => Promise<FormData>;
		json: () => Promise<any>;
	};
}

export async function lireActualiteDepuisRequete(c: RequestContext, imageExistante = '') {
	const contentType = c.req.header('content-type') || '';

	if (contentType.includes('multipart/form-data')) {
		const formData = await c.req.formData();
		const fichier = lireFichierFormData(formData.get('image'));
		const uploadResult = await enregistrerFichierUpload(fichier, actualiteConfig, imageExistante);

		// En cas d'erreur de validation, on lance une erreur avec le message
		if (uploadResult.error) {
			throw new Error(uploadResult.error);
		}

		return {
			actualite: {
				titre: lireChaineFormData(formData.get('titre')),
				contenu: lireChaineFormData(formData.get('contenu')),
				date_publication: lireChaineFormData(formData.get('date_publication')),
				image_url: uploadResult.url || imageExistante || '',
				statut: lireChaineFormData(formData.get('statut')) || 'brouillon',
			},
			imageRemplacee: uploadResult.imageRemplacee,
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
	await supprimerFichierUpload(imageUrl, actualiteConfig);
}
