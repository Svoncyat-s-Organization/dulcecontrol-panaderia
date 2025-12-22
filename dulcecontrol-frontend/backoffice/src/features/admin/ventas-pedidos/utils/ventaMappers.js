import dayjs from 'dayjs';
import { formatApiDateTime } from './dateTime.js';

export const mapPedidoToTable = (pedido, clientesMap = new Map()) => {
    const clienteNombre = clientesMap.get(pedido.clienteId)?.nombreDoc
        || clientesMap.get(pedido.clienteId)?.nombre
        || 'Cliente General';

    return {
        key: pedido.id,
        id: pedido.id,
        codigo: pedido.codigoPedido,
        cliente: clienteNombre,
        total: pedido.totalFinalCentimos / 100,
        estado: pedido.estadoPedido,
        estadoPago: pedido.estadoPago,
        fecha: dayjs(pedido.creadoEn).format('DD/MM/YYYY HH:mm'),
        fechaEntrega: pedido.fechaEntregaPactada,
        tipoEntrega: pedido.tipoEntrega,
        raw: pedido, // Include raw data for modal operations
    };
};

export const mapSesionToTable = (sesion) => ({
    key: sesion.id,
    id: sesion.id,
    caja: sesion.cajaNombre,
    usuarioApertura: sesion.usuarioAperturaNombre,
    usuarioCierre: sesion.usuarioCierreNombre || '-',
    fechaApertura: formatApiDateTime(sesion.fechaApertura),
    fechaCierre: formatApiDateTime(sesion.fechaCierre),
    estado: sesion.estaAbierta ? 'Abierta' : 'Cerrada',
    montoInicial: sesion.montoInicialCentimos / 100,
    montoFinal: sesion.montoFinalRealCentimos ? sesion.montoFinalRealCentimos / 100 : 0,
});
