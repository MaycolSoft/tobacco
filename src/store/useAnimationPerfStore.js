import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ANIMATION_PERF_DEFAULTS, normalizePerfConfig } from '@/config/animationPerformance';

// Ajustes internos de rendimiento de ScrollVideo (los edita LayoutControlPanel).
export const useAnimationPerfStore = create(
  persist(
    (set) => ({
      config: { ...ANIMATION_PERF_DEFAULTS },
      updateConfig: (patch) => set((state) => ({ config: normalizePerfConfig({ ...state.config, ...patch }) })),
      resetConfig: () => set({ config: { ...ANIMATION_PERF_DEFAULTS } }),
    }),
    {
      name: 'tamborilero-animation-perf',
      // v4: defaults actuales de animationPerformance.js (se descartan ajustes guardados de versiones previas).
      version: 4,
      migrate: () => ({ config: { ...ANIMATION_PERF_DEFAULTS } }),
      partialize: (state) => ({ config: state.config }),
      // Los valores guardados se combinan con los defaults actuales (claves nuevas incluidas).
      merge: (persisted, current) => ({ ...current, config: normalizePerfConfig(persisted?.config) }),
    }
  )
);
