import apiClient from '../../../api/apiClient.js';
import { ENDPOINTS } from '../../../config/api.config.js';

export const loginSuperadmin = async ({ email, password }) => {
    const { data } = await apiClient.post(ENDPOINTS.AUTH_SUPERADMIN_LOGIN, {
        email,
        password,
    });
    return data;
};
