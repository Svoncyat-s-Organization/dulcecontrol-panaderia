import { useEffect, useMemo } from 'react';
import {
    Button,
    Table,
    Tag,
    Alert,
    Card,
    Select,
    DatePicker,
    Space,
    Typography,
    Descriptions,
    theme,
    Form,
    Modal,
    InputNumber,
    Switch,
} from 'antd';
import { EditOutlined, EyeOutlined, ReloadOutlined } from '@ant-design/icons';
import { getStateTag, SUBSCRIPTION_STATES } from '../../constants/subscriptionStates.js';
import { centimosToPEN } from '../../utils/currencyFormatter.js';
import { formatDate, formatDateTime } from '../../utils/dateFormatter.js';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Text } = Typography;
const CICLO_LABELS = {
    MENSUAL: 'Mensual',
    ANUAL: 'Anual',
};

const SuscripcionesManagerView = ({
    suscripciones,
    loading,
    isError,
    onRetry,
    filters,
    onFilterChange,
    onResetFilters,
    onViewDetails,
    onCloseDetail,
    onOpenEdit,
    onCloseEdit,
    detailSuscripcion,
    editSuscripcion,
    onSaveEdit,
    isSavingEdit,
    planes,
}) => {
    const { token } = theme.useToken();
    const [filterForm] = Form.useForm();
    const [editForm] = Form.useForm();

    useEffect(() => {
        filterForm.setFieldsValue({
            estado: filters.estado || undefined,
            rangoFechas:
                filters.fechaInicio && filters.fechaFin
                    ? [dayjs(filters.fechaInicio), dayjs(filters.fechaFin)]
                    : undefined,
        });
    }, [filters, filterForm]);

    useEffect(() => {
        if (!editSuscripcion) {
            editForm.resetFields();
            return;
        }

        editForm.setFieldsValue({
            planId: editSuscripcion.planId,
            ciclo: editSuscripcion.ciclo,
            precioPactadoSoles: typeof editSuscripcion.precioPactadoCentimos === 'number'
                ? editSuscripcion.precioPactadoCentimos / 100
                : undefined,
            fechaInicio: editSuscripcion.fechaInicio ? dayjs(editSuscripcion.fechaInicio) : null,
            fechaFin: editSuscripcion.fechaFin ? dayjs(editSuscripcion.fechaFin) : null,
            estado: editSuscripcion.estado,
            autorenovar: editSuscripcion.autorenovar,
        });
    }, [editSuscripcion, editForm]);

    const filteredData = useMemo(() => {
        if (!filters.fechaInicio && !filters.fechaFin) {
            return suscripciones;
        }

        const start = filters.fechaInicio ? dayjs(filters.fechaInicio) : null;
        const end = filters.fechaFin ? dayjs(filters.fechaFin) : null;

        return suscripciones.filter((item) => {
            if (!item.fechaFin) return false;
            const fechaFin = dayjs(item.fechaFin);
            if (start && fechaFin.isBefore(start, 'day')) return false;
            if (end && fechaFin.isAfter(end, 'day')) return false;
            return true;
        });
    }, [suscripciones, filters.fechaInicio, filters.fechaFin]);

    const handleFormChange = (_, allValues) => {
        if ('estado' in allValues) {
            onFilterChange('estado', allValues.estado);
        }

        if (Array.isArray(allValues.rangoFechas) && allValues.rangoFechas.length === 2) {
            onFilterChange('fechaInicio', allValues.rangoFechas[0]?.toISOString());
            onFilterChange('fechaFin', allValues.rangoFechas[1]?.toISOString());
        } else if (!allValues.rangoFechas || allValues.rangoFechas.length === 0) {
            onFilterChange('fechaInicio', undefined);
            onFilterChange('fechaFin', undefined);
        }
    };

    const handleReset = () => {
        filterForm.resetFields();
        onResetFilters();
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 70,
            render: (id) => <Text strong>{id}</Text>,
        },
        {
            title: 'Tienda',
            dataIndex: 'tiendaId',
            key: 'tiendaId',
            width: 120,
            render: (tiendaId) => <Text>{tiendaId ? `Tienda #${tiendaId}` : '-'}</Text>,
        },
        {
            title: 'Plan',
            dataIndex: 'planNombre',
            key: 'planNombre',
            width: 220,
            render: (_, record) => (
                <Space direction="vertical" size={0}>
                    <Text strong>{record.planNombre || '-'}</Text>
                    <Text type="secondary">{record.planCodigo || 'Sin código'}</Text>
                </Space>
            ),
        },
        {
            title: 'Ciclo',
            dataIndex: 'ciclo',
            key: 'ciclo',
            width: 110,
            render: (ciclo) => (
                <Tag color={ciclo === 'MENSUAL' ? 'blue' : 'purple'}>
                    {CICLO_LABELS[ciclo] || ciclo}
                </Tag>
            ),
        },
        {
            title: 'Estado',
            dataIndex: 'estado',
            key: 'estado',
            width: 130,
            render: (estado) => {
                const { label, color } = getStateTag(estado);
                return <Tag color={color}>{label}</Tag>;
            },
        },
        {
            title: 'Inicio',
            dataIndex: 'fechaInicio',
            key: 'fechaInicio',
            width: 130,
            render: (fecha) => <Text>{formatDate(fecha)}</Text>,
        },
        {
            title: 'Fin',
            dataIndex: 'fechaFin',
            key: 'fechaFin',
            width: 130,
            render: (fecha) => <Text>{formatDate(fecha)}</Text>,
        },
        {
            title: 'Precio Pactado',
            dataIndex: 'precioPactadoCentimos',
            key: 'precioPactadoCentimos',
            width: 150,
            render: (centimos) => <Text>{centimosToPEN(centimos)}</Text>,
        },
        {
            title: 'Acciones',
            key: 'acciones',
            width: 160,
            render: (_, record) => (
                <Space size={4} wrap>
                    <Button type="link" icon={<EyeOutlined />} onClick={() => onViewDetails(record)}>
                        Ver detalle
                    </Button>
                    <Button type="link" icon={<EditOutlined />} onClick={() => onOpenEdit(record)}>
                        Editar
                    </Button>
                </Space>
            ),
        },
    ];

    if (isError) {
        return (
            <Alert
                message="Error al cargar suscripciones"
                description="No se pudieron cargar las suscripciones. Intenta nuevamente."
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
                        Gestión de Suscripciones
                    </Typography.Title>
                    <Text type="secondary">Administra las suscripciones de las tiendas.</Text>
                </div>
            </div>

            <Form
                form={filterForm}
                layout="vertical"
                onValuesChange={handleFormChange}
                style={{ marginBottom: 16 }}
            >
                <Space style={{ width: '100%' }} wrap>
                    <Form.Item name="estado" label="Estado" style={{ minWidth: 180 }}>
                        <Select placeholder="Todos los estados" allowClear>
                            <Select.Option value={SUBSCRIPTION_STATES.EN_PRUEBA}>En Prueba</Select.Option>
                            <Select.Option value={SUBSCRIPTION_STATES.ACTIVA}>Activa</Select.Option>
                            <Select.Option value={SUBSCRIPTION_STATES.VENCIDA}>Vencida</Select.Option>
                            <Select.Option value={SUBSCRIPTION_STATES.CANCELADA}>Cancelada</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item name="rangoFechas" label="Fecha Fin">
                        <RangePicker format="DD/MM/YYYY" allowClear />
                    </Form.Item>

                    <Form.Item label=" ">
                        <Button icon={<ReloadOutlined />} onClick={handleReset}>
                            Limpiar Filtros
                        </Button>
                    </Form.Item>
                </Space>
            </Form>

            <Table
                columns={columns}
                dataSource={filteredData}
                loading={loading}
                rowKey="id"
                pagination={{
                    pageSizeOptions: ['10', '20', '50', '100'],
                    showSizeChanger: true,
                    defaultPageSize: 10,
                    showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} suscripciones`,
                }}
            />

            <Modal
                title={detailSuscripcion ? `Detalle de suscripción #${detailSuscripcion.id}` : 'Detalle de suscripción'}
                open={Boolean(detailSuscripcion)}
                onCancel={onCloseDetail}
                footer={null}
                width={720}
            >
                <Descriptions bordered column={2} size="small">
                    <Descriptions.Item label="Tienda">
                        {detailSuscripcion?.tiendaId ? `Tienda #${detailSuscripcion.tiendaId}` : '-'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Plan">
                        {detailSuscripcion?.planNombre || '-'} ({detailSuscripcion?.planCodigo || 'sin código'})
                    </Descriptions.Item>
                    <Descriptions.Item label="Ciclo">
                        <Tag color={detailSuscripcion?.ciclo === 'MENSUAL' ? 'blue' : 'purple'}>
                            {CICLO_LABELS[detailSuscripcion?.ciclo] || detailSuscripcion?.ciclo || '-'}
                        </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Estado">
                        {detailSuscripcion && (
                            <Tag color={getStateTag(detailSuscripcion.estado).color}>
                                {getStateTag(detailSuscripcion.estado).label}
                            </Tag>
                        )}
                    </Descriptions.Item>
                    <Descriptions.Item label="Precio Pactado">
                        {centimosToPEN(detailSuscripcion?.precioPactadoCentimos)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Plan Mensual">
                        {centimosToPEN(detailSuscripcion?.planPrecioMensualCentimos)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Inicio">
                        {formatDate(detailSuscripcion?.fechaInicio)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Fin">
                        {formatDate(detailSuscripcion?.fechaFin)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Autorenovar">
                        <Tag color={detailSuscripcion?.autorenovar ? 'green' : 'orange'}>
                            {detailSuscripcion?.autorenovar ? 'Sí' : 'No'}
                        </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Cancelado en">
                        {formatDate(detailSuscripcion?.canceladoEn)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Creado en">
                        {formatDateTime(detailSuscripcion?.creadoEn)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Actualizado en">
                        {formatDateTime(detailSuscripcion?.actualizadoEn)}
                    </Descriptions.Item>
                </Descriptions>
            </Modal>

            <Modal
                title={editSuscripcion ? `Editar suscripción #${editSuscripcion.id}` : 'Editar suscripción'}
                open={Boolean(editSuscripcion)}
                onCancel={onCloseEdit}
                footer={null}
                width={720}
                destroyOnClose
            >
                <Form
                    form={editForm}
                    layout="vertical"
                    onFinish={onSaveEdit}
                    disabled={isSavingEdit}
                >
                    <Form.Item
                        label="Plan"
                        name="planId"
                        rules={[{ required: true, message: 'Selecciona un plan' }]}
                    >
                        <Select placeholder="Selecciona un plan" showSearch optionFilterProp="label">
                            {(planes || []).map((plan) => (
                                <Select.Option
                                    key={plan.id}
                                    value={plan.id}
                                    label={`${plan.nombre} ${plan.codigo ? `(${plan.codigo})` : ''}`}
                                >
                                    {plan.nombre} {plan.codigo ? `(${plan.codigo})` : ''}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Space style={{ width: '100%' }} size="large" wrap>
                        <Form.Item
                            label="Ciclo"
                            name="ciclo"
                            rules={[{ required: true, message: 'Selecciona un ciclo' }]}
                            style={{ flex: 1, minWidth: 160 }}
                        >
                            <Select placeholder="Selecciona un ciclo">
                                <Select.Option value="MENSUAL">Mensual</Select.Option>
                                <Select.Option value="ANUAL">Anual</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Estado"
                            name="estado"
                            rules={[{ required: true, message: 'Selecciona un estado' }]}
                            style={{ flex: 1, minWidth: 160 }}
                        >
                            <Select placeholder="Selecciona un estado">
                                <Select.Option value={SUBSCRIPTION_STATES.EN_PRUEBA}>En Prueba</Select.Option>
                                <Select.Option value={SUBSCRIPTION_STATES.ACTIVA}>Activa</Select.Option>
                                <Select.Option value={SUBSCRIPTION_STATES.VENCIDA}>Vencida</Select.Option>
                                <Select.Option value={SUBSCRIPTION_STATES.CANCELADA}>Cancelada</Select.Option>
                            </Select>
                        </Form.Item>
                    </Space>

                    <Form.Item
                        label="Precio Pactado (Soles)"
                        name="precioPactadoSoles"
                        rules={[{ required: true, message: 'Ingresa un precio' }]}
                    >
                        <InputNumber
                            min={0}
                            step={0.01}
                            precision={2}
                            addonBefore="S/"
                            style={{ width: 200 }}
                        />
                    </Form.Item>

                    <Space style={{ width: '100%' }} size="large" wrap>
                        <Form.Item label="Fecha de Inicio" name="fechaInicio" style={{ flex: 1, minWidth: 200 }}>
                            <DatePicker format="DD/MM/YYYY" allowClear style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item label="Fecha de Fin" name="fechaFin" style={{ flex: 1, minWidth: 200 }}>
                            <DatePicker format="DD/MM/YYYY" allowClear style={{ width: '100%' }} />
                        </Form.Item>
                    </Space>

                    <Form.Item label="Autorenovar" name="autorenovar" valuePropName="checked">
                        <Switch />
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit" loading={isSavingEdit}>
                                Guardar cambios
                            </Button>
                            <Button onClick={onCloseEdit} disabled={isSavingEdit}>
                                Cancelar
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default SuscripcionesManagerView;
