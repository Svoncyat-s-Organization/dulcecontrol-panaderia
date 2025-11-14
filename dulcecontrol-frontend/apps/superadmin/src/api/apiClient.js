import axios from 'axios';
import { useTokenStore} from '../shared/store/tokenStore.js';

const API_URL = 'http://localhost:2250';

const apiClient = axios.create({
    baseURL: API_URL,
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
            useTokenStore.getState().logout();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default apiClient;