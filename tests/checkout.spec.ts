import type { Page, Locator } from '@playwright/test';
import {
  test,
  expect,
  seedBag,
  expectFitsViewport,
  doubleCriticalText,
  expectNoCriticalClip
} from './fixtures';

async function activate(locator: Locator, touch = false) {
  if (touch) await locator.tap();
  else await locator.click();
}
async function begin(page: Page) {
  await seedBag(page);
  await page.goto('checkout/');
  await expect(page.getByLabel('Full name', { exact: true })).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
}
async function details(page: Page, long = false) {
  const values = {
    name: long ? 'N'.repeat(100) : 'Renée D’Arcy',
    email: long
      ? `${'a'.repeat(64)}@${'b'.repeat(63)}.${'c'.repeat(63)}.${'d'.repeat(53)}.invalid`
      : "renee.o'connor+ritual@example.com",
    address: long ? 'A'.repeat(160) : '18 Via Roma',
    city: long ? 'C'.repeat(80) : 'Milano',
    postalCode: long ? 'P'.repeat(16) : '20100'
  };
  for (const [label, value] of [
    ['Full name', values.name],
    ['Email address', values.email],
    ['Street address', values.address],
    ['City', values.city],
    ['Postal code', values.postalCode]
  ])
    await page.getByLabel(label!, { exact: true }).fill(value!);
  await page.getByLabel('Country', { exact: true }).selectOption('Italy');
  return values;
}
async function tabTo(page: Page, target: Locator) {
  const key =
    process.platform === 'darwin' &&
    page.context().browser()?.browserType().name() === 'webkit'
      ? 'Alt+Tab'
      : 'Tab';
  for (let i = 0; i < 100; i++) {
    if (await target.evaluate((el) => document.activeElement === el)) return;
    await page.keyboard.press(key);
  }
  throw Error('Control was not reachable by keyboard.');
}

test.describe('touch delivery journey', () => {
  test.use({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true
  });
  test('rejects malformed details, confirms valid choices and survives own-key reset without saving contacts', async ({
    page
  }) => {
    const requests: { url: string; method: string }[] = [];
    page.on('request', (request) =>
      requests.push({ url: request.url(), method: request.method() })
    );
    await begin(page);
    const review = page.getByRole('button', {
      name: 'Review your ritual',
      exact: true
    });
    await activate(review, true);
    await expect(page.getByLabel('Full name', { exact: true })).toBeFocused();
    const values = await details(page);
    for (const email of ['alex<smith>@example.com', 'alex,smith@example.com']) {
      await page.getByLabel('Email address', { exact: true }).fill(email);
      await activate(review, true);
      await expect(
        page.getByLabel('Email address', { exact: true })
      ).toHaveAttribute('aria-invalid', 'true');
      await expect(
        page.getByLabel('Email address', { exact: true })
      ).toBeFocused();
      await expect(
        page.getByRole('button', { name: 'Place demo order', exact: true })
      ).toHaveCount(0);
    }
    await page.getByLabel('Email address', { exact: true }).fill(values.email);
    await activate(review, true);
    await expect(
      page.getByRole('heading', { level: 1, name: 'One last look.' })
    ).toBeFocused();
    await expect(page.getByTestId('order-total')).toHaveText('€28.50');
    await activate(
      page.getByRole('button', { name: 'Place demo order', exact: true }),
      true
    );
    await expect(
      page.getByRole('heading', { level: 1, name: 'Your ritual is gathered.' })
    ).toBeFocused();
    await expect(page.getByTestId('confirmed-email')).toHaveText(values.email);
    await expect(
      page.getByRole('button', { name: 'Open bag, 0 items', exact: true })
    ).toBeVisible();
    const reference = await page
      .getByTestId('confirmation-reference')
      .innerText();
    const storage = await page.evaluate(() =>
      [localStorage, sessionStorage].flatMap((s) =>
        Object.keys(s).map((key) => s.getItem(key) ?? '')
      )
    );
    for (const value of storage)
      for (const contact of [values.name, values.email, values.address])
        expect(value).not.toContain(contact);
    for (const request of requests) {
      expect(['GET', 'HEAD']).toContain(request.method);
      for (const contact of [values.name, values.email, values.address]) {
        expect(request.url).not.toContain(contact);
        expect(request.url).not.toContain(encodeURIComponent(contact));
      }
    }
    await activate(
      page
        .getByRole('contentinfo')
        .getByRole('button', { name: 'Reset saved bag & ritual', exact: true }),
      true
    );
    await activate(
      page.getByRole('button', { name: 'Reset Elnuara choices', exact: true }),
      true
    );
    await expect(page.getByTestId('confirmation-reference')).toHaveText(
      reference
    );
    await expect(page.getByTestId('order-total')).toHaveText('€28.50');
    await expect(page.getByTestId('confirmed-email')).toHaveText(values.email);
    expect(
      await page.evaluate(() => localStorage.getItem('elnuara.body.state.v1'))
    ).toBeNull();
    expect(
      await page.evaluate(() => localStorage.getItem('other-demo.sentinel'))
    ).toBe('keep');
    await expectFitsViewport(page);
    await expectNoCriticalClip(page);
  });
});

test('supports keyboard review, editing and confirmation', async ({ page }) => {
  await begin(page);
  const values = await details(page);
  await tabTo(
    page,
    page.getByRole('button', { name: 'Review your ritual', exact: true })
  );
  await page.keyboard.press('Enter');
  await expect(
    page.getByRole('heading', { level: 1, name: 'One last look.' })
  ).toBeFocused();
  await tabTo(
    page,
    page.getByRole('button', { name: 'Edit details', exact: true })
  );
  await page.keyboard.press('Enter');
  await expect(page.getByLabel('Full name', { exact: true })).toHaveValue(
    values.name
  );
  await expect(page.getByLabel('Street address', { exact: true })).toHaveValue(
    values.address
  );
  await tabTo(
    page,
    page.getByRole('button', { name: 'Review your ritual', exact: true })
  );
  await page.keyboard.press('Enter');
  await expect(
    page.getByRole('heading', { level: 1, name: 'One last look.' })
  ).toBeFocused();
  await tabTo(
    page,
    page.getByRole('button', { name: 'Place demo order', exact: true })
  );
  await page.keyboard.press('Enter');
  await expect(
    page.getByRole('heading', { level: 1, name: 'Your ritual is gathered.' })
  ).toBeFocused();
  await expect(page.getByTestId('order-total')).toHaveText('€28.50');
});

for (const width of [320, 390, 768, 1440]) {
  test(`long delivery details fit at ${width}px${width === 320 ? '' : ' with exact idempotent 200% text'}`, async ({
    page
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await begin(page);
    const values = await details(page, true);
    expect(values.email).toHaveLength(254);
    if (width !== 320) {
      await doubleCriticalText(page);
      await doubleCriticalText(page);
    }
    await expectFitsViewport(page);
    await expectNoCriticalClip(page);
    await page
      .getByRole('button', { name: 'Review your ritual', exact: true })
      .click();
    await expect(
      page.getByRole('heading', { level: 1, name: 'One last look.' })
    ).toBeVisible();
    if (width !== 320) {
      await doubleCriticalText(page);
      await doubleCriticalText(page);
    }
    await expectFitsViewport(page);
    await expectNoCriticalClip(page);
    await page
      .getByRole('button', { name: 'Place demo order', exact: true })
      .click();
    await expect(
      page.getByRole('heading', { level: 1, name: 'Your ritual is gathered.' })
    ).toBeVisible();
    await expect(page.getByTestId('confirmed-email')).toHaveText(values.email);
    if (width !== 320) {
      await doubleCriticalText(page);
      await doubleCriticalText(page);
    }
    await expectFitsViewport(page);
    await expectNoCriticalClip(page);
    await expect(page.getByTestId('order-total')).toHaveText('€28.50');
  });
}
