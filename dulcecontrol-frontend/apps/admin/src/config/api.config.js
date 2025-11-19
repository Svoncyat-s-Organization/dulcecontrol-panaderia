/**
 * Configuración centralizada de URLs de la API
 */

export const API_BASE_URL = 'https://pasteleria.spring.informaticapp.com:2250';
export const API_LOCAL_URL = 'https://localhost:2250';

export const getApiUrl = () => {
  return API_LOCAL_URL;
};

export const ENDPOINTS = {
  SWAGGER_UI: '/swagger-ui/index.html',
  DEV_TOKEN_LOGIN: '/api/token/login',
  DEV_TOKEN_REGISTER: '/api/token/register',
  AUTH_SUPERADMIN_LOGIN: '/api/auth/superadmin/login',
  AUTH_ADMIN_LOGIN: '/api/auth/admin/login',
  AUTH_STOREFRONT_LOGIN: '/api/auth/storefront/login',
};
