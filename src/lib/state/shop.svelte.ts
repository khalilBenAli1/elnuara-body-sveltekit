import { getContext, setContext } from 'svelte';
import { addLines, setQuantity, totals } from '../domain/bag';
import { addRoutine, recommend, validateRoutine } from '../domain/routine';
import type { Preferences, RoutineChoice, SavedState } from '../domain/types';
import {
  initialState,
  loadState,
  saveState,
  resetState,
  type StoragePort
} from '../adapters/persistence';
export class Shop {
  state = $state<SavedState>(initialState());
  storageStatus = $state<'ready' | 'corrupt' | 'blocked'>('ready');
  loaded = $state(false);
  message = $state('');
  error = $state('');
  private storage?: StoragePort;
  get bag() {
    return this.state.bag;
  }
  get preferences() {
    return this.state.preferences;
  }
  get routine() {
    return this.state.routine;
  }
  get totals() {
    return totals(this.bag);
  }
  hydrate(storage: StoragePort) {
    this.storage = storage;
    const loaded = loadState(storage);
    this.state = loaded.state;
    this.storageStatus = loaded.status;
    this.loaded = true;
  }
  blocked() {
    this.storageStatus = 'blocked';
    this.loaded = true;
  }
  private persist() {
    if (this.storageStatus === 'corrupt') return;
    if (!this.storage || !saveState(this.storage, $state.snapshot(this.state)))
      this.storageStatus = 'blocked';
  }
  private commit(state: SavedState, message: string) {
    this.state = state;
    this.message = message;
    this.error = '';
    this.persist();
  }
  add(productId: string, variantId: string, quantity: number) {
    const result = addLines(this.bag, [{ productId, variantId, quantity }]);
    if (!result.ok) {
      this.error = result.error;
      return false;
    }
    this.commit({ ...this.state, bag: result.value }, 'Added to your bag.');
    return true;
  }
  quantity(key: string, quantity: number) {
    const result = setQuantity(this.bag, key, quantity);
    if (!result.ok) {
      this.error = result.error;
      return false;
    }
    this.commit(
      { ...this.state, bag: result.value },
      quantity ? 'Bag updated.' : 'Item removed.'
    );
    return true;
  }
  preferencesChange(patch: Partial<Preferences>) {
    const preferences = { ...this.preferences, ...patch };
    this.commit(
      { ...this.state, preferences, routine: recommend(preferences) },
      'Your ritual suggestions have been refreshed.'
    );
  }
  setRoutine(routine: RoutineChoice[]) {
    if (!validateRoutine(routine)) {
      this.error = 'Choose available sizes for your ritual.';
      return false;
    }
    this.commit({ ...this.state, routine }, 'Your ritual has been updated.');
    return true;
  }
  addRitual() {
    const result = addRoutine(this.bag, this.routine);
    if (!result.ok) {
      this.error = result.error;
      return false;
    }
    this.commit(
      { ...this.state, bag: result.value },
      'Your ritual has been added to the bag.'
    );
    return true;
  }
  restoreRoutine() {
    this.commit(
      { ...this.state, routine: recommend(this.preferences) },
      'Suggested ritual restored.'
    );
  }
  clearBag() {
    this.commit({ ...this.state, bag: [] }, 'Bag cleared.');
  }
  reset() {
    this.state = initialState();
    this.error = '';
    this.message = 'Your saved bag and ritual have been reset.';
    this.storageStatus =
      this.storage && resetState(this.storage) ? 'ready' : 'blocked';
  }
}
const CONTEXT = Symbol('elnuara-shop');
export function createShop() {
  const shop = new Shop();
  setContext(CONTEXT, shop);
  return shop;
}
export function useShop(): Shop {
  return getContext<Shop>(CONTEXT);
}
