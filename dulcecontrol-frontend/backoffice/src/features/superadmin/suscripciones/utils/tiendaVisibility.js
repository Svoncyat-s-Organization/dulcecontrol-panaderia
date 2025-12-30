export const isTiendaVisible = (tienda) => {
    if (!tienda) return false;

    const eliminadoEn = tienda.eliminadoEn ?? tienda.eliminado_en;
    return eliminadoEn === null || eliminadoEn === undefined || String(eliminadoEn).trim() === '';
};
