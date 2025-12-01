import { Button, Card, Result, Space, Table, Typography, theme, Form, Input, Select, DatePicker } from 'antd';
import { IconRefresh, IconSettings, IconEye, IconPrinter, IconClearAll } from '@tabler/icons-react';
import { useEffect } from 'react';
import dayjs from 'dayjs';

const { Text } = Typography;
const { RangePicker } = DatePicker;

const getOrderStatusColor = (status) => {
    const statusMap = {
        'pendiente': '#faad14',
        'pendiente_pago': '#faad14',
        'en_preparacion': '#1890ff',
        'listo_entrega': '#52c41a',
        'entregado': '#52c41a',
        'cancelado': '#ff4d4f',
    };
    return statusMap[status?.toLowerCase()] || '#d9d9d9';
};

const normalizeOrderStatus = (status) => {
    const statusMap = {
        'pendiente': 'PENDIENTE',
        'pendiente_pago': 'PENDIENTE',
        'en_preparacion': 'EN PREPARACIÓN',
        'listo_entrega': 'LISTO',
        'entregado': 'ENTREGADO',
        'cancelado': 'CANCELADO',
    };
    return statusMap[status?.toLowerCase()] || status;
};

const getPaymentStatusColor = (status) => {
    const statusMap = {
        'pendiente': '#ff4d4f',
        'parcial': '#faad14',
        'pagado_total': '#52c41a',
    };
    return statusMap[status?.toLowerCase()] || '#d9d9d9';
};

const normalizePaymentStatus = (status) => {
    const statusMap = {
        'pendiente': 'PENDIENTE',
        'parcial': 'PARCIAL',
        'pagado_total': 'PAGO TOTAL',
    };
    return statusMap[status?.toLowerCase()] || status;
};

const estadoPedidoOptions = [
    { label: 'Pendiente', value: 'pendiente' },
    { label: 'En Preparación', value: 'en_preparacion' },
    { label: 'Listo para Entrega', value: 'listo_entrega' },
    { label: 'Entregado', value: 'entregado' },
    { label: 'Cancelado', value: 'cancelado' },
];

const estadoPagoOptions = [
    { label: 'Pendiente', value: 'pendiente' },
    { label: 'Parcial', value: 'parcial' },
    { label: 'Pago Total', value: 'pagado_total' },
];

const PedidosTableView = ({
    pedidos,
    loading,
    isError,
    onRetry,
    onManageStatus,
    onViewDetail,
    onPrint,
    filters,
    onFiltersChange,
    onResetFilters,
    clienteOptions,
}) => {
    const [form] = Form.useForm();
    const { token } = theme.useToken();

    useEffect(() => {
        form.setFieldsValue({
            codigoPedido: filters.codigoPedido || undefined,
            clienteId: filters.clienteId || undefined,
            estadoPedido: filters.estadoPedido || undefined,
            estadoPago: filters.estadoPago || undefined,
            rangoFechas: filters.rangoFechas
                ? [dayjs(filters.rangoFechas[0]), dayjs(filters.rangoFechas[1])]
                : undefined,
        });
    }, [filters, form]);

    const handleFormChange = (_, allValues) => {
        const parsed = {
            codigoPedido: allValues.codigoPedido || null,
            clienteId: allValues.clienteId || null,
            estadoPedido: allValues.estadoPedido || null,
            estadoPago: allValues.estadoPago || null,
            rangoFechas: allValues.rangoFechas ? allValues.rangoFechas.map((date) => date?.toISOString()) : null,
        };
        onFiltersChange(parsed);
    };

    const handleReset = () => {
        form.resetFields();
        onResetFilters();
    };

    if (isError) {
        return (
            <Result
                status="error"
                title="No se pudieron cargar los pedidos"
                subTitle="Intenta nuevamente más tarde"
                extra={
                    <Button icon={<IconRefresh size={16} />} onClick={onRetry}>
                        Reintentar
                    </Button>
                }
            />
        );
    }

    const columns = [
        {
            title: 'Código',
            dataIndex: 'codigo',
            key: 'codigo',
            width: 140,
            render: (codigo) => <Text strong>{codigo}</Text>,
        },
        {
            title: 'Cliente',
            dataIndex: 'cliente',
            key: 'cliente',
            width: 180,
            ellipsis: true,
            render: (cliente) => <Text>{cliente}</Text>,
        },
        {
            title: 'Fecha Entrega',
            dataIndex: 'fechaEntrega',
            key: 'fechaEntrega',
            width: 120,
            render: (fecha) => {
                if (!fecha) return <Text type="secondary">-</Text>;
                return <Text>{dayjs(fecha).format('DD/MM/YYYY')}</Text>;
            },
        },
        {
            title: 'Estado Pedido',
            dataIndex: 'estado',
            key: 'estado',
            width: 160,
            render: (status) => {
                const color = getOrderStatusColor(status);
                const label = normalizeOrderStatus(status);
                return (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: color }} />
                        <Text>{label}</Text>
                    </span>
                );
            },
        },
        {
            title: 'Estado Pago',
            dataIndex: 'estadoPago',
            key: 'estadoPago',
            width: 150,
            render: (status) => {
                const color = getPaymentStatusColor(status);
                const label = normalizePaymentStatus(status);
                return (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: color }} />
                        <Text>{label}</Text>
                    </span>
                );
            },
        },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
            width: 130,
            render: (total) => <Text strong>S/ {total?.toFixed(2)}</Text>,
        },
        {
            title: 'Acciones',
            key: 'actions',
            width: 240,
            render: (_, record) => (
                <Space>
                    <Button
                        type="link"
                        icon={<IconSettings size={16} />}
                        onClick={() => onManageStatus(record)}
                    >
                        Gestionar
                    </Button>
                    <Button
                        type="link"
                        icon={<IconEye size={16} />}
                        onClick={() => onViewDetail(record)}
                    >
                        Detalle
                    </Button>
                    <Button
                        type="link"
                        icon={<IconPrinter size={16} />}
                        onClick={() => onPrint(record)}
                    >
                        Imprimir
                    </Button>
                </Space>
            ),
        },
    ];

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
                        Gestión de Pedidos
                    </Typography.Title>
                    <Text type="secondary">Administra el estado y pagos de pedidos.</Text>
                </div>
            </div>

            <Form
                form={form}
                layout="vertical"
                onValuesChange={handleFormChange}
                style={{ marginBottom: 16 }}
            >
                <Space style={{ width: '100%' }} wrap>
                    <Form.Item name="codigoPedido" label="Código" style={{ minWidth: 180 }}>
                        <Input placeholder="Buscar por código" allowClear />
                    </Form.Item>
                    <Form.Item name="clienteId" label="Cliente" style={{ minWidth: 280 }}>
                        <Select
                            allowClear
                            showSearch
                            placeholder="Selecciona cliente"
                            options={clienteOptions}
                            optionFilterProp="label"
                        />
                    </Form.Item>
                    <Form.Item name="estadoPedido" label="Estado Pedido" style={{ minWidth: 200 }}>
                        <Select allowClear placeholder="Todos" options={estadoPedidoOptions} />
                    </Form.Item>
                    <Form.Item name="estadoPago" label="Estado Pago" style={{ minWidth: 180 }}>
                        <Select allowClear placeholder="Todos" options={estadoPagoOptions} />
                    </Form.Item>
                    <Form.Item name="rangoFechas" label="Fecha Entrega">
                        <RangePicker allowClear format="DD/MM/YYYY" />
                    </Form.Item>
                    <Form.Item label=" ">
                        <Button icon={<IconClearAll size={16} />} onClick={handleReset}>
                            Limpiar
                        </Button>
                    </Form.Item>
                </Space>
            </Form>

            <Table
                rowKey="id"
                dataSource={pedidos}
                columns={columns}
                loading={loading}
                pagination={{
                    pageSizeOptions: ['10', '20', '50', '100'],
                    showSizeChanger: true,
                    defaultPageSize: 10,
                    showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} pedidos`,
                }}
            />
        </Card>
    );
};

export default PedidosTableView;
