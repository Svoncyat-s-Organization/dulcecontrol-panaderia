import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import { ENDPOINTS, getApiUrl } from '../../config/api.config.js';

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (correo, contrasena) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(`${getApiUrl()}${ENDPOINTS.AUTH_LOGIN}`, {
            correo,
            contrasena,
          });

          const { token, ...userData } = response.data;

          set({
            token,
            user: userData,
            isAuthenticated: true,
            isLoading: false,
          });

          // Configurar el token en axios para futuras peticiones (opcional, pero recomendado)
          // axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        } catch (error) {
          set({
            error: error.response?.data?.message || 'Error al iniciar sesión',
            isLoading: false,
            isAuthenticated: false,
            token: null,
            user: null,
          });
          throw error;
        }
      },

      logout: () => {
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },
    }),
    {
      name: 'auth-storage', // nombre para localStorage
      partialize: (state) => ({ token: state.token, user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
