import { API_PORT, PORTAL_PORT, freePorts } from './e2e.config';
import { teardownTestDatabase } from './db-admin';

export default async function globalTeardown(): Promise<void> {
  await teardownTestDatabase();
  freePorts([API_PORT, PORTAL_PORT]);
}
