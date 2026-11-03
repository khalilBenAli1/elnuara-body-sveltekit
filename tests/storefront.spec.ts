import {
  test,
  expect,
  seedBag,
  expectFitsViewport,
  doubleCriticalText,
  expectNoCriticalClip
} from './fixtures';
import { products } from '../src/lib/data/catalog';
import { STORAGE_KEY } from '../src/lib/adapters/persistence';
import AxeBuilder from '@axe-core/playwright';

test('canonical product routes expose matching size photos, prices and unavailable states', async ({
  page
}) => {
  for (const product of products) {
    await page.goto(`products/${product.id}/`);
    await expect(
      page.getByRole('heading', { name: product.name, exact: true })
    ).toBeVisible();
    for (const v of product.variants) {
      await page.getByRole('radio', { name: new RegExp(v.size) }).check();
      await expect(page.getByTestId('product-price')).toHaveText(
        new Intl.NumberFormat('en-IE', {
          style: 'currency',
          currency: 'EUR'
        }).format(v.priceCents / 100)
      );
      await expect(
        page
          .getByRole('button', {
            name: `Enlarge ${product.name}, ${v.size}`,
            exact: true
          })
          .getByRole('img')
      ).toHaveAttribute('src', new RegExp(v.image.replace('.', '\\.')));
      await expect(
        page.getByRole('button', {
          name: v.stock ? 'Add to bag' : 'Currently unavailable',
          exact: true
        })
      ).toBeEnabled({ enabled: !!v.stock });
    }
  }
});

test('same-size quantities merge, different sizes stay separate and stock remains bounded', async ({
  page
}) => {
  await page.goto('products/citrus-veil/');
  await page.getByRole('radio', { name: /500 ml/ }).check();
  await page.getByRole('button', { name: 'Add to bag', exact: true }).click();
  await page.getByRole('button', { name: 'Add to bag', exact: true }).click();
  await page.getByRole('radio', { name: /250 ml/ }).check();
  await page.getByRole('button', { name: 'Add to bag', exact: true }).click();
  await page
    .getByRole('button', { name: 'Open bag, 3 items', exact: true })
    .click();
  const dialog = page.getByRole('dialog', { name: /Your bag/ });
  await expect(
    dialog.getByRole('heading', { name: 'Citrus Veil Wash', exact: true })
  ).toHaveCount(2);
  await dialog
    .getByRole('button', {
      name: 'Remove Citrus Veil Wash, 250 ml',
      exact: true
    })
    .click();
  await expect(dialog.getByText('€76.00', { exact: true })).toHaveCount(3);
  for (let i = 0; i < 3; i++)
    await dialog
      .getByRole('button', {
        name: 'Increase Citrus Veil Wash, 500 ml',
        exact: true
      })
      .click();
  await expect(
    dialog.getByRole('button', {
      name: 'Increase Citrus Veil Wash, 500 ml',
      exact: true
    })
  ).toBeDisabled();
  await page.keyboard.press('Escape');
  await expect(
    page.getByRole('button', { name: 'Open bag, 5 items', exact: true })
  ).toBeFocused();
  await page.reload();
  await expect(
    page.getByRole('button', { name: 'Open bag, 5 items', exact: true })
  ).toBeVisible();
});

test('rapid type, scent, price and sort updates compose in the URL', async ({
  page
}) => {
  await page.goto('collection/');
  await expect(
    page.getByRole('button', { name: 'Wash', exact: true })
  ).toBeEnabled();
  await page.evaluate(() => {
    const type = [...document.querySelectorAll('button')].find(
      (b) => b.textContent?.trim() === 'Wash'
    );
    if (!type) throw Error('Missing Wash filter');
    type.click();
    for (const [label, value] of [
      ['Scent', 'Unfragranced'],
      ['Price', '3000'],
      ['Sort', 'price-high']
    ]) {
      const select = document.querySelector(`select[aria-label="${label}"]`);
      if (!(select instanceof HTMLSelectElement))
        throw Error('Missing filter ' + label);
      select.value = value;
      select.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
  await expect
    .poll(() => new URL(page.url()).searchParams.get('sort'))
    .toBe('price-high');
  const query = new URL(page.url()).searchParams;
  expect(Object.fromEntries(query)).toEqual({
    type: 'Wash',
    scent: 'Unfragranced',
    price: '3000',
    sort: 'price-high'
  });
  await expect(
    page.getByRole('heading', { name: 'Still Water Wash', exact: true })
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Citrus Veil Wash', exact: true })
  ).toHaveCount(0);
  await page.getByRole('button', { name: 'Oil', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: /A little room/ })
  ).toBeVisible();
  await page
    .getByRole('button', { name: 'Explore all eight', exact: true })
    .click();
  await expect(
    page.getByRole('status').filter({ hasText: '8 essentials' })
  ).toBeVisible();
});

test('ritual explains real fallbacks, allows editing/removing and atomically adds reduced choices', async ({
  page
}) => {
  await page.goto('routine/');
  await page.getByRole('radio', { name: 'Unfragranced', exact: true }).check();
  const body = page.getByRole('article', { name: 'body ritual choice' });
  await expect(body).toContainText('no exact unfragranced light body option');
  await body
    .getByLabel('Product for body', { exact: true })
    .selectOption('amber-current');
  await expect(body).toContainText('A fragrance alternative: woods.');
  await expect(body).toContainText('oil, rather than light');
  await expect(body).not.toContainText('richer balm');
  await body.getByLabel('Size for body', { exact: true }).selectOption('200');
  await page
    .getByRole('button', { name: 'Remove cleanse choice', exact: true })
    .click();
  await page
    .getByRole('button', { name: 'Remove hands choice', exact: true })
    .click();
  await expect(page.getByText('€58.00', { exact: true })).toHaveCount(2);
  await page
    .getByRole('button', { name: 'Add ritual to bag', exact: true })
    .click();
  await page
    .getByRole('button', { name: 'Open bag, 1 items', exact: true })
    .click();
  await expect(page.getByRole('dialog', { name: /Your bag/ })).toContainText(
    'Amber Current Oil'
  );
  await expect(page.getByRole('dialog', { name: /Your bag/ })).toContainText(
    '200 ml'
  );
  await expect(page.getByRole('dialog', { name: /Your bag/ })).toContainText(
    '€62.50'
  );
});

test('overstocked and empty rituals cannot partially add items', async ({
  page
}) => {
  await seedBag(page, [
    { productId: 'citrus-veil', variantId: '250', quantity: 8 }
  ]);
  await page.goto('routine/');
  await page
    .getByRole('button', { name: 'Add ritual to bag', exact: true })
    .click();
  await expect(page.getByRole('alert')).toContainText(
    'Your bag has not changed'
  );
  const stored = await page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key)!),
    STORAGE_KEY
  );
  expect(stored.bag).toEqual([
    { productId: 'citrus-veil', variantId: '250', quantity: 8 }
  ]);
  for (const slot of ['cleanse', 'body', 'hands'])
    await page
      .getByRole('button', { name: `Remove ${slot} choice`, exact: true })
      .click();
  await expect(
    page.getByRole('button', { name: 'Add ritual to bag', exact: true })
  ).toBeDisabled();
  await expect(
    page.getByRole('button', { name: 'Open bag, 8 items', exact: true })
  ).toBeVisible();
});

test('gallery and bag restore keyboard focus and ignore late close events after reopen', async ({
  page
}) => {
  await page.goto('products/leaf-milk/');
  const opener = page.getByRole('button', {
    name: 'Enlarge Leaf Milk Lotion, 200 ml',
    exact: true
  });
  await opener.focus();
  await page.keyboard.press('Enter');
  await expect(
    page.getByRole('dialog', {
      name: 'Leaf Milk Lotion photograph',
      exact: true
    })
  ).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(opener).toBeFocused();
  await opener.click();
  await page
    .getByRole('dialog', { name: 'Leaf Milk Lotion photograph', exact: true })
    .evaluate(async (dialog) => {
      if (!(dialog instanceof HTMLDialogElement)) throw Error('Not native');
      const closed = new Promise<void>((resolve) =>
        dialog.addEventListener('close', () => resolve(), { once: true })
      );
      dialog.close();
      const trigger = document.querySelector(
        'button[aria-label="Enlarge Leaf Milk Lotion, 200 ml"]'
      );
      if (!(trigger instanceof HTMLButtonElement)) throw Error('No opener');
      trigger.click();
      await closed;
    });
  await expect(
    page.getByRole('dialog', {
      name: 'Leaf Milk Lotion photograph',
      exact: true
    })
  ).toBeVisible();
  await page
    .getByRole('button', { name: 'Close photograph', exact: true })
    .click();
  const bag = page.getByRole('button', {
    name: 'Open bag, 0 items',
    exact: true
  });
  await bag.click();
  await page
    .getByRole('dialog', { name: /Your bag/ })
    .evaluate(async (dialog) => {
      if (!(dialog instanceof HTMLDialogElement)) throw Error('Not native');
      dialog.close();
      const trigger = document.querySelector(
        'button[aria-label="Open bag, 0 items"]'
      );
      if (!(trigger instanceof HTMLButtonElement)) throw Error('No opener');
      trigger.click();
    });
  await expect(page.getByRole('dialog', { name: /Your bag/ })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(bag).toBeFocused();
});

test('corrupt storage remains untouched until own-key reset and preserves another demo sentinel', async ({
  page
}) => {
  await page.goto('');
  await page.evaluate((key) => {
    localStorage.setItem(key, '{broken');
    localStorage.setItem('other-demo.sentinel', 'keep');
  }, STORAGE_KEY);
  await page.reload();
  await expect(page.getByRole('alert')).toContainText(
    'original data has been left untouched'
  );
  await page.goto('products/citrus-veil/');
  await page.getByRole('button', { name: 'Add to bag', exact: true }).click();
  expect(
    await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY)
  ).toBe('{broken');
  await page
    .getByRole('button', { name: 'Dismiss update', exact: true })
    .click();
  await page
    .getByRole('contentinfo')
    .getByRole('button', { name: 'Reset saved bag & ritual', exact: true })
    .click();
  await page
    .getByRole('button', { name: 'Reset Elnuara choices', exact: true })
    .click();
  expect(
    await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY)
  ).toBe(null);
  expect(
    await page.evaluate(() => localStorage.getItem('other-demo.sentinel'))
  ).toBe('keep');
  await expect(
    page.getByRole('button', { name: 'Open bag, 0 items', exact: true })
  ).toBeVisible();
});

test('blocked storage remains usable', async ({ page }) => {
  await page.addInitScript(() =>
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new DOMException('Blocked', 'SecurityError');
      }
    })
  );
  await page.goto('products/soft-palm/');
  await expect(page.getByRole('alert')).toContainText('cannot save this bag');
  await page.getByRole('button', { name: 'Add to bag', exact: true }).click();
  await expect(
    page.getByRole('button', { name: 'Open bag, 1 items', exact: true })
  ).toBeVisible();
});

test.describe('native touch controls', () => {
  test.use({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true
  });
  test('navigation, size gallery and bag work with taps', async ({ page }) => {
    await page.goto('');
    await page
      .getByRole('button', { name: 'Open navigation', exact: true })
      .tap();
    await page
      .getByRole('navigation', { name: 'Mobile navigation' })
      .getByRole('link', { name: 'Body & hands', exact: true })
      .tap();
    await page
      .getByRole('heading', { name: 'Citrus Veil Wash', exact: true })
      .tap();
    await page
      .getByRole('button', { name: 'View 500 ml photo', exact: true })
      .tap();
    await expect(page.getByTestId('product-price')).toHaveText('€38.00');
    await page
      .getByRole('button', {
        name: 'Enlarge Citrus Veil Wash, 500 ml',
        exact: true
      })
      .tap();
    await page
      .getByRole('button', { name: 'Close photograph', exact: true })
      .tap();
    await page.getByRole('button', { name: 'Add to bag', exact: true }).tap();
    await page
      .getByRole('button', { name: 'Open bag, 1 items', exact: true })
      .tap();
    await expect(page.getByRole('dialog', { name: /Your bag/ })).toContainText(
      '500 ml'
    );
    await page.getByRole('button', { name: 'Close bag', exact: true }).tap();
    await expectFitsViewport(page);
  });
});

for (const width of [320, 390, 768, 1440])
  for (const route of [
    '',
    'collection/',
    'products/citrus-veil/',
    'routine/',
    'materials/'
  ])
    test(`critical text fits ${route || 'home'} at ${width}px and exact idempotent 2x`, async ({
      page
    }) => {
      await page.setViewportSize({ width, height: 1000 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      await expectFitsViewport(page);
      await expectNoCriticalClip(page);
      await doubleCriticalText(page);
      await doubleCriticalText(page);
      await expectFitsViewport(page);
      await expectNoCriticalClip(page);
    });

for (const route of [
  '',
  'collection/',
  'products/citrus-veil/',
  'routine/',
  'materials/',
  'bag/'
])
  test(`accessibility on ${route || 'home'}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 1000 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(route);
    await page.evaluate(() => document.fonts.ready);
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
          .analyze()
      ).violations
    ).toEqual([]);
  });

test('unknown direct paths return a deliberate static404', async ({
  request
}) => {
  const response = await request.get('this-ritual-does-not-exist/');
  expect(response.status()).toBe(404);
  expect(await response.text()).toContain('Elnuara');
});
