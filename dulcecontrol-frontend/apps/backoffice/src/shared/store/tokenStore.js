import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useSedeStore } from './sedeStore.js';
import { parseJwt } from '../utils/jwtUtils.js';

const initialState = {
    token: null,
    userType: null,
    tiendaId: null,
    expiresAt: null,
    isAuthenticated: false,
    panelRoleHint: null,
    user: null,
};

export const useTokenStore = create(
    persist(
        (set, get) => ({
            ...initialState,
            login: ({ token, userType, tiendaId = null, expiresIn }) => {
                const expiresAt = expiresIn ? Date.now() + expiresIn * 1000 : null;
                const { selectedTiendaId, clearSelection } = useSedeStore.getState();
                if (selectedTiendaId && tiendaId !== selectedTiendaId) {
                    clearSelection();
                }
                const userClaims = parseJwt(token);
                set({
                    token,
                    userType,
                    tiendaId,
                    expiresAt,
                    isAuthenticated: true,
                    panelRoleHint: null,
                    user: userClaims,
                });
            },
            logout: () => {
                set({ ...initialState });
                localStorage.removeItem('token-storage');
                useSedeStore.getState().clearSelection();
            },
            setPanelRoleHint: (role) => {
                set({ panelRoleHint: role });
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
                user: state.user,
            }),
        }
    )
);