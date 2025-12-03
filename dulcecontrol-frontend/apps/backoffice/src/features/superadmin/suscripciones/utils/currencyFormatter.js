/**
 * Convierte céntimos a Soles con formato de moneda
 * @param {number} centimos - Precio en céntimos (ej. 9900)
 * @returns {string} Precio formateado en Soles (ej. "S/ 99.00")
 */
export const centimosToPEN = (centimos) => {
    if (centimos === null || centimos === undefined) return 'S/ 0.00';
    const soles = centimos / 100;
    return `S/ ${soles.toFixed(2)}`;
};

/**
 * Convierte Soles a céntimos
 * @param {number|string} soles - Precio en Soles (ej. 99.00 o "99.00")
 * @returns {number} Precio en céntimos (ej. 9900)
 */
export const PENToCentimos = (soles) => {
    const solesNum = typeof soles === 'string' ? parseFloat(soles) : soles;
    if (isNaN(solesNum)) return 0;
    return Math.round(solesNum * 100);
};

