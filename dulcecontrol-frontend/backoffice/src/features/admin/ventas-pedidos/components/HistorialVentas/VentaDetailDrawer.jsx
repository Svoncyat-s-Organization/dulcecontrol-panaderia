import { Drawer, Descriptions, Divider, List, Typography, Tag, Empty, Skeleton } from 'antd';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const metodoPagoLabels = {
    efectivo: 'Efectivo',
    yape: 'Yape',
    plin: 'Plin',
    tarjeta_credito: 'Tarjeta Crédito',
    tarjeta_debito: 'Tarjeta Débito',
    transferencia: 'Transferencia',
    pasarela_online: 'Pasarela Online',
};

const formatMoney = (value = 0) => `S/ ${(value / 100).toFixed(2)}`;

const VentaDetailDrawer = ({
    open,
    onClose,
    pedido,
    detalles,
    pagos,
    productosMap,
    clienteNombre,
    vendedorNombre,
    loading,
}) => {
    const hasData = Boolean(pedido);
    const detalleConNombre = (detalles ?? []).map((detalle) => ({
        ...detalle,
        productoNombre: productosMap.get(detalle.productoId)?.nombre || `Producto ${detalle.productoId}`,
    }));

    return (
        <Drawer
            title="Detalle de la venta"
            placement="right"
            width={520}
            open={open}
            onClose={onClose}
            destroyOnClose
        >
            {loading ? (
                <Skeleton active paragraph={{ rows: 8 }} />
            ) : !hasData ? (
                <Empty description="Selecciona una venta para ver su detalle" />
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                        <Title level={5} style={{ marginBottom: 8 }}>Resumen</Title>
                        <Descriptions bordered size="small" column={1}>
                            <Descriptions.Item label="Código">{pedido.codigoPedido}</Descriptions.Item>
                            <Descriptions.Item label="Fecha y hora">
                                {dayjs(pedido.creadoEn).format('DD/MM/YYYY HH:mm')}
                            </Descriptions.Item>
                            <Descriptions.Item label="Cliente">{clienteNombre || 'Cliente general'}</Descriptions.Item>
                            <Descriptions.Item label="Comprobante">
                                {pedido.tipoComprobante
                                    ? `${pedido.tipoComprobante?.toUpperCase()} ${pedido.serieComprobante ?? ''} ${pedido.numeroComprobante ?? ''}`.trim()
                                    : 'Sin comprobante'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Total">{formatMoney(pedido.totalFinalCentimos ?? 0)}</Descriptions.Item>
                            <Descriptions.Item label="Vendedor">{vendedorNombre || 'No asignado'}</Descriptions.Item>
                        </Descriptions>
                    </div>

                    <div>
                        <Divider orientation="left">Productos</Divider>
                        {detalleConNombre.length === 0 ? (
                            <Empty description="No hay detalles de productos" />
                        ) : (
                            <List
                                dataSource={detalleConNombre}
                                renderItem={(detalle) => (
                                    <List.Item>
                                        <List.Item.Meta
                                            title={detalle.productoNombre}
                                            description={`${detalle.cantidad} x ${formatMoney(detalle.precioUnitarioCentimos)}`}
                                        />
                                        <Text strong>{formatMoney(detalle.subtotalLineaCentimos)}</Text>
                                    </List.Item>
                                )}
                            />
                        )}
                    </div>

                    <div>
                        <Divider orientation="left">Pagos</Divider>
                        {Array.isArray(pagos) && pagos.length > 0 ? (
                            <List
                                dataSource={pagos}
                                renderItem={(pago) => (
                                    <List.Item>
                                        <List.Item.Meta
                                            title={metodoPagoLabels[pago.metodoPago] || pago.metodoPago}
                                            description={dayjs(pago.fechaPago).format('DD/MM/YYYY HH:mm')}
                                        />
                                        <Tag color="blue">{formatMoney(pago.montoPagadoCentimos)}</Tag>
                                    </List.Item>
                                )}
                            />
                        ) : (
                            <Empty description="No se registraron pagos" />
                        )}
                    </div>
                </div>
            )}
        </Drawer>
    );
};

export default VentaDetailDrawer;
