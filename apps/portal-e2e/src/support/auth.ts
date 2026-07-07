import { expect, type APIRequestContext, type Page } from '@playwright/test';

import { API_URL } from './e2e.config';

export { API_URL };

export const TEST_PASSWORD = 'Password123';

export interface TestUser {
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export function makeUser(prefix = 'user'): TestUser {
  const unique = `${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
  return {
    firstName: 'Test',
    lastName: 'User',
    name: 'Test User',
    email: `${prefix}-${unique}@example.com`,
    password: TEST_PASSWORD,
  };
}

export async function apiSignUp(
  request: APIRequestContext,
  user: TestUser,
): Promise<void> {
  const maxAttempts = 5;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const res = await request.post(`${API_URL}/api/auth/sign-up/email`, {
      data: { name: user.name, email: user.email, password: user.password },
    });
    if (res.ok()) return;

    if (res.status() === 429 && attempt < maxAttempts) {
      await new Promise((r) => setTimeout(r, 500 * attempt));
      continue;
    }
    expect(
      res.ok(),
      `sign-up failed: ${res.status()} ${await res.text()}`,
    ).toBe(true);
  }
}

/** Register a fresh user through the UI; auto sign-in lands on the dashboard. */
export async function uiSignUp(page: Page, user: TestUser): Promise<void> {
  await page.goto('/sign-up');
  await page.locator('#firstName').fill(user.firstName);
  await page.locator('#lastName').fill(user.lastName);
  await page.locator('#email').fill(user.email);
  await page.locator('#password').fill(user.password);
  await page.locator('#confirmPassword').fill(user.password);
  await page.getByRole('button', { name: /create account/i }).click();
  // Client-side redirect (router.push) — poll the URL rather than wait for a
  // load event that a SPA navigation never fires.
  await expect(page).toHaveURL('/');
}

/** Sign in an existing user through the UI and wait for the dashboard. */
export async function uiSignIn(
  page: Page,
  email: string,
  password: string,
): Promise<void> {
  await page.goto('/sign-in');
  await page.locator('#email').fill(email);
  await page.locator('#password').fill(password);
  await page.getByRole('button', { name: /^sign in$/i }).click();
  // Client-side redirect (router.push) — poll the URL rather than wait for a
  // load event that a SPA navigation never fires.
  await expect(page).toHaveURL('/');
}

/**
 * Create a ticket through the "New Ticket" dialog and wait for it to appear in
 * the list. Priority defaults to Medium, so only the text fields are filled.
 * Returns the title used, for later assertions.
 */
export async function createTicket(page: Page, title: string): Promise<string> {
  await page.getByRole('button', { name: /new ticket/i }).click();

  const dialog = page.getByRole('dialog');
  await dialog.locator('#title').fill(title);
  await dialog.locator('#customerName').fill('Jane Doe');
  await dialog.locator('#customerEmail').fill('jane@example.com');
  await dialog.locator('#description').fill('Ticket created by an e2e test.');
  await dialog.getByRole('button', { name: /create ticket/i }).click();

  // Dialog closes on success and the row shows up in the table.
  await expect(dialog).toBeHidden();
  await expect(page.getByText(title, { exact: true })).toBeVisible();
  return title;
}
