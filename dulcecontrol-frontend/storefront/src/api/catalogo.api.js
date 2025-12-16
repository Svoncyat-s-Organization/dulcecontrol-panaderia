/**
 * API para el catálogo público del storefront.
 * Endpoints sin autenticación para productos y categorías.
 * 
 * La tienda se detecta automáticamente por:
 * - Producción: Subdominio o dominio personalizado
 * - Desarrollo: Variable VITE_TIENDA_ID del .env
 */

import { getTiendaIdentifier, buildPublicApiUrl } from '../config/tenant.config';

/**
 * Obtiene todas las categorías activas de la tienda.
 * Endpoint: GET /api/public/tienda/{id}/catalogo/categorias
 * 
 * @returns {Promise<Array>} Lista de categorías ordenadas por ordenVisual
 */
export const getCategorias = async () => {
  const identifier = getTiendaIdentifier();
  
  if (!identifier) {
    throw new Error('No se pudo detectar la tienda.');
  }
  
  const url = buildPublicApiUrl(identifier, 'catalogo/categorias');
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Error al obtener categorías: ${response.statusText}`);
  }
  
  return response.json();
};

/**
 * Busca productos con filtros opcionales y paginación.
 * Endpoint: GET /api/public/tienda/{id}/catalogo/productos
 * 
 * @param {Object} params - Parámetros de filtro
 * @param {number} [params.categoriaId] - Filtro por categoría
 * @param {boolean} [params.destacado] - Filtro por destacados (true para HomePage)
 * @param {number} [params.page=0] - Número de página
 * @param {number} [params.size=12] - Tamaño de página
 * @param {string} [params.sort='nombre,asc'] - Ordenamiento
 * @returns {Promise<Object>} Objeto Page<ProductoPublicoResponse> con content[], pageable, totalElements
 */
export const getProductos = async (params = {}) => {
  const queryParams = new URLSearchParams();
  
  if (params.categoriaId) queryParams.append('categoriaId', params.categoriaId);
  if (params.destacado !== undefined) queryParams.append('destacado', params.destacado);
  if (params.page !== undefined) queryParams.append('page', params.page);
  if (params.size !== undefined) queryParams.append('size', params.size);
  if (params.sort) queryParams.append('sort', params.sort);
  
  const identifier = getTiendaIdentifier();
  
  if (!identifier) {
    throw new Error('No se pudo detectar la tienda.');
  }
  
  const baseUrl = buildPublicApiUrl(identifier, 'catalogo/productos');
  const url = `${baseUrl}?${queryParams.toString()}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Error al obtener productos: ${response.statusText}`);
  }
  
  return response.json();
};

/**
 * Obtiene el detalle completo de un producto por slug.
 * Endpoint: GET /api/public/tienda/{id}/catalogo/productos/{slug}
 * 
 * @param {string} slug - Slug único del producto (ej: 'torta-chocolate-premium')
 * @returns {Promise<Object>} ProductoDetallePublicoResponse con galería, atributos, categoría
 */
export const getProductoBySlug = async (slug) => {
  const identifier = getTiendaIdentifier();
  
  if (!identifier) {
    throw new Error('No se pudo detectar la tienda.');
  }
  
  const url = buildPublicApiUrl(identifier, `catalogo/productos/${slug}`);
  const response = await fetch(url);
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Producto no encontrado: ${slug}`);
    }
    throw new Error(`Error al obtener producto: ${response.statusText}`);
  }
  
  return response.json();
};

/**
 * Formatea precio de céntimos a soles con decimales.
 * Los precios en BD están multiplicados por 100.
 * 
 * @param {number} centimos - Precio en céntimos (ej: 4500 para S/ 45.00)
 * @returns {string} Precio formateado (ej: "45.00")
 */
export const formatPrecio = (centimos) => {
  if (!centimos && centimos !== 0) return '0.00';
  return (centimos / 100).toFixed(2);
};

/**
 * Formatea precio con símbolo de moneda.
 * 
 * @param {number} centimos - Precio en céntimos
 * @param {string} [moneda='S/'] - Símbolo de moneda
 * @returns {string} Precio formateado con moneda (ej: "S/ 45.00")
 */
export const formatPrecioConMoneda = (centimos, moneda = 'S/') => {
  return `${moneda} ${formatPrecio(centimos)}`;
};
