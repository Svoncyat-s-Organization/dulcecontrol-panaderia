import { create } from 'zustand';
import { facturacionApi } from '../api/facturacion.api';
import { message } from 'antd';

/**
 * Store para gestionar el estado del módulo de facturación (POS)
 */
export const useFacturacionStore = create((set, get) => ({
    // Estado Inicial
    carrito: [],
    cliente: null,
    configuracion: {
        serieId: null,
        tipoComprobante: 'BOLETA', // BOLETA, FACTURA
        moneda: 'PEN',
        tiendaId: null, // Se debe setear al iniciar el componente
        sedeId: null,
        usuarioId: null // Vendedor
    },
    totales: {
        subtotal: 0,
        igv: 0,
        total: 0,
        gravada: 0,
        exonerada: 0,
        inafecta: 0
    },
    loading: false,

    // Acciones de Configuración
    setConfiguracion: (config) => set((state) => ({
        configuracion: { ...state.configuracion, ...config }
    })),

    // Acciones del Carrito
    agregarProducto: (producto) => {
        const { carrito } = get();
        const existe = carrito.find(item => item.id === producto.id);

        if (existe) {
            // Si ya existe, aumentamos cantidad
            get().actualizarCantidad(producto.id, existe.cantidad + 1);
        } else {
            // Si no existe, lo agregamos
            const nuevoItem = {
                ...producto,
                cantidad: 1,
                precioUnitario: producto.precio || 0, // Asegurar precio
                subtotal: producto.precio || 0,
                tipoIgv: producto.tipoIgv || 'GRAVADO' // Asumimos gravado por defecto si no viene
            };
            set({ carrito: [...carrito, nuevoItem] });
            get().recalcularTotales();
        }
    },

    removerProducto: (productoId) => {
        set((state) => ({
            carrito: state.carrito.filter(item => item.id !== productoId)
        }));
        get().recalcularTotales();
    },

    actualizarCantidad: (productoId, cantidad) => {
        if (cantidad <= 0) {
            get().removerProducto(productoId);
            return;
        }

        set((state) => ({
            carrito: state.carrito.map(item => {
                if (item.id === productoId) {
                    return {
                        ...item,
                        cantidad,
                        subtotal: item.precioUnitario * cantidad
                    };
                }
                return item;
            })
        }));
        get().recalcularTotales();
    },

    limpiarCarrito: () => {
        set({ carrito: [], cliente: null, totales: { subtotal: 0, igv: 0, total: 0, gravada: 0, exonerada: 0, inafecta: 0 } });
    },

    // Acciones de Cliente
    seleccionarCliente: (cliente) => {
        set({ cliente });
    },

    // Lógica de Negocio
    recalcularTotales: () => {
        const { carrito } = get();
        let gravada = 0;
        let exonerada = 0;
        let inafecta = 0;
        let igv = 0;

        carrito.forEach(item => {
            const subtotalItem = item.precioUnitario * item.cantidad;

            // Lógica simplificada de impuestos (ajustar según reglas de negocio reales)
            // Asumimos que el precio unitario YA INCLUYE IGV para items gravados
            if (item.tipoIgv === 'EXONERADO') {
                exonerada += subtotalItem;
            } else if (item.tipoIgv === 'INAFECTO') {
                inafecta += subtotalItem;
            } else {
                // GRAVADO (Precio incluye IGV)
                const baseImponible = subtotalItem / 1.18;
                gravada += baseImponible;
                igv += (subtotalItem - baseImponible);
            }
        });

        const total = gravada + igv + exonerada + inafecta;

        set({
            totales: {
                gravada,
                exonerada,
                inafecta,
                igv,
                subtotal: gravada + exonerada + inafecta, // Valor de venta
                total // Precio de venta total
            }
        });
    },

    // Procesamiento de Venta
    procesarVenta: async () => {
        const { carrito, cliente, configuracion, totales } = get();

        if (carrito.length === 0) {
            message.warning('El carrito está vacío');
            return;
        }
        if (!cliente) {
            message.warning('Debe seleccionar un cliente');
            return;
        }
        if (!configuracion.serieId) {
            message.warning('Debe seleccionar una serie de comprobante');
            return;
        }

        set({ loading: true });
        try {
            const tiendaId = configuracion.tiendaId;

            // 1. Crear Pedido
            const pedidoPayload = {
                codigoPedido: `PED-${Date.now()}`, // Temporal
                sedeOrigenId: configuracion.sedeId,
                clienteId: cliente.id,
                origen: 'TIENDA',
                estadoPedido: 'COMPLETADO', // Asumimos venta directa
                estadoPago: 'PAGADO',
                tipoEntrega: 'TIENDA',
                fechaEntregaPactada: new Date().toISOString(),
                moneda: configuracion.moneda,
                subtotalItemsCentimos: Math.round(totales.subtotal * 100),
                totalFinalCentimos: Math.round(totales.total * 100),
                requiereComprobante: true,
                tipoComprobante: configuracion.tipoComprobante
            };

            const pedido = await facturacionApi.crearPedido(tiendaId, pedidoPayload);

            // 2. Agregar Detalles
            for (const item of carrito) {
                const detallePayload = {
                    productoId: item.id,
                    cantidad: item.cantidad,
                    precioUnitarioCentimos: Math.round(item.precioUnitario * 100),
                    subtotalLineaCentimos: Math.round(item.subtotal * 100),
                    notasItem: ''
                };
                await facturacionApi.agregarDetallePedido(tiendaId, pedido.id, detallePayload);
            }

            // 3. Crear Comprobante
            const comprobantePayload = {
                tiendaId: tiendaId,
                pedidoId: pedido.id,
                serieId: configuracion.serieId,

                emisorRazonSocial: "Mi Panadería", // Debería venir de config
                emisorRuc: "20123456789",
                emisorDireccion: "Dirección Tienda",

                clienteTipoDoc: cliente.tipoDocumento || 'DNI',
                clienteNumeroDoc: cliente.numeroDocumento,
                clienteNombre: cliente.nombre || cliente.razonSocial,
                clienteDireccion: cliente.direccion || '-',

                tipoComprobante: configuracion.tipoComprobante,
                correlativo: 0, // Backend asigna? O frontend debe predecir? Asumimos 0 y backend asigna
                fechaEmision: new Date().toISOString(),
                moneda: configuracion.moneda,

                totalGravadoCentimos: Math.round(totales.gravada * 100),
                totalInafectoCentimos: Math.round(totales.inafecta * 100),
                totalExoneradoCentimos: Math.round(totales.exonerada * 100),
                totalIgvCentimos: Math.round(totales.igv * 100),
                totalImpuestosBolsaCentimos: 0,
                totalImporteCentimos: Math.round(totales.total * 100)
            };

            const comprobante = await facturacionApi.crearComprobante(tiendaId, comprobantePayload);

            message.success('Venta realizada con éxito');
            get().limpiarCarrito();
            return comprobante;

        } catch (error) {
            console.error('Error al procesar venta:', error);
            message.error('Error al procesar la venta. Revise la consola.');
        } finally {
            set({ loading: false });
        }
    }
}));
