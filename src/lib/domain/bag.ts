import { getVariant } from './catalog';
import type { BagLine, Result } from './types';
export const STANDARD_DELIVERY_CENTS = 450;
export const FREE_DELIVERY_THRESHOLD_CENTS = 6000;
export const money = (cents: number) =>
  new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(
    cents / 100
  );
export const lineKey = (line: Pick<BagLine, 'productId' | 'variantId'>) =>
  `${line.productId}:${line.variantId}`;
export function validateBag(lines: readonly BagLine[]): boolean {
  if (lines.length > 16) return false;
  const seen = new Set<string>();
  for (const l of lines) {
    const found = getVariant(l.productId, l.variantId);
    if (
      !found ||
      !Number.isSafeInteger(l.quantity) ||
      l.quantity < 1 ||
      l.quantity > found.variant.stock ||
      seen.has(lineKey(l))
    )
      return false;
    seen.add(lineKey(l));
  }
  return true;
}
export function addLines(
  bag: readonly BagLine[],
  incoming: readonly BagLine[]
): Result<BagLine[]> {
  if (!validateBag(bag) || !incoming.length)
    return {
      ok: false,
      error: incoming.length
        ? 'Your bag needs to be reset before adding items.'
        : 'Choose at least one item first.'
    };
  const next = bag.map((l) => ({ ...l }));
  for (const item of incoming) {
    const found = getVariant(item.productId, item.variantId);
    if (!found || !Number.isSafeInteger(item.quantity) || item.quantity < 1)
      return {
        ok: false,
        error: 'One of these choices is no longer available.'
      };
    const existing = next.find((l) => lineKey(l) === lineKey(item));
    const quantity = (existing?.quantity ?? 0) + item.quantity;
    if (quantity > found.variant.stock)
      return {
        ok: false,
        error: `Only ${found.variant.stock} of ${found.product.name}, ${found.variant.size}, are available in this demo. Your bag has not changed.`
      };
    if (existing) existing.quantity = quantity;
    else next.push({ ...item });
  }
  return { ok: true, value: next };
}
export function setQuantity(
  bag: readonly BagLine[],
  key: string,
  quantity: number
): Result<BagLine[]> {
  if (!validateBag(bag) || !bag.some((line) => lineKey(line) === key))
    return { ok: false, error: 'That item is no longer in your bag.' };
  if (!Number.isSafeInteger(quantity) || quantity < 0)
    return { ok: false, error: 'Choose a whole quantity.' };
  const next =
    quantity === 0
      ? bag.filter((l) => lineKey(l) !== key)
      : bag.map((l) => (lineKey(l) === key ? { ...l, quantity } : { ...l }));
  return validateBag(next)
    ? { ok: true, value: next }
    : { ok: false, error: 'That quantity is not available.' };
}
export function totals(bag: readonly BagLine[]) {
  if (!validateBag(bag)) throw Error('Invalid bag');
  const subtotalCents = bag.reduce(
    (n, l) =>
      n + getVariant(l.productId, l.variantId)!.variant.priceCents * l.quantity,
    0
  );
  const deliveryCents =
    subtotalCents === 0 || subtotalCents >= FREE_DELIVERY_THRESHOLD_CENTS
      ? 0
      : STANDARD_DELIVERY_CENTS;
  return {
    subtotalCents,
    deliveryCents,
    totalCents: subtotalCents + deliveryCents,
    count: bag.reduce((n, l) => n + l.quantity, 0)
  };
}
