export function formatDisplayDate(value, { fallback = 'Date inconnue' } = {}) {
	if (!value) {
		return fallback;
	}

	let parsedDate;

	if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
		const [year, month, day] = value.split('-').map(Number);
		parsedDate = new Date(year, month - 1, day);
	} else {
		parsedDate = new Date(value);
	}

	if (Number.isNaN(parsedDate.getTime())) {
		return value;
	}

	return parsedDate.toLocaleDateString('fr-FR', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	});
}
