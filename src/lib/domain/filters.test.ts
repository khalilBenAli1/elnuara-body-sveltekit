import { it, expect } from 'vitest';
import brief from '../../../docs/PRODUCT_IMAGE_BRIEF.json';
import { products } from './catalog';
import {
  defaultFilters,
  queryFor,
  readFilters,
  filterProducts
} from './filters';
it('preserves every canonical product and per-size media/price/stock field', () => {
  expect(products).toHaveLength(brief.products.length);
  for (const product of products) {
    const canonical = brief.products.find((p) => p.id === product.id);
    if (!canonical) throw Error('Missing canonical product');
    expect(product).toMatchObject(canonical);
  }
});
it('roundtrips URL state and rejects unsupported query choices', () => {
  const filter = {
    ...defaultFilters(),
    category: 'Hand care' as const,
    scent: 'Herbal' as const,
    price: '3000' as const,
    sort: 'price-high' as const
  };
  expect(readFilters(new URLSearchParams(queryFor(filter)))).toEqual(filter);
  expect(
    readFilters(
      new URLSearchParams('type=unknown&scent=unknown&price=-2&sort=unsafe')
    )
  ).toEqual(defaultFilters());
});
it('composes type, scent and per-size starting-price filters without reordering fixtures', () => {
  const before = products.map((p) => p.id);
  expect(
    filterProducts(products, {
      ...defaultFilters(),
      category: 'Wash',
      scent: 'Unfragranced',
      price: '3000'
    }).map((p) => p.id)
  ).toEqual(['still-water']);
  expect(
    filterProducts(products, {
      ...defaultFilters(),
      category: 'Oil',
      scent: 'Unfragranced'
    })
  ).toEqual([]);
  filterProducts(products, { ...defaultFilters(), sort: 'price-high' });
  expect(products.map((p) => p.id)).toEqual(before);
});
