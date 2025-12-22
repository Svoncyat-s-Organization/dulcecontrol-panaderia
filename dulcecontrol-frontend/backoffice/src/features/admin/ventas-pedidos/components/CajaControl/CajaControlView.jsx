import { Button, Card, Modal, Form, Select, Alert, Row, Col, Spin, Typography, Input } from 'antd';
import { LockOutlined, UnlockOutlined, ShopOutlined, UserOutlined, DollarCircleOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { getClientes } from '../../api/clientes.api.js';
import { useCartStore } from '../../hooks/useCartStore.js';
import { useEffect, useState } from 'react';
import MoneyInput from '../../../../../shared/components/MoneyInput.jsx';
import { toLocaleStringApiDateTime } from '../../utils/dateTime.js';

const { Text } = Typography;
const { Option } = Select;

const CajaControlView = ({
    isOpen,
    session,
    isLoading,
    onOpenClick,
    onCloseClick,
    onWithdrawClick,
    isModalVisible,
    onModalCancel,
    onModalSubmit,
    actionType,
    tiendaId,
    user,
    cajas = [],
    currentCaja,
    cajasLoading = false,
    saldoDisponibleCentimos,
    saldoLoading,
    withdrawLoading,
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

    const saldoDisponibleSoles = typeof saldoDisponibleCentimos === 'number'
        ? saldoDisponibleCentimos / 100
        : null;

    const retiroOptions = [
        { label: 'Retiro de efectivo', value: 'retiro_efectivo' },
        { label: 'Gasto operativo', value: 'gasto_operativo' },
    ];

    const modalTitle = (() => {
        if (actionType === 'OPEN') return 'Apertura de Caja';
        if (actionType === 'CLOSE') return 'Cierre de Caja';
        if (actionType === 'WITHDRAW') return 'Retiro de efectivo';
        return 'Gestión de Caja';
    })();

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
                        <MoneyInput
                            style={{ width: '100%' }}
                        />
                    </Form.Item>
                </>
            )}

            {actionType === 'CLOSE' && (
                <>
                    <Form.Item label="Fecha de Apertura">
                        <Input
                            value={toLocaleStringApiDateTime(session?.fechaApertura)}
                            readOnly
                            style={{
                                background: '#f0f5ff',
                                color: '#1d39c4',
                                fontWeight: 'bold',
                                textAlign: 'center',
                                border: '1px solid #adc6ff'
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        name="montoFinal"
                        label="Monto Final Real (S/)"
                        initialValue={saldoDisponibleSoles}
                        rules={[{ required: true, message: 'Ingrese el monto contado en caja' }]}
                    >
                        <MoneyInput
                            style={{ width: '100%' }}
                        />
                    </Form.Item>
                </>
            )}

            {actionType === 'WITHDRAW' && (
                <>
                    <Form.Item label="Saldo Disponible en Caja">
                        <Input
                            value={`S/ ${saldoDisponibleSoles != null ? saldoDisponibleSoles.toFixed(2) : '0.00'}`}
                            readOnly
                            style={{
                                background: '#f0f5ff',
                                color: '#1d39c4',
                                fontWeight: 'bold',
                                textAlign: 'right',
                                border: '1px solid #adc6ff'
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        name="tipoMovimiento"
                        label="Tipo de movimiento"
                        rules={[{ required: true, message: 'Seleccione el tipo de movimiento' }]}
                    >
                        <Select
                            placeholder="Seleccione una opción"
                            options={retiroOptions}
                        />
                    </Form.Item>
                    <Form.Item
                        name="montoRetiro"
                        label="Monto a retirar (S/)"
                        rules={[
                            { required: true, message: 'Ingrese el monto a retirar' },
                            {
                                validator: (_, value) => {
                                    if (value == null) {
                                        return Promise.resolve();
                                    }
                                    if (value <= 0) {
                                        return Promise.reject(new Error('El monto debe ser mayor a cero'));
                                    }
                                    if (saldoDisponibleSoles != null && value > saldoDisponibleSoles) {
                                        return Promise.reject(new Error('El monto excede el saldo disponible'));
                                    }
                                    return Promise.resolve();
                                }
                            }
                        ]}
                    >
                        <MoneyInput
                            style={{ width: '100%' }}
                        />
                    </Form.Item>
                    <Form.Item
                        name="concepto"
                        label="Nota del movimiento"
                        rules={[{ required: true, message: 'Ingrese una nota para el movimiento' }]}
                    >
                        <Input.TextArea
                            placeholder="Ej: depósito al banco, gasto operativo"
                            rows={3}
                            maxLength={200}
                            showCount
                        />
                    </Form.Item>
                </>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <Button onClick={onModalCancel}>Cancelar</Button>
                <Button type="primary" htmlType="submit">
                    {actionType === 'OPEN' ? 'Abrir Caja' : actionType === 'CLOSE' ? 'Cerrar Caja' : 'Registrar movimiento'}
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
                title={modalTitle}
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
                        <div style={{ display: 'flex', flexDirection: 'row', gap: 16, alignItems: 'center' }}>
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                <Text type="secondary">Inicio:</Text>
                                <Text strong>S/ {((session?.montoInicialCentimos ?? 0) / 100).toFixed(2)}</Text>
                            </div>
                            <div style={{ width: 1, height: 24, background: '#f0f0f0' }} />
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                <Text type="secondary">Disponible:</Text>
                                <Text strong style={{ fontSize: 16, color: '#1890ff' }}>
                                    {saldoLoading ? '...' : `S/ ${saldoDisponibleSoles != null ? saldoDisponibleSoles.toFixed(2) : '0.00'}`}
                                </Text>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Button
                                type="primary"
                                icon={<DollarCircleOutlined />}
                                onClick={onWithdrawClick}
                                disabled={saldoLoading || (saldoDisponibleCentimos ?? 0) <= 0}
                                loading={withdrawLoading}
                            >
                                Retirar
                            </Button>
                            <Button type="primary" danger icon={<LockOutlined />} onClick={onCloseClick}>
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
                title={modalTitle}
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
