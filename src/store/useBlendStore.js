import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Pasos de la mesa de composición. El paso 04 solo existe cuando la mezcla está completa.
export const BLEND_STEPS = [
  { key: 'TRIPA', number: '01', label: 'Tripa', min: 2, max: 5, multi: true },
  { key: 'CAPOTE', number: '02', label: 'Capote', min: 1, max: 1, multi: false },
  { key: 'CAPA', number: '03', label: 'Capa', min: 1, max: 1, multi: false },
];
export const RESULT_STEP = { key: 'RESULT', number: '04', label: 'Tu cigarro' };

const emptySelections = () => ({ TRIPA: [], CAPOTE: [], CAPA: [] });

export const isStepComplete = (step, selections) => {
  const count = selections[step.key]?.length ?? 0;
  return count >= step.min && count <= step.max;
};
export const isBlendComplete = selections => BLEND_STEPS.every(step => isStepComplete(step, selections));

// Explica siempre qué puede hacer la persona después de cada selección.
export const getStepMessage = (step, count) => {
  const name = step.label.toLowerCase();
  if (!step.multi) return count ? `Hoja de ${name} seleccionada · Puedes continuar o elegir otra.` : `Selecciona una hoja de ${name}.`;
  if (count === 0) return `Selecciona entre ${step.min} y ${step.max} hojas de ${name}.`;
  if (count < step.min) return `${count} hoja seleccionada · Añade al menos ${step.min - count === 1 ? 'una más' : `${step.min - count} más`}.`;
  if (count < step.max) return `${count} hojas seleccionadas · Puedes continuar o añadir hasta ${step.max - count} más.`;
  return `${count} hojas seleccionadas · Has alcanzado el máximo.`;
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
        loadedBlend: blend.name,
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
