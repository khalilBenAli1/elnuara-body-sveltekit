import { describe, it, expect } from 'vitest';
import { products, getVariant } from './catalog';
import { addLines, setQuantity, totals } from './bag';
import {
  recommend,
  explain,
  defaultPreferences,
  addRoutine,
  routineTotal
} from './routine';
import {
  initialState,
  parseState,
  loadState,
  resetState,
  STORAGE_KEY,
  type StoragePort
} from '../adapters/persistence';
describe('canonical catalog and exact bag rules', () => {
  it('has eight distinct products and all sixteen size-specific identities', () => {
    expect(products).toHaveLength(8);
    expect(products.flatMap((p) => p.variants)).toHaveLength(16);
    expect(
      new Set(products.flatMap((p) => p.variants.map((v) => v.image))).size
    ).toBe(16);
    expect(getVariant('stone-grain', '350')?.variant.stock).toBe(0);
  });
  it('merges only the same product and size, using per-size cents', () => {
    const first = addLines(
      [],
      [{ productId: 'citrus-veil', variantId: '250', quantity: 1 }]
    );
    if (!first.ok) throw Error('fixture');
    const second = addLines(first.value, [
      { productId: 'citrus-veil', variantId: '250', quantity: 1 },
      { productId: 'citrus-veil', variantId: '500', quantity: 1 }
    ]);
    if (!second.ok) throw Error('fixture');
    expect(second.value).toHaveLength(2);
    expect(totals(second.value)).toEqual({
      subtotalCents: 8600,
      deliveryCents: 0,
      totalCents: 8600,
      count: 3
    });
    expect(first.value[0].quantity).toBe(1);
  });
  it('charges standard450 only below6000 and nothing for an empty bag', () => {
    expect(totals([]).totalCents).toBe(0);
    expect(
      totals([{ productId: 'citrus-veil', variantId: '250', quantity: 1 }])
    ).toMatchObject({ deliveryCents: 450, totalCents: 2850 });
    expect(
      totals([
        { productId: 'quiet-dune', variantId: '150', quantity: 1 },
        { productId: 'citrus-veil', variantId: '250', quantity: 1 }
      ]).deliveryCents
    ).toBe(0);
  });
  it('rejects invalid or unavailable additions atomically', () => {
    const bag = [{ productId: 'citrus-veil', variantId: '250', quantity: 1 }];
    for (const incoming of [
      [{ productId: 'stone-grain', variantId: '350', quantity: 1 }],
      [{ productId: 'citrus-veil', variantId: '250', quantity: 8 }],
      [{ productId: 'missing', variantId: '250', quantity: 1 }],
      [{ productId: 'soft-palm', variantId: '50', quantity: 1.5 }]
    ])
      expect(
        addLines(bag, [
          { productId: 'soft-palm', variantId: '50', quantity: 1 },
          ...incoming
        ]).ok
      ).toBe(false);
    expect(bag).toEqual([
      { productId: 'citrus-veil', variantId: '250', quantity: 1 }
    ]);
  });
  it('bounds quantities and removes exactly one line', () => {
    const bag = [
      { productId: 'citrus-veil', variantId: '250', quantity: 1 },
      { productId: 'citrus-veil', variantId: '500', quantity: 1 }
    ];
    expect(setQuantity(bag, 'citrus-veil:250', 0)).toEqual({
      ok: true,
      value: [bag[1]]
    });
    expect(setQuantity(bag, 'citrus-veil:250', 9).ok).toBe(false);
  });
});
describe('honest routine suggestions and atomic reduced routines', () => {
  it('states the missing unfragranced light body match truthfully', () => {
    const prefs = {
      ...defaultPreferences(),
      fragrance: 'unfragranced' as const
    };
    const choices = recommend(prefs);
    expect(choices.find((c) => c.slot === 'body')?.productId).toBe(
      'quiet-dune'
    );
    expect(
      explain(
        choices.find((c) => c.slot === 'body')!,
        prefs
      )
    ).toContain('no exact unfragranced light body option');
    expect(
      choices.every(
        (c) =>
          getVariant(c.productId, c.variantId)?.product.scent === 'Unfragranced'
      )
    ).toBe(true);
  });
  it('allows any valid nonempty reduced ritual with correct prices', () => {
    const one = [recommend(defaultPreferences())[0]];
    const result = addRoutine([], one);
    expect(result.ok).toBe(true);
    expect(routineTotal(one)).toBe(2400);
    expect(addRoutine([], []).ok).toBe(false);
  });
  it('rejects invalid, out-of-stock and cumulatively overstocked routines without partial writes', () => {
    const bag = [{ productId: 'citrus-veil', variantId: '250', quantity: 8 }];
    expect(addRoutine(bag, recommend(defaultPreferences())).ok).toBe(false);
    expect(bag).toHaveLength(1);
    expect(
      addRoutine(
        [],
        [{ slot: 'body', productId: 'stone-grain', variantId: '350' }]
      ).ok
    ).toBe(false);
  });
});
describe('versioned field validation and own-key isolation', () => {
  it('round-trips a valid state with copies', () =>
    expect(parseState(JSON.stringify(initialState()))).toEqual(initialState()));
  it.each(['{', 'null', '{"version":2}', '[]'])(
    'rejects malformed/unknown saved state %s',
    (raw) => expect(() => parseState(raw)).toThrow()
  );
  it('rejects mutations of otherwise valid record fields', () => {
    const valid = {
      ...initialState(),
      bag: [{ productId: 'citrus-veil', variantId: '250', quantity: 1 }]
    };
    const edits = [
      (x: typeof valid) => (x.bag[0].productId = 'bad'),
      (x: typeof valid) => (x.bag[0].variantId = '999'),
      (x: typeof valid) => (x.bag[0].quantity = -1),
      (x: typeof valid) => (x.bag[0].quantity = 1.5),
      (x: typeof valid) => (x.bag[0].quantity = 9)
    ];
    for (const edit of edits) {
      const x = structuredClone(valid);
      edit(x);
      expect(() => parseState(JSON.stringify(x))).toThrow();
    }
    expect(() =>
      parseState(
        JSON.stringify({
          ...valid,
          preferences: { ...valid.preferences, fragrance: 'made-up' }
        })
      )
    ).toThrow();
    expect(() =>
      parseState(
        JSON.stringify({ ...valid, bag: [{ ...valid.bag[0], priceCents: 1 }] })
      )
    ).toThrow();
  });
  it('preserves corrupt data and reports blocked reads', () => {
    const data = new Map([
      [STORAGE_KEY, '{bad'],
      ['other-demo.sentinel', 'keep']
    ]);
    const storage: StoragePort = {
      getItem: (k) => data.get(k) ?? null,
      setItem: (k, v) => {
        data.set(k, v);
      },
      removeItem: (k) => {
        data.delete(k);
      }
    };
    expect(loadState(storage).status).toBe('corrupt');
    expect(data.get(STORAGE_KEY)).toBe('{bad');
    expect(resetState(storage)).toBe(true);
    expect(data.get('other-demo.sentinel')).toBe('keep');
    expect(
      loadState({
        ...storage,
        getItem: () => {
          throw Error('blocked');
        }
      }).status
    ).toBe('blocked');
  });
});
