import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useTokenStore = create(
    persist(
        (set) => ({
            token: null,
            user: null,
            isAuthenticated: false,
            login: (token, user) => set({ token, user, isAuthenticated: true }),
            logout: () => {
                set({ token: null, user: null, isAuthenticated: false });
                localStorage.removeItem('token-storage');
            },
            setUser: (user) => set({ user }),
        }),
        {
            name: 'token-storage',
        }
    )
);