import { it, expect } from 'vitest';
import { Shop } from './shop.svelte';
import { STORAGE_KEY, type StoragePort } from '../adapters/persistence';
const memory = () => {
  const data = new Map<string, string>();
  const storage: StoragePort = {
    getItem: (k) => data.get(k) ?? null,
    setItem: (k, v) => {
      data.set(k, v);
    },
    removeItem: (k) => {
      data.delete(k);
    }
  };
  return { data, storage };
};
it('isolates independently constructed layout instances before hydration', () => {
  const a = new Shop(),
    b = new Shop();
  a.add('citrus-veil', '250', 1);
  expect(a.bag).toHaveLength(1);
  expect(b.bag).toHaveLength(0);
  a.state.routine = [];
  expect(b.routine).toHaveLength(3);
});
it('hydrates validated state, persists edits, and resets only its namespaced key', () => {
  const { data, storage } = memory();
  data.set('other-demo.sentinel', 'keep');
  const a = new Shop();
  a.hydrate(storage);
  a.add('soft-palm', '50', 2);
  const b = new Shop();
  b.hydrate(storage);
  expect(b.totals.subtotalCents).toBe(3600);
  expect(data.has(STORAGE_KEY)).toBe(true);
  b.reset();
  expect(data.has(STORAGE_KEY)).toBe(false);
  expect(data.get('other-demo.sentinel')).toBe('keep');
});
it('keeps a corrupt record untouched during temporary browsing edits', () => {
  const { data, storage } = memory();
  data.set(STORAGE_KEY, '{bad');
  const shop = new Shop();
  shop.hydrate(storage);
  shop.add('citrus-veil', '250', 1);
  expect(shop.storageStatus).toBe('corrupt');
  expect(data.get(STORAGE_KEY)).toBe('{bad');
});
