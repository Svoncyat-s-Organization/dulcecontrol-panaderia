import { Button, Card, Modal, Form, InputNumber, Select, Alert, Row, Col, Spin, Typography, Input } from 'antd';
import { LockOutlined, UnlockOutlined, ShopOutlined, UserOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { getClientes } from '../../api/clientes.api.js';
import { useCartStore } from '../../hooks/useCartStore.js';
import { useEffect, useState } from 'react';

const { Text } = Typography;
const { Option } = Select;

const CajaControlView = ({
    isOpen,
    session,
    isLoading,
    onOpenClick,
    onCloseClick,
    isModalVisible,
    onModalCancel,
    onModalSubmit,
    actionType,
    tiendaId,
    user,
    cajas = [],
    currentCaja,
    cajasLoading = false,
    children
}) => {
    const [formKey, setFormKey] = useState(0);
    const [hasSessionResolved, setHasSessionResolved] = useState(false);
    const { setCliente, cliente } = useCartStore();

    const { data: clientes = [] } = useQuery({
        queryKey: ['clientes', tiendaId],
        queryFn: () => getClientes(tiendaId),
        enabled: !!tiendaId && isOpen,
    });

    useEffect(() => {
        if (clientes.length > 0 && !cliente) {
            const generico = clientes.find(c => {
                const nombre = (c.nombreDoc || '').toLowerCase();
                return nombre.includes('genérico') || nombre.includes('generico');
            });
            if (generico) {
                setCliente(generico);
            }
        }
    }, [clientes, cliente, setCliente]);

    useEffect(() => {
        if (!isModalVisible) {
            setFormKey((prev) => prev + 1);
        }
    }, [isModalVisible, actionType]);

    useEffect(() => {
        if (!isLoading) {
            setHasSessionResolved(true);
        }
    }, [isLoading]);

    if (isLoading && !hasSessionResolved) {
        return (
            <div style={{ padding: 24, textAlign: 'center' }}>
                <Spin tip="Verificando sesión de caja...">
                    <div style={{ minHeight: 48 }} />
                </Spin>
            </div>
        );
    }

    const renderModalContent = () => (
        <Form key={formKey} layout="vertical" onFinish={onModalSubmit}>
            {actionType === 'OPEN' && (
                <>
                    <Form.Item
                        name="cajaId"
                        label="Seleccionar Caja"
                        rules={[{ required: true, message: 'Seleccione una caja' }]}
                    >
                        <Select
                            placeholder="Seleccione caja física"
                            disabled={cajasLoading || !cajas.length}
                            loading={cajasLoading}
                            notFoundContent={cajasLoading ? 'Cargando cajas...' : 'No hay cajas disponibles'}
                        >
                            {cajas.map(c => (
                                <Option key={c.id} value={c.id}>{c.nombre}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Fecha de Apertura">
                        <Input value={new Date().toLocaleString()} readOnly style={{ background: '#f5f5f5', color: '#000' }} />
                    </Form.Item>
                    <Form.Item label="Usuario Responsable">
                        <Input value={user?.nombre_completo || user?.nombreCompleto || user?.sub || user?.email || 'Desconocido'} readOnly style={{ background: '#f5f5f5', color: '#000' }} />
                    </Form.Item>
                    <Form.Item
                        name="montoInicial"
                        label="Monto Inicial (S/)"
                        rules={[{ required: true, message: 'Ingrese monto inicial' }]}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            formatter={(value) => `S/ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => value.replace(/S\/\s?|(,*)/g, '')}
                            min={0}
                        />
                    </Form.Item>
                </>
            )}

            {actionType === 'CLOSE' && (
                <>
                    <Alert
                        message="Cierre de Caja"
                        description={`Se cerrará la sesión iniciada el ${new Date(session?.fechaApertura).toLocaleString()}`}
                        type="warning"
                        showIcon
                        style={{ marginBottom: 16 }}
                    />
                    <Form.Item
                        name="montoFinal"
                        label="Monto Final Real (S/)"
                        rules={[{ required: true, message: 'Ingrese el monto contado en caja' }]}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            formatter={(value) => `S/ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => value.replace(/S\/\s?|(,*)/g, '')}
                            min={0}
                        />
                    </Form.Item>
                </>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <Button onClick={onModalCancel}>Cancelar</Button>
                <Button type="primary" htmlType="submit">
                    {actionType === 'OPEN' ? 'Abrir Caja' : 'Cerrar Caja'}
                </Button>
            </div>
        </Form>
    );

    const renderClosedState = () => (
        <div style={{ padding: 24, textAlign: 'center' }}>
            <Card>
                <ShopOutlined style={{ fontSize: 48, color: '#faad14', marginBottom: 24 }} />
                <h2>Caja Cerrada</h2>
                <br />
                <Button
                    type="primary"
                    size="large"
                    icon={<UnlockOutlined />}
                    onClick={onOpenClick}
                    style={{ marginBottom: 24 }}
                >
                    Abrir Caja
                </Button>
                <p>Debe abrir una sesión de caja para poder realizar ventas.</p>
                <br />
            </Card>

            <Modal
                title="Apertura de Caja"
                open={isModalVisible}
                onCancel={onModalCancel}
                footer={null}
                destroyOnHidden
            >
                {renderModalContent()}
            </Modal>
        </div>
    );

    const renderOpenState = () => (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col span={12}>
                    <Card
                        size="small"
                        styles={{ body: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 60 } }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#52c41a', boxShadow: '0 0 0 2px rgba(82, 196, 26, 0.2)' }} />
                            <Text strong style={{ fontSize: 16 }}>{currentCaja?.nombre || 'Caja sin nombre'}</Text>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <Text type="secondary">Inicio: <Text strong>S/ {((session?.montoInicialCentimos ?? 0) / 100).toFixed(2)}</Text></Text>
                            <Button
                                danger
                                size="small"
                                icon={<LockOutlined />}
                                onClick={onCloseClick}
                            >
                                Cerrar
                            </Button>
                        </div>
                    </Card>
                </Col>
                <Col span={12}>
                    <Card
                        size="small"
                        styles={{ body: { display: 'flex', alignItems: 'center', gap: 12, height: 60, padding: '0 12px' } }}
                    >
                        <UserOutlined style={{ fontSize: 18, color: '#1890ff' }} />
                        <Select
                            showSearch
                            style={{ flex: 1 }}
                            placeholder="Seleccionar Cliente"
                            optionFilterProp="children"
                            value={cliente?.id}
                            onChange={(val) => setCliente(clientes.find(c => c.id === val))}
                            filterOption={(input, option) => {
                                const label = typeof option?.children === 'string'
                                    ? option.children
                                    : option?.children?.props?.children ?? '';
                                return label.toLowerCase().includes(input.toLowerCase());
                            }}
                            variant="borderless"
                            suffixIcon={null}
                        >
                            {clientes.map(c => (
                                <Option key={c.id} value={c.id}>{c.nombreDoc}</Option>
                            ))}
                        </Select>
                    </Card>
                </Col>
            </Row>

            <div style={{ flex: 1, overflow: 'hidden' }}>
                {children}
            </div>

            <Modal
                title="Cierre de Caja"
                open={isModalVisible}
                onCancel={onModalCancel}
                footer={null}
                destroyOnHidden
            >
                {renderModalContent()}
            </Modal>
        </div>
    );

    const content = isOpen ? renderOpenState() : renderClosedState();
    const showOverlay = isLoading && hasSessionResolved;

    return (
        <div style={{ position: 'relative', height: '100%' }}>
            {content}
            {showOverlay && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                    <Spin tip="Actualizando sesión de caja...">
                        <div style={{ minHeight: 48 }} />
                    </Spin>
                </div>
            )}
        </div>
    );
};

export default CajaControlView;
