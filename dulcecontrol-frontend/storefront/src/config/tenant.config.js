/**
 * Configuración de multitenancy para el storefront.
 * 
 * PRODUCCIÓN (Vercel):
 * - Detecta tienda por subdominio: panaderia-rosita.dulcecontrol.com
 * - O por dominio personalizado: www.panaderiarosita.pe
 * 
 * DESARROLLO (Local):
 * - Usa VITE_TIENDA_ID del .env.local
 * - Fallback: tienda 1 por defecto
 */

const isDevelopment = import.meta.env.MODE === 'development';

/**
 * Extrae el identificador de tienda desde el hostname.
 * 
 * Estrategia:
 * 1. Si es subdominio de dulcecontrol.com → usa el subdominio como slug
 * 2. Si es dominio personalizado → consulta al backend por el dominio
 * 3. En desarrollo → usa VITE_TIENDA_ID del .env
 * 
 * @returns {string|number|null} - Slug de tienda, ID numérico, o null
 */
export const getTiendaIdentifier = () => {
  // DESARROLLO: Usar variable de entorno
  if (isDevelopment) {
    const tiendaId = import.meta.env.VITE_TIENDA_ID;
    if (tiendaId) {
      console.log('🏪 [DEV] Usando VITE_TIENDA_ID:', tiendaId);
      return parseInt(tiendaId, 10);
    }
    console.warn('⚠️ [DEV] VITE_TIENDA_ID no definido, usando tienda 1 por defecto');
    return 1; // Fallback para desarrollo
  }

  // PRODUCCIÓN: Detectar por hostname
  const hostname = window.location.hostname;
  
  // Caso 1: Subdominio de dulcecontrol.com
  // Ej: panaderia-rosita.dulcecontrol.com → "panaderia-rosita"
  if (hostname.includes('dulcecontrol.com')) {
    const subdomain = hostname.split('.')[0];
    
    // Ignorar subdominio "www" y otros genéricos
    if (subdomain && subdomain !== 'www' && subdomain !== 'dulcecontrol') {
      console.log('🏪 [PROD] Subdominio detectado:', subdomain);
      return subdomain; // Devuelve el slug
    }
  }
  
  // Caso 2: Dominio personalizado completo
  // Ej: www.panaderiarosita.pe → se enviará al backend para resolver
  if (!hostname.includes('localhost') && !hostname.includes('127.0.0.1')) {
    console.log('🏪 [PROD] Dominio personalizado detectado:', hostname);
    return hostname; // El backend lo resolverá
  }
  
  console.error('❌ No se pudo detectar la tienda. Hostname:', hostname);
  return null;
};

/**
 * Determina si se debe usar slug o ID numérico en la URL.
 * 
 * @param {string|number} identifier - Identificador de getTiendaIdentifier()
 * @returns {boolean} - true si es slug (string), false si es ID (number)
 */
export const isSlugIdentifier = (identifier) => {
  return typeof identifier === 'string';
};

/**
 * Construye la URL base para las APIs públicas del storefront.
 * 
 * Soporta dos formatos:
 * - /api/public/tienda/{id}/... (cuando identifier es number)
 * - /api/public/tienda/slug/{slug}/... (cuando identifier es string)
 * 
 * @param {string|number} identifier - ID o slug de tienda
 * @param {string} endpoint - Ruta del endpoint (ej: 'config', 'catalogo/productos')
 * @returns {string} - URL completa
 */
export const buildPublicApiUrl = (identifier, endpoint) => {
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
  
  if (isSlugIdentifier(identifier)) {
    return `${baseUrl}/api/public/tienda/slug/${identifier}/${endpoint}`;
  } else {
    return `${baseUrl}/api/public/tienda/${identifier}/${endpoint}`;
  }
};

export default {
  getTiendaIdentifier,
  isSlugIdentifier,
  buildPublicApiUrl,
};
