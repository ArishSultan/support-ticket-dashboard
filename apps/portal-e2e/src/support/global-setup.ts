import { provisionTestDatabase } from './db-admin';

export default async function globalSetup(): Promise<void> {
  await provisionTestDatabase();
}
