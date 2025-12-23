import { Modal, Form, Select, Alert, Divider, Row, Col, Radio, Typography, Button, Spin } from 'antd';
import { CheckCircleOutlined, WarningOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import MoneyInput from '../../../../../shared/components/MoneyInput.jsx';
import { useCajaSession } from '../../hooks/useCajaSession.js';
import EmitirComprobanteModal from './EmitirComprobanteModal.jsx';

const { Option } = Select;
const { Title, Text } = Typography;

const normalizeEstadoPago = (value) => (value || '').toString().trim().toLowerCase();
const normalizeEstadoPedido = (value) => (value || '').toString().trim().toLowerCase();

const UnifiedStatusModal = ({
    open,
    onClose,
    pedido,
    cliente,
    clientes,
    onConfirmPayment,
    onConfirmStatus,
    onEmitirComprobante,
    loadingPayment,
    loadingStatus,
    loadingEmitirComprobante,
    facturacionConfig,
    facturacionConfigLoading,
    tiendaId,
}) => {
    const [form] = Form.useForm();
    const [selectedOrderStatus, setSelectedOrderStatus] = useState(null);
    const [montoPagar, setMontoPagar] = useState(0);
    const [localSaldoPendiente, setLocalSaldoPendiente] = useState(0);
    const [localIsPaymentComplete, setLocalIsPaymentComplete] = useState(false);
    const [emitirComprobanteOpen, setEmitirComprobanteOpen] = useState(false);

    const { isOpen: isCajaOpen, session: cajaSession } = useCajaSession();

    const isOrderDelivered = normalizeEstadoPedido(pedido?.raw?.estadoPedido || pedido?.estado) === 'entregado';

    useEffect(() => {
        if (open && pedido) {
            const saldoPendienteCentimos = pedido?.raw?.saldoPendienteCentimos;
            const totalFallback = Number(pedido?.total || 0);
            const saldoInicial = (saldoPendienteCentimos !== null && saldoPendienteCentimos !== undefined)
                ? Number(saldoPendienteCentimos) / 100
                : totalFallback;

            setLocalSaldoPendiente(saldoInicial);

            const estadoPagoNormalized = normalizeEstadoPago(pedido?.raw?.estadoPago || pedido?.estadoPago);
            const pagoCompletoPorEstado = estadoPagoNormalized === 'pagado_total';
            const pagoCompletoPorSaldo = saldoInicial <= 0.01;

            setLocalIsPaymentComplete(Boolean(pagoCompletoPorEstado || pagoCompletoPorSaldo));
            setMontoPagar(0);

            form.setFieldsValue({
                estadoPedido: pedido.raw?.estadoPedido,
                metodoPago: 'efectivo',
            });
            setSelectedOrderStatus(pedido.raw?.estadoPedido);
        }
    }, [open, pedido, form]);

    useEffect(() => {
        if (!open) {
            setEmitirComprobanteOpen(false);
        }
    }, [open]);

    const handleFinish = (values) => {
        onConfirmStatus(pedido, values.estadoPedido);
    };

    const handleCancel = () => {
        form.resetFields();
        setSelectedOrderStatus(null);
        setMontoPagar(0);
        setLocalSaldoPendiente(0);
        setLocalIsPaymentComplete(false);
        onClose();
    };

    const handleOrderStatusChange = (value) => {
        setSelectedOrderStatus(value);
    };



    const handlePayment = async () => {
        if (!isCajaOpen || !cajaSession) {
            return;
        }

        const metodoPago = form.getFieldValue('metodoPago');
        const montoPagado = montoPagar;

        if (!metodoPago || montoPagado <= 0) {
            return;
        }

        if (montoPagado > localSaldoPendiente) {
            return;
        }

        // Calculate new balance
        const nuevoSaldo = localSaldoPendiente - montoPagado;
        const esPagoCompleto = nuevoSaldo <= 0.01; // Tolerance for floating point

        try {
            // Esperar a que el backend registre el pago y actualice el pedido
            const updatedPedido = await onConfirmPayment?.(pedido, {
                metodoPago: metodoPago,
                montoPagado: montoPagado,
                sesionCajaId: cajaSession.id,
            });

            // Preferir el estado real del backend para decidir si está pagado
            const backendTotal = Number(updatedPedido?.totalFinalCentimos ?? pedido?.raw?.totalFinalCentimos ?? 0);
            const backendPagado = Number(updatedPedido?.montoPagadoCentimos ?? 0);
            const backendSaldo = backendTotal > 0 ? Math.max(0, (backendTotal - backendPagado) / 100) : nuevoSaldo;
            const backendPagoCompleto = normalizeEstadoPago(updatedPedido?.estadoPago) === 'pagado_total'
                || backendSaldo <= 0.01;

            setLocalSaldoPendiente(backendSaldo);
            setLocalIsPaymentComplete(Boolean(backendPagoCompleto));

            // Reset inputs
            setMontoPagar(0);
            form.setFieldsValue({ metodoPago: 'efectivo' });
        } catch {
            // El padre ya muestra el error (message.error). No tocar el estado local.
        }

    };

    const showStockWarning = selectedOrderStatus === 'entregado' && !isOrderDelivered;

    const pedidoYaTieneComprobante = Boolean(
        pedido?.raw?.tipoComprobante
        && pedido?.raw?.serieComprobante
        && pedido?.raw?.numeroComprobante
    );

    const puedeEmitirComprobante = Boolean(
        localIsPaymentComplete
        && !pedidoYaTieneComprobante
        && !loadingPayment
        && !!onEmitirComprobante
    );

    return (
        <Modal
            title="Gestionar Pedido"
            open={open}
            onCancel={handleCancel}
            footer={
                !isOrderDelivered ? (
                    <Button type="primary" onClick={() => form.submit()} loading={loadingStatus}>
                        Actualizar Estado
                    </Button>
                ) : null
            }
            width={600}
        >
            <div style={{ marginBottom: 16 }}>
                <Text strong>Pedido:</Text> {pedido?.codigo} | <Text strong>Total:</Text> S/ {pedido?.total?.toFixed(2)}
            </div>

            {loadingEmitirComprobante && (
                <Alert
                    type="info"
                    showIcon
                    message={
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                            <Spin size="small" />
                            Emitiendo comprobante...
                        </span>
                    }
                    style={{ marginBottom: 12 }}
                />
            )}

            <Form form={form} layout="vertical" onFinish={handleFinish}>
                {/* Sección de Pago - Solo si no está entregado ni pagado completamente */}
                {!isOrderDelivered && !localIsPaymentComplete && (
                    <>
                        <div style={{
                            background: '#fafafa',
                            padding: 16,
                            borderRadius: 8,
                            border: '1px solid #d9d9d9',
                            marginBottom: 20
                        }}>
                            <div style={{ marginBottom: 12 }}>
                                <Text strong style={{ fontSize: 16 }}>Registro de Pago</Text>
                            </div>

                            {!isCajaOpen ? (
                                <Alert
                                    message="Caja Cerrada"
                                    description="Debes abrir una caja en el Punto de Venta para poder registrar pagos."
                                    type="warning"
                                    showIcon
                                    icon={<WarningOutlined />}
                                    style={{ marginBottom: 16 }}
                                />
                            ) : (
                                <>
                                    <div style={{
                                        background: '#fff7e6',
                                        padding: '12px 16px',
                                        borderRadius: 6,
                                        marginBottom: 16,
                                        border: '1px solid #ffd666'
                                    }}>
                                        <Text type="secondary">Saldo Pendiente</Text>
                                        <Title level={3} style={{ margin: 0, color: '#fa8c16' }}>
                                            S/ {localSaldoPendiente.toFixed(2)}
                                        </Title>
                                    </div>

                                    <Form.Item
                                        name="metodoPago"
                                        label="Método de Pago"
                                    >
                                        <Radio.Group
                                            buttonStyle="solid"
                                            style={{ width: '100%' }}
                                        >
                                            <Row gutter={[8, 8]}>
                                                <Col span={12}><Radio.Button value="efectivo" style={{ width: '100%', textAlign: 'center' }}>Efectivo</Radio.Button></Col>
                                                <Col span={12}><Radio.Button value="yape" style={{ width: '100%', textAlign: 'center' }}>Yape / Plin</Radio.Button></Col>
                                                <Col span={12}><Radio.Button value="tarjeta_credito" style={{ width: '100%', textAlign: 'center' }}>Tarjeta</Radio.Button></Col>
                                                <Col span={12}><Radio.Button value="transferencia" style={{ width: '100%', textAlign: 'center' }}>Transferencia</Radio.Button></Col>
                                            </Row>
                                        </Radio.Group>
                                    </Form.Item>

                                    <div style={{ marginBottom: 16 }}>
                                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                                            Monto a Pagar
                                        </label>
                                        <MoneyInput
                                            size="large"
                                            value={montoPagar}
                                            onChange={setMontoPagar}
                                            style={{
                                                fontSize: '24px',
                                                fontWeight: 'bold',
                                                textAlign: 'right',
                                                color: '#1890ff',
                                                cursor: 'text'
                                            }}
                                            placeholder="0.00"
                                        />
                                        {montoPagar > localSaldoPendiente && (
                                            <Text type="danger" style={{ fontSize: 12 }}>
                                                El monto excede el saldo pendiente
                                            </Text>
                                        )}
                                    </div>

                                    <Button
                                        type="primary"
                                        block
                                        size="large"
                                        onClick={handlePayment}
                                        loading={loadingPayment}
                                        disabled={montoPagar <= 0 || montoPagar > localSaldoPendiente}
                                    >
                                        Registrar Pago
                                    </Button>
                                </>
                            )}
                        </div>
                    </>
                )}

                {/* Alert de pago completo - Solo si está pagado pero NO entregado */}
                {!isOrderDelivered && localIsPaymentComplete && (
                    <>
                        <Alert
                            message="Pago Completo"
                            description="Este pedido ya tiene el pago total registrado."
                            type="success"
                            showIcon
                            icon={<CheckCircleOutlined />}
                            style={{ marginBottom: 12 }}
                        />

                        {pedidoYaTieneComprobante ? (
                            <Alert
                                type="info"
                                showIcon
                                message="Comprobante emitido"
                                description={`${String(pedido.raw.tipoComprobante || '').toUpperCase()} ${pedido.raw.serieComprobante || ''}-${String(pedido.raw.numeroComprobante || '').toString().padStart(8, '0')}`}
                                style={{ marginBottom: 20 }}
                            />
                        ) : (
                            <div style={{ marginBottom: 20 }}>
                                <Button
                                    type="primary"
                                    block
                                    onClick={() => setEmitirComprobanteOpen(true)}
                                    disabled={!puedeEmitirComprobante}
                                    loading={loadingEmitirComprobante}
                                >
                                    Emitir Boleta / Factura
                                </Button>
                            </div>
                        )}
                    </>
                )}

                <Divider>Estado del Pedido</Divider>

                {/* Select de estado - Solo si NO está entregado */}
                {!isOrderDelivered ? (
                    <>
                        <Form.Item
                            name="estadoPedido"
                            label="Estado del Pedido"
                            rules={[
                                { required: true, message: 'Selecciona un estado' },
                                {
                                    validator: (_, value) => {
                                        if (value === 'entregado' && !localIsPaymentComplete) {
                                            return Promise.reject(new Error('Debe tener pago total antes de marcar como entregado'));
                                        }
                                        return Promise.resolve();
                                    }
                                }
                            ]}
                        >
                            <Select
                                placeholder="Seleccionar estado"
                                onChange={handleOrderStatusChange}
                                size="large"
                            >
                                <Option value="pendiente_pago">PENDIENTE</Option>
                                <Option value="en_preparacion">EN PREPARACION</Option>
                                <Option value="listo_entrega">LISTO</Option>
                                <Option value="entregado" disabled={!localIsPaymentComplete}>ENTREGADO</Option>
                            </Select>
                        </Form.Item>

                        {showStockWarning && (
                            <Alert
                                message="Advertencia de Stock"
                                description="Al marcar como ENTREGADO, el stock del inventario se reducirá automáticamente. Esta acción no se puede deshacer."
                                type="warning"
                                showIcon
                                style={{ marginBottom: 16 }}
                            />
                        )}
                    </>
                ) : (
                    /* Alert de pedido entregado - Solo si YA está entregado */
                    <Alert
                        message="Pedido Entregado"
                        description="Este pedido ya fue entregado. El stock fue actualizado automáticamente."
                        type="success"
                        showIcon
                        icon={<CheckCircleOutlined />}
                    />
                )}
            </Form>

            <EmitirComprobanteModal
                open={emitirComprobanteOpen}
                onClose={() => setEmitirComprobanteOpen(false)}
                loading={loadingEmitirComprobante}
                tiendaId={tiendaId}
                sedeId={pedido?.raw?.sedeOrigenId}
                pedido={pedido?.raw}
                cliente={cliente}
                clientes={clientes}
                facturacionConfig={facturacionConfig}
                facturacionConfigLoading={facturacionConfigLoading}
                isCajaOpen={isCajaOpen}
                onConfirm={async (data) => {
                    try {
                        // Cerrar inmediatamente el modal de emisión; el estado de carga se muestra
                        // en el modal principal mientras se procesa.
                        setEmitirComprobanteOpen(false);
                        await onEmitirComprobante?.(pedido, data);
                    } catch {
                        // Parent handles errors; keep modal open so user can retry.
                    }
                }}
            />
        </Modal>
    );
};

export default UnifiedStatusModal;
