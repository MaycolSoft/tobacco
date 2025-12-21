import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      expiry: null,

      login: (username, password) => {
        // Simulación de validación hardcoded
        if (username === 'admin' && password === '1234') {
          const oneDay = Date.now() + 24 * 60 * 60 * 1000;
          
          set({ 
            user: { username, role: 'admin' },
            token: 'fake-jwt-token-sequence',
            expiry: oneDay 
          });
          return true;
        }
        return false;
      },

      logout: () => {
        set({ user: null, token: null, expiry: null });
      },

      checkSession: () => {
        const { expiry } = get();
        if (expiry && Date.now() > expiry) {
          set({ user: null, token: null, expiry: null });
          return false;
        }
        return !!get().user;
      },
    }),
    {
      name: 'auth-storage', // Nombre de la llave en LocalStorage
    }
  )
);