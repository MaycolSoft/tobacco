import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useLayoutStore = create(
  persist(
    (set, get) => ({
      // Aquí solo guardaremos { "/ruta": { showNavbar: true, ... } }
      pagesConfig: {},

      // Estado dinámico (NO persistente para el Icono)
      currentConfig: {
        showNavbar: true,
        showFooter: true,
        showHeader: true,
        navbarSticky: false,
        headerData: { title: '', subtitle: '', icon: null } // Se llena al cargar
      },

      loadPageConfig: (path, defaultConfig) => {
        const savedSettings = get().pagesConfig[path] || {};
        
        // Combinamos: La info visual del archivo config + los switches del localStorage
        set({
          currentConfig: {
            ...defaultConfig, // Trae title, subtitle e icon reales (funciones)
            ...savedSettings, // Sobrescribe showNavbar, showHeader, etc.
            headerData: {
              title: defaultConfig.title || '',
              subtitle: defaultConfig.subtitle || '',
              icon: defaultConfig.icon || null
            }
          }
        });
      },

      updateCurrentConfig: (path, newFields) => {
        set((state) => {
          const updatedConfig = { ...state.currentConfig, ...newFields };
          
          // Solo persistimos los flags de visibilidad, NO el headerData (que tiene el icono)
          const settingsToPersist = {
            showNavbar: updatedConfig.showNavbar,
            showFooter: updatedConfig.showFooter,
            showHeader: updatedConfig.showHeader,
            navbarSticky: updatedConfig.navbarSticky,
          };

          return {
            currentConfig: updatedConfig,
            pagesConfig: {
              ...state.pagesConfig,
              [path]: settingsToPersist
            }
          };
        });
      },

      toggleNavbar: (path) => get().updateCurrentConfig(path, { showNavbar: !get().currentConfig.showNavbar }),
      toggleFooter: (path) => get().updateCurrentConfig(path, { showFooter: !get().currentConfig.showFooter }),
      toggleHeader: (path) => get().updateCurrentConfig(path, { showHeader: !get().currentConfig.showHeader }),
      toggleNavbarSticky: (path) => get().updateCurrentConfig(path, { navbarSticky: !get().currentConfig.navbarSticky }),
    }),
    {
      name: 'tamborilero-layout-storage',
      // OPCIONAL: Filtramos para que SOLO se guarde pagesConfig en el storage
      partialize: (state) => ({ pagesConfig: state.pagesConfig }),
    }
  )
);