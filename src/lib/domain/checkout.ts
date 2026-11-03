import { getVariant } from './catalog';
import { totals, validateBag } from './bag';
import type { BagLine } from './types';

export interface ContactDraft {
  name: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}
export type ContactErrors = Partial<Record<keyof ContactDraft, string>>;
export const countries = [
  'Ireland',
  'Italy',
  'France',
  'Germany',
  'Spain',
  'Netherlands'
] as const;
export const emptyContact = (): ContactDraft => ({
  name: '',
  email: '',
  address: '',
  city: '',
  postalCode: '',
  country: ''
});

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function boundedText(
  value: unknown,
  minimum: number,
  maximum: number
): boolean {
  return (
    typeof value === 'string' &&
    value.trim().length >= minimum &&
    value.trim().length <= maximum
  );
}

// Supported unquoted address format only; no DNS or mailbox lookup.
function validEmail(raw: unknown): boolean {
  if (typeof raw !== 'string' || raw.length > 254) return false;
  const parts = raw.trim().split('@');
  if (parts.length !== 2) return false;
  const [local = '', domain = ''] = parts;
  if (
    local.length > 64 ||
    !/^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*$/.test(
      local
    )
  )
    return false;
  const labels = domain.split('.');
  return (
    labels.length >= 2 &&
    labels.every((label) =>
      /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?$/.test(label)
    ) &&
    /^[A-Za-z](?:[A-Za-z0-9-]*[A-Za-z0-9])$/.test(labels.at(-1) ?? '')
  );
}

export function validateContact(draft: ContactDraft): ContactErrors {
  const value: Record<string, unknown> = isRecord(draft) ? draft : {};
  const country = typeof value.country === 'string' ? value.country.trim() : '';
  const errors: ContactErrors = {};
  if (!boundedText(value.name, 2, 100))
    errors.name = 'Enter your name using 2 to 100 characters.';
  if (!validEmail(value.email))
    errors.email = 'Enter an email such as alex@example.com.';
  if (!boundedText(value.address, 4, 160))
    errors.address = 'Enter an address using 4 to 160 characters.';
  if (!boundedText(value.city, 1, 80))
    errors.city = 'Enter your city using up to 80 characters.';
  if (
    !boundedText(value.postalCode, 2, 16) ||
    typeof value.postalCode !== 'string' ||
    !/^[A-Za-z0-9][A-Za-z0-9 -]*[A-Za-z0-9]$/.test(value.postalCode.trim())
  )
    errors.postalCode =
      'Enter a postal code using 2 to 16 letters, numbers, spaces or hyphens.';
  if (!countries.some((option) => option === country))
    errors.country = 'Choose a destination from the list.';
  return errors;
}

export interface ConfirmationLine {
  readonly productId: string;
  readonly variantId: string;
  readonly name: string;
  readonly size: string;
  readonly image: string;
  readonly unitCents: number;
  readonly quantity: number;
}
export interface OrderConfirmation {
  readonly orderId: string;
  readonly contact: Readonly<ContactDraft>;
  readonly lines: readonly ConfirmationLine[];
  readonly totals: Readonly<ReturnType<typeof totals>>;
}

export function createConfirmation(
  bag: readonly BagLine[],
  contact: ContactDraft,
  orderId: string
): OrderConfirmation {
  if (Object.keys(validateContact(contact)).length)
    throw new Error('Check your delivery details before continuing.');
  const hasValidShape =
    Array.isArray(bag) &&
    bag.length > 0 &&
    bag.every(
      (line: unknown) =>
        isRecord(line) &&
        Object.keys(line).every((key) =>
          ['productId', 'variantId', 'quantity'].includes(key)
        ) &&
        typeof line.productId === 'string' &&
        typeof line.variantId === 'string' &&
        typeof line.quantity === 'number'
    );
  if (!hasValidShape || !validateBag(bag))
    throw new Error('Choose available items and quantities before continuing.');
  if (typeof orderId !== 'string' || !orderId.trim())
    throw new Error(
      'Your demo reference could not be created. Please try again.'
    );

  const lines = bag.map((line) => {
    const found = getVariant(line.productId, line.variantId)!;
    return Object.freeze({
      productId: line.productId,
      variantId: line.variantId,
      name: found.product.name,
      size: found.variant.size,
      image: found.variant.image,
      unitCents: found.variant.priceCents,
      quantity: line.quantity
    });
  });
  const copiedContact: Readonly<ContactDraft> = Object.freeze({
    name: contact.name.trim(),
    email: contact.email.trim(),
    address: contact.address.trim(),
    city: contact.city.trim(),
    postalCode: contact.postalCode.trim(),
    country: contact.country.trim()
  });
  return Object.freeze({
    orderId: orderId.trim(),
    contact: copiedContact,
    lines: Object.freeze(lines),
    totals: Object.freeze(totals(bag))
  });
}
