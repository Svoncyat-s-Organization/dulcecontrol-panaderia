import { create } from 'zustand';

const initialState = {
  permissions: null,
  role: null,
  usuario: null,
  isLoading: false,
};

export const useAuthorizationStore = create((set) => ({
  ...initialState,
  setLoading: (isLoading) => set(() => ({ isLoading })),
  setContext: (context = {}) =>
    set((state) => ({
      permissions: context.permissions !== undefined ? context.permissions : state.permissions,
      role: context.role !== undefined ? context.role : state.role,
      usuario: context.usuario !== undefined ? context.usuario : state.usuario,
    })),
  reset: () => set(() => ({ ...initialState })),
}));
