import type { SavedState, BagLine, RoutineChoice } from '../domain/types';
import { validateBag } from '../domain/bag';
import {
  defaultPreferences,
  recommend,
  validPreferences,
  validateRoutine
} from '../domain/routine';
export const STORAGE_KEY = 'elnuara.body.state.v1';
export const STORAGE_LIMIT = 16000;
export interface StoragePort {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}
export const initialState = (): SavedState => {
  const preferences = defaultPreferences();
  return { version: 1, bag: [], routine: recommend(preferences), preferences };
};
const record = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);
const keys = (v: Record<string, unknown>, expected: string[]) =>
  Object.keys(v).length === expected.length &&
  expected.every((k) => Object.hasOwn(v, k));
export function parseState(raw: string): SavedState {
  if (new TextEncoder().encode(raw).byteLength > STORAGE_LIMIT)
    throw Error('Saved data is too large.');
  const value: unknown = JSON.parse(raw);
  if (
    !record(value) ||
    !keys(value, ['version', 'bag', 'routine', 'preferences']) ||
    value.version !== 1 ||
    !Array.isArray(value.bag) ||
    !Array.isArray(value.routine) ||
    !record(value.preferences) ||
    !keys(value.preferences, ['daypart', 'texture', 'fragrance']) ||
    !validPreferences(value.preferences)
  )
    throw Error('Unsupported saved data.');
  const bag: BagLine[] = value.bag.map((v: unknown) => {
    if (
      !record(v) ||
      !keys(v, ['productId', 'variantId', 'quantity']) ||
      typeof v.productId !== 'string' ||
      typeof v.variantId !== 'string' ||
      typeof v.quantity !== 'number'
    )
      throw Error('Invalid saved bag.');
    return {
      productId: v.productId,
      variantId: v.variantId,
      quantity: v.quantity
    };
  });
  const routine: RoutineChoice[] = value.routine.map((v: unknown) => {
    if (
      !record(v) ||
      !keys(v, ['slot', 'productId', 'variantId']) ||
      (v.slot !== 'cleanse' && v.slot !== 'body' && v.slot !== 'hands') ||
      typeof v.productId !== 'string' ||
      typeof v.variantId !== 'string'
    )
      throw Error('Invalid saved ritual.');
    return { slot: v.slot, productId: v.productId, variantId: v.variantId };
  });
  if (!validateBag(bag) || !validateRoutine(routine))
    throw Error('Saved choices are unavailable.');
  return { version: 1, bag, routine, preferences: { ...value.preferences } };
}
export function loadState(storage: StoragePort): {
  state: SavedState;
  status: 'ready' | 'corrupt' | 'blocked';
} {
  let raw: string | null;
  try {
    raw = storage.getItem(STORAGE_KEY);
  } catch {
    return { state: initialState(), status: 'blocked' };
  }
  if (raw === null) return { state: initialState(), status: 'ready' };
  try {
    return { state: parseState(raw), status: 'ready' };
  } catch {
    return { state: initialState(), status: 'corrupt' };
  }
}
export function saveState(storage: StoragePort, state: SavedState): boolean {
  try {
    const json = JSON.stringify(state);
    parseState(json);
    storage.setItem(STORAGE_KEY, json);
    return true;
  } catch {
    return false;
  }
}
export function resetState(storage: StoragePort): boolean {
  try {
    storage.removeItem(STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}
