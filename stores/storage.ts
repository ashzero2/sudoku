import { createMMKV } from 'react-native-mmkv';
import { createJSONStorage, type StateStorage } from 'zustand/middleware';

const mmkv = createMMKV();

const backend: StateStorage = {
  getItem: (name) => mmkv.getString(name) ?? null,
  setItem: (name, value) => mmkv.set(name, value),
  removeItem: (name) => mmkv.remove(name),
};

export function createStorage<State>() {
  return createJSONStorage<State>(() => backend);
}
