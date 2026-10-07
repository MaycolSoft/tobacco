import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Pasos de la mesa de composición. El paso 04 solo existe cuando la mezcla está completa.
export const BLEND_STEPS = [
  { key: 'TRIPA', number: '01', labelKey: 'craft:steps.TRIPA', min: 2, max: 5, multi: true },
  { key: 'CAPOTE', number: '02', labelKey: 'craft:steps.CAPOTE', min: 1, max: 1, multi: false },
  { key: 'CAPA', number: '03', labelKey: 'craft:steps.CAPA', min: 1, max: 1, multi: false },
];
export const RESULT_STEP = { key: 'RESULT', number: '04', labelKey: 'craft:steps.RESULT' };

const emptySelections = () => ({ TRIPA: [], CAPOTE: [], CAPA: [] });

export const isStepComplete = (step, selections) => {
  const count = selections[step.key]?.length ?? 0;
  return count >= step.min && count <= step.max;
};
export const isBlendComplete = selections => BLEND_STEPS.every(step => isStepComplete(step, selections));

// Explica siempre qué puede hacer la persona después de cada selección.
export const getStepMessage = (step, count, t) => {
  const options = { count, min: step.min, max: step.max, remaining: (count < step.min ? step.min : step.max) - count };
  if (!step.multi) return t(`craft:selection.${step.key}.${count ? 'ready' : 'empty'}`, options);
  const state = count === 0 ? 'empty' : count < step.min ? 'insufficient' : count < step.max ? 'ready' : 'maximum';
  return t(`craft:selection.TRIPA.${state}`, options);
};

// La mezcla se conserva durante la sesión para poder consultar la biblioteca o la guía sin perderla.
export const useBlendStore = create(
  persist(
    (set, get) => ({
      selections: emptySelections(),
      stepIndex: 0,
      loadedBlend: null,

      setStep: stepIndex => set({ stepIndex }),

      toggleLeaf: (category, leafId) => {
        const step = BLEND_STEPS.find(item => item.key === category);
        const current = get().selections[category];
        let next;
        if (current.includes(leafId)) next = current.filter(id => id !== leafId);
        else if (!step.multi) next = [leafId];
        else if (current.length >= step.max) return;
        else next = [...current, leafId];
        set({ selections: { ...get().selections, [category]: next } });
      },

      // Añade una hoja desde otra página. Devuelve false si la tripa ya está completa.
      addLeaf: leaf => {
        const step = BLEND_STEPS.find(item => item.key === leaf.category);
        if (!step) return false;
        const current = get().selections[leaf.category];
        const stepIndex = BLEND_STEPS.indexOf(step);
        if (current.includes(leaf.id)) { set({ stepIndex }); return true; }
        if (step.multi && current.length >= step.max) return false;
        set({ selections: { ...get().selections, [leaf.category]: step.multi ? [...current, leaf.id] : [leaf.id] }, stepIndex });
        return true;
      },

      loadBlend: blend => set({
        selections: { TRIPA: [...blend.leaves.TRIPA], CAPOTE: [blend.leaves.CAPOTE], CAPA: [blend.leaves.CAPA] },
        loadedBlend: { id: blend.id, name: blend.name },
        stepIndex: 0,
      }),
      clearLoadedBlend: () => set({ loadedBlend: null }),
      reset: () => set({ selections: emptySelections(), stepIndex: 0, loadedBlend: null }),
    }),
    {
      name: 'tamboril-blend',
      storage: createJSONStorage(() => sessionStorage),
      partialize: ({ selections, stepIndex }) => ({ selections, stepIndex }),
    },
  ),
);
