import { useEffect } from 'react';
import { Button, Table, Tag, Alert, Card, Select, DatePicker, Space, Typography, theme, Form } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { MOVEMENT_TYPES, getMovementTag } from '../../constants/movementTypes.js';
import { centimosToPEN } from '../../utils/currencyFormatter.js';
import { formatDateTime } from '../../utils/dateFormatter.js';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Text } = Typography;

const HistorialManagerView = ({
    historial,
    loading,
    isError,
    onRetry,
    filters,
    onFilterChange,
    onResetFilters,
}) => {
    const { token } = theme.useToken();
    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue({
            tipo_movimiento: filters.tipo_movimiento || undefined,
            rangoFechas: (filters.fecha_inicio && filters.fecha_fin)
                ? [dayjs(filters.fecha_inicio), dayjs(filters.fecha_fin)]
                : undefined,
        });
    }, [filters, form]);

    const handleFormChange = (_, allValues) => {
        if (allValues.tipo_movimiento !== undefined) {
            onFilterChange('tipo_movimiento', allValues.tipo_movimiento);
        }
        if (allValues.rangoFechas) {
            onFilterChange('fecha_inicio', allValues.rangoFechas[0]?.toISOString());
            onFilterChange('fecha_fin', allValues.rangoFechas[1]?.toISOString());
        } else if (allValues.rangoFechas === null) {
            onFilterChange('fecha_inicio', undefined);
            onFilterChange('fecha_fin', undefined);
        }
    };

    const handleReset = () => {
        form.resetFields();
        onResetFilters();
    };

    const columns = [
        {
            title: 'ID Suscripción',
            dataIndex: 'id',
            key: 'id',
            width: 120,
            render: (id) => <Text strong>{id}</Text>,
        },
        {
            title: 'Tienda',
            dataIndex: 'tienda_id',
            key: 'tienda_id',
            width: 100,
            render: (tiendaId) => <Text>Tienda #{tiendaId}</Text>,
        },
        {
            title: 'Plan Actual',
            dataIndex: 'plan_id',
            key: 'plan_id',
            width: 120,
            render: (planId) => <Text>Plan #{planId}</Text>,
        },
        {
            title: 'Estado Actual',
            dataIndex: 'estado',
            key: 'estado',
            width: 130,
            render: (estado) => {
                const colorMap = {
                    EN_PRUEBA: 'blue',
                    ACTIVA: 'green',
                    VENCIDA: 'orange',
                    CANCELADA: 'red',
                };
                return <Tag color={colorMap[estado] || 'default'}>{estado}</Tag>;
            },
        },
        {
            title: 'Ciclo',
            dataIndex: 'ciclo',
            key: 'ciclo',
            width: 100,
            render: (ciclo) => (
                <Tag color={ciclo === 'MENSUAL' ? 'blue' : 'purple'}>
                    {ciclo}
                </Tag>
            ),
        },
        {
            title: 'Precio Pactado',
            dataIndex: 'precio_pactado_centimos',
            key: 'precio_pactado',
            width: 140,
            render: (centimos) => <Text>{centimosToPEN(centimos)}</Text>,
        },
        {
            title: 'Última Actualización',
            dataIndex: 'actualizado_en',
            key: 'actualizado_en',
            width: 180,
            render: (fecha) => <Text>{formatDateTime(fecha)}</Text>,
        },
    ];

    if (isError) {
        return (
            <Alert
                message="Error al cargar historial"
                description="No se pudo cargar el historial de suscripciones. Intenta nuevamente."
                type="error"
                showIcon
                action={
                    <Button size="small" onClick={onRetry}>
                        Reintentar
                    </Button>
                }
            />
        );
    }

    return (
        <Card
            style={{
                borderRadius: token.borderRadiusLG,
                background: token.colorBgContainer,
                boxShadow: token.boxShadowTertiary,
            }}
            bodyStyle={{ padding: 24 }}
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 12,
                    marginBottom: 16,
                }}
            >
                <div>
                    <Typography.Title level={4} style={{ margin: 0 }}>
                        Historial de Suscripciones
                    </Typography.Title>
                    <Text type="secondary">
                        Vista de actividad de suscripciones.
                    </Text>
                </div>
            </div>

            <Form
                form={form}
                layout="vertical"
                onValuesChange={handleFormChange}
                style={{ marginBottom: 16 }}
            >
                <Space style={{ width: '100%' }} wrap>
                    <Form.Item name="tipo_movimiento" label="Tipo de Movimiento" style={{ minWidth: 200 }}>
                        <Select
                            placeholder="Todos los movimientos"
                            allowClear
                        >
                            {Object.values(MOVEMENT_TYPES).map((type) => {
                                const { label, color } = getMovementTag(type);
                                return (
                                    <Select.Option key={type} value={type}>
                                        <Tag color={color}>{label}</Tag>
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    </Form.Item>

                    <Form.Item name="rangoFechas" label="Rango de Fechas">
                        <RangePicker format="DD/MM/YYYY" allowClear />
                    </Form.Item>

                    <Form.Item label=" ">
                        <Button icon={<ReloadOutlined />} onClick={handleReset}>
                            Limpiar Filtros
                        </Button>
                    </Form.Item>
                </Space>
            </Form>

            <Alert
                message="Vista Simplificada"
                description="Esta vista muestra las suscripciones actuales. Para ver el historial completo de movimientos (altas, upgrades, cancelaciones), se requiere implementar el endpoint específico de historial en el backend."
                type="info"
                showIcon
                closable
                style={{ marginBottom: 16 }}
            />

            <Table
                columns={columns}
                dataSource={historial}
                loading={loading}
                rowKey="id"
                pagination={{
                    pageSizeOptions: ['10', '20', '50', '100'],
                    showSizeChanger: true,
                    defaultPageSize: 10,
                    showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} registros`,
                }}
            />
        </Card>
    );
};

export default HistorialManagerView;
