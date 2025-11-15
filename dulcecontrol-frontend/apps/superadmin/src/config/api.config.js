/**
 * Configuración centralizada de URLs de la API
 * 
 * La aplicación intentará conectarse primero a la URL de producción.
 * Si falla, puede usar la URL local como fallback (implementar lógica según necesidad).
 */

// URL principal (producción)
// Opciones:
// 1. Con subdominio proxy: 'https://api.pasteleria.spring.informaticapp.com'
// 2. Con ruta proxy: 'https://pasteleria.spring.informaticapp.com'
// 3. Puerto directo (requiere SSL en Spring): 'https://pasteleria.spring.informaticapp.com:2250'
export const API_BASE_URL = 'https://pasteleria.spring.informaticapp.com';

// URL de desarrollo/local (para referencia o fallback)
export const API_LOCAL_URL = 'http://localhost:2250';

// URL activa (puedes cambiar esto dinámicamente si lo necesitas)
export const getApiUrl = () => {
    // Prioriza la URL de producción
    // Si quieres detectar automáticamente según el entorno:
    // return import.meta.env.PROD ? API_BASE_URL : API_LOCAL_URL;
    
    return API_BASE_URL;
};

// Endpoints específicos
export const ENDPOINTS = {
    AUTH_LOGIN: '/api/v1/auth/login',
    USERS_REGISTER: '/api/superadmin/seguridad/usuarios',
    SWAGGER_UI: '/swagger-ui/index.html',
};
