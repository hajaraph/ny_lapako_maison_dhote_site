export type SiteSettingsRow = {
	address: string;
	contact_phone: string;
	contact_whatsapp: string;
	contact_email: string;
	opening_hours: string;
	check_in: string;
	copyright_owner: string;
	copyright_url: string;
};

export type SiteSettingsResponse = SiteSettingsRow & {
	address_lines: string[];
};

export const DEFAULT_SITE_SETTINGS: SiteSettingsRow = {
	address: 'Lanirano\nFort-Dauphin\nMadagascar',
	contact_phone: '0340721499',
	contact_whatsapp: '0340721499',
	contact_email: 'contact@nylapako.fr',
	opening_hours: 'Accueil 7j/7',
	check_in: 'Check-in dès 15h',
	copyright_owner: 'Demondra',
	copyright_url: 'https://github.com/hajaraph',
};

function nettoyerTexte(valeur: unknown, fallback = '') {
	if (typeof valeur !== 'string') {
		return fallback;
	}

	const propre = valeur.trim();
	return propre || fallback;
}

export function splitAddressLines(address: string) {
	return nettoyerTexte(address)
		.split(/\r?\n/)
		.map((line) => line.trim())
		.filter(Boolean);
}

export function formatTelHref(phone: string) {
	const propre = nettoyerTexte(phone);
	return propre ? `tel:${propre.replace(/\s+/g, '')}` : 'tel:';
}

export function formatWhatsappHref(phone: string) {
	const propre = nettoyerTexte(phone).replace(/[^\d+]/g, '');

	if (!propre) {
		return 'https://wa.me/';
	}

	if (propre.startsWith('+')) {
		return `https://wa.me/${propre.slice(1)}`;
	}

	if (propre.startsWith('0')) {
		return `https://wa.me/261${propre.slice(1)}`;
	}

	return `https://wa.me/${propre}`;
}

export function normaliserSiteSettingsPayload(body: unknown) {
	if (!body || typeof body !== 'object') {
		return null;
	}

	const candidate = body as Record<string, unknown>;
	const payload: Partial<SiteSettingsRow> = {};
	const champs: Array<keyof SiteSettingsRow> = [
		'address',
		'contact_phone',
		'contact_whatsapp',
		'contact_email',
		'opening_hours',
		'check_in',
		'copyright_owner',
		'copyright_url',
	];

	for (const champ of champs) {
		const valeur = nettoyerTexte(candidate[champ]);
		if (valeur) {
			if (champ === 'contact_email') {
				payload[champ] = valeur.toLowerCase();
			} else {
				payload[champ] = valeur;
			}
		}
	}

	return Object.keys(payload).length > 0 ? payload : null;
}

export function fusionnerSiteSettings(
	base?: Partial<SiteSettingsRow> | null,
	patch?: Partial<SiteSettingsRow> | null,
): SiteSettingsRow {
	return {
		address: nettoyerTexte(patch?.address, nettoyerTexte(base?.address, DEFAULT_SITE_SETTINGS.address)),
		contact_phone: nettoyerTexte(patch?.contact_phone, nettoyerTexte(base?.contact_phone, DEFAULT_SITE_SETTINGS.contact_phone)),
		contact_whatsapp: nettoyerTexte(
			patch?.contact_whatsapp,
			nettoyerTexte(base?.contact_whatsapp, DEFAULT_SITE_SETTINGS.contact_whatsapp),
		),
		contact_email: nettoyerTexte(
			patch?.contact_email,
			nettoyerTexte(base?.contact_email, DEFAULT_SITE_SETTINGS.contact_email),
		).toLowerCase(),
		opening_hours: nettoyerTexte(patch?.opening_hours, nettoyerTexte(base?.opening_hours, DEFAULT_SITE_SETTINGS.opening_hours)),
		check_in: nettoyerTexte(patch?.check_in, nettoyerTexte(base?.check_in, DEFAULT_SITE_SETTINGS.check_in)),
		copyright_owner: nettoyerTexte(
			patch?.copyright_owner,
			nettoyerTexte(base?.copyright_owner, DEFAULT_SITE_SETTINGS.copyright_owner),
		),
		copyright_url: nettoyerTexte(
			patch?.copyright_url,
			nettoyerTexte(base?.copyright_url, DEFAULT_SITE_SETTINGS.copyright_url),
		),
	};
}

export function formaterSiteSettingsResponse(row?: Partial<SiteSettingsRow> | null): SiteSettingsResponse {
	const siteSettings = fusionnerSiteSettings(row, null);

	return {
		...siteSettings,
		address_lines: splitAddressLines(siteSettings.address),
	};
}

export function estEmailValide(email: string) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function estUrlValide(url: string) {
	try {
		const parsed = new URL(url);
		return parsed.protocol === 'http:' || parsed.protocol === 'https:';
	} catch {
		return false;
	}
}
