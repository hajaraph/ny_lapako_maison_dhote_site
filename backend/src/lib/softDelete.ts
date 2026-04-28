/**
 * Utilitaires pour Soft Delete
 */

import { isNull, eq, and } from 'drizzle-orm';
import type { SQLiteTable } from 'drizzle-orm/sqlite-core';

/**
 * Filtre pour exclure les enregistrements supprimés (deleted_at IS NULL)
 */
export function notDeleted(table: any) {
	return isNull(table.deleted_at);
}

/**
 * Filtre pour inclure uniquement les enregistrements supprimés (deleted_at IS NOT NULL)
 */
export function onlyDeleted(table: any) {
	return table.deleted_at;
}

/**
 * Marque un enregistrement comme supprimé (soft delete)
 */
export function softDelete(table: any, id: number) {
	return eq(table.id, id);
}

/**
 * Récupère un enregistrement s'il n'est pas supprimé
 */
export function findNotDeleted(table: any, id: number) {
	return and(eq(table.id, id), isNull(table.deleted_at));
}
