import { test, expect } from '@playwright/test';

test.describe('Shopping List', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('should add a new item', async ({ page }) => {
    // Add a new item
    await page.getByPlaceholder('Add an item...').fill('Test Item');
    await page.locator('button[name="add-item"]').click();

    // Verify the item was added
    const item = page.locator('li', { hasText: 'Test Item' }).first();
    await expect(item).toBeVisible();
    await expect(item.locator('span').first()).toHaveText('1');
  });
});
