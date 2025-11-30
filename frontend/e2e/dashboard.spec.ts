import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display dashboard title', async ({ page }) => {
    await expect(page.getByText('MirrorLink Dashboard')).toBeVisible();
  });

  test('should show compare panel', async ({ page }) => {
    await expect(page.getByText('Origin (Arbitrum Sepolia)')).toBeVisible();
    await expect(page.getByText('Destination (Base Sepolia)')).toBeVisible();
  });

  test('should display network status', async ({ page }) => {
    await expect(page.getByText('Network Status')).toBeVisible();
  });

  test('should navigate to contracts page', async ({ page }) => {
    await page.click('text=Contracts');
    await expect(page).toHaveURL('/contracts');
    await expect(page.getByText('Contract Information')).toBeVisible();
  });
});

