/**
 * Configuración centralizada de URLs de la API
 * 
 * La aplicación intentará conectarse primero a la URL de producción.
 * Si falla, puede usar la URL local como fallback (implementar lógica según necesidad).
 */

// URL principal (producción) - Spring Boot con certificado SSL de cPanel
export const API_BASE_URL = 'https://pasteleria.spring.informaticapp.com:2250';

// URL de desarrollo/local (para referencia o fallback)
export const API_LOCAL_URL = 'https://localhost:2250';

// URL activa (puedes cambiar esto dinámicamente si lo necesitas)
export const getApiUrl = () => {
    // Prioriza la URL de producción
    // Si quieres detectar automáticamente según el entorno:
    // return import.meta.env.PROD ? API_BASE_URL : API_LOCAL_URL;
    
    return API_LOCAL_URL;
};

// Endpoints específicos
export const ENDPOINTS = {
    // Testeo de Endpoints
    SWAGGER_UI: '/swagger-ui/index.html',

    // Endpoints para la obtención del token por desarrolladores
    DEV_TOKEN_LOGIN: '/api/token/login',
    DEV_TOKEN_REGISTER: '/api/token/register',

    // Autenticación multi-tenant
    AUTH_SUPERADMIN_LOGIN: '/api/auth/superadmin/login',
    AUTH_ADMIN_LOGIN: '/api/auth/admin/login',
    AUTH_STOREFRONT_LOGIN: '/api/auth/storefront/login',

    // Endpoints para el superadministrador
    // Tiendas
    API_TIENDA: '/api/superadmin/tiendas',
    // Tiendas - Sedes
    API_TIENDA_SEDE: '/api/superadmin/tiendas/{tiendaId}/sedes',
};
