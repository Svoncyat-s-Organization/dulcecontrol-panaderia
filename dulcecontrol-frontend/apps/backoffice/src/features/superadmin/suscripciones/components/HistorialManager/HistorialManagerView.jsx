import { Button, Table, Tag, Alert, Card, Select, Typography, theme, Space } from 'antd';
import { getMovementTag } from '../../constants/movementTypes.js';
import { centimosToPEN } from '../../utils/currencyFormatter.js';
import { formatDateTime } from '../../utils/dateFormatter.js';

const { Text } = Typography;

const HistorialManagerView = ({
    historial,
    loading,
    isError,
    onRetry,
    suscripciones,
    tiendasMap,
    selectedSuscripcionId,
    onSelectSuscripcion,
    isLoadingSuscripciones,
}) => {
    const { token } = theme.useToken();

    const columns = [
        {
            title: 'Fecha',
            dataIndex: 'fechaMovimiento',
            key: 'fechaMovimiento',
            width: 180,
            render: (fecha) => <Text>{formatDateTime(fecha)}</Text>,
        },
        {
            title: 'Tipo Movimiento',
            dataIndex: 'tipoMovimiento',
            key: 'tipoMovimiento',
            width: 150,
            render: (tipo) => {
                const { label, color } = getMovementTag(tipo);
                return <Tag color={color}>{label}</Tag>;
            },
        },
        {
            title: 'Plan Anterior',
            dataIndex: 'planAnteriorNombre',
            key: 'planAnteriorNombre',
            width: 150,
            render: (nombre) => <Text type="secondary">{nombre || '-'}</Text>,
        },
        {
            title: 'Plan Nuevo',
            dataIndex: 'planNuevoNombre',
            key: 'planNuevoNombre',
            width: 150,
            render: (nombre) => <Text strong>{nombre || '-'}</Text>,
        },
        {
            title: 'Precio Anterior',
            dataIndex: 'precioAnteriorCentimos',
            key: 'precioAnteriorCentimos',
            width: 130,
            render: (centimos) => <Text type="secondary">{centimos !== null ? centimosToPEN(centimos) : '-'}</Text>,
        },
        {
            title: 'Precio Nuevo',
            dataIndex: 'precioNuevoCentimos',
            key: 'precioNuevoCentimos',
            width: 130,
            render: (centimos) => <Text>{centimos !== null ? centimosToPEN(centimos) : '-'}</Text>,
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
            styles={{ body: { padding: 24 } }}
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 12,
                    marginBottom: 24,
                }}
            >
                <div>
                    <Typography.Title level={4} style={{ margin: 0 }}>
                        Historial de Movimientos
                    </Typography.Title>
                    <Text type="secondary">
                        Auditoría de cambios en las suscripciones.
                    </Text>
                </div>
            </div>

            <div style={{ marginBottom: 24 }}>
                <Text strong style={{ display: 'block', marginBottom: 8 }}>Seleccionar por tienda:</Text>
                <Select
                    showSearch
                    style={{ width: '100%', maxWidth: 500 }}
                    placeholder="Seleccionar por tienda"
                    optionFilterProp="label"
                    optionLabelProp="label"
                    onChange={onSelectSuscripcion}
                    value={selectedSuscripcionId}
                    loading={isLoadingSuscripciones}
                    filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                >
                    {(suscripciones || []).map((susc) => {
                        const tiendaNombre = susc.tiendaNombre
                            || tiendasMap?.get(susc.tiendaId)
                            || `Tienda #${susc.tiendaId}`;
                        const optionLabel = tiendaNombre;
                        return (
                            <Select.Option
                                key={susc.id}
                                value={susc.id}
                                label={optionLabel}
                            >
                                <Space direction="vertical" size={0}>
                                    <Text strong>{tiendaNombre}</Text>
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        {susc.planNombre} • ID: {susc.id}
                                    </Text>
                                </Space>
                            </Select.Option>
                        );
                    })}
                </Select>
            </div>

            {selectedSuscripcionId && (
                <Table
                    columns={columns}
                    dataSource={historial}
                    loading={loading}
                    rowKey="id"
                    pagination={{
                        pageSizeOptions: ['10', '20', '50'],
                        showSizeChanger: true,
                        defaultPageSize: 10,
                        showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} movimientos`,
                    }}
                    locale={{
                        emptyText: 'No hay movimientos registrados para esta suscripción',
                    }}
                />
            )}
        </Card>
    );
};

export default HistorialManagerView;
