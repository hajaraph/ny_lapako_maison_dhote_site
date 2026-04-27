import { jwt } from 'hono/jwt';
import { JWT_ALG, JWT_SECRET } from '../config';

export const adminAuth = jwt({ secret: JWT_SECRET, alg: JWT_ALG });
