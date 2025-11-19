import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialState = {
  token: null,
  userType: null,
  tiendaId: null,
  expiresAt: null,
  isAuthenticated: false,
};

export const useTokenStore = create(
  persist(
    (set, get) => ({
      ...initialState,
      login: ({ token, userType, tiendaId = null, expiresIn }) => {
        const expiresAt = expiresIn ? Date.now() + expiresIn * 1000 : null;
        set({
          token,
          userType,
          tiendaId,
          expiresAt,
          isAuthenticated: true,
        });
      },
      logout: () => {
        set({ ...initialState });
        localStorage.removeItem('token-storage');
      },
      hasValidSession: () => {
        const { token, expiresAt } = get();
        if (!token) return false;
        if (expiresAt && expiresAt <= Date.now()) {
          return false;
        }
        return true;
      },
    }),
    {
      name: 'token-storage',
      partialize: (state) => ({
        token: state.token,
        userType: state.userType,
        tiendaId: state.tiendaId,
        expiresAt: state.expiresAt,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
