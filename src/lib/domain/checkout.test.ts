import { describe, expect, it } from 'vitest';
import type { BagLine } from './types';
import {
  countries,
  emptyContact,
  validateContact,
  createConfirmation,
  type ContactDraft
} from './checkout';

const contact = (): ContactDraft => ({
  name: '  Renée D’Arcy  ',
  email: "renee.o'connor+ritual@example.com",
  address: '18 Via Roma',
  city: 'Milano',
  postalCode: '20100',
  country: 'Italy'
});
const small: BagLine = {
  productId: 'citrus-veil',
  variantId: '250',
  quantity: 1
};

describe('delivery details', () => {
  it('creates fresh empty details and reports every missing field', () => {
    const first = emptyContact();
    first.name = 'Changed';
    expect(emptyContact()).toEqual({
      name: '',
      email: '',
      address: '',
      city: '',
      postalCode: '',
      country: ''
    });
    expect(Object.keys(validateContact(emptyContact())).sort()).toEqual([
      'address',
      'city',
      'country',
      'email',
      'name',
      'postalCode'
    ]);
    expect(countries).toEqual([
      'Ireland',
      'Italy',
      'France',
      'Germany',
      'Spain',
      'Netherlands'
    ]);
  });

  it('supports international names, single-letter cities and listed destinations', () => {
    for (const name of [
      'Renée D’Arcy',
      'Søren Ångström',
      '王小明',
      'أمل حداد',
      'N'.repeat(100)
    ]) {
      expect(validateContact({ ...contact(), name })).toEqual({});
    }
    expect(validateContact({ ...contact(), city: 'Y' })).toEqual({});
    for (const country of countries) {
      expect(validateContact({ ...contact(), country })).toEqual({});
    }
    for (const postalCode of [
      'D02 X285',
      '1012 AB',
      '00100',
      '75001',
      '10115',
      '28001'
    ]) {
      expect(validateContact({ ...contact(), postalCode })).toEqual({});
    }
  });

  it('accepts supported unquoted plus, dot and apostrophe addresses up to the raw limit', () => {
    const long = `${'a'.repeat(64)}@${'b'.repeat(63)}.${'c'.repeat(63)}.${'d'.repeat(53)}.invalid`;
    expect(long).toHaveLength(254);
    for (const email of [
      'alex.smith+ritual@example.com',
      "o'connor@example.com",
      'A-Z_09!#$%&*+/=?^`{|}~@example.co.uk',
      ' alex@example.com ',
      long
    ]) {
      expect(validateContact({ ...contact(), email })).toEqual({});
    }
    expect(validateContact({ ...contact(), email: ` ${long}` })).toHaveProperty(
      'email'
    );
    expect(
      validateContact({ ...contact(), email: `${'a'.repeat(65)}@example.com` })
    ).toHaveProperty('email');
  });

  it.each([
    'alex<smith>@example.com',
    'alex,smith@example.com',
    '.alex@example.com',
    'alex.@example.com',
    'alex..smith@example.com',
    'alex smith@example.com',
    '"alex"@example.com',
    'alex@@example.com',
    'alex@example',
    'alex@-example.com',
    'alex@example-.com',
    'alex@example..com',
    'alex@exam_ple.com',
    `alex@${'x'.repeat(64)}.com`
  ])('rejects unsupported email format %s', (email) => {
    expect(validateContact({ ...contact(), email })).toHaveProperty('email');
  });

  it('rejects malformed, missing and over-limit details without throwing', () => {
    for (const [field, value] of [
      ['name', 'N'],
      ['name', 'N'.repeat(101)],
      ['name', null],
      ['email', null],
      ['email', 3],
      ['address', 'x'],
      ['address', 'x'.repeat(161)],
      ['city', ' '],
      ['city', 'x'.repeat(81)],
      ['postalCode', 'x'],
      ['postalCode', 'x'.repeat(17)],
      ['postalCode', '<1012>'],
      ['postalCode', '10,12'],
      ['country', 'Unknown'],
      ['country', null]
    ] as const) {
      expect(
        validateContact({ ...contact(), [field]: value } as ContactDraft)
      ).toHaveProperty(field);
    }
    for (const invalid of [null, [], {}, 'contact']) {
      expect(
        Object.keys(validateContact(invalid as unknown as ContactDraft))
      ).toHaveLength(6);
    }
  });
});

describe('detached local confirmation', () => {
  it('uses the selected size image and price with exact standard delivery cents', () => {
    const order = createConfirmation([small], contact(), 'ELN-SAMPLE-01');
    expect(order).toEqual({
      orderId: 'ELN-SAMPLE-01',
      contact: { ...contact(), name: 'Renée D’Arcy' },
      lines: [
        {
          productId: 'citrus-veil',
          variantId: '250',
          name: 'Citrus Veil Wash',
          size: '250 ml',
          image: 'citrus-veil-250.webp',
          unitCents: 2400,
          quantity: 1
        }
      ],
      totals: {
        subtotalCents: 2400,
        deliveryCents: 450,
        totalCents: 2850,
        count: 1
      }
    });
    const large = createConfirmation(
      [{ ...small, variantId: '500' }],
      contact(),
      'ELN-SAMPLE-02'
    );
    expect(large.lines[0]).toMatchObject({
      size: '500 ml',
      image: 'citrus-veil-500.webp',
      unitCents: 3800
    });
    expect(large.totals).toEqual({
      subtotalCents: 3800,
      deliveryCents: 450,
      totalCents: 4250,
      count: 1
    });
  });

  it('keeps both sizes distinct and derives threshold and quantity totals from fixtures', () => {
    const twoSizes = createConfirmation(
      [small, { ...small, variantId: '500' }],
      contact(),
      'ELN-SAMPLE-03'
    );
    expect(twoSizes.lines.map((line) => line.size)).toEqual([
      '250 ml',
      '500 ml'
    ]);
    expect(twoSizes.totals).toEqual({
      subtotalCents: 6200,
      deliveryCents: 0,
      totalCents: 6200,
      count: 2
    });
    const threshold = createConfirmation(
      [small, { productId: 'quiet-dune', variantId: '150', quantity: 1 }],
      contact(),
      'ELN-SAMPLE-04'
    );
    expect(threshold.totals).toEqual({
      subtotalCents: 6000,
      deliveryCents: 0,
      totalCents: 6000,
      count: 2
    });
    const below = createConfirmation(
      [{ productId: 'amber-current', variantId: '200', quantity: 1 }],
      contact(),
      'ELN-SAMPLE-05'
    );
    expect(below.totals).toEqual({
      subtotalCents: 5800,
      deliveryCents: 450,
      totalCents: 6250,
      count: 1
    });
    expect(
      createConfirmation(
        [{ ...small, quantity: 2 }],
        contact(),
        'ELN-SAMPLE-06'
      ).totals
    ).toEqual({
      subtotalCents: 4800,
      deliveryCents: 450,
      totalCents: 5250,
      count: 2
    });
  });

  it('rejects empty, partially malformed, duplicate and unavailable bags without a partial order', () => {
    const invalidLines = [
      { ...small, productId: 'unknown' },
      { ...small, variantId: 'unknown' },
      { ...small, quantity: 0 },
      { ...small, quantity: -1 },
      { ...small, quantity: 1.5 },
      { ...small, quantity: 9 },
      { ...small, quantity: Number.MAX_SAFE_INTEGER },
      { ...small, quantity: NaN },
      { ...small, priceCents: 1 },
      { productId: 'stone-grain', variantId: '350', quantity: 1 },
      null
    ];
    for (const bag of [
      [],
      null,
      [small, small],
      ...invalidLines.map((line) => [small, line])
    ]) {
      expect(() =>
        createConfirmation(bag as readonly BagLine[], contact(), 'ELN-INVALID')
      ).toThrow();
    }
    expect(() =>
      createConfirmation([small], emptyContact(), 'ELN-INVALID')
    ).toThrow();
    expect(() => createConfirmation([small], contact(), '')).toThrow();
  });

  it('retains only copied contact fields and freezes the whole memory-only order', () => {
    const sourceContact = { ...contact(), extraPaymentField: 'never-copy' };
    const sourceBag = [{ ...small }];
    const order = createConfirmation(sourceBag, sourceContact, 'ELN-SAMPLE-07');
    sourceContact.name = 'Changed Person';
    sourceContact.email = 'changed@example.com';
    sourceContact.address = 'A different address';
    sourceBag[0]!.quantity = 7;
    sourceBag[0]!.variantId = '500';
    sourceBag.length = 0;
    expect(order.contact).toEqual({ ...contact(), name: 'Renée D’Arcy' });
    expect(order.contact).not.toHaveProperty('extraPaymentField');
    expect(order.lines[0]).toMatchObject({
      variantId: '250',
      unitCents: 2400,
      quantity: 1,
      size: '250 ml'
    });
    expect(order.totals.totalCents).toBe(2850);
    expect(Object.isFrozen(order)).toBe(true);
    expect(Object.isFrozen(order.contact)).toBe(true);
    expect(Object.isFrozen(order.lines)).toBe(true);
    expect(Object.isFrozen(order.lines[0])).toBe(true);
    expect(Object.isFrozen(order.totals)).toBe(true);
  });
});
