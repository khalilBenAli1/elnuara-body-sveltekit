import {
  categories,
  scents,
  type Category,
  type Scent,
  type Product
} from './types';
export interface Filters {
  category: Category | 'All';
  scent: Scent | 'All';
  price: 'any' | '3000' | '4000';
  sort: 'featured' | 'price-low' | 'price-high';
}
export const defaultFilters = (): Filters => ({
  category: 'All',
  scent: 'All',
  price: 'any',
  sort: 'featured'
});
export function readFilters(query: Pick<URLSearchParams, 'get'>): Filters {
  const category = categories.find((c) => c === query.get('type')) ?? 'All';
  const scent = scents.find((s) => s === query.get('scent')) ?? 'All';
  const rawPrice = query.get('price');
  const price = rawPrice === '3000' || rawPrice === '4000' ? rawPrice : 'any';
  const rawSort = query.get('sort');
  const sort =
    rawSort === 'price-low' || rawSort === 'price-high' ? rawSort : 'featured';
  return { category, scent, price, sort };
}
export function queryFor(filters: Filters): '' | `?${string}` {
  const q = new URLSearchParams();
  if (filters.category !== 'All') q.set('type', filters.category);
  if (filters.scent !== 'All') q.set('scent', filters.scent);
  if (filters.price !== 'any') q.set('price', filters.price);
  if (filters.sort !== 'featured') q.set('sort', filters.sort);
  return q.size ? `?${q.toString()}` : '';
}
export function filterProducts(
  products: readonly Product[],
  filters: Filters
): Product[] {
  const result = products.filter(
    (p) =>
      (filters.category === 'All' || p.category === filters.category) &&
      (filters.scent === 'All' || p.scent === filters.scent) &&
      (filters.price === 'any' ||
        p.variants.some((v) => v.priceCents <= Number(filters.price)))
  );
  if (filters.sort === 'price-low')
    result.sort((a, b) => a.variants[0].priceCents - b.variants[0].priceCents);
  if (filters.sort === 'price-high')
    result.sort((a, b) => b.variants[0].priceCents - a.variants[0].priceCents);
  return result;
}
