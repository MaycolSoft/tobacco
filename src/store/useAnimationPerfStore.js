import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ANIMATION_PERF_DEFAULTS, normalizePerfConfig } from '@/config/animationPerformance';

// Ajustes internos de rendimiento de ScrollVideo (los edita LayoutControlPanel).
export const useAnimationPerfStore = create(
  persist(
    (set) => ({
      config: { ...ANIMATION_PERF_DEFAULTS },
      variantJob: null,
      setVariantJob: (variantJob) => set({ variantJob }),
      updateConfig: (patch) => set((state) => ({ config: normalizePerfConfig({ ...state.config, ...patch }) })),
      selectFrameVariant: (source, profile) => set((state) => ({
        config: normalizePerfConfig({ ...state.config, frameVariants: { ...state.config.frameVariants, [source]: profile } }),
      })),
      clearFrameVariant: (source) => set((state) => {
        const frameVariants = { ...state.config.frameVariants };
        delete frameVariants[source];
        return { config: { ...state.config, frameVariants } };
      }),
      removeFrameVariant: (folder) => set((state) => ({
        config: { ...state.config, frameVariants: Object.fromEntries(
          Object.entries(state.config.frameVariants).filter(([, profile]) => profile.folder !== folder)
        ) },
      })),
      resetConfig: () => set({ config: { ...ANIMATION_PERF_DEFAULTS } }),
    }),
    {
      name: 'tamborilero-animation-perf',
      // v4: defaults actuales de animationPerformance.js (se descartan ajustes guardados de versiones previas).
      version: 4,
      migrate: () => ({ config: { ...ANIMATION_PERF_DEFAULTS } }),
      partialize: (state) => ({ config: state.config, variantJob: state.variantJob }),
      // Los valores guardados se combinan con los defaults actuales (claves nuevas incluidas).
      merge: (persisted, current) => ({
        ...current,
        config: normalizePerfConfig(persisted?.config),
        variantJob: persisted?.variantJob?.id && typeof persisted.variantJob.status === 'string' ? persisted.variantJob : null,
      }),
    }
  )
);
