import apiClient from '../../../api/apiClient.js';
import { ENDPOINTS } from '../../../config/api.config.js';

export const postAdminLogin = (payload) =>
  apiClient.post(ENDPOINTS.AUTH_ADMIN_LOGIN, payload).then((response) => response.data);
