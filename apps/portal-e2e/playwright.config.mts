import { resolve } from 'node:path';
import { configDotenv } from 'dotenv';
import { defineConfig, devices } from '@playwright/test';
import { nxE2EPreset } from '@nx/playwright/preset';
import { workspaceRoot } from '@nx/devkit';

configDotenv({ path: resolve(workspaceRoot, 'apps', 'portal-e2e', '.env') });

const PORTAL_PORT = process.env.E2E_PORTAL_PORT || '3100';
const API_PORT = process.env.E2E_API_PORT || '4100';
const API_URL = `http://localhost:${API_PORT}`;
const PORTAL_URL = process.env.BASE_URL || `http://localhost:${PORTAL_PORT}`;

const E2E_DATABASE_URL = process.env.E2E_DATABASE_URL ?? '';

export default defineConfig({
  ...nxE2EPreset(import.meta.dirname, { testDir: './src' }),
  globalSetup: './src/support/global-setup.ts',
  globalTeardown: './src/support/global-teardown.ts',
  retries: process.env.CI ? 2 : 1,
  timeout: 60_000,
  expect: { timeout: 15_000 },
  use: {
    baseURL: PORTAL_URL,
    trace: 'on-first-retry',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },
  webServer: !E2E_DATABASE_URL
    ? []
    : [
        {
          command:
            'pnpm exec nx build @org/api && exec node dist/apps/api/main.js',
          url: `${API_URL}/api/docs-json`,
          reuseExistingServer: !process.env.CI,
          cwd: workspaceRoot,
          timeout: 180_000,
          // Keep the API entirely out of the test output.
          stdout: 'ignore',
          stderr: 'ignore',
          env: {
            APP_MODE: 'DEV',
            API_URL,
            APP_URL: PORTAL_URL,
            API_HOST: '0.0.0.0',
            API_PORT,
            DB_URL: E2E_DATABASE_URL,
            BETTER_AUTH_SECRET:
              process.env.E2E_BETTER_AUTH_SECRET ||
              'e2e-only-better-auth-secret-not-a-real-key',
            AUTH_RATE_LIMIT_ENABLED: 'false',
          },
        },
        {
          command: `pnpm exec nx run @org/portal:dev --port=${PORTAL_PORT}`,
          url: PORTAL_URL,
          reuseExistingServer: !process.env.CI,
          cwd: workspaceRoot,
          timeout: 120_000,
          env: {
            NEXT_PUBLIC_API_URL: API_URL,
            NX_DAEMON: 'false',
          },
        },
      ],
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  ],
});
