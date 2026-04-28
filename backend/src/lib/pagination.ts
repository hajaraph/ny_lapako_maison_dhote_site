/**
 * Utilitaires de pagination pour les routes API
 */

export interface PaginationParams {
	page: number;
	limit: number;
}

export interface PaginatedResult<T> {
	data: T[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
		hasNextPage: boolean;
		hasPrevPage: boolean;
	};
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

/**
 * Extrait les paramètres de pagination depuis l'URL
 */
export function getPaginationParams(url: string): PaginationParams {
	const { searchParams } = new URL(url);
	
	const page = Math.max(1, parseInt(searchParams.get('page') || String(DEFAULT_PAGE), 10));
	const limit = Math.min(
		MAX_LIMIT,
		Math.max(1, parseInt(searchParams.get('limit') || String(DEFAULT_LIMIT), 10))
	);
	
	return { page, limit };
}

/**
 * Calcule l'offset pour la requête SQL
 */
export function getOffset(page: number, limit: number): number {
	return (page - 1) * limit;
}

/**
 * Crée le résultat paginé
 */
export function createPaginatedResult<T>(
	data: T[],
	total: number,
	params: PaginationParams
): PaginatedResult<T> {
	const totalPages = Math.ceil(total / params.limit);
	
	return {
		data,
		pagination: {
			page: params.page,
			limit: params.limit,
			total,
			totalPages,
			hasNextPage: params.page < totalPages,
			hasPrevPage: params.page > 1,
		},
	};
}
