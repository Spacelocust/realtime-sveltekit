import { expect, test } from '@playwright/test';

test('Can see the homepage', async ({ page }) => {
  // Can go to the home page
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'The Quiz Game' })).toBeVisible();
});
