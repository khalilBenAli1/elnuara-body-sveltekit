import { test as base, expect, type Page } from '@playwright/test';
import { initialState, STORAGE_KEY } from '../src/lib/adapters/persistence';
import type { BagLine } from '../src/lib/domain/types';
export { expect };
export const test = base.extend<{ browserIssues: string[] }>({
  browserIssues: [
    async ({ page }, use) => {
      const issues: string[] = [];
      page.on('pageerror', (error) =>
        issues.push('pageerror: ' + error.message)
      );
      page.on('console', (message) => {
        if (message.type() === 'warning' || message.type() === 'error')
          issues.push(message.type() + ': ' + message.text());
      });
      await use(issues);
      expect(
        issues,
        'All browser warnings and runtime errors must remain empty.'
      ).toEqual([]);
    },
    { auto: true }
  ]
});
export async function seedBag(
  page: Page,
  bag: BagLine[] = [{ productId: 'citrus-veil', variantId: '250', quantity: 1 }]
) {
  await page.goto('');
  await page.evaluate(
    ({ key, state }) => {
      localStorage.setItem(key, JSON.stringify(state));
      localStorage.setItem('other-demo.sentinel', 'keep');
    },
    { key: STORAGE_KEY, state: { ...initialState(), bag } }
  );
}
export async function expectFitsViewport(page: Page) {
  const size = await page.evaluate(() => ({
    content: document.documentElement.scrollWidth,
    viewport: document.documentElement.clientWidth
  }));
  expect(size.content, JSON.stringify(size)).toBeLessThanOrEqual(size.viewport);
}
export async function doubleCriticalText(page: Page) {
  const result = await page.evaluate(() => {
    for (const element of document.querySelectorAll<HTMLElement>(
      '[data-base-font]'
    )) {
      const original = element.dataset.originalFont ?? '';
      if (original) element.style.fontSize = original;
      else element.style.removeProperty('font-size');
    }
    const nodes = [
      ...document.querySelectorAll<HTMLElement>(
        'h1,h2,h3,p,a,button,label,input,select,legend,dt,dd,span,small,strong,em,[data-critical]'
      )
    ].filter(
      (element) =>
        element.getClientRects().length > 0 &&
        getComputedStyle(element).visibility !== 'hidden'
    );
    const bases = nodes.map((element) => ({
      element,
      size: parseFloat(getComputedStyle(element).fontSize),
      original: element.style.fontSize
    }));
    for (const { element, size, original } of bases) {
      element.dataset.originalFont = original;
      element.dataset.baseFont = String(size);
      element.style.fontSize = `${size * 2}px`;
    }
    return {
      count: bases.length,
      errors: bases
        .filter(
          ({ element, size }) =>
            Math.abs(
              parseFloat(getComputedStyle(element).fontSize) - size * 2
            ) > 0.05
        )
        .map(({ element, size }) => ({
          text: element.textContent?.slice(0, 80),
          base: size,
          actual: getComputedStyle(element).fontSize
        }))
    };
  });
  expect(result.count).toBeGreaterThan(0);
  expect(
    result.errors,
    'Text must be exactly doubled, including prices.'
  ).toEqual([]);
}
export async function expectNoCriticalClip(page: Page) {
  const clipped = await page.evaluate(() => {
    const results: { text: string; reason: string }[] = [];
    const width = document.documentElement.clientWidth;
    for (const element of document.querySelectorAll<HTMLElement>(
      'h1,h2,h3,p,a,button,label,legend,dt,dd,span,small,strong,em,[data-critical]'
    )) {
      if (
        !element.getClientRects().length ||
        getComputedStyle(element).visibility === 'hidden' ||
        !element.textContent?.trim() ||
        element.closest('.visually-hidden')
      )
        continue;
      const range = document.createRange();
      range.selectNodeContents(element);
      const rect = range.getBoundingClientRect();
      if (rect.width && (rect.left < -1 || rect.right > width + 1))
        results.push({
          text: element.textContent.trim().slice(0, 90),
          reason: `text range ${rect.left}..${rect.right}, viewport ${width}`
        });
      if (
        element.clientWidth > 0 &&
        element.scrollWidth > element.clientWidth + 1
      )
        results.push({
          text: element.textContent.trim().slice(0, 90),
          reason: `scroll ${element.scrollWidth}, client ${element.clientWidth}`
        });
      let parent = element.parentElement;
      while (parent && parent !== document.body) {
        const style = getComputedStyle(parent);
        if (style.overflowX === 'hidden' || style.overflowX === 'clip') {
          const bounds = parent.getBoundingClientRect();
          if (
            rect.width &&
            (rect.left < bounds.left - 1 || rect.right > bounds.right + 1)
          ) {
            results.push({
              text: element.textContent.trim().slice(0, 90),
              reason: 'clipped by overflow ancestor'
            });
            break;
          }
        }
        parent = parent.parentElement;
      }
    }
    return results;
  });
  expect(
    clipped,
    'Critical rendered text must fit without horizontal clipping.'
  ).toEqual([]);
}
