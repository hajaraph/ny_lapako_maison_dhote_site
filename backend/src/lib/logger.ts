/**
 * Configuration du logger structuré avec Pino
 */

import pino from 'pino';

const isDevelopment = process.env.NODE_ENV !== 'production';

export const logger = pino({
	level: process.env.LOG_LEVEL || 'info',
	transport: isDevelopment
		? {
				target: 'pino-pretty',
				options: {
					colorize: true,
					translateTime: 'HH:MM:ss Z',
					ignore: 'pid,hostname',
				},
		  }
		: undefined,
	timestamp: pino.stdTimeFunctions.isoTime,
	formatters: {
		level(label) {
			return { level: label };
		},
	},
});

/**
 * Logger pour les requêtes HTTP
 */
export const httpLogger = logger.child({ context: 'http' });

/**
 * Logger pour les opérations DB
 */
export const dbLogger = logger.child({ context: 'database' });

/**
 * Logger pour les erreurs
 */
export const errorLogger = logger.child({ context: 'error' });
