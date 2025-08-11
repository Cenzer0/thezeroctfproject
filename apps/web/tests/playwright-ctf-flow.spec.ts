import { test, expect } from '@playwright/test';

// Basic smoke flow placeholder to be extended when admin UI exists
test('home and challenges pages render', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/CTF/i);
  await page.goto('/challenges');
  await expect(page.getByRole('heading', { name: /challenges/i })).toBeVisible();
});
