import apiClient from '../../../../api/apiClient.js';
import { ENDPOINTS } from '../../../../config/api.config.js';

export const postSuperadminLogin = (payload) =>
    apiClient.post(ENDPOINTS.AUTH_SUPERADMIN_LOGIN, payload).then((response) => response.data);
