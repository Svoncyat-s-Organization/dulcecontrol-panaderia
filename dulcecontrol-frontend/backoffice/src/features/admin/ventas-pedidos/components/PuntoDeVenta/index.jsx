import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import PosView from './PosView.jsx';
import CheckoutModal from './CheckoutModal.jsx';
import ReceiptModal from './ReceiptModal.jsx';
import { POS_MODES, useCartStore } from '../../hooks/useCartStore.js';
import { useCajaSession } from '../../hooks/useCajaSession.js';
import { useTokenStore } from '../../../../../shared/store/tokenStore.js';
import { createPedido, addDetallePedido, addPagoPedido, addDireccionPedido } from '../../api/pedidos.api.js';
import { registrarMovimientoCaja } from '../../api/cajas.api.js';
import { getConfiguracionTienda } from '../../api/configuracion.api.js';
import { createComprobante, incrementarCorrelativoSerie } from '../../api/facturacion.api.js';
import { CAJA_KEYS, PEDIDO_KEYS, FACTURACION_KEYS } from '../../constants/queryKeys.js';
import { getInventarioProductosPorSede } from '../../../inventario/api/existencias.api.js';
import { crearMovimientoInventarioProducto } from '../../../inventario/api/movimientos.api.js';
import { INVENTARIO_PRODUCTO_KEYS, INVENTARIO_MOVIMIENTO_KEYS } from '../../../inventario/constants/queryKeys.js';
import { TIPOS_ENTREGA } from '../../constants/ventaConstants.js';

const RECEIPT_STORAGE_KEY = 'dc-pos-last-receipt';

const persistReceiptPayload = (payload) => {
    if (typeof window === 'undefined') {
        return;
    }
    try {
        window.sessionStorage.setItem(
            RECEIPT_STORAGE_KEY,
            JSON.stringify({ createdAt: Date.now(), data: payload })
        );
    } catch {
        // Ignoramos errores de almacenamiento en navegadores con cuotas estrictas
    }
};

const readPersistedReceipt = () => {
    if (typeof window === 'undefined') {
        return null;
    }
    try {
        const raw = window.sessionStorage.getItem(RECEIPT_STORAGE_KEY);
        if (!raw) {
            return null;
        }
        const parsed = JSON.parse(raw);
        const maxAge = 5 * 60 * 1000;
        if (!parsed?.data || Date.now() - (parsed.createdAt || 0) > maxAge) {
            window.sessionStorage.removeItem(RECEIPT_STORAGE_KEY);
            return null;
        }
        return parsed.data;
    } catch {
        return null;
    }
};

const clearPersistedReceipt = () => {
    if (typeof window === 'undefined') {
        return;
    }
    try {
        window.sessionStorage.removeItem(RECEIPT_STORAGE_KEY);
    } catch {
        // Ignoramos errores al limpiar almacenamiento
    }
};

const normalizeDocumentoContacto = (value) => {
    if (!value) {
        return null;
    }
    const normalized = String(value).toUpperCase();
    return normalized === 'DNI' || normalized === 'RUC' ? normalized : null;
};

const PuntoDeVenta = () => {
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [receiptData, setReceiptData] = useState(null);

    const { items, cliente, getTotal, clearCart, posMode } = useCartStore();
    const { session, usuarioId, currentCaja, isLoading: isCajaDataLoading } = useCajaSession();
    const tiendaId = useTokenStore((state) => state.tiendaId);
    const queryClient = useQueryClient();
    const {
        data: facturacionConfig,
        isLoading: isFacturacionConfigLoading,
        error: facturacionConfigError,
    } = useQuery({
        queryKey: FACTURACION_KEYS.configuracion(tiendaId || null),
        queryFn: () => getConfiguracionTienda(tiendaId),
        enabled: !!tiendaId,
        retry: false,
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

    useEffect(() => {
        const cachedReceipt = readPersistedReceipt();
        if (cachedReceipt) {
            setReceiptData(cachedReceipt);
        }
    }, []);

    const ensureContextReady = () => {
        if (isCajaDataLoading) {
            console.info('Información de caja aún cargándose.');
            return false;
        }
        if (!tiendaId) {
            console.error('No se pudo determinar la tienda.');
            return false;
        }
        if (!session?.id) {
            console.error('No hay sesión de caja abierta.');
            return false;
        }
        if (!usuarioId) {
            console.error('No se pudo identificar al vendedor.');
            return false;
        }
        if (!currentCaja?.sedeId) {
            console.error('No se pudo determinar la sede asociada a la caja.');
            return false;
        }
        return true;
    };

    const toLocalDateTimeString = () => new Date().toISOString().split('.')[0];

    const syncInventarioTrasVenta = async ({ pedidoId, itemsVendidos }) => {
        console.log('🛍️ [POS VENTA] Iniciando sincronización de inventario tras venta POS');
        console.log('🛍️ [POS VENTA] Pedido ID:', pedidoId, '| Sede ID:', currentCaja?.sedeId, '| Tienda ID:', tiendaId);
        console.log('🛍️ [POS VENTA] Items vendidos:', itemsVendidos.length);
        console.table(itemsVendidos.map(i => ({ ProductoID: i.id, Nombre: i.nombre, Cantidad: i.quantity })));
        
        if (!currentCaja?.sedeId) {
            throw new Error('No se puede ajustar inventario sin una sede activa');
        }

        console.log('📦 [POS VENTA] Obteniendo inventarios de la sede...');
        const inventarios = await getInventarioProductosPorSede(tiendaId, currentCaja.sedeId);
        console.log('📦 [POS VENTA] Inventarios obtenidos:', inventarios?.length || 0);
        const inventarioPorProducto = new Map(
            (Array.isArray(inventarios) ? inventarios : []).map((registro) => [String(registro.productoId), registro])
        );

        const faltantes = [];

        for (const item of itemsVendidos) {
            const registro = inventarioPorProducto.get(String(item.id));
            if (!registro) {
                console.error('❌ [POS VENTA] No hay inventario para:', item.nombre || item.sku || `ID ${item.id}`);
                faltantes.push(item.nombre || item.sku || `ID ${item.id}`);
                continue;
            }

            console.log(`🔄 [POS VENTA] Creando movimiento de salida para producto ${item.id}: ${item.quantity} unidades`);
            console.log('   Stock actual:', registro.cantidadActual, '→ Stock después:', registro.cantidadActual - item.quantity);
            
            const movimiento = await crearMovimientoInventarioProducto(tiendaId, {
                sedeId: registro.sedeId,
                productoId: registro.productoId,
                tipoMovimiento: 'salida',
                cantidad: item.quantity,
                pedidoId,
                motivo: 'venta',
                responsableId: usuarioId,
            });
            
            console.log('✅ [POS VENTA] Movimiento de inventario creado para producto', item.id);
            
            if (movimiento.planificacionAutomaticaGenerada) {
                console.log('🎉 [PLANIFICACIÓN AUTO] ¡Plan de producción generado automáticamente!');
                console.log('   Plan ID:', movimiento.planGeneradoId);
                console.log('   Stock bajó al punto de reposición - Se planificará reposición automática');
            } else {
                console.log('ℹ️ [PLANIFICACIÓN] Stock OK - No se requiere planificación automática');
            }
        }

        if (faltantes.length) {
            console.error('❌ [POS VENTA] Error:', `Inventario no configurado para: ${faltantes.join(', ')}`);
            throw new Error(`Inventario no configurado para: ${faltantes.join(', ')}`);
        }
        
        console.log('✅ [POS VENTA] ¡Inventario sincronizado correctamente!');
        console.log('🔔 [POS VENTA] IMPORTANTE: El backend debería verificar automáticamente si algún producto llegó al punto de reposición');
    };

    const createPedidoMutation = useMutation({
        mutationFn: async (checkoutData) => {
            if (!ensureContextReady()) {
                throw new Error('Contexto de caja incompleto');
            }
            const facturacionReady = !!(facturacionConfig?.ruc && facturacionConfig?.razonSocial && facturacionConfig?.direccionFiscal);
            if (!facturacionReady) {
                throw new Error('Configuración de facturación incompleta. Completa tus datos fiscales antes de registrar ventas.');
            }

            const total = getTotal();
            const itemsSnapshot = items.map((item) => ({ ...item }));
            const subtotal = itemsSnapshot.reduce((acc, item) => acc + (item.precioBaseCentimos * item.quantity), 0);
            const totalCentimos = Math.round(total * 100);
            const checkoutMode = checkoutData.posMode || posMode;
            const isPedido = checkoutMode === POS_MODES.PEDIDO;
            const isDelivery = checkoutData.tipoEntrega === TIPOS_ENTREGA.DELIVERY;
            const rawMontoPagado = typeof checkoutData.montoPagado === 'number'
                ? checkoutData.montoPagado
                : (isPedido ? 0 : total);
            const montoPagadoCentimos = Math.max(0, Math.round(rawMontoPagado * 100));
            const estadoPago = isPedido
                ? (montoPagadoCentimos === 0
                    ? 'pendiente'
                    : montoPagadoCentimos < totalCentimos
                        ? 'parcial'
                        : 'pagado_total')
                : 'pagado_total';
            const estadoPedido = isPedido
                ? (estadoPago === 'pagado_total' ? 'en_preparacion' : 'pendiente_pago')
                : 'pagado';
            const codigoPedido = `${isPedido ? 'PED' : 'POS'}-${Date.now()}`;
            const fechaEntregaPactada = checkoutData.fechaEntrega || toLocalDateTimeString();
            const shippingDireccion = checkoutData.shippingDireccion?.trim() || null;
            const shippingReferencia = checkoutData.shippingReferencia?.trim() || null;
            const shippingDistrito = checkoutData.shippingDistrito?.trim() || null;
            const shippingProvincia = checkoutData.shippingProvincia?.trim() || null;
            const shippingDepartamento = checkoutData.shippingDepartamento?.trim() || null;
            const direccionEntrega = isDelivery
                ? [
                    shippingDireccion,
                    shippingReferencia ? `Ref: ${shippingReferencia}` : null,
                    [shippingDistrito, shippingProvincia, shippingDepartamento].filter(Boolean).join(', ')
                ].filter(Boolean).join(' | ') || null
                : null;
            const costoDeliveryCentimos = isDelivery
                ? Math.max(0, Math.round((checkoutData.costoDelivery || 0) * 100))
                : 0;
            const shippingContactoNombre = isDelivery
                ? (checkoutData.shippingContactoNombre?.trim() || cliente?.nombreDoc || 'Cliente POS')
                : null;
            const shippingContactoTelefono = isDelivery
                ? (checkoutData.shippingContactoTelefono?.trim() || cliente?.telefono || '000000000')
                : null;
            const shippingCodigoUbigeo = isDelivery ? (checkoutData.shippingCodigoUbigeo || null) : null;
            const contactoDocTipo = normalizeDocumentoContacto(cliente?.tipoDoc ?? cliente?.tipo_doc);
            const contactoDocNumero = cliente?.numeroDoc ?? cliente?.numero_doc ?? null;
            const contactoEmail = cliente?.correo ?? cliente?.email ?? null;
            const serieIdSeleccionada = checkoutData.comprobanteSerieId;
            const serieCodigoSeleccionada = checkoutData.comprobanteSerieCodigo;
            const correlativoSeleccionado = checkoutData.comprobanteCorrelativo;
            if (!serieIdSeleccionada || !correlativoSeleccionado) {
                throw new Error('No se pudo determinar la serie y correlativo del comprobante. Refresca las series e inténtalo nuevamente.');
            }
            const clienteDocTipo = (checkoutData.clienteDocTipo || 'DNI').toUpperCase();
            const clienteDocNumero = checkoutData.clienteDocNumero || '';
            const clienteNombre = checkoutData.clienteNombre || cliente?.nombreDoc || 'Cliente POS';
            const clienteDireccion = checkoutData.clienteDireccion || (isDelivery ? shippingDireccion : null) || cliente?.direccion || null;
            const { gravado: totalGravadoCentimos, igv: totalIgvCentimos } = calcularTotalesComprobante(totalCentimos);

            const pedidoPayload = {
                codigoPedido,
                sedeOrigenId: currentCaja.sedeId,
                clienteId: checkoutData.clienteId || cliente?.id || null,
                origen: 'pos_local',
                sesionCajaId: session.id,
                vendedorId: usuarioId,
                estadoPedido,
                estadoPago,
                tipoEntrega: checkoutData.tipoEntrega || 'consumo_local',
                fechaEntregaPactada,
                direccionEntrega,
                costoDeliveryCentimos,
                moneda: 'PEN',
                subtotalItemsCentimos: Math.round(subtotal),
                descuentoTotalCentimos: 0,
                impuestosTotalesCentimos: 0,
                totalFinalCentimos: totalCentimos,
                montoPagadoCentimos,
                requiereComprobante: true,
                tipoComprobante: checkoutData.tipoComprobante,
                serieComprobante: serieCodigoSeleccionada || null,
                numeroComprobante: correlativoSeleccionado || null,
                notasPedido: checkoutData.notasPedido?.trim() || null,
            };

            const pedidoCreado = await createPedido(tiendaId, pedidoPayload);
            const pedidoId = pedidoCreado.id;

            let direccionEnvioRegistrada = null;
            if (isDelivery && shippingDireccion) {
                const direccionPayload = {
                    tipoDireccion: 'envio',
                    nombreContacto: shippingContactoNombre,
                    tipoDocContacto: contactoDocTipo,
                    numeroDocContacto: contactoDocNumero ? String(contactoDocNumero) : null,
                    telefonoContacto: shippingContactoTelefono,
                    emailContacto: contactoEmail || null,
                    direccionCompleta: direccionEntrega || shippingDireccion,
                    referencia: shippingReferencia || null,
                    distrito: shippingDistrito || null,
                    provincia: shippingProvincia || null,
                    departamento: shippingDepartamento || null,
                    codigoUbigeo: shippingCodigoUbigeo,
                    codigoPostal: null,
                };

                try {
                    direccionEnvioRegistrada = await addDireccionPedido(tiendaId, pedidoId, direccionPayload);
                } catch (error) {
                    console.error('No se pudo registrar la dirección de entrega del pedido', error);
                }
            }

            // 2. Agregar detalles (items)
            const detallesPromises = itemsSnapshot.map(item => {
                const detallePayload = {
                    productoId: item.id,
                    cantidad: item.quantity,
                    precioUnitarioCentimos: item.precioBaseCentimos,
                    subtotalLineaCentimos: item.precioBaseCentimos * item.quantity,
                    notasItem: item.customNotes || ''
                };
                return addDetallePedido(tiendaId, pedidoId, detallePayload);
            });

            await Promise.all(detallesPromises);

            // 3. Registrar el pago
            let pagoRegistrado = null;
            let pagoPayloadResumen = null;
            if (montoPagadoCentimos > 0) {
                const pagoPayload = {
                    sesionCajaId: session.id,
                    montoPagadoCentimos,
                    metodoPago: checkoutData.metodoPago,
                    referenciaExterna: null,
                    fechaPago: toLocalDateTimeString(),
                    registradoPor: usuarioId
                };

                pagoPayloadResumen = { ...pagoPayload };
                pagoRegistrado = await addPagoPedido(tiendaId, pedidoId, pagoPayload);

                await registrarMovimientoCaja(tiendaId, session.id, {
                    tipoMovimiento: 'venta',
                    montoCentimos: montoPagadoCentimos,
                    metodoPago: checkoutData.metodoPago,
                    pedidoId,
                    concepto: `Venta POS ${pedidoPayload.codigoPedido}`,
                    comprobanteAsociado: pedidoCreado.codigoPedido || null,
                });
            }

            if (!isPedido) {
                await syncInventarioTrasVenta({ pedidoId, itemsVendidos: itemsSnapshot });
            }

            let comprobanteRegistrado = null;
            try {
                comprobanteRegistrado = await createComprobante(tiendaId, {
                    tiendaId,
                    pedidoId,
                    serieId: serieIdSeleccionada,
                    emisorRazonSocial: facturacionConfig.razonSocial,
                    emisorRuc: facturacionConfig.ruc,
                    emisorDireccion: facturacionConfig.direccionFiscal,
                    clienteTipoDoc: clienteDocTipo,
                    clienteNumeroDoc: clienteDocNumero,
                    clienteNombre,
                    clienteDireccion,
                    tipoComprobante: checkoutData.tipoComprobante,
                    correlativo: correlativoSeleccionado,
                    moneda: 'PEN',
                    totalGravadoCentimos,
                    totalInafectoCentimos: 0,
                    totalExoneradoCentimos: 0,
                    totalIgvCentimos,
                    totalImpuestosBolsaCentimos: 0,
                    totalImporteCentimos: totalCentimos,
                });
                await incrementarCorrelativoSerie(tiendaId, serieIdSeleccionada);
            } catch (error) {
                console.error('No se pudo registrar el comprobante electrónico', error);
                throw new Error(error?.response?.data?.message || 'No se pudo registrar el comprobante electrónico');
            }

            const clienteResumen = {
                ...(cliente || {}),
                nombreDoc: clienteNombre,
                numeroDoc: clienteDocNumero,
                tipoDoc: clienteDocTipo,
                direccion: clienteDireccion,
            };
            const comprobanteResumen = comprobanteRegistrado
                ? { ...comprobanteRegistrado, serieCodigo: serieCodigoSeleccionada }
                : null;

            // Retornar objeto completo para el recibo
            return {
                ...pedidoCreado,
                items: itemsSnapshot.map(item => ({
                    ...item,
                    subtotalLineaCentimos: item.precioBaseCentimos * item.quantity
                })),
                totalFinalCentimos: pedidoCreado.totalFinalCentimos ?? totalCentimos,
                montoPagadoCentimos,
                metodoPago: pagoPayloadResumen?.metodoPago || null,
                pagos: pagoRegistrado ? [pagoRegistrado] : [],
                fechaCreacion: pedidoCreado.fechaCreacion || pedidoCreado.creadoEn || new Date().toISOString(),
                tipoComprobante: checkoutData.tipoComprobante,
                notasPedido: pedidoPayload.notasPedido,
                tipoEntrega: pedidoPayload.tipoEntrega,
                direccionEntrega,
                direccionEnvio: direccionEnvioRegistrada,
                shipping: isDelivery ? {
                    direccion: shippingDireccion,
                    referencia: shippingReferencia,
                    distrito: shippingDistrito,
                    provincia: shippingProvincia,
                    departamento: shippingDepartamento,
                    codigoUbigeo: shippingCodigoUbigeo,
                    contactoNombre: shippingContactoNombre,
                    contactoTelefono: shippingContactoTelefono,
                } : null,
                serieComprobante: serieCodigoSeleccionada,
                numeroComprobante: correlativoSeleccionado,
                comprobante: comprobanteResumen,
                cliente: clienteResumen,
            };
        },
        onSuccess: (data) => {
            setReceiptData(data);
            persistReceiptPayload(data);
            clearCart();
            setIsCheckoutOpen(false);
            queryClient.invalidateQueries(PEDIDO_KEYS.all);
            if (currentCaja?.sedeId) {
                queryClient.invalidateQueries(INVENTARIO_PRODUCTO_KEYS.lists(tiendaId, currentCaja.sedeId));
                queryClient.invalidateQueries(INVENTARIO_MOVIMIENTO_KEYS.productos.lists(tiendaId, currentCaja.sedeId));
            }
            if (session?.id) {
                queryClient.invalidateQueries(CAJA_KEYS.movimientos(tiendaId, session.id));
            }
        },
        onError: (err) => console.error(err?.response?.data?.message || err.message || 'Error al procesar venta')
    });

    const handleCheckout = () => {
        if (items.length === 0) {
            console.warn('El carrito está vacío');
            return;
        }
        if (!ensureContextReady()) {
            return;
        }
        setIsCheckoutOpen(true);
    };

    const handleConfirmCheckout = (values) => {
        createPedidoMutation.mutate(values);
    };

    const handleReceiptClose = () => {
        clearPersistedReceipt();
        setReceiptData(null);
    };

    return (
        <>
            <PosView onCheckout={handleCheckout} />
            <CheckoutModal
                open={isCheckoutOpen}
                onCancel={() => setIsCheckoutOpen(false)}
                onConfirm={handleConfirmCheckout}
                total={getTotal()}
                loading={createPedidoMutation.isPending}
                sedeId={currentCaja?.sedeId || null}
                facturacionConfig={facturacionConfig}
                facturacionConfigLoading={isFacturacionConfigLoading}
                facturacionConfigError={facturacionConfigError}
            />
            <ReceiptModal
                open={!!receiptData}
                onClose={handleReceiptClose}
                pedido={receiptData}
            />
        </>
    );
};

export default PuntoDeVenta;
