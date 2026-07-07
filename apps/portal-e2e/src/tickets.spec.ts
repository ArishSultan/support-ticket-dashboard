import { test, expect } from '@playwright/test';

import {
  makeUser,
  apiSignUp,
  uiSignUp,
  uiSignIn,
  createTicket,
} from './support/auth';
import { promoteToAdmin } from './support/db';

test('an agent can sign up and create a ticket', async ({ page }) => {
  const user = makeUser('agent');
  await uiSignUp(page, user);

  const title = `E2E agent ticket ${Date.now()}`;
  await createTicket(page, title);
});

test('an admin can delete a ticket', async ({ page, request }) => {
  const admin = makeUser('admin');
  await apiSignUp(request, admin);
  await promoteToAdmin(admin.email);
  await uiSignIn(page, admin.email, admin.password);

  const title = `E2E admin ticket ${Date.now()}`;
  await createTicket(page, title);

  const row = page.getByRole('row', { name: new RegExp(title) });
  await row.getByRole('button', { name: /details/i }).click();
  await expect(page).toHaveURL(/\/tickets\/[0-9a-f-]+/);

  await page.getByRole('button', { name: /delete ticket/i }).click();
  const confirm = page.getByRole('alertdialog');
  await confirm.getByRole('button', { name: 'Delete', exact: true }).click();

  await expect(page).toHaveURL('/');
  await expect(page.getByText(title, { exact: true })).toHaveCount(0);
});
