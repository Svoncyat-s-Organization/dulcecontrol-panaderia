import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useSedeStore } from './sedeStore.js';
import { useAuthorizationStore } from './authorizationStore.js';
import { parseJwt } from '../utils/jwtUtils.js';

const initialState = {
    token: null,
    userType: null,
    tiendaId: null,
    expiresAt: null,
    isAuthenticated: false,
    panelRoleHint: null,
    user: null,
    subscription: null,
};

export const useTokenStore = create(
    persist(
        (set, get) => ({
            ...initialState,
            login: ({ token, userType, tiendaId = null, expiresIn, userId, subscription = null }) => {
                const expiresAt = expiresIn ? Date.now() + expiresIn * 1000 : null;
                const { selectedTiendaId, clearSelection } = useSedeStore.getState();
                useAuthorizationStore.getState().reset();
                if (selectedTiendaId && tiendaId !== selectedTiendaId) {
                    clearSelection();
                }
                const userClaims = parseJwt(token) || {};
                // Merge claims with explicit userId if provided
                const resolvedUserId = typeof userId === 'number' ? userId : userClaims?.id;
                const user = {
                    ...userClaims,
                    id: resolvedUserId,
                };

                set({
                    token,
                    userType,
                    tiendaId,
                    expiresAt,
                    isAuthenticated: true,
                    panelRoleHint: null,
                    user,
                    subscription,
                });
            },
            logout: () => {
                set({ ...initialState });
                localStorage.removeItem('token-storage');
                useSedeStore.getState().clearSelection();
                useAuthorizationStore.getState().reset();
            },
            setPanelRoleHint: (role) => {
                set({ panelRoleHint: role });
            },
            setSubscription: (nextSubscription) => {
                set({ subscription: nextSubscription });
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
                subscription: state.subscription,
            }),
        }
    )
);