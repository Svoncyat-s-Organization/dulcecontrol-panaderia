import { Drawer, Form, Select, Input, Radio, Typography, Row, Col, Button, Space, DatePicker, Alert, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useEffect, useMemo, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { useQuery } from '@tanstack/react-query';
import { createDireccionCliente, getClientes, getDireccionesCliente } from '../../api/clientes.api.js';
import { useTokenStore } from '../../../../../shared/store/tokenStore.js';
import { POS_MODES, useCartStore } from '../../hooks/useCartStore.js';
import { TIPOS_ENTREGA } from '../../constants/ventaConstants.js';
import MoneyInput from '../../../../../shared/components/MoneyInput.jsx';

const { Title, Text } = Typography;
const { Option } = Select;

const CheckoutModal = ({ open, onCancel, onConfirm, total, loading }) => {
    const [form] = Form.useForm();
    const [addressForm] = Form.useForm();
    const tiendaId = useTokenStore((state) => state.tiendaId);
    const { cliente, setCliente, posMode } = useCartStore();
    const CASH_METHOD = 'efectivo';
    const [metodoPago, setMetodoPago] = useState(CASH_METHOD);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [savingAddress, setSavingAddress] = useState(false);
    const previousMode = useRef(posMode);
    const clienteId = cliente?.id;

    const isPedido = posMode === POS_MODES.PEDIDO;
    const tipoEntregaValue = Form.useWatch('tipoEntrega', form) || (isPedido ? TIPOS_ENTREGA.RECOJO_TIENDA : TIPOS_ENTREGA.CONSUMO_LOCAL);
    const montoPagadoValue = Number(Form.useWatch('montoPagado', form) || 0);
    const showDeliveryFields = isPedido && tipoEntregaValue === TIPOS_ENTREGA.DELIVERY;

    const { data: clientes = [] } = useQuery({
        queryKey: ['clientes', tiendaId],
        queryFn: () => getClientes(tiendaId),
        enabled: !!tiendaId && open
    });

    const { data: direccionesCliente = [], refetch: refetchDirecciones } = useQuery({
        queryKey: ['cliente-direcciones', tiendaId, clienteId],
        queryFn: () => getDireccionesCliente(tiendaId, clienteId),
        enabled: !!tiendaId && !!clienteId && open
    });

    useEffect(() => {
        if (!open) {
            return;
        }
        previousMode.current = posMode;
        form.resetFields();
        const isRuc = cliente?.tipoDoc === 'RUC';
        const defaultComprobante = isRuc ? 'factura' : 'boleta';
        const defaultMonto = isPedido ? 0 : total;
        form.setFieldsValue({
            tipoComprobante: defaultComprobante,
            metodoPago: isPedido ? 'yape' : CASH_METHOD,
            tipoEntrega: isPedido ? TIPOS_ENTREGA.RECOJO_TIENDA : TIPOS_ENTREGA.CONSUMO_LOCAL,
            montoPagado: defaultMonto,
            fechaEntrega: isPedido ? dayjs().add(1, 'day').hour(12).minute(0) : dayjs(),
            costoDelivery: 0,
            direccionClienteId: null,
            shippingDireccion: '',
            shippingReferencia: '',
            shippingContactoNombre: cliente?.nombreDoc || '',
            shippingContactoTelefono: cliente?.telefono || '',
        });
        setMetodoPago(isPedido ? 'yape' : CASH_METHOD);
    }, [open, cliente, posMode, total, isPedido, form]);

    useEffect(() => {
        if (!open) {
            return;
        }
        if (!clienteId) {
            form.setFieldsValue({
                direccionClienteId: null,
                shippingDireccion: '',
                shippingReferencia: '',
                shippingContactoNombre: '',
                shippingContactoTelefono: '',
            });
        } else {
            form.setFieldsValue({
                shippingContactoNombre: cliente?.nombreDoc || '',
                shippingContactoTelefono: cliente?.telefono || '',
            });
        }
    }, [clienteId, cliente, form, open]);

    useEffect(() => {
        if (!open) {
            return;
        }
        if (previousMode.current === posMode) {
            return;
        }
        previousMode.current = posMode;
        const defaultMonto = posMode === POS_MODES.PEDIDO ? 0 : total;
        form.setFieldsValue({
            metodoPago: posMode === POS_MODES.PEDIDO ? 'yape' : CASH_METHOD,
            tipoEntrega: posMode === POS_MODES.PEDIDO ? TIPOS_ENTREGA.RECOJO_TIENDA : TIPOS_ENTREGA.CONSUMO_LOCAL,
            montoPagado: defaultMonto,
            fechaEntrega: posMode === POS_MODES.PEDIDO ? dayjs().add(1, 'day').hour(12).minute(0) : dayjs(),
        });
        setMetodoPago(posMode === POS_MODES.PEDIDO ? 'yape' : CASH_METHOD);
    }, [posMode, open, total, form]);

    useEffect(() => {
        if (!open || isPedido) {
            return;
        }
        if (form.getFieldValue('tipoEntrega') === TIPOS_ENTREGA.DELIVERY) {
            form.setFieldsValue({ tipoEntrega: TIPOS_ENTREGA.CONSUMO_LOCAL });
        }
    }, [isPedido, open, form]);

    useEffect(() => {
        if (!open || !clienteId || !showDeliveryFields) {
            return;
        }
        if (direccionesCliente.length === 1) {
            const currentSelection = form.getFieldValue('direccionClienteId');
            if (currentSelection) {
                return;
            }
            const unica = direccionesCliente[0];
            form.setFieldsValue({
                direccionClienteId: unica.id,
                shippingDireccion: unica.direccionCompleta || '',
                shippingReferencia: unica.referencia || '',
            });
        }
    }, [open, clienteId, direccionesCliente, form, showDeliveryFields]);

    // Ubigeo logic removed - using simple text fields for address

    const handleOk = () => {
        form.validateFields().then((values) => {
            if (!isPedido && values.metodoPago === CASH_METHOD && values.montoPagado < total) {
                form.setFields([
                    { name: 'montoPagado', errors: ['El monto pagado debe ser mayor o igual al total'] },
                ]);
                return;
            }
            if (isPedido && values.montoPagado > total) {
                form.setFields([
                    { name: 'montoPagado', errors: ['El adelanto no puede superar el total del pedido'] },
                ]);
                return;
            }

            const normalizedPayload = {
                ...values,
                posMode,
                clienteId: cliente?.id,
                direccionClienteId: values.direccionClienteId || null,
                montoPagado: Number(values.montoPagado || 0),
                costoDelivery: showDeliveryFields ? Number(values.costoDelivery || 0) : 0,
                shippingDireccion: showDeliveryFields ? values.shippingDireccion?.trim() || '' : null,
                shippingReferencia: showDeliveryFields ? values.shippingReferencia?.trim() || null : null,
                shippingDepartamento: null,
                shippingProvincia: null,
                shippingDistrito: null,
                shippingCodigoUbigeo: null,
                shippingContactoNombre: showDeliveryFields ? values.shippingContactoNombre?.trim() || cliente?.nombreDoc || '' : null,
                shippingContactoTelefono: showDeliveryFields ? values.shippingContactoTelefono?.trim() || cliente?.telefono || '' : null,
                fechaEntrega: values.fechaEntrega ? dayjs(values.fechaEntrega).format('YYYY-MM-DDTHH:mm:ss') : null,
            };

            onConfirm(normalizedPayload);
        });
    };

    const isRuc = cliente?.tipoDoc === 'RUC';
    const cambio = Math.max(0, montoPagadoValue - total);
    const saldoPendiente = Math.max(0, total - montoPagadoValue);
    const actionLabel = isPedido ? 'Registrar pedido' : 'Confirmar pago';

    const handleDireccionSelect = (value) => {
        if (!value) {
            form.setFieldsValue({
                direccionClienteId: null,
                shippingDireccion: '',
                shippingReferencia: '',
            });
            return;
        }
        const selected = direccionesCliente.find((dir) => dir.id === value);
        form.setFieldsValue({
            direccionClienteId: value,
            shippingDireccion: selected?.direccionCompleta || '',
            shippingReferencia: selected?.referencia || '',
        });
    };

    const openAddressModal = () => {
        if (!clienteId) {
            return;
        }
        addressForm.resetFields();
        setIsAddressModalOpen(true);
    };

    const handleSaveAddress = async () => {
        if (!clienteId) {
            return;
        }
        try {
            const values = await addressForm.validateFields();
            setSavingAddress(true);
            const direccionParts = [values.direccion?.trim()].filter(Boolean);
            const extraParts = [values.distrito, values.provincia, values.departamento]
                .map((item) => item?.trim())
                .filter(Boolean);
            if (extraParts.length) {
                direccionParts.push(extraParts.join(', '));
            }
            const direccionCompleta = direccionParts.join(' - ');
            const payload = {
                etiqueta: values.etiqueta?.trim() || undefined,
                direccionCompleta,
                referencia: values.referencia?.trim() || null,
                esEntrega: true,
            };
            const nuevaDireccion = await createDireccionCliente(tiendaId, clienteId, payload);
            await refetchDirecciones();
            form.setFieldsValue({
                direccionClienteId: nuevaDireccion.id,
                shippingDireccion: direccionCompleta,
                shippingReferencia: values.referencia?.trim() || '',
            });
            setIsAddressModalOpen(false);
            addressForm.resetFields();
        } catch (error) {
            console.error('No se pudo guardar la dirección del cliente', error);
        } finally {
            setSavingAddress(false);
        }
    };

    const entregaOptions = [
        { value: TIPOS_ENTREGA.CONSUMO_LOCAL, label: 'Consumo en local' },
        { value: TIPOS_ENTREGA.RECOJO_TIENDA, label: 'Recojo en tienda' },
        ...(isPedido ? [{ value: TIPOS_ENTREGA.DELIVERY, label: 'Delivery' }] : []),
    ];

    return (
        <Drawer
            title={isPedido ? 'Registrar pedido' : 'Confirmar venta'}
            placement="right"
            size="large"
            open={open}
            onClose={onCancel}
            destroyOnClose
            maskClosable={!loading}
            styles={{
                body: { paddingBottom: 88 },
                header: { borderBottom: '1px solid #f0f0f0' }
            }}
            footer={
                <Space style={{ justifyContent: 'flex-end', width: '100%' }}>
                    <Button onClick={onCancel} disabled={loading}>Cancelar</Button>
                    <Button type="primary" loading={loading} onClick={handleOk}>
                        {actionLabel}
                    </Button>
                </Space>
            }
        >
            <div style={{
                border: '1px solid #e6f4ff',
                borderRadius: 12,
                padding: 16,
                marginBottom: 24,
                background: '#f0faff',
                textAlign: 'center'
            }}>
                <Text type="secondary">Total del {isPedido ? 'pedido' : 'pago'}</Text>
                <Title level={2} style={{ margin: 0, color: '#1677ff' }}>S/ {total.toFixed(2)}</Title>
            </div>

            <Form form={form} layout="vertical" onSubmitCapture={(e) => e.preventDefault()}>
                <Form.Item label="Cliente">
                    <Select
                        showSearch
                        style={{ width: '100%' }}
                        placeholder="Seleccionar Cliente"
                        optionFilterProp="children"
                        value={cliente?.id}
                        onChange={(val) => setCliente(clientes.find((c) => c.id === val))}
                        allowClear
                        filterOption={(input, option) => (option?.children ?? '').toLowerCase().includes(input.toLowerCase())}
                    >
                        {clientes.map((c) => (
                            <Option key={c.id} value={c.id}>
                                {c.nombreDoc} ({c.tipoDoc || 'DOC'})
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="tipoEntrega"
                    label="Modalidad de entrega"
                    rules={[{ required: true, message: 'Seleccione una modalidad de entrega' }]}
                >
                    <Select>
                        {entregaOptions.map((option) => (
                            <Option key={option.value} value={option.value}>{option.label}</Option>
                        ))}
                    </Select>
                </Form.Item>

                {isPedido && (
                    <Form.Item
                        name="fechaEntrega"
                        label="Fecha de entrega pactada"
                        rules={[{ required: true, message: 'Seleccione una fecha estimada' }]}
                    >
                        <DatePicker
                            showTime
                            style={{ width: '100%' }}
                            format="DD/MM/YYYY HH:mm"
                            getPopupContainer={(trigger) => trigger.parentElement}
                        />
                    </Form.Item>
                )}

                <Form.Item
                    name="tipoComprobante"
                    label="Tipo de Comprobante"
                    rules={[{ required: true, message: 'Seleccione tipo de comprobante' }]}
                >
                    <Radio.Group buttonStyle="solid" style={{ width: '100%' }}>
                        <Radio.Button value="boleta" style={{ width: '50%', textAlign: 'center' }}>BOLETA</Radio.Button>
                        <Radio.Button value="factura" style={{ width: '50%', textAlign: 'center' }} disabled={!isRuc}>
                            FACTURA
                        </Radio.Button>
                    </Radio.Group>
                </Form.Item>

                <Form.Item
                    name="metodoPago"
                    label="Método de Pago"
                    dependencies={['montoPagado']}
                    rules={[({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!isPedido) {
                                return value ? Promise.resolve() : Promise.reject(new Error('Seleccione método de pago'));
                            }
                            const adelanto = Number(getFieldValue('montoPagado') || 0);
                            if (adelanto > 0 && !value) {
                                return Promise.reject(new Error('Seleccione método de pago para registrar el adelanto'));
                            }
                            return Promise.resolve();
                        }
                    })]}
                >
                    <Radio.Group
                        buttonStyle="solid"
                        style={{ width: '100%' }}
                        onChange={(e) => setMetodoPago(e.target.value)}
                    >
                        <Row gutter={[8, 8]}>
                            <Col span={12}><Radio.Button value="efectivo" style={{ width: '100%', textAlign: 'center' }}>Efectivo</Radio.Button></Col>
                            <Col span={12}><Radio.Button value="yape" style={{ width: '100%', textAlign: 'center' }}>Yape / Plin</Radio.Button></Col>
                            <Col span={12}><Radio.Button value="tarjeta_credito" style={{ width: '100%', textAlign: 'center' }}>Tarjeta</Radio.Button></Col>
                            <Col span={12}><Radio.Button value="transferencia" style={{ width: '100%', textAlign: 'center' }}>Transferencia</Radio.Button></Col>
                        </Row>
                    </Radio.Group>
                </Form.Item>

                {showDeliveryFields && (
                    <div style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: 16, marginBottom: 24 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                            <Text strong>Dirección para delivery</Text>
                            <Button type="link" icon={<PlusOutlined />} onClick={openAddressModal} disabled={!clienteId}>
                                Nueva dirección
                            </Button>
                        </div>
                        {!clienteId && (
                            <Alert
                                type="info"
                                showIcon
                                style={{ marginBottom: 12 }}
                                message="Selecciona un cliente para registrar o reutilizar direcciones"
                            />
                        )}
                        <Form.Item name="direccionClienteId" label="Dirección del cliente">
                            <Select
                                placeholder={clienteId ? 'Selecciona una dirección guardada (opcional)' : 'Sin cliente seleccionado'}
                                allowClear
                                disabled={!clienteId || direccionesCliente.length === 0}
                                onChange={handleDireccionSelect}
                            >
                                {direccionesCliente.map((dir) => (
                                    <Option key={dir.id} value={dir.id}>
                                        {dir.etiqueta ? `${dir.etiqueta} · ` : ''}{dir.direccionCompleta}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="shippingDireccion"
                            label="Dirección"
                            rules={[{ required: true, message: 'Ingresa la dirección de entrega' }]}
                        >
                            <Input placeholder="Calle, número, urbanización, distrito, provincia, departamento" />
                        </Form.Item>
                        <Form.Item name="shippingReferencia" label="Referencia">
                            <Input placeholder="Punto de referencia" />
                        </Form.Item>
                        <Row gutter={12}>
                            <Col span={12}>
                                <Form.Item
                                    name="shippingContactoNombre"
                                    label="Contacto"
                                    rules={[{ required: true, message: 'Ingresa el nombre de contacto' }]}
                                >
                                    <Input placeholder="Nombre de la persona que recibe" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="shippingContactoTelefono"
                                    label="Teléfono"
                                    rules={[{ required: true, message: 'Ingresa un teléfono de contacto' }]}
                                >
                                    <Input placeholder="Ej: 999888777" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item
                            name="costoDelivery"
                            label="Costo de delivery"
                            rules={[{ type: 'number', min: 0, message: 'Ingrese un monto válido' }]}
                        >
                            <MoneyInput
                                style={{ width: '100%' }}
                                placeholder="0.00"
                            />
                        </Form.Item>
                    </div>
                )}

                {!isPedido && metodoPago === CASH_METHOD && (
                    <div style={{ background: '#ffffff', padding: 16, borderRadius: 8, border: '1px solid #d9d9d9', marginBottom: 24 }}>
                        <Row gutter={16} align="middle">
                            <Col span={12}>
                                <Form.Item
                                    name="montoPagado"
                                    label="Monto Recibido"
                                    rules={[{ required: true, message: 'Ingrese monto' }]}
                                    style={{ marginBottom: 0 }}
                                >
                                    <MoneyInput
                                        style={{ width: '100%' }}
                                        size="large"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12} style={{ textAlign: 'right' }}>
                                <Text type="secondary">Vuelto / Cambio</Text>
                                <Title level={3} style={{ margin: 0, color: cambio > 0 ? '#faad14' : '#595959' }}>
                                    S/ {cambio.toFixed(2)}
                                </Title>
                            </Col>
                        </Row>
                    </div>
                )}

                {isPedido && (
                    <div style={{ background: '#fff', padding: 16, borderRadius: 8, border: '1px dashed #d9d9d9', marginBottom: 24 }}>
                        <Row gutter={16} align="middle">
                            <Col span={12}>
                                <Form.Item
                                    name="montoPagado"
                                    label="Adelanto recibido"
                                    style={{ marginBottom: 0 }}
                                    rules={[{ type: 'number', min: 0, message: 'El adelanto no puede ser negativo' }]}
                                >
                                    <MoneyInput
                                        style={{ width: '100%' }}
                                        placeholder="0.00"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12} style={{ textAlign: 'right' }}>
                                <Text type="secondary">Saldo pendiente</Text>
                                <Title level={3} style={{ margin: 0, color: saldoPendiente > 0 ? '#faad14' : '#52c41a' }}>
                                    S/ {saldoPendiente.toFixed(2)}
                                </Title>
                            </Col>
                        </Row>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            Si no se recibió adelanto, deje el valor en 0.
                        </Text>
                    </div>
                )}

                <Form.Item name="notasPedido" label="Notas (Opcional)">
                    <Input.TextArea rows={2} placeholder="Observaciones de la venta..." />
                </Form.Item>
            </Form>

            <Modal
                title="Nueva dirección del cliente"
                open={isAddressModalOpen}
                onCancel={() => setIsAddressModalOpen(false)}
                onOk={handleSaveAddress}
                okText="Guardar"
                cancelText="Cancelar"
                confirmLoading={savingAddress}
                destroyOnClose
            >
                {!clienteId ? (
                    <Alert type="warning" showIcon message="Selecciona primero un cliente" />
                ) : (
                    <Form form={addressForm} layout="vertical" onFinish={handleSaveAddress}>
                        <Form.Item name="etiqueta" label="Etiqueta">
                            <Input placeholder="Ej: Casa, Oficina" />
                        </Form.Item>
                        <Form.Item
                            name="direccion"
                            label="Dirección"
                            rules={[{ required: true, message: 'Ingresa la dirección principal' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item name="referencia" label="Referencia">
                            <Input />
                        </Form.Item>
                        <Form.Item name="distrito" label="Distrito">
                            <Input />
                        </Form.Item>
                        <Form.Item name="provincia" label="Provincia">
                            <Input />
                        </Form.Item>
                        <Form.Item name="departamento" label="Departamento">
                            <Input />
                        </Form.Item>
                    </Form>
                )}
            </Modal>
        </Drawer>
    );
};

export default CheckoutModal;
