import { getTiendaIdentifier, buildPublicApiUrl } from '../config/tenant.config';

/**
 * Obtiene una página del storefront por su slug.
 * 
 * @param {string} slug - El slug de la página (ej: 'home-seccion-about', 'home-seccion-contact')
 * @returns {Promise<Object>} - Datos de la página (titulo, contenido JSON, etc.)
 * @throws {Error} - Si la página no existe o hay error en el backend
 */
export const getPaginaBySlug = async (slug) => {
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
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.mensaje || `Error al obtener página: ${response.status}`);
  }
  
  return response.json();
};

/**
 * Obtiene todas las páginas activas del storefront.
 * 
 * @returns {Promise<Array>} - Array de páginas
 * @throws {Error} - Si hay error en el backend
 */
export const getPaginas = async () => {
  const identifier = getTiendaIdentifier();
  
  if (!identifier) {
    throw new Error('No se pudo detectar la tienda.');
  }
  
  const url = buildPublicApiUrl(identifier, 'paginas');
  const response = await fetch(url);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.mensaje || `Error al obtener páginas: ${response.status}`);
  }
  
  return response.json();
};
