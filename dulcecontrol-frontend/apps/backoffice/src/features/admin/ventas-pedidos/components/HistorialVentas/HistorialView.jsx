import { Card, Table, Button, Result, Form, Input, Select, DatePicker, Space, Tag, Typography, theme } from 'antd';
import { ReloadOutlined, PrinterOutlined, EyeOutlined, ClearOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Text } = Typography;

const metodoPagoOptions = [
    { label: 'Efectivo', value: 'efectivo' },
    { label: 'Yape', value: 'yape' },
    { label: 'Plin', value: 'plin' },
    { label: 'Tarjeta Crédito', value: 'tarjeta_credito' },
    { label: 'Tarjeta Débito', value: 'tarjeta_debito' },
    { label: 'Transferencia', value: 'transferencia' },
    { label: 'Pasarela Online', value: 'pasarela_online' },
];

const comprobanteOptions = [
    { label: 'Boleta', value: 'boleta' },
    { label: 'Factura', value: 'factura' },
    { label: 'Nota de crédito', value: 'nota_credito' },
    { label: 'Nota de débito', value: 'nota_debito' },
];

const HistorialView = ({
    data,
    loading,
    isError,
    onRetry,
    filters,
    onFiltersChange,
    onResetFilters,
    pagination,
    onPaginationChange,
    clienteOptions,
    onPrint,
    onViewDetail,
    printingId,
    totalItems,
}) => {
    const [form] = Form.useForm();
    const { token } = theme.useToken();

    useEffect(() => {
        form.setFieldsValue({
            codigoPedido: filters.codigoPedido || undefined,
            clienteId: filters.clienteId || undefined,
            metodoPago: filters.metodoPago || undefined,
            tipoComprobante: filters.tipoComprobante || undefined,
            rangoFechas: filters.rangoFechas
                ? [dayjs(filters.rangoFechas[0]), dayjs(filters.rangoFechas[1])]
                : undefined,
        });
    }, [filters, form]);

    const handleFormChange = (_, allValues) => {
        const parsed = {
            codigoPedido: allValues.codigoPedido || null,
            clienteId: allValues.clienteId || null,
            metodoPago: allValues.metodoPago || null,
            tipoComprobante: allValues.tipoComprobante || null,
            rangoFechas: allValues.rangoFechas ? allValues.rangoFechas.map((date) => date?.toISOString()) : null,
        };
        onFiltersChange(parsed);
    };

    const handleReset = () => {
        form.resetFields();
        onResetFilters();
    };

    const columns = [
        {
            title: 'Código',
            dataIndex: 'codigo',
            key: 'codigo',
            render: (text) => <Text strong>{text}</Text>,
        },
        {
            title: 'Fecha y hora',
            dataIndex: 'fechaHora',
            key: 'fechaHora',
        },
        {
            title: 'Cliente',
            dataIndex: 'clienteNombre',
            key: 'clienteNombre',
        },
        {
            title: 'Comprobante',
            dataIndex: 'comprobante',
            key: 'comprobante',
        },
        {
            title: 'Método de pago',
            dataIndex: 'metodoPagoLabel',
            key: 'metodoPagoLabel',
            render: (label) => (label ? <Tag color="blue">{label}</Tag> : <Tag>Sin registro</Tag>),
        },
        {
            title: 'Total',
            dataIndex: 'totalDisplay',
            key: 'totalDisplay',
        },
        {
            title: 'Vendedor',
            dataIndex: 'vendedorNombre',
            key: 'vendedorNombre',
        },
        {
            title: 'Acciones',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button
                        icon={<PrinterOutlined />}
                        size="small"
                        type="link"
                        loading={printingId === record.id}
                        onClick={() => onPrint(record)}
                    >
                        Imprimir
                    </Button>
                    <Button
                        icon={<EyeOutlined />}
                        size="small"
                        type="link"
                        onClick={() => onViewDetail(record)}
                    >
                        Ver detalle
                    </Button>
                </Space>
            ),
        },
    ];

    if (isError) {
        return (
            <Result
                status="error"
                title="Error al cargar historial"
                extra={<Button onClick={onRetry} icon={<ReloadOutlined />}>Reintentar</Button>}
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
            styles={{ body: { padding: 24 } }}
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
                        Historial de Ventas
                    </Typography.Title>
                    <Text type="secondary">Consulta y gestiona el historial de ventas realizadas.</Text>
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
                    <Form.Item name="tipoComprobante" label="Tipo comprobante" style={{ minWidth: 200 }}>
                        <Select allowClear placeholder="Todos" options={comprobanteOptions} />
                    </Form.Item>
                    <Form.Item name="metodoPago" label="Método de pago" style={{ minWidth: 200 }}>
                        <Select allowClear placeholder="Todos" options={metodoPagoOptions} />
                    </Form.Item>
                    <Form.Item name="rangoFechas" label="Rango de fechas">
                        <RangePicker allowClear format="DD/MM/YYYY" />
                    </Form.Item>
                    <Form.Item label=" ">
                        <Button icon={<ClearOutlined />} onClick={handleReset}>Limpiar</Button>
                    </Form.Item>
                </Space>
            </Form>

            <Table
                dataSource={data}
                columns={columns}
                loading={loading}
                rowKey="id"
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: totalItems,
                    showSizeChanger: true,
                    pageSizeOptions: ['10', '20', '50', '100'],
                    showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} ventas`,
                }}
                onChange={(pager) => onPaginationChange({ current: pager.current, pageSize: pager.pageSize })}
            />
        </Card>
    );
};

export default HistorialView;
