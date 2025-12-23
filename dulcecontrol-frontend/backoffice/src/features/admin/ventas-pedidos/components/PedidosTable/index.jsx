import { useState, useMemo } from 'react';
import { message } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import PedidosTableView from './PedidosTableView.jsx';
import UnifiedStatusModal from './UnifiedStatusModal.jsx';
import PedidoDetailDrawer from './PedidoDetailDrawer.jsx';
import ReceiptModal from '../PuntoDeVenta/ReceiptModal.jsx';
import { useTokenStore } from '../../../../../shared/store/tokenStore.js';
import { useSedeStore } from '../../../../../shared/store/sedeStore.js';
import {
    getPedidos,
    getPedidoById,
    updatePedido,
    getDetallesPedido,
    addPagoPedido,
    getPagosPedido,
} from '../../api/pedidos.api.js';
import { registrarMovimientoCaja } from '../../api/cajas.api.js';
import { getClientes } from '../../api/clientes.api.js';
import { getUsuariosAdmin } from '../../api/usuarios.api.js';
import { getProductos } from '../../../catalogo/api/productos.api.js';
import { PEDIDO_KEYS } from '../../constants/queryKeys.js';
import { mapPedidoToTable } from '../../utils/ventaMappers.js';
import { INVENTARIO_PRODUCTO_KEYS, INVENTARIO_MOVIMIENTO_KEYS } from '../../../inventario/constants/queryKeys.js';
import { getConfiguracionTienda } from '../../api/configuracion.api.js';
import { createComprobante, incrementarCorrelativoSerie } from '../../api/facturacion.api.js';

const PedidosTable = () => {
    const tiendaId = useTokenStore((state) => state.tiendaId);
    const selectedSedeId = useSedeStore((state) => state.selectedSedeId);
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

    const pedidosParams = useMemo(() => ({
        sedeId: selectedSedeId ?? undefined,
    }), [selectedSedeId]);

    const { data: pedidos = [], isLoading, isError, refetch } = useQuery({
        queryKey: PEDIDO_KEYS.lists(tiendaId, selectedSedeId ?? null, pedidosParams),
        queryFn: () => getPedidos(tiendaId, pedidosParams),
        enabled: !!tiendaId && !!selectedSedeId,
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

    const {
        data: facturacionConfig,
        isLoading: isFacturacionConfigLoading,
        error: facturacionConfigError,
    } = useQuery({
        queryKey: ['configuracion-tienda', tiendaId],
        queryFn: () => getConfiguracionTienda(tiendaId),
        enabled: !!tiendaId,
        retry: 1,
    });

    const calcularTotalesComprobante = (importeCentimos) => {
        const tasaIgvValor = Number(facturacionConfig?.tasaIgv ?? 18);
        if (!tasaIgvValor || Number.isNaN(tasaIgvValor) || tasaIgvValor <= 0) {
            return { gravado: importeCentimos, igv: 0 };
        }
        const rate = tasaIgvValor / 100;
        const gravado = Math.round(importeCentimos / (1 + rate));
        const igv = importeCentimos - gravado;
        return { gravado, igv };
    };

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

        if (selectedSedeId) {
            const objetivo = String(selectedSedeId);
            filtered = filtered.filter((p) => {
                const raw = p?.raw || {};
                const sedeRaw = raw.sedeOrigenId ?? raw.sedeId ?? raw.sede_origen_id ?? null;
                return sedeRaw != null ? String(sedeRaw) === objetivo : true;
            });
        }

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
    }, [pedidos, clientesMap, filters, selectedSedeId]);

    // Importante: el descuento de inventario al marcar ENTREGADO debe ejecutarse una sola vez.
    // Para evitar duplicados, el frontend NO crea movimientos de inventario en este punto;
    // se asume que el backend se encarga del descuento al cambiar el estado a ENTREGADO.

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
        onError: (err) => {
            const errMsg = err?.response?.data?.message || err?.message || 'No se pudo registrar el pago';
            console.error(errMsg);
            message.error(errMsg);
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
                // Nota: al marcar ENTREGADO queremos que el responsable quede asociado.
                // Algunos flujos/reportes usan vendedorId como referencia del responsable.
                vendedorId: nuevoEstado === 'entregado' ? (usuarioId || pedido.raw.vendedorId) : pedido.raw.vendedorId,
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
        queryKey: PEDIDO_KEYS.detalles(tiendaId, selectedSedeId ?? null, detailDrawer.pedido?.id),
        queryFn: () => getDetallesPedido(tiendaId, detailDrawer.pedido.id),
        enabled: !!detailDrawer.pedido && !!tiendaId,
    });

    const detailPagosQuery = useQuery({
        queryKey: PEDIDO_KEYS.pagos(tiendaId, selectedSedeId ?? null, detailDrawer.pedido?.id),
        queryFn: () => getPagosPedido(tiendaId, detailDrawer.pedido.id),
        enabled: !!detailDrawer.pedido && !!tiendaId,
    });

    const handleManageStatus = (pedido) => {
        const cliente = clientesMap.get(pedido?.raw?.clienteId) || null;
        setStatusModal({ open: true, pedido, cliente });
    };

    const handleViewDetail = (pedido) => {
        setDetailDrawer({ open: true, pedido });
    };

    const handleCloseStatusModal = () => {
        setStatusModal({ open: false, pedido: null, cliente: null });
    };

    const handleCloseDetailDrawer = () => {
        setDetailDrawer({ open: false, pedido: null });
    };

    const handleConfirmPayment = (pedido, paymentData) => {
        return paymentMutation.mutateAsync({ pedido, paymentData });
    };

    const handleConfirmStatus = (pedido, nuevoEstado) => {
        statusMutation.mutate({ pedido, nuevoEstado });
    };

    const emitirComprobanteMutation = useMutation({
        mutationFn: async ({ pedido, data }) => {
            if (!tiendaId) {
                throw new Error('No se pudo determinar la tienda.');
            }
            if (!pedido?.raw?.id) {
                throw new Error('Pedido inválido.');
            }

            const pedidoId = pedido.raw.id;
            const pedidoDetail = await getPedidoById(tiendaId, pedidoId);

            // No confiar solo en estadoPago (puede estar desfasado mientras el modal sigue abierto).
            // Validamos por montos en centimos.
            const totalCentimosPagoCheck = Number(pedidoDetail?.totalFinalCentimos ?? 0);
            const pagadoCentimosPagoCheck = Number(pedidoDetail?.montoPagadoCentimos ?? 0);
            if (totalCentimosPagoCheck > 0 && pagadoCentimosPagoCheck < totalCentimosPagoCheck) {
                throw new Error('El pedido debe tener pago total antes de emitir comprobante.');
            }

            if (pedidoDetail?.tipoComprobante && pedidoDetail?.serieComprobante && pedidoDetail?.numeroComprobante) {
                throw new Error('Este pedido ya tiene un comprobante emitido.');
            }

            const totalCentimos = Number(pedidoDetail?.totalFinalCentimos ?? 0);
            const { gravado: totalGravadoCentimos, igv: totalIgvCentimos } = calcularTotalesComprobante(totalCentimos);

            const comprobanteRegistrado = await createComprobante(tiendaId, {
                tiendaId,
                pedidoId,
                serieId: data.serieId,
                emisorRazonSocial: facturacionConfig?.razonSocial || '',
                emisorRuc: facturacionConfig?.ruc || '',
                emisorDireccion: facturacionConfig?.direccionFiscal || '',
                clienteTipoDoc: data.clienteDocTipo,
                clienteNumeroDoc: data.clienteDocNumero,
                clienteNombre: data.clienteNombre,
                clienteDireccion: data.clienteDireccion,
                tipoComprobante: data.tipoComprobante,
                correlativo: data.correlativo,
                moneda: (pedidoDetail?.moneda || 'PEN'),
                totalGravadoCentimos,
                totalInafectoCentimos: 0,
                totalExoneradoCentimos: 0,
                totalIgvCentimos,
                totalImpuestosBolsaCentimos: 0,
                totalImporteCentimos: totalCentimos,
            });

            // A partir de aquí el comprobante ya fue creado. Si algo falla (incremento correlativo,
            // actualización del pedido o carga de detalle/pagos), igual mostramos el comprobante
            // para que el usuario pueda imprimirlo.

            try {
                await incrementarCorrelativoSerie(tiendaId, data.serieId);
            } catch (err) {
                console.error('No se pudo incrementar correlativo de serie', err);
            }

            let pedidoBase = pedidoDetail;
            try {
                const updatePayload = {
                    codigoPedido: pedidoDetail?.codigoPedido,
                    sedeOrigenId: pedidoDetail?.sedeOrigenId,
                    clienteId: data?.clienteId || pedidoDetail?.clienteId,
                    origen: pedidoDetail?.origen,
                    sesionCajaId: pedidoDetail?.sesionCajaId,
                    vendedorId: pedidoDetail?.vendedorId,
                    estadoPedido: pedidoDetail?.estadoPedido,
                    estadoPago: pedidoDetail?.estadoPago,
                    tipoEntrega: pedidoDetail?.tipoEntrega,
                    fechaEntregaPactada: pedidoDetail?.fechaEntregaPactada,
                    direccionEntrega: pedidoDetail?.direccionEntrega,
                    costoDeliveryCentimos: pedidoDetail?.costoDeliveryCentimos,
                    moneda: pedidoDetail?.moneda,
                    subtotalItemsCentimos: pedidoDetail?.subtotalItemsCentimos,
                    descuentoTotalCentimos: pedidoDetail?.descuentoTotalCentimos,
                    impuestosTotalesCentimos: pedidoDetail?.impuestosTotalesCentimos,
                    totalFinalCentimos: pedidoDetail?.totalFinalCentimos,
                    montoPagadoCentimos: pedidoDetail?.montoPagadoCentimos,
                    requiereComprobante: true,
                    tipoComprobante: data.tipoComprobante,
                    serieComprobante: data.serieCodigo,
                    // En backend el campo es String; enviar siempre string para evitar fallas de coerción.
                    numeroComprobante: String(data.correlativo ?? ''),
                    notasPedido: pedidoDetail?.notasPedido,
                };

                const pedidoActualizado = await updatePedido(tiendaId, pedidoId, updatePayload);
                pedidoBase = pedidoActualizado || pedidoDetail;
            } catch (err) {
                console.error('No se pudo actualizar el pedido con datos de comprobante', err);
            }

            let detalles = [];
            let pagos = [];
            try {
                [detalles, pagos] = await Promise.all([
                    getDetallesPedido(tiendaId, pedidoId),
                    getPagosPedido(tiendaId, pedidoId),
                ]);
            } catch (err) {
                console.error('No se pudieron cargar detalles/pagos para el recibo', err);
            }

            const receiptPayload = buildReceiptPayload({
                ...pedidoBase,
                comprobante: { ...comprobanteRegistrado, serieCodigo: data.serieCodigo },
            }, detalles, pagos);

            // Force comprobante ticket layout
            receiptPayload.receiptKind = 'comprobante';

            return receiptPayload;
        },
        onSuccess: (payload) => {
            queryClient.invalidateQueries(PEDIDO_KEYS.all);
            setReceiptData(payload);
            handleCloseStatusModal();
        },
        onError: (err) => {
            const errMsg = err?.response?.data?.message || err?.message || 'No se pudo emitir el comprobante';
            console.error(errMsg);
            message.error(errMsg);
        },
    });

    const handleEmitirComprobante = (pedido, data) => {
        return emitirComprobanteMutation.mutateAsync({ pedido, data });
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
                cliente={statusModal.cliente}
                clientes={clientesQuery.data || []}
                onClose={handleCloseStatusModal}
                onConfirmPayment={handleConfirmPayment}
                onConfirmStatus={handleConfirmStatus}
                onEmitirComprobante={handleEmitirComprobante}
                loadingPayment={paymentMutation.isPending}
                loadingStatus={statusMutation.isPending}
                loadingEmitirComprobante={emitirComprobanteMutation.isPending}
                facturacionConfig={facturacionConfigError ? null : facturacionConfig}
                facturacionConfigLoading={isFacturacionConfigLoading}
                tiendaId={tiendaId}
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
