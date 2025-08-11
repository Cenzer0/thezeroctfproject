import { test, expect } from '@playwright/test';

test('admin create challenge -> player submit -> leaderboard', async ({ page }) => {
  // Placeholder demo: navigate public pages
  await page.goto('/');
  await expect(page).toHaveTitle(/CTF/i);

  await page.goto('/challenges');
  await expect(page.getByRole('heading', { name: /challenges/i })).toBeVisible();

  // In a real app, would log in as admin, create challenge, publish, then as player submit and verify leaderboard.
});
