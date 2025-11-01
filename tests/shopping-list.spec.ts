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

  test('should increase item quantity', async ({ page }) => {
    // Add a test item
    await page.getByPlaceholder('Add an item...').fill('Test Item');
    await page.locator('button[name="add-item"]').click();

    // Increase quantity
    const item = page.locator('li', { hasText: 'Test Item' }).first();
    const incrementButton = item.locator('button[aria-label^="Increase quantity"]');
    await incrementButton.click();

    // Verify quantity increased
    await expect(item.locator('span').first()).toHaveText('2');
  });

  test('should decrease item quantity', async ({ page }) => {
    // Add a test item and increase quantity first
    await page.getByPlaceholder('Add an item...').fill('Test Item');
    await page.locator('button[name="add-item"]').click();

    const item = page.locator('li', { hasText: 'Test Item' }).first();
    await item.locator('button[aria-label^="Increase quantity"]').click(); // Increase to 2

    // Decrease quantity
    await item.locator('button[aria-label^="Decrease quantity"]').click();

    // Verify quantity decreased
    await expect(item.locator('span').first()).toHaveText('1');
  });

  test('should delete an item', async ({ page }) => {
    // Add a test item
    await page.getByPlaceholder('Add an item...').fill('Test Item');
    await page.locator('button[name="add-item"]').click();

    // Delete the item
    const item = page.locator('li', { hasText: 'Test Item' }).first();
    await item.hover();
    const deleteButton = item.locator('button[aria-label^="Delete"]');
    await deleteButton.click();

    // Verify item was deleted
    await expect(item).not.toBeVisible();
  });

  test('should add a category', async ({ page }) => {
    // Add a new category
    await page.getByPlaceholder('Enter category name').fill('Test Category');
    await page.locator('button:has-text("Add Category")').click();

    // Verify category was added
    await expect(page.getByText('Test Category')).toBeVisible();
  });

  test('should add a value to a category', async ({ page }) => {
    // Add a category first
    await page.getByPlaceholder('Enter category name').fill('Test Category');
    await page.locator('button:has-text("Add Category")').click();

    // Add a value to the category
    const categorySection = page.locator('section', { hasText: 'Test Category' });
    const addValueInput = categorySection.getByPlaceholder('Add to Test Category...');

    if (await addValueInput.isVisible()) {
      await addValueInput.fill('Test Value');
      await categorySection.locator('button:has-text("Add")').click();

      // Verify value was added
      await expect(categorySection.getByText('Test Value')).toBeVisible();
    }
  });
});
