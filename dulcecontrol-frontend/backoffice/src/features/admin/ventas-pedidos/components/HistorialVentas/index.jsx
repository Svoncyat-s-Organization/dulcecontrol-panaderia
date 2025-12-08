import { useMemo, useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { useQuery, useQueries } from '@tanstack/react-query';
import HistorialView from './HistorialView.jsx';
import { useTokenStore } from '../../../../../shared/store/tokenStore.js';
import { getPedidos, getPagosPedido, getPedidoById, getDetallesPedido } from '../../api/pedidos.api.js';
import { getClientes } from '../../api/clientes.api.js';
import { getUsuariosAdmin } from '../../api/usuarios.api.js';
import { getProductos } from '../../../catalogo/api/productos.api.js';
import { PEDIDO_KEYS } from '../../constants/queryKeys.js';
import ReceiptModal from '../PuntoDeVenta/ReceiptModal.jsx';
import VentaDetailDrawer from './VentaDetailDrawer.jsx';

const metodoPagoLabels = {
    efectivo: 'Efectivo',
    yape: 'Yape',
    plin: 'Plin',
    tarjeta_credito: 'Tarjeta Crédito',
    tarjeta_debito: 'Tarjeta Débito',
    transferencia: 'Transferencia',
    pasarela_online: 'Pasarela Online',
};

const initialFilters = {
    codigoPedido: null,
    clienteId: null,
    metodoPago: null,
    tipoComprobante: null,
    rangoFechas: null,
};

const formatMoney = (value = 0) => `S/ ${(value / 100).toFixed(2)}`;

const HistorialVentas = () => {
    const tiendaId = useTokenStore((state) => state.tiendaId);
    const [filters, setFilters] = useState(initialFilters);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
    const [printingId, setPrintingId] = useState(null);
    const [receiptData, setReceiptData] = useState(null);
    const [detailPedido, setDetailPedido] = useState(null);
    const [detailOpen, setDetailOpen] = useState(false);

    const fechaParams = useMemo(() => {
        if (!filters.rangoFechas || filters.rangoFechas.length !== 2) {
            return {};
        }
        const [from, to] = filters.rangoFechas;
        return {
            fechaDesde: from || undefined,
            fechaHasta: to || undefined,
        };
    }, [filters.rangoFechas]);

    const pedidosQuery = useQuery({
        queryKey: PEDIDO_KEYS.lists(tiendaId, fechaParams),
        queryFn: () => getPedidos(tiendaId, fechaParams),
        enabled: !!tiendaId,
        select: (response) => Array.isArray(response) ? response : [],
    });

    const clientesQuery = useQuery({
        queryKey: ['clientes', tiendaId],
        queryFn: () => getClientes(tiendaId),
        enabled: !!tiendaId,
    });

    const usuariosQuery = useQuery({
        queryKey: ['usuarios', tiendaId],
        queryFn: () => getUsuariosAdmin(tiendaId),
        enabled: !!tiendaId,
    });

    const productosQuery = useQuery({
        queryKey: ['productos', 'all', tiendaId],
        queryFn: () => getProductos(tiendaId),
        enabled: !!tiendaId,
        staleTime: 1000 * 60 * 5,
    });

    const pedidos = pedidosQuery.data || [];

    const pagosQueries = useQueries({
        queries: (pedidos || []).map((pedido) => ({
            queryKey: PEDIDO_KEYS.pagos(tiendaId, pedido.id),
            queryFn: () => getPagosPedido(tiendaId, pedido.id),
            enabled: !!tiendaId,
            staleTime: 1000 * 60,
        })),
    });

    const pagosMap = useMemo(() => {
        const map = new Map();
        pagosQueries.forEach((query, idx) => {
            const pedidoId = pedidos[idx]?.id;
            if (pedidoId && Array.isArray(query.data)) {
                map.set(pedidoId, query.data);
            }
        });
        return map;
    }, [pagosQueries, pedidos]);

    const clientesMap = useMemo(() => {
        const map = new Map();
        (clientesQuery.data || []).forEach((cliente) => {
            map.set(cliente.id, cliente);
        });
        return map;
    }, [clientesQuery.data]);

    const usuariosMap = useMemo(() => {
        const map = new Map();
        (usuariosQuery.data || []).forEach((usuario) => {
            const nombre = usuario.nombreCompleto
                || `${usuario.nombres || ''} ${usuario.apellidos || ''}`.trim()
                || usuario.correo
                || `Usuario ${usuario.id}`;
            map.set(usuario.id, nombre);
        });
        return map;
    }, [usuariosQuery.data]);

    const productosMap = useMemo(() => {
        const map = new Map();
        (productosQuery.data || []).forEach((producto) => {
            map.set(producto.id, producto);
        });
        return map;
    }, [productosQuery.data]);

    const rows = useMemo(() => {
        return pedidos.map((pedido) => {
            const pagos = pagosMap.get(pedido.id) || [];
            const metodoPago = pagos[0]?.metodoPago || null;
            const clienteNombre = clientesMap.get(pedido.clienteId)?.nombreDoc
                || clientesMap.get(pedido.clienteId)?.nombre
                || 'Cliente general';
            const vendedorNombre = usuariosMap.get(pedido.vendedorId) || 'No asignado';
            const comprobante = pedido.tipoComprobante
                ? `${pedido.tipoComprobante?.toUpperCase()} ${pedido.serieComprobante || ''} ${pedido.numeroComprobante || ''}`.trim()
                : 'Sin comprobante';

            return {
                id: pedido.id,
                codigo: pedido.codigoPedido,
                codigoLower: pedido.codigoPedido?.toLowerCase() || '',
                fechaHora: dayjs(pedido.creadoEn).format('DD/MM/YYYY HH:mm'),
                creadoEn: pedido.creadoEn,
                clienteId: pedido.clienteId,
                clienteNombre,
                comprobante,
                tipoComprobante: pedido.tipoComprobante || null,
                metodoPago,
                metodoPagoLabel: metodoPagoLabels[metodoPago] || null,
                totalDisplay: formatMoney(pedido.totalFinalCentimos || 0),
                totalCentimos: pedido.totalFinalCentimos || 0,
                vendedorId: pedido.vendedorId,
                vendedorNombre,
                raw: pedido,
            };
        });
    }, [pedidos, pagosMap, clientesMap, usuariosMap]);

    const filteredRows = useMemo(() => {
        return rows.filter((row) => {
            // Filtrar solo ventas POS
            if (!row.codigo?.startsWith('POS')) {
                return false;
            }

            if (filters.codigoPedido && !row.codigoLower.includes(filters.codigoPedido.toLowerCase())) {
                return false;
            }
            if (filters.clienteId && row.clienteId !== filters.clienteId) {
                return false;
            }
            if (filters.tipoComprobante && (row.tipoComprobante || '').toLowerCase() !== filters.tipoComprobante) {
                return false;
            }
            if (filters.metodoPago && row.metodoPago !== filters.metodoPago) {
                return false;
            }
            if (filters.rangoFechas && filters.rangoFechas.length === 2) {
                const [fromIso, toIso] = filters.rangoFechas;
                const fecha = dayjs(row.creadoEn);
                if (fromIso && fecha.isBefore(dayjs(fromIso))) {
                    return false;
                }
                if (toIso && fecha.isAfter(dayjs(toIso))) {
                    return false;
                }
            }
            return true;
        });
    }, [rows, filters]);

    useEffect(() => {
        setPagination((prev) => {
            const maxPage = Math.max(1, Math.ceil(filteredRows.length / prev.pageSize) || 1);
            return prev.current > maxPage ? { ...prev, current: maxPage } : prev;
        });
    }, [filteredRows.length]);

    const paginatedRows = useMemo(() => {
        const start = (pagination.current - 1) * pagination.pageSize;
        return filteredRows.slice(start, start + pagination.pageSize);
    }, [filteredRows, pagination]);

    const clienteOptions = useMemo(() => (
        (clientesQuery.data || []).map((cliente) => ({
            value: cliente.id,
            label: cliente.nombreDoc || cliente.nombre || `Cliente ${cliente.id}`,
        }))
    ), [clientesQuery.data]);

    const handleFiltersChange = (nextFilters) => {
        setFilters((prev) => ({ ...prev, ...nextFilters }));
        setPagination((prev) => ({ ...prev, current: 1 }));
    };

    const handleResetFilters = () => {
        setFilters(initialFilters);
        setPagination((prev) => ({ ...prev, current: 1 }));
    };

    const handlePaginationChange = ({ current, pageSize }) => {
        setPagination({ current, pageSize });
    };

    const buildReceiptPayload = (pedido, detalles = [], pagos = []) => {
        const clienteInfo = clientesMap.get(pedido.clienteId);
        const normalizedDetalles = detalles.map((detalle) => ({
            id: detalle.id,
            nombre: productosMap.get(detalle.productoId)?.nombre || `Producto ${detalle.productoId}`,
            quantity: detalle.cantidad,
            precioBaseCentimos: detalle.precioUnitarioCentimos,
            subtotalLineaCentimos: detalle.subtotalLineaCentimos,
        }));
        const normalizedPagos = pagos.map((pago) => ({
            id: pago.id,
            metodoPago: pago.metodoPago,
            montoPagadoCentimos: pago.montoPagadoCentimos,
            fechaPago: pago.fechaPago,
        }));

        return {
            ...pedido,
            items: normalizedDetalles,
            pagos: normalizedPagos,
            metodoPago: normalizedPagos[0]?.metodoPago,
            cliente: clienteInfo
                ? {
                    nombreDoc: clienteInfo.nombreDoc || clienteInfo.nombre,
                    tipoDoc: clienteInfo.tipoDoc,
                    numeroDoc: clienteInfo.numeroDoc,
                    direccion: clienteInfo.direccion,
                }
                : null,
        };
    };

    const handlePrint = async (row) => {
        if (!tiendaId || !row?.raw?.id) return;
        setPrintingId(row.id);
        try {
            const pedidoId = row.raw.id;
            const [pedidoDetail, detalles, pagos] = await Promise.all([
                getPedidoById(tiendaId, pedidoId),
                getDetallesPedido(tiendaId, pedidoId),
                getPagosPedido(tiendaId, pedidoId),
            ]);
            setReceiptData(buildReceiptPayload(pedidoDetail, detalles, pagos));
        } catch (error) {
            console.error('Error al preparar el recibo', error);
        } finally {
            setPrintingId(null);
        }
    };

    const handleViewDetail = (row) => {
        if (!row?.raw) return;
        setDetailPedido(row.raw);
        setDetailOpen(true);
    };

    const detailDetallesQuery = useQuery({
        queryKey: PEDIDO_KEYS.detalles(tiendaId, detailPedido?.id),
        queryFn: () => getDetallesPedido(tiendaId, detailPedido.id),
        enabled: !!detailPedido && !!tiendaId,
    });

    const detailPagosQuery = useQuery({
        queryKey: PEDIDO_KEYS.pagos(tiendaId, detailPedido?.id),
        queryFn: () => getPagosPedido(tiendaId, detailPedido.id),
        enabled: !!detailPedido && !!tiendaId,
    });

    const handleCloseDetail = () => {
        setDetailOpen(false);
        setDetailPedido(null);
    };

    const handleCloseReceipt = () => {
        setReceiptData(null);
    };

    const loading = pedidosQuery.isLoading || clientesQuery.isLoading || usuariosQuery.isLoading;

    return (
        <>
            <HistorialView
                data={paginatedRows}
                loading={loading}
                isError={pedidosQuery.isError}
                onRetry={pedidosQuery.refetch}
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onResetFilters={handleResetFilters}
                pagination={pagination}
                onPaginationChange={handlePaginationChange}
                clienteOptions={clienteOptions}
                onPrint={handlePrint}
                onViewDetail={handleViewDetail}
                printingId={printingId}
                totalItems={filteredRows.length}
            />

            <ReceiptModal open={!!receiptData} onClose={handleCloseReceipt} pedido={receiptData} />

            <VentaDetailDrawer
                open={detailOpen}
                onClose={handleCloseDetail}
                pedido={detailPedido}
                detalles={detailDetallesQuery.data}
                pagos={detailPagosQuery.data}
                productosMap={productosMap}
                clienteNombre={detailPedido ? (clientesMap.get(detailPedido.clienteId)?.nombreDoc || clientesMap.get(detailPedido.clienteId)?.nombre) : null}
                vendedorNombre={detailPedido ? usuariosMap.get(detailPedido.vendedorId) : null}
                loading={detailDetallesQuery.isLoading || detailPagosQuery.isLoading}
            />
        </>
    );
};

export default HistorialVentas;
