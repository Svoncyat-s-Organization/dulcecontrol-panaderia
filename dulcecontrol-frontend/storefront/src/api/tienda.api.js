import { getTiendaIdentifier, buildPublicApiUrl } from '../config/tenant.config';

/**
 * API pública para consumir configuración de tienda desde el backend.
 * 
 * La tienda se detecta automáticamente por:
 * - Producción: Subdominio o dominio personalizado
 * - Desarrollo: Variable VITE_TIENDA_ID del .env
 */

/**
 * Obtiene la configuración completa de la tienda (branding + config pública).
 * Endpoint: GET /api/public/tienda/{id}/config o /api/public/tienda/slug/{slug}/config
 * 
 * @returns {Promise<Object>} - Configuración de tienda con branding, colores, URLs, etc.
 * @throws {Error} - Si no se puede detectar la tienda o el backend falla
 */
export const getTiendaConfig = async () => {
  const identifier = getTiendaIdentifier();
  
  if (!identifier) {
    throw new Error('No se pudo detectar la tienda. Verifica el dominio o VITE_TIENDA_ID.');
  }
  
  const url = buildPublicApiUrl(identifier, 'config');
  const response = await fetch(url);
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Tienda no encontrada: ${identifier}`);
    }
    throw new Error(`Error al obtener configuración de tienda: ${response.statusText}`);
  }
  
  return response.json();
};

/**
 * Obtiene todas las páginas activas del CMS de la tienda.
 * Endpoint: GET /api/public/tienda/{id}/paginas
 * 
 * @returns {Promise<Array>} - Lista de páginas CMS activas
 */
export const getPaginasActivas = async () => {
  const identifier = getTiendaIdentifier();
  
  if (!identifier) {
    throw new Error('No se pudo detectar la tienda.');
  }
  
  const url = buildPublicApiUrl(identifier, 'paginas');
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Error al obtener páginas: ${response.statusText}`);
  }
  
  return response.json();
};

/**
 * Obtiene una página CMS por su slug.
 * Endpoint: GET /api/public/tienda/{id}/paginas/{slug}
 * 
 * @param {string} slug - Slug de la página (ej: 'terminos-condiciones')
 * @returns {Promise<Object>} - Contenido de la página
 */
export const getPaginaPorSlug = async (slug) => {
  const identifier = getTiendaIdentifier();
  
  if (!identifier) {
    throw new Error('No se pudo detectar la tienda.');
  }
  
  const url = buildPublicApiUrl(identifier, `paginas/${slug}`);
  const response = await fetch(url);
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Página no encontrada: ${slug}`);
    }
    throw new Error(`Error al obtener página: ${response.statusText}`);
  }
  
  return response.json();
};
