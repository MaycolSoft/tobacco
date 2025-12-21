import { create } from 'zustand';

export const useLayoutStore = create((set) => ({
  isVisualExperience: false,
  setVisualExperience: (value) => set({ isVisualExperience: value }),
}));