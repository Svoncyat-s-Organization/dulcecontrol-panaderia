import axios from 'axios';
import { useTokenStore} from '../shared/store/tokenStore.js';
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