const DEFAULT_SITE_INFO_RAW = {
	address: 'Lanirano\nFort-Dauphin\nMadagascar',
	contact_phone: '0340721499',
	contact_whatsapp: '0340721499',
	contact_email: 'contact@nylapako.fr',
	opening_hours: 'Accueil 7j/7',
	check_in: 'Check-in dès 15h',
	copyright_owner: 'Demondra',
	copyright_url: 'https://github.com/hajaraph',
};

function cleanText(value, fallback = '') {
	if (typeof value !== 'string') {
		return fallback;
	}

	const trimmed = value.trim();
	return trimmed || fallback;
}

export function splitAddressLines(address) {
	return cleanText(address)
		.split(/\r?\n/)
		.map((line) => line.trim())
		.filter(Boolean);
}

export const DEFAULT_SITE_INFO = {
	...DEFAULT_SITE_INFO_RAW,
	address_lines: splitAddressLines(DEFAULT_SITE_INFO_RAW.address),
};

export function normalizeSiteInfo(data = {}) {
	const address = cleanText(data.address, DEFAULT_SITE_INFO_RAW.address);
	const address_lines = Array.isArray(data.address_lines) && data.address_lines.length > 0
		? data.address_lines.map((line) => cleanText(line)).filter(Boolean)
		: splitAddressLines(address);

	return {
		address,
		contact_phone: cleanText(data.contact_phone, DEFAULT_SITE_INFO_RAW.contact_phone),
		contact_whatsapp: cleanText(data.contact_whatsapp, DEFAULT_SITE_INFO_RAW.contact_whatsapp),
		contact_email: cleanText(data.contact_email, DEFAULT_SITE_INFO_RAW.contact_email).toLowerCase(),
		opening_hours: cleanText(data.opening_hours, DEFAULT_SITE_INFO_RAW.opening_hours),
		check_in: cleanText(data.check_in, DEFAULT_SITE_INFO_RAW.check_in),
		copyright_owner: cleanText(data.copyright_owner, DEFAULT_SITE_INFO_RAW.copyright_owner),
		copyright_url: cleanText(data.copyright_url, DEFAULT_SITE_INFO_RAW.copyright_url),
		address_lines,
	};
}

export function createSiteInfoForm(data = {}) {
	const normalized = normalizeSiteInfo(data);

	return {
		address: normalized.address,
		contact_phone: normalized.contact_phone,
		contact_whatsapp: normalized.contact_whatsapp,
		contact_email: normalized.contact_email,
		opening_hours: normalized.opening_hours,
		check_in: normalized.check_in,
		copyright_owner: normalized.copyright_owner,
		copyright_url: normalized.copyright_url,
	};
}

export function formatTelHref(phone) {
	const value = cleanText(phone);
	return value ? `tel:${value.replace(/\s+/g, '')}` : 'tel:';
}

export function formatWhatsappHref(phone) {
	const value = cleanText(phone).replace(/[^\d+]/g, '');

	if (!value) {
		return 'https://wa.me/';
	}

	if (value.startsWith('+')) {
		return `https://wa.me/${value.slice(1)}`;
	}

	if (value.startsWith('0')) {
		return `https://wa.me/261${value.slice(1)}`;
	}

	return `https://wa.me/${value}`;
}
