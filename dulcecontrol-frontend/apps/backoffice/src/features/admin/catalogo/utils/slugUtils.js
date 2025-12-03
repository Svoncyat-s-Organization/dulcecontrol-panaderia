/**
 * Convierte texto a formato slug (URL-friendly)
 * @param {string} text - Texto a convertir
 * @returns {string} - Slug generado
 */
export const slugify = (text) => {
  if (!text) return '';
  
  return text
    .toString()
    .normalize('NFD') // Descomponer caracteres acentuados
    .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Eliminar caracteres especiales
    .replace(/\s+/g, '-') // Espacios a guiones
    .replace(/-+/g, '-') // Múltiples guiones a uno solo
    .replace(/^-+|-+$/g, '') // Eliminar guiones al inicio/final
    .slice(0, 100); // Limitar longitud
};
