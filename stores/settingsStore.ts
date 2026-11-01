import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { createStorage } from '@/stores/storage';

export interface Settings {
  theme: 'system' | 'light' | 'dark';
  /** Only controls whether wrong entries are highlighted; mistakes are always counted. */
  showMistakes: boolean;
  autoEliminateNotes: boolean;
  haptics: boolean;
}

interface SettingsState {
  settings: Settings;
  update: (patch: Partial<Settings>) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: { theme: 'system', showMistakes: true, autoEliminateNotes: true, haptics: true },
      update: (patch) => set((state) => ({ settings: { ...state.settings, ...patch } })),
    }),
    {
      name: 'settings',
      version: 1,
      storage: createStorage<Pick<SettingsState, 'settings'>>(),
      partialize: ({ settings }) => ({ settings }),
    },
  ),
);
