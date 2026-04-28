import path from 'node:path';
import {
	enregistrerFichierUpload,
	supprimerFichierUpload,
	lireChaineFormData,
	lireFichierFormData,
	type MediaConfig,
} from './mediaUpload';

export const UPLOADS_ROOT = path.resolve(process.cwd(), 'uploads');
export const EVENT_UPLOADS_ROOT = path.join(UPLOADS_ROOT, 'evenements');
export const EVENT_UPLOADS_PUBLIC_PREFIX = '/uploads/evenements';

const eventConfig: MediaConfig = {
	rootDir: EVENT_UPLOADS_ROOT,
	publicPrefix: EVENT_UPLOADS_PUBLIC_PREFIX,
};

interface RequestContext {
	req: {
		header: (name: string) => string | undefined;
		formData: () => Promise<FormData>;
		json: () => Promise<any>;
	};
}

export async function lireEvenementDepuisRequete(c: RequestContext, imageExistante = '') {
	const contentType = c.req.header('content-type') || '';

	if (contentType.includes('multipart/form-data')) {
		const formData = await c.req.formData();
		const fichier = lireFichierFormData(formData.get('image'));
		const uploadResult = await enregistrerFichierUpload(fichier, eventConfig, imageExistante);

		// En cas d'erreur de validation, on lance une erreur avec le message
		if (uploadResult.error) {
			throw new Error(uploadResult.error);
		}

		return {
			evenement: {
				titre: lireChaineFormData(formData.get('titre')),
				description: lireChaineFormData(formData.get('description')),
				date_evenement: lireChaineFormData(formData.get('date_evenement')),
				image_url: uploadResult.url || lireChaineFormData(formData.get('image_url')) || imageExistante || '',
				statut: lireChaineFormData(formData.get('statut')) || 'planifie',
			},
			imageRemplacee: uploadResult.imageRemplacee,
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
	await supprimerFichierUpload(imageUrl, eventConfig);
}
