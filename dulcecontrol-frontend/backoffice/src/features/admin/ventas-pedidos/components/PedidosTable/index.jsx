import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import PedidosTableView from './PedidosTableView.jsx';
import UnifiedStatusModal from './UnifiedStatusModal.jsx';
import PedidoDetailDrawer from './PedidoDetailDrawer.jsx';
import ReceiptModal from '../PuntoDeVenta/ReceiptModal.jsx';
import { useTokenStore } from '../../../../../shared/store/tokenStore.js';
import { getPedidos, updatePedido, getDetallesPedido, addPagoPedido, getPagosPedido } from '../../api/pedidos.api.js';
import { registrarMovimientoCaja } from '../../api/cajas.api.js';
import { getClientes } from '../../api/clientes.api.js';
import { getUsuariosAdmin } from '../../api/usuarios.api.js';
import { getProductos } from '../../../catalogo/api/productos.api.js';
import { PEDIDO_KEYS } from '../../constants/queryKeys.js';
import { mapPedidoToTable } from '../../utils/ventaMappers.js';
import { getInventarioProductosPorSede } from '../../../inventario/api/existencias.api.js';
import { crearMovimientoInventarioProducto } from '../../../inventario/api/movimientos.api.js';
import { INVENTARIO_PRODUCTO_KEYS, INVENTARIO_MOVIMIENTO_KEYS } from '../../../inventario/constants/queryKeys.js';

const PedidosTable = () => {
    const tiendaId = useTokenStore((state) => state.tiendaId);
    const user = useTokenStore((state) => state.user);
    const usuarioId = user?.id;
    const queryClient = useQueryClient();

    const [statusModal, setStatusModal] = useState({ open: false, pedido: null });
    const [detailDrawer, setDetailDrawer] = useState({ open: false, pedido: null });
    const [receiptData, setReceiptData] = useState(null);
    const [printingId, setPrintingId] = useState(null);
    const [filters, setFilters] = useState({
        codigoPedido: null,
        clienteId: null,
        estadoPedido: null,
        estadoPago: null,
        rangoFechas: null,
    });

    const { data: pedidos = [], isLoading, isError, refetch } = useQuery({
        queryKey: PEDIDO_KEYS.lists(tiendaId, {}),
        queryFn: () => getPedidos(tiendaId),
        enabled: !!tiendaId,
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

    const clientesMap = useMemo(() => {
        const map = new Map();
        (clientesQuery.data || []).forEach((cliente) => {
            map.set(cliente.id, cliente);
        });
        return map;
    }, [clientesQuery.data]);

    const clienteOptions = useMemo(() => {
        return (clientesQuery.data || []).map((cliente) => ({
            label: cliente.nombreDoc || cliente.nombre || 'Sin nombre',
            value: cliente.id,
        }));
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

    const pedOrders = useMemo(() => {
        let filtered = pedidos
            .map(pedido => mapPedidoToTable(pedido, clientesMap))
            .filter(pedido => pedido.codigo?.startsWith('PED'));

        // Apply filters
        if (filters.codigoPedido) {
            filtered = filtered.filter(p =>
                p.codigo.toLowerCase().includes(filters.codigoPedido.toLowerCase())
            );
        }
        if (filters.clienteId) {
            filtered = filtered.filter(p => p.raw.clienteId === filters.clienteId);
        }
        if (filters.estadoPedido) {
            filtered = filtered.filter(p =>
                p.estado?.toLowerCase() === filters.estadoPedido.toLowerCase()
            );
        }
        if (filters.estadoPago) {
            filtered = filtered.filter(p =>
                p.estadoPago?.toLowerCase() === filters.estadoPago.toLowerCase()
            );
        }
        if (filters.rangoFechas && filters.rangoFechas[0] && filters.rangoFechas[1]) {
            const start = dayjs(filters.rangoFechas[0]).startOf('day');
            const end = dayjs(filters.rangoFechas[1]).endOf('day');
            filtered = filtered.filter(p => {
                if (!p.fechaEntrega) return false;
                const fecha = dayjs(p.fechaEntrega);
                return fecha.isAfter(start) && fecha.isBefore(end);
            });
        }

        return filtered;
    }, [pedidos, clientesMap, filters]);

    const syncInventarioTrasEntrega = async (pedidoId, sedeId, vendedorId) => {
        console.log('📦 [VENTA] Iniciando sincronización de inventario tras entrega');
        console.log('📦 [VENTA] Pedido ID:', pedidoId, '| Sede ID:', sedeId, '| Tienda ID:', tiendaId);
        
        if (!sedeId || !tiendaId) {
            throw new Error('Falta información de sede o tienda para actualizar inventario');
        }

        const responsableId = usuarioId || vendedorId;
        console.log('👤 [VENTA] Responsable ID:', responsableId);
        
        const detalles = await getDetallesPedido(tiendaId, pedidoId);
        console.log('📋 [VENTA] Detalles del pedido obtenidos:', detalles.length, 'productos');
        console.table(detalles.map(d => ({ ProductoID: d.productoId, Cantidad: d.cantidad })));
        
        const inventarios = await getInventarioProductosPorSede(tiendaId, sedeId);
        console.log('📦 [VENTA] Inventarios de la sede obtenidos:', inventarios?.length || 0);
        const inventarioPorProducto = new Map(
            (Array.isArray(inventarios) ? inventarios : []).map((registro) => [String(registro.productoId), registro])
        );

        const faltantes = [];

        for (const detalle of detalles) {
            const registro = inventarioPorProducto.get(String(detalle.productoId));
            if (!registro) {
                console.error('❌ [VENTA] No hay inventario configurado para Producto ID:', detalle.productoId);
                faltantes.push(`Producto ID ${detalle.productoId}`);
                continue;
            }

            console.log(`🔄 [VENTA] Descontando producto ${detalle.productoId}: ${detalle.cantidad} unidades`);
            console.log('   Stock antes:', registro.cantidadActual, '→ Stock después:', registro.cantidadActual - detalle.cantidad);
            
            await crearMovimientoInventarioProducto(tiendaId, {
                sedeId: registro.sedeId,
                productoId: registro.productoId,
                tipoMovimiento: 'salida',
                cantidad: detalle.cantidad,
                pedidoId,
                motivo: 'venta',
                responsableId: responsableId,
            });
            
            console.log('✅ [VENTA] Movimiento de inventario creado para producto', detalle.productoId);
        }

        if (faltantes.length) {
            console.error('❌ [VENTA] Error:', `Inventario no configurado para: ${faltantes.join(', ')}`);
            throw new Error(`Inventario no configurado para: ${faltantes.join(', ')}`);
        }
        
        console.log('✅ [VENTA] ¡Inventario sincronizado correctamente!');
        console.log('🔔 [VENTA] IMPORTANTE: El backend debería verificar ahora si algún producto llegó al punto de reposición');
    };

    const paymentMutation = useMutation({
        mutationFn: async ({ pedido, paymentData }) => {
            const montoPagadoCentimos = Math.round(paymentData.montoPagado * 100);

            await addPagoPedido(tiendaId, pedido.id, {
                sesionCajaId: paymentData.sesionCajaId || pedido.raw.sesionCajaId,
                montoPagadoCentimos,
                metodoPago: paymentData.metodoPago,
                referenciaExterna: null,
                fechaPago: new Date().toISOString().split('.')[0],
                registradoPor: usuarioId || pedido.raw.vendedorId,
            });

            // Registrar movimiento de caja
            if (paymentData.sesionCajaId) {
                const comprobanteRef = [
                    pedido.raw.tipoComprobante,
                    pedido.raw.serieComprobante,
                    pedido.raw.numeroComprobante
                ].filter(Boolean).join(' ');

                await registrarMovimientoCaja(tiendaId, paymentData.sesionCajaId, {
                    tipoMovimiento: 'venta',
                    montoCentimos: montoPagadoCentimos,
                    concepto: `Pago de pedido ${pedido.raw.codigoPedido}`,
                    comprobanteAsociado: pedido.raw.codigoPedido,
                    pedidoId: pedido.raw.id, // Also sending pedidoId as it is in the DTO
                    metodoPago: paymentData.metodoPago,
                    fechaMovimiento: new Date().toISOString(),
                    usuarioId: usuarioId || pedido.raw.vendedorId,
                });
            }

            const totalCentimos = pedido.raw.totalFinalCentimos;
            const montoPagadoActual = pedido.raw.montoPagadoCentimos || 0;
            const nuevoMontoPagado = montoPagadoActual + montoPagadoCentimos;

            let nuevoEstadoPago = 'pendiente';
            if (nuevoMontoPagado >= totalCentimos) {
                nuevoEstadoPago = 'pagado_total';
            } else if (nuevoMontoPagado > 0) {
                nuevoEstadoPago = 'parcial';
            }

            const payload = {
                codigoPedido: pedido.raw.codigoPedido,
                sedeOrigenId: pedido.raw.sedeOrigenId,
                clienteId: pedido.raw.clienteId,
                origen: pedido.raw.origen,
                sesionCajaId: pedido.raw.sesionCajaId,
                vendedorId: pedido.raw.vendedorId,
                estadoPedido: pedido.raw.estadoPedido,
                estadoPago: nuevoEstadoPago,
                tipoEntrega: pedido.raw.tipoEntrega,
                fechaEntregaPactada: pedido.raw.fechaEntregaPactada,
                direccionEntrega: pedido.raw.direccionEntrega,
                costoDeliveryCentimos: pedido.raw.costoDeliveryCentimos,
                moneda: pedido.raw.moneda,
                subtotalItemsCentimos: pedido.raw.subtotalItemsCentimos,
                descuentoTotalCentimos: pedido.raw.descuentoTotalCentimos,
                impuestosTotalesCentimos: pedido.raw.impuestosTotalesCentimos,
                totalFinalCentimos: pedido.raw.totalFinalCentimos,
                montoPagadoCentimos: nuevoMontoPagado,
                requiereComprobante: pedido.raw.requiereComprobante,
                tipoComprobante: pedido.raw.tipoComprobante,
                serieComprobante: pedido.raw.serieComprobante,
                numeroComprobante: pedido.raw.numeroComprobante,
                notasPedido: pedido.raw.notasPedido,
            };

            return await updatePedido(tiendaId, pedido.id, payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(PEDIDO_KEYS.all);
        },
        onError: () => {
            // Silent error handling
        },
    });

    const statusMutation = useMutation({
        mutationFn: async ({ pedido, nuevoEstado }) => {
            console.log('🔄 [ESTADO PEDIDO] Cambiando estado del pedido');
            console.log('   Pedido:', pedido.codigo);
            console.log('   Estado anterior:', pedido.raw.estadoPedido);
            console.log('   Estado nuevo:', nuevoEstado);
            
            const payload = {
                codigoPedido: pedido.raw.codigoPedido,
                sedeOrigenId: pedido.raw.sedeOrigenId,
                clienteId: pedido.raw.clienteId,
                origen: pedido.raw.origen,
                sesionCajaId: pedido.raw.sesionCajaId,
                vendedorId: pedido.raw.vendedorId,
                estadoPedido: nuevoEstado,
                estadoPago: pedido.raw.estadoPago,
                tipoEntrega: pedido.raw.tipoEntrega,
                fechaEntregaPactada: pedido.raw.fechaEntregaPactada,
                direccionEntrega: pedido.raw.direccionEntrega,
                costoDeliveryCentimos: pedido.raw.costoDeliveryCentimos,
                moneda: pedido.raw.moneda,
                subtotalItemsCentimos: pedido.raw.subtotalItemsCentimos,
                descuentoTotalCentimos: pedido.raw.descuentoTotalCentimos,
                impuestosTotalesCentimos: pedido.raw.impuestosTotalesCentimos,
                totalFinalCentimos: pedido.raw.totalFinalCentimos,
                montoPagadoCentimos: pedido.raw.montoPagadoCentimos,
                requiereComprobante: pedido.raw.requiereComprobante,
                tipoComprobante: pedido.raw.tipoComprobante,
                serieComprobante: pedido.raw.serieComprobante,
                numeroComprobante: pedido.raw.numeroComprobante,
                notasPedido: pedido.raw.notasPedido,
            };

            console.log('📤 [ESTADO PEDIDO] Enviando actualización al backend...');
            const updated = await updatePedido(tiendaId, pedido.id, payload);
            console.log('✅ [ESTADO PEDIDO] Pedido actualizado en el backend');

            if (nuevoEstado === 'entregado' && pedido.raw.estadoPedido !== 'entregado') {
                console.log('🚚 [ENTREGA] Pedido marcado como ENTREGADO - Iniciando descuento de inventario...');
                await syncInventarioTrasEntrega(pedido.id, pedido.raw.sedeOrigenId, pedido.raw.vendedorId);
                console.log('🎉 [ENTREGA] ¡Proceso de entrega completado!');
            }

            return updated;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(PEDIDO_KEYS.all);
            queryClient.invalidateQueries(INVENTARIO_PRODUCTO_KEYS.all);
            queryClient.invalidateQueries(INVENTARIO_MOVIMIENTO_KEYS.all);
            handleCloseStatusModal();
        },
        onError: () => {
            // Silent error handling
        },
    });

    const detailDetallesQuery = useQuery({
        queryKey: PEDIDO_KEYS.detalles(tiendaId, detailDrawer.pedido?.id),
        queryFn: () => getDetallesPedido(tiendaId, detailDrawer.pedido.id),
        enabled: !!detailDrawer.pedido && !!tiendaId,
    });

    const detailPagosQuery = useQuery({
        queryKey: PEDIDO_KEYS.pagos(tiendaId, detailDrawer.pedido?.id),
        queryFn: () => getPagosPedido(tiendaId, detailDrawer.pedido.id),
        enabled: !!detailDrawer.pedido && !!tiendaId,
    });

    const handleManageStatus = (pedido) => {
        setStatusModal({ open: true, pedido });
    };

    const handleViewDetail = (pedido) => {
        setDetailDrawer({ open: true, pedido });
    };

    const handleCloseStatusModal = () => {
        setStatusModal({ open: false, pedido: null });
    };

    const handleCloseDetailDrawer = () => {
        setDetailDrawer({ open: false, pedido: null });
    };

    const handleConfirmPayment = (pedido, paymentData) => {
        paymentMutation.mutate({ pedido, paymentData });
    };

    const handleConfirmStatus = (pedido, nuevoEstado) => {
        statusMutation.mutate({ pedido, nuevoEstado });
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

    const handlePrint = async (pedido) => {
        if (!tiendaId || !pedido?.raw?.id) return;
        setPrintingId(pedido.id);
        try {
            const pedidoId = pedido.raw.id;
            const [detalles, pagos] = await Promise.all([
                getDetallesPedido(tiendaId, pedidoId),
                getPagosPedido(tiendaId, pedidoId),
            ]);
            setReceiptData(buildReceiptPayload(pedido.raw, detalles, pagos));
        } catch (error) {
            console.error('Error al preparar el recibo', error);
        } finally {
            setPrintingId(null);
        }
    };

    const handleClosePrintModal = () => {
        setReceiptData(null);
    };

    const handleFiltersChange = (newFilters) => {
        setFilters(newFilters);
    };

    const handleResetFilters = () => {
        setFilters({
            codigoPedido: null,
            clienteId: null,
            estadoPedido: null,
            estadoPago: null,
            rangoFechas: null,
        });
    };

    return (
        <>
            <PedidosTableView
                pedidos={pedOrders}
                loading={isLoading}
                isError={isError}
                onRetry={refetch}
                onManageStatus={handleManageStatus}
                onViewDetail={handleViewDetail}
                onPrint={handlePrint}
                printingId={printingId}
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onResetFilters={handleResetFilters}
                clienteOptions={clienteOptions}
            />

            <UnifiedStatusModal
                open={statusModal.open}
                pedido={statusModal.pedido}
                onClose={handleCloseStatusModal}
                onConfirmPayment={handleConfirmPayment}
                onConfirmStatus={handleConfirmStatus}
                loadingPayment={paymentMutation.isPending}
                loadingStatus={statusMutation.isPending}
            />

            <PedidoDetailDrawer
                open={detailDrawer.open}
                onClose={handleCloseDetailDrawer}
                pedido={detailDrawer.pedido?.raw}
                detalles={detailDetallesQuery.data}
                pagos={detailPagosQuery.data}
                productosMap={productosMap}
                clienteNombre={detailDrawer.pedido ? clientesMap.get(detailDrawer.pedido.raw?.clienteId)?.nombreDoc || clientesMap.get(detailDrawer.pedido.raw?.clienteId)?.nombre : null}
                vendedorNombre={detailDrawer.pedido ? usuariosMap.get(detailDrawer.pedido.raw?.vendedorId) : null}
                loading={detailDetallesQuery.isLoading || detailPagosQuery.isLoading}
            />

            <ReceiptModal
                open={!!receiptData}
                onClose={handleClosePrintModal}
                pedido={receiptData}
            />
        </>
    );
};

export default PedidosTable;
