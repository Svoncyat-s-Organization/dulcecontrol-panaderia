import axios from 'axios';
import { useTokenStore } from '../shared/store/tokenStore.js';
import { useSedeStore } from '../shared/store/sedeStore.js';
import { getApiUrl } from '../config/api.config.js';

const apiClient = axios.create({
    baseURL: getApiUrl(),
    headers: {
        'Content-Type': 'application/json',
    }
});

apiClient.interceptors.request.use(
    (config) => {
        const token = useTokenStore.getState().token;
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        const sedeId = useSedeStore.getState().selectedSedeId;
        if (sedeId) {
            config.headers['X-Sede-Id'] = sedeId;
        } else if (config.headers['X-Sede-Id']) {
            delete config.headers['X-Sede-Id'];
        }
        return config;
    }
);

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            const { token, userType, logout } = useTokenStore.getState();
            if (token) {
                const loginPath = userType === 'SUPERADMIN' ? '/superadmin/login' : '/admin/login';
                logout();
                if (window.location.pathname !== loginPath) {
                    window.location.href = loginPath;
                }
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;