import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialState = {
  selectedSedeId: null,
  selectedSedeNombre: null,
  selectedTiendaId: null,
  lastUpdatedAt: null,
};

export const useSedeStore = create(
  persist(
    (set) => ({
      ...initialState,
      setSelectedSede: ({ sedeId, sedeNombre, tiendaId }) => {
        if (!sedeId) {
          set({ ...initialState });
          return;
        }
        set({
          selectedSedeId: sedeId,
          selectedSedeNombre: sedeNombre ?? null,
          selectedTiendaId: tiendaId ?? null,
          lastUpdatedAt: Date.now(),
        });
      },
      clearSelection: () => set({ ...initialState }),
    }),
    {
      name: 'sede-storage',
      partialize: (state) => ({
        selectedSedeId: state.selectedSedeId,
        selectedSedeNombre: state.selectedSedeNombre,
        selectedTiendaId: state.selectedTiendaId,
      }),
    }
  )
);
