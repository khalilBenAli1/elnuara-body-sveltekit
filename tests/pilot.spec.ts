import { test, expect } from '@playwright/test';
test('cold product to size-aware bag and detached local confirmation', async ({
  page
}) => {
  const issues: string[] = [];
  page.on('pageerror', (e) => issues.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'warning' || m.type() === 'error') issues.push(m.text());
  });
  await page.goto('products/citrus-veil/');
  await expect(
    page.getByRole('heading', { name: 'Citrus Veil Wash', exact: true })
  ).toBeVisible();
  await page.getByRole('radio', { name: /500 ml/ }).check();
  await expect(page.getByTestId('product-price')).toHaveText('€38.00');
  await page.getByRole('button', { name: 'Add to bag', exact: true }).click();
  await page
    .getByRole('button', { name: 'Open bag, 1 items', exact: true })
    .click();
  await page.getByRole('link', { name: 'Continue to demo checkout' }).click();
  await page.getByLabel('Full name', { exact: true }).fill('Renée D’Arcy');
  await page
    .getByLabel('Email address', { exact: true })
    .fill("renee.o'connor+ritual@example.com");
  await page.getByLabel('Street address', { exact: true }).fill('18 Via Roma');
  await page.getByLabel('City', { exact: true }).fill('Milano');
  await page.getByLabel('Postal code', { exact: true }).fill('20100');
  await page.getByLabel('Country', { exact: true }).selectOption('Italy');
  await page
    .getByRole('button', { name: 'Review your ritual', exact: true })
    .click();
  await expect(page.getByTestId('order-total')).toHaveText('€42.50');
  await page
    .getByRole('button', { name: 'Place demo order', exact: true })
    .click();
  await expect(
    page.getByRole('heading', { name: 'Your ritual is gathered.', exact: true })
  ).toBeVisible();
  await expect(page.getByTestId('confirmed-email')).toHaveText(
    "renee.o'connor+ritual@example.com"
  );
  await expect(
    page.getByRole('button', { name: 'Open bag, 0 items', exact: true })
  ).toBeVisible();
  await expect(page.getByTestId('order-total')).toHaveText('€42.50');
  expect(issues).toEqual([]);
});
test('cold query route hydrates without warnings and filters the catalog', async ({
  page
}) => {
  const issues: string[] = [];
  page.on('pageerror', (e) => issues.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'warning' || m.type() === 'error') issues.push(m.text());
  });
  await page.goto('collection/?type=Wash&scent=Unfragranced&price=3000');
  await expect(
    page.getByRole('heading', { name: 'Still Water Wash', exact: true })
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Citrus Veil Wash', exact: true })
  ).toHaveCount(0);
  await expect(
    page.getByRole('status').filter({ hasText: '1 essential' })
  ).toBeVisible();
  expect(issues).toEqual([]);
});
