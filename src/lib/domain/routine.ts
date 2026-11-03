import { products, getVariant } from './catalog';
import { addLines } from './bag';
import type {
  BagLine,
  Preferences,
  RoutineChoice,
  RoutineSlot,
  Result,
  Product
} from './types';
export const routineSlots: readonly RoutineSlot[] = [
  'cleanse',
  'body',
  'hands'
];
export const defaultPreferences = (): Preferences => ({
  daypart: 'morning',
  texture: 'light',
  fragrance: 'fragranced'
});
export function validPreferences(v: unknown): v is Preferences {
  if (typeof v !== 'object' || v === null) return false;
  return (
    'daypart' in v &&
    (v.daypart === 'morning' || v.daypart === 'evening') &&
    'texture' in v &&
    (v.texture === 'light' || v.texture === 'rich') &&
    'fragrance' in v &&
    (v.fragrance === 'fragranced' || v.fragrance === 'unfragranced')
  );
}
export function validateRoutine(choices: readonly RoutineChoice[]): boolean {
  if (choices.length > 3) return false;
  const seen = new Set<RoutineSlot>();
  for (const c of choices) {
    const found = getVariant(c.productId, c.variantId);
    if (
      !routineSlots.includes(c.slot) ||
      seen.has(c.slot) ||
      !found ||
      found.product.slot !== c.slot ||
      found.variant.stock < 1
    )
      return false;
    seen.add(c.slot);
  }
  return true;
}
function score(p: Product, prefs: Preferences) {
  const fragranceMatch =
    (p.scent === 'Unfragranced') === (prefs.fragrance === 'unfragranced');
  const textureMatch = p.texture.toLowerCase() === prefs.texture;
  return (
    (fragranceMatch ? 20 : 0) +
    (textureMatch ? 8 : 0) +
    (p.preferred === prefs.daypart ? 3 : 0) +
    (p.dayparts.includes(prefs.daypart) ? 2 : 0)
  );
}
export function recommend(prefs: Preferences): RoutineChoice[] {
  return routineSlots.flatMap((slot) => {
    const p = products
      .filter((p) => p.slot === slot && p.variants.some((v) => v.stock > 0))
      .sort((a, b) => score(b, prefs) - score(a, prefs))[0];
    const v = p?.variants.find((v) => v.stock > 0);
    return p && v ? [{ slot, productId: p.id, variantId: v.id }] : [];
  });
}
export function explain(choice: RoutineChoice, prefs: Preferences): string {
  const found = getVariant(choice.productId, choice.variantId);
  if (!found) return 'Choose an available product.';
  const p = found.product;
  const fragrance =
    (p.scent === 'Unfragranced') === (prefs.fragrance === 'unfragranced');
  const parts = [
    p.dayparts.includes(prefs.daypart)
      ? `Fits your ${prefs.daypart} timing.`
      : `An alternative timing: this fixture is tagged for ${p.dayparts.join(' and ')}.`
  ];
  parts.push(
    fragrance
      ? p.scent === 'Unfragranced'
        ? 'An unfragranced choice.'
        : `${p.scent} notes match your fragranced preference.`
      : `A fragrance alternative: ${p.scent.toLowerCase()}.`
  );
  if (choice.slot === 'body') {
    if (p.texture.toLowerCase() === prefs.texture)
      parts.push(`A ${prefs.texture} texture, as requested.`);
    else if (prefs.fragrance === 'unfragranced' && prefs.texture === 'light')
      parts.push(
        'There is no exact unfragranced light body option in this collection. This richer balm is the closest available unfragranced alternative.'
      );
    else
      parts.push(
        `A texture alternative: ${p.texture.toLowerCase()}, rather than ${prefs.texture}.`
      );
  }
  return parts.join(' ');
}
export function routineTotal(choices: readonly RoutineChoice[]): number {
  if (!validateRoutine(choices)) throw Error('Invalid routine');
  return choices.reduce(
    (n, c) => n + getVariant(c.productId, c.variantId)!.variant.priceCents,
    0
  );
}
export function addRoutine(
  bag: readonly BagLine[],
  choices: readonly RoutineChoice[]
): Result<BagLine[]> {
  if (!choices.length)
    return { ok: false, error: 'Add at least one choice to your ritual.' };
  if (!validateRoutine(choices))
    return {
      ok: false,
      error:
        'One of your ritual choices is unavailable. Your bag has not changed.'
    };
  return addLines(
    bag,
    choices.map((c) => ({
      productId: c.productId,
      variantId: c.variantId,
      quantity: 1
    }))
  );
}
