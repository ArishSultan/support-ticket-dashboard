import { test, expect } from '@playwright/test';

test('redirects unauthenticated users to sign-in', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveURL(/\/sign-in\?callbackUrl=/);
  await expect(page.getByRole('button', { name: /^sign in$/i })).toBeVisible();
});
