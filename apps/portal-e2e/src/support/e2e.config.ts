import { resolve } from 'node:path';
import { execSync } from 'node:child_process';

export const ROOT = resolve(__dirname, '../../../..');

export const API_PORT = Number(process.env.E2E_API_PORT ?? 4100);
export const PORTAL_PORT = Number(process.env.E2E_PORTAL_PORT ?? 3100);
export const API_URL = `http://localhost:${API_PORT}`;
export const PORTAL_URL = `http://localhost:${PORTAL_PORT}`;

export const E2E_BETTER_AUTH_SECRET =
  process.env.E2E_BETTER_AUTH_SECRET ??
  'e2e-only-better-auth-secret-not-a-real-key';

export function getTestDbUrl(): string {
  const url = process.env.E2E_DATABASE_URL;
  if (!url) {
    throw new Error(
      'E2E_DATABASE_URL is required. Provide a dedicated, disposable Postgres ' +
        'database for the e2e suite, e.g.\n' +
        '  E2E_DATABASE_URL="postgres://user:pass@host:5432/your_test_db" pnpm exec nx e2e @org/portal-e2e',
    );
  }
  return url;
}

export function freePorts(ports: number[]): void {
  for (const port of ports) {
    try {
      const out = execSync(`lsof -ti tcp:${port} -sTCP:LISTEN`, {
        stdio: ['ignore', 'pipe', 'ignore'],
      })
        .toString()
        .trim();
      for (const pid of out.split('\n').filter(Boolean)) {
        try {
          process.kill(Number(pid), 'SIGKILL');
        } catch {
          // already gone
        }
      }
    } catch {
      // nothing listening on this port
    }
  }
}
