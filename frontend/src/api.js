const BASE_URL = 'http://localhost:3000';
const LOCAL_TOKEN_KEY = 'nylapako_admin_token';
const SESSION_TOKEN_KEY = 'nylapako_admin_session_token';

export const API_BASE_URL = BASE_URL;

export class ApiError extends Error {
	constructor(message, status, data = null) {
		super(message);
		this.name = 'ApiError';
		this.status = status;
		this.data = data;
	}
}

export function getAuthToken() {
	if (typeof window === 'undefined') {
		return null;
	}

	return window.localStorage.getItem(LOCAL_TOKEN_KEY) || window.sessionStorage.getItem(SESSION_TOKEN_KEY);
}

export function setAuthToken(token, remember = false) {
	if (typeof window === 'undefined') {
		return;
	}

	window.localStorage.removeItem(LOCAL_TOKEN_KEY);
	window.sessionStorage.removeItem(SESSION_TOKEN_KEY);

	if (remember) {
		window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
		return;
	}

	window.sessionStorage.setItem(SESSION_TOKEN_KEY, token);
}

export function clearAuthToken() {
	if (typeof window === 'undefined') {
		return;
	}

	window.localStorage.removeItem(LOCAL_TOKEN_KEY);
	window.sessionStorage.removeItem(SESSION_TOKEN_KEY);
}

export function resolveBackendAssetUrl(url) {
	if (!url) {
		return '';
	}

	if (/^(https?:)?\/\//.test(url) || url.startsWith('data:') || url.startsWith('blob:')) {
		return url;
	}

	return `${BASE_URL}${url.startsWith('/') ? url : `/${url}`}`;
}

async function requete(endpoint, methode = 'GET', donnees = null, options = {}) {
	const isFormData = typeof FormData !== 'undefined' && donnees instanceof FormData;
	const headers = {};

	if (options.auth) {
		const token = getAuthToken();
		if (!token) {
			throw new ApiError('Authentification requise', 401);
		}

		headers.Authorization = `Bearer ${token}`;
	}

	if (!isFormData) {
		headers['Content-Type'] = 'application/json';
	}

	const requestOptions = {
		method: methode,
		headers,
	};

	if (isFormData) {
		requestOptions.body = donnees;
	} else if (donnees !== null) {
		requestOptions.body = JSON.stringify(donnees);
	}

	const reponse = await fetch(`${BASE_URL}${endpoint}`, requestOptions);
	const texte = await reponse.text();
	let data = null;

	if (texte) {
		try {
			data = JSON.parse(texte);
		} catch {
			data = texte;
		}
	}

	if (!reponse.ok) {
		const message = data && typeof data === 'object' ? data.error || data.message || `Erreur API: ${reponse.status}` : `Erreur API: ${reponse.status}`;
		throw new ApiError(message, reponse.status, data);
	}

	return data;
}

export const api = {
	auth: {
		login: (data) => requete('/auth/login', 'POST', data),
	},
	actualites: {
		lister: () => requete('/actualites'),
		creer: (data) => requete('/actualites', 'POST', data, { auth: true }),
		supprimer: (id) => requete(`/actualites/${id}`, 'DELETE', null, { auth: true }),
	},
	evenements: {
		lister: () => requete('/evenements'),
		creer: (data) => requete('/evenements', 'POST', data, { auth: true }),
	},
	avis: {
		lister: () => requete('/avis'),
		soumettre: (data) => requete('/avis', 'POST', data),
		moderer: (id, statut) => requete(`/avis/${id}/statut`, 'PATCH', { statut }, { auth: true }),
	},
	admin: {
		getProfil: () => requete('/admin/profil', 'GET', null, { auth: true }),
		updateProfil: (data) => requete('/admin/profil', 'PATCH', data, { auth: true }),
		stats: () => requete('/admin/stats', 'GET', null, { auth: true }),
		actualites: {
			lister: () => requete('/admin/actualites', 'GET', null, { auth: true }),
			creer: (data) => requete('/admin/actualites', 'POST', data, { auth: true }),
			supprimer: (id) => requete(`/admin/actualites/${id}`, 'DELETE', null, { auth: true }),
		},
		evenements: {
			lister: () => requete('/admin/evenements', 'GET', null, { auth: true }),
			creer: (data) => requete('/admin/evenements', 'POST', data, { auth: true }),
			mettreAJour: (id, data) => requete(`/admin/evenements/${id}`, 'PATCH', data, { auth: true }),
			supprimer: (id) => requete(`/admin/evenements/${id}`, 'DELETE', null, { auth: true }),
		},
		avis: {
			lister: () => requete('/admin/avis', 'GET', null, { auth: true }),
			moderer: (id, statut) => requete(`/admin/avis/${id}/statut`, 'PATCH', { statut }, { auth: true }),
		},
	},
};
