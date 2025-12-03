import { Modal, Form, Select, Alert, Divider, Row, Col, Radio, Typography, Button, Input } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import MoneyInput from '../../../../../shared/components/MoneyInput.jsx';

const { Option } = Select;
const { Title, Text } = Typography;

const UnifiedStatusModal = ({ open, onClose, pedido, onConfirmPayment, onConfirmStatus, loadingPayment, loadingStatus }) => {
    const [form] = Form.useForm();
    const [selectedOrderStatus, setSelectedOrderStatus] = useState(null);
    const [montoPagar, setMontoPagar] = useState(0);
    const [localSaldoPendiente, setLocalSaldoPendiente] = useState(0);
    const [localIsPaymentComplete, setLocalIsPaymentComplete] = useState(false);

    const isOrderDelivered = pedido?.estado?.toLowerCase() === 'entregado';

    useEffect(() => {
        if (open && pedido) {
            const saldoInicial = pedido.raw?.saldoPendienteCentimos
                ? pedido.raw.saldoPendienteCentimos / 100
                : (pedido.total || 0);

            setLocalSaldoPendiente(saldoInicial);
            setLocalIsPaymentComplete(pedido.estadoPago?.toLowerCase() === 'pagado_total');
            setMontoPagar(0);

            form.setFieldsValue({
                estadoPedido: pedido.raw?.estadoPedido,
                metodoPago: 'efectivo',
            });
            setSelectedOrderStatus(pedido.raw?.estadoPedido);
        }
    }, [open, pedido, form]);

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



    const handlePayment = () => {
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

        // Call payment mutation
        onConfirmPayment(pedido, {
            metodoPago: metodoPago,
            montoPagado: montoPagado,
        });

        // Update local state
        setLocalSaldoPendiente(nuevoSaldo);
        setLocalIsPaymentComplete(esPagoCompleto);

        // Reset inputs
        setMontoPagar(0);
        form.setFieldsValue({
            metodoPago: 'efectivo',
        });
    };

    const showStockWarning = selectedOrderStatus === 'entregado' && !isOrderDelivered;

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
                        </div>
                    </>
                )}

                {/* Alert de pago completo - Solo si está pagado pero NO entregado */}
                {!isOrderDelivered && localIsPaymentComplete && (
                    <Alert
                        message="Pago Completo"
                        description="Este pedido ya tiene el pago total registrado."
                        type="success"
                        showIcon
                        icon={<CheckCircleOutlined />}
                        style={{ marginBottom: 20 }}
                    />
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
        </Modal>
    );
};

export default UnifiedStatusModal;
