import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * Store global para manejar autenticación del cliente
 */
export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      tiendaId: null,
      isAuthenticated: false,

      setAuth: (authData) => set({
        token: authData.token,
        user: {
          id: authData.userId,
          type: authData.userType,
        },
        tiendaId: authData.tiendaId,
        isAuthenticated: true,
      }),

      logout: () => set({
        token: null,
        user: null,
        tiendaId: null,
        isAuthenticated: false,
      }),
    }),
    {
      name: 'storefront-auth',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
