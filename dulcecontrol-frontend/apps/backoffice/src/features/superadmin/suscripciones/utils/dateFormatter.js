import dayjs from 'dayjs';

/**
 * Formatea una fecha ISO a formato DD/MM/YYYY
 * @param {string} dateString - Fecha en formato ISO
 * @returns {string} Fecha formateada
 */
export const formatDate = (dateString) => {
    if (!dateString) return '-';
    return dayjs(dateString).format('DD/MM/YYYY');
};

/**
 * Formatea una fecha ISO a formato DD/MM/YYYY HH:mm
 * @param {string} dateString - Fecha en formato ISO
 * @returns {string} Fecha y hora formateadas
 */
export const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    return dayjs(dateString).format('DD/MM/YYYY HH:mm');
};

/**
 * Verifica si una fecha está vencida
 * @param {string} dateString - Fecha en formato ISO
 * @returns {boolean} True si está vencida
 */
export const isExpired = (dateString) => {
    if (!dateString) return false;
    return dayjs(dateString).isBefore(dayjs());
};
