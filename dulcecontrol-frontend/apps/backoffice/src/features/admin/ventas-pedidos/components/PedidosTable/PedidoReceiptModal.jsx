import { Modal, Typography, Divider, Button } from 'antd';
import { PrinterOutlined, CloseOutlined } from '@ant-design/icons';
import { useRef, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useTokenStore } from '../../../../../shared/store/tokenStore.js';
import { getDetallesPedido, getPagosPedido } from '../../api/pedidos.api.js';
import { PEDIDO_KEYS } from '../../constants/queryKeys.js';

const { Title, Text } = Typography;

const formatMoney = (value = 0) => {
    const safeValue = Number.isFinite(value) ? value : 0;
    return `S/ ${(safeValue / 100).toFixed(2)}`;
};

const printTicket = (html) => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
        return;
    }

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.style.visibility = 'hidden';

    document.body.appendChild(iframe);
    const printDocument = iframe.contentWindow?.document;
    if (!printDocument) {
        document.body.removeChild(iframe);
        return;
    }

    printDocument.open();
    printDocument.write(`<!DOCTYPE html><html><head><title>Ticket</title>
        <style>
            body { font-family: 'Fira Mono', 'SFMono-Regular', Consolas, monospace; margin: 0; padding: 16px; color: #0f172a; }
            h1, h2, h3, h4, h5, h6 { margin: 0; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 4px 0; font-size: 12px; }
            th { text-align: left; border-bottom: 1px solid #cbd5e1; }
        </style>
    </head><body>${html}</body></html>`);
    printDocument.close();

    const triggerPrint = () => {
        try {
            iframe.contentWindow?.focus();
            iframe.contentWindow?.print();
        } finally {
            document.body.removeChild(iframe);
        }
    };

    setTimeout(triggerPrint, 100);
};

const PedidoReceiptModal = ({ open, onClose, pedido }) => {
    const printAreaRef = useRef(null);
    const tiendaId = useTokenStore((state) => state.tiendaId);
    const [pedidoData, setPedidoData] = useState(null);

    const detallesQuery = useQuery({
        queryKey: PEDIDO_KEYS.detalles(tiendaId, pedido?.id),
        queryFn: () => getDetallesPedido(tiendaId, pedido.id),
        enabled: !!pedido && !!tiendaId && open,
    });

    const pagosQuery = useQuery({
        queryKey: PEDIDO_KEYS.pagos(tiendaId, pedido?.id),
        queryFn: () => getPagosPedido(tiendaId, pedido.id),
        enabled: !!pedido && !!tiendaId && open,
    });

    useEffect(() => {
        if (open && pedido && detallesQuery.data && pagosQuery.data) {
            setPedidoData({
                ...pedido.raw,
                items: detallesQuery.data,
                pagos: pagosQuery.data,
            });
        }
    }, [open, pedido, detallesQuery.data, pagosQuery.data]);

    const handlePrint = () => {
        if (!printAreaRef.current) {
            return;
        }
        printTicket(printAreaRef.current.innerHTML);
    };

    if (!pedido || !pedidoData) return null;

    const items = Array.isArray(pedidoData.items) ? pedidoData.items : [];
    const pagos = Array.isArray(pedidoData.pagos) ? pedidoData.pagos : [];

    const totalCentimos = pedidoData.totalFinalCentimos || 0;
    const totalPagado = pagos.reduce((acc, pago) => acc + (pago.montoPagadoCentimos || 0), 0);
    const cambioCentimos = Math.max(0, totalPagado - totalCentimos);
    const notasPedido = pedidoData.notasPedido || null;

    return (
        <Modal open={open} onCancel={onClose} footer={null} width={420} closable={false} destroyOnClose>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text strong>Comprobante de Pedido</Text>
                    <Button type="text" icon={<CloseOutlined />} onClick={onClose} aria-label="Cerrar" />
                </div>

                <div
                    ref={printAreaRef}
                    id="pedido-print-area"
                    style={{
                        border: '1px solid #e2e8f0',
                        borderRadius: 12,
                        padding: 24,
                        fontFamily: 'Fira Mono, SFMono-Regular, Consolas, monospace',
                        background: '#fff',
                    }}
                >
                    <div style={{ textAlign: 'center', marginBottom: 16 }}>
                        <Title level={4} style={{ marginBottom: 4 }}>DulceControl</Title>
                        <Text style={{ display: 'block' }}>Av. Principal 123, Tarapoto</Text>
                        <Text style={{ display: 'block' }}>RUC: 20123456789</Text>
                        <div
                            style={{
                                marginTop: 12,
                                display: 'inline-block',
                                border: '1px solid #0f172a',
                                padding: '4px 12px',
                                fontWeight: 600,
                            }}
                        >
                            PEDIDO
                        </div>
                    </div>

                    <div style={{ borderBottom: '1px dashed #cbd5e1', paddingBottom: 8, marginBottom: 8 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Ticket:</span>
                            <span>{pedidoData.codigoPedido}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                            <span>Fecha:</span>
                            <span>
                                {new Date(pedidoData.creadoEn || Date.now()).toLocaleDateString()}{' '}
                                {new Date(pedidoData.creadoEn || Date.now()).toLocaleTimeString()}
                            </span>
                        </div>
                        {pedidoData.fechaEntregaPactada && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                                <span>F. Entrega:</span>
                                <span>{dayjs(pedidoData.fechaEntregaPactada).format('DD/MM/YYYY')}</span>
                            </div>
                        )}
                    </div>

                    <div style={{ borderBottom: '1px dashed #cbd5e1', paddingBottom: 8, marginBottom: 8 }}>
                        <Text strong style={{ display: 'block', marginBottom: 4 }}>Cliente</Text>
                        <div>{pedido.cliente || 'Cliente General'}</div>
                    </div>

                    <table style={{ width: '100%', marginBottom: 12 }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #cbd5e1' }}>
                                <th style={{ paddingBottom: 4 }}>Cant.</th>
                                <th style={{ paddingBottom: 4 }}>Descripción</th>
                                <th style={{ paddingBottom: 4, textAlign: 'right' }}>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, idx) => (
                                <tr key={item.id || idx}>
                                    <td style={{ padding: '4px 0' }}>{item.cantidad || 0}</td>
                                    <td style={{ padding: '4px 0' }}>
                                        <div>{item.nombreProducto || item.descripcion || 'Producto'}</div>
                                        {item.notasItem && (
                                            <div style={{ fontSize: 10, color: '#64748b' }}>
                                                {item.notasItem}
                                            </div>
                                        )}
                                    </td>
                                    <td style={{ padding: '4px 0', textAlign: 'right' }}>
                                        {formatMoney(item.subtotalLineaCentimos || 0)}
                                    </td>
                                </tr>
                            ))}
                            {items.length === 0 && (
                                <tr>
                                    <td colSpan={3} style={{ textAlign: 'center', padding: 12 }}>
                                        Sin productos registrados
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {notasPedido && (
                        <div style={{ borderTop: '1px dashed #cbd5e1', padding: '8px 0', fontSize: 12 }}>
                            <Text strong style={{ display: 'block', marginBottom: 4 }}>Notas del pedido</Text>
                            <div>{notasPedido}</div>
                        </div>
                    )}

                    <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: 8 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                            <span>Total</span>
                            <span>{formatMoney(totalCentimos)}</span>
                        </div>
                        <Divider style={{ margin: '12px 0' }} />
                        <div>
                            <Text strong>Pagos</Text>
                            <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
                                {pagos.map((pago) => (
                                    <div key={pago.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>{(pago.metodoPago || 's/d').toUpperCase()}</span>
                                        <span>{formatMoney(pago.montoPagadoCentimos || 0)}</span>
                                    </div>
                                ))}
                                {pagos.length === 0 && <Text type="secondary">Sin pagos registrados</Text>}
                                {cambioCentimos > 0 && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                                        <span>Cambio</span>
                                        <span>{formatMoney(cambioCentimos)}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div style={{ textAlign: 'center', marginTop: 16, fontSize: 10, color: '#64748b' }}>
                        <div>Documento de control interno.</div>
                        <div>¡Gracias por su preferencia!</div>
                    </div>
                </div>

                <Button type="primary" icon={<PrinterOutlined />} block size="large" onClick={handlePrint}>
                    Imprimir pedido
                </Button>
            </div>
        </Modal>
    );
};

export default PedidoReceiptModal;
