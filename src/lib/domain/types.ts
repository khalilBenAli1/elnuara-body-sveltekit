export const categories = [
  'Wash',
  'Lotion',
  'Oil',
  'Scrub',
  'Hand care'
] as const;
export const scents = ['Citrus', 'Herbal', 'Woods', 'Unfragranced'] as const;
export type Category = (typeof categories)[number];
export type Scent = (typeof scents)[number];
export type Texture = 'Gel' | 'Light' | 'Rich' | 'Oil' | 'Grain' | 'Cream';
export type Daypart = 'morning' | 'evening';
export type RoutineSlot = 'cleanse' | 'body' | 'hands';
export interface Variant {
  readonly id: string;
  readonly size: string;
  readonly priceCents: number;
  readonly stock: number;
  readonly image: string;
}
export interface Product {
  readonly id: string;
  readonly name: string;
  readonly category: Category;
  readonly type: string;
  readonly scent: Scent;
  readonly texture: Texture;
  readonly dayparts: readonly Daypart[];
  readonly preferred: Daypart | 'both';
  readonly slot: RoutineSlot | 'polish';
  readonly packaging: string;
  readonly variants: readonly Variant[];
  readonly story: string;
  readonly feel: string;
  readonly materialNote: string;
}
export interface BagLine {
  productId: string;
  variantId: string;
  quantity: number;
}
export interface RoutineChoice {
  slot: RoutineSlot;
  productId: string;
  variantId: string;
}
export interface Preferences {
  daypart: Daypart;
  texture: 'light' | 'rich';
  fragrance: 'fragranced' | 'unfragranced';
}
export interface SavedState {
  version: 1;
  bag: BagLine[];
  routine: RoutineChoice[];
  preferences: Preferences;
}
export type Result<T> = { ok: true; value: T } | { ok: false; error: string };
