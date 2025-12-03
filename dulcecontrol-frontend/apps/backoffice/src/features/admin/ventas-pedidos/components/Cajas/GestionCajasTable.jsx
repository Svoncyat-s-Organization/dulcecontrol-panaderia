import { useMemo, useState } from 'react';
import { Card, Table, DatePicker, Space, Form, Select, Button, Typography, theme } from 'antd';
import { ClearOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);
import { useQueries, useQuery } from '@tanstack/react-query';
import { useTokenStore } from '../../../../../shared/store/tokenStore.js';
import { getSesionesCaja, getCajas, getMovimientosCaja } from '../../api/cajas.api.js';
import { getUsuariosAdmin } from '../../api/usuarios.api.js';
import { CAJA_KEYS } from '../../constants/queryKeys.js';
import StatusDot from './StatusDot.jsx';
import { computeExpectedFinalCentimos } from '../../utils/cajaCalculations.js';

const { RangePicker } = DatePicker;
const { Text } = Typography;

const estadoOptions = [
    { label: 'Abierta', value: true },
    { label: 'Cerrada', value: false },
];

const GestionCajasTable = () => {
    const tiendaId = useTokenStore((state) => state.tiendaId);
    const { token } = theme.useToken();
    const [form] = Form.useForm();
    const [range, setRange] = useState(null);
    const [filters, setFilters] = useState({
        cajaId: null,
        usuarioId: null,
        estaAbierta: null,
    });

    const sesionesQuery = useQuery({
        queryKey: CAJA_KEYS.sesiones(tiendaId),
        queryFn: () => getSesionesCaja(tiendaId),
        enabled: !!tiendaId,
        select: (response) => Array.isArray(response) ? response : [],
    });

    const cajasQuery = useQuery({
        queryKey: ['cajas-map', tiendaId],
        queryFn: () => getCajas(tiendaId),
        enabled: !!tiendaId,
    });

    const usuariosQuery = useQuery({
        queryKey: ['usuarios', tiendaId],
        queryFn: () => getUsuariosAdmin(tiendaId),
        enabled: !!tiendaId,
    });

    const cajasMap = useMemo(() => {
        const map = new Map();
        (cajasQuery.data || []).forEach((caja) => {
            map.set(caja.id, caja.nombre);
        });
        return map;
    }, [cajasQuery.data]);

    const usuariosMap = useMemo(() => {
        const map = new Map();
        (usuariosQuery.data || []).forEach((usuario) => {
            const nombre = usuario.nombreCompleto
                || `${usuario.nombres || ''} ${usuario.apellidos || ''}`.trim()
                || usuario.correo
                || `Usuario ${usuario.id}`;
            map.set(usuario.id, nombre);
        });
        return map;
    }, [usuariosQuery.data]);

    const cajaOptions = useMemo(() => {
        return (cajasQuery.data || []).map((caja) => ({
            label: caja.nombre,
            value: caja.id,
        }));
    }, [cajasQuery.data]);

    const usuarioOptions = useMemo(() => {
        return (usuariosQuery.data || []).map((usuario) => {
            const nombre = usuario.nombreCompleto
                || `${usuario.nombres || ''} ${usuario.apellidos || ''}`.trim()
                || usuario.correo
                || `Usuario ${usuario.id}`;
            return {
                label: nombre,
                value: usuario.id,
            };
        });
    }, [usuariosQuery.data]);

    const filteredSesiones = useMemo(() => {
        const base = sesionesQuery.data || [];
        return base
            .filter((sesion) => {
                // Filtro por rango de fechas
                if (range && range[0] && range[1] && sesion.fechaApertura) {
                    const fecha = dayjs(sesion.fechaApertura);
                    if (!fecha.isBetween(range[0].startOf('day'), range[1].endOf('day'), null, '[]')) {
                        return false;
                    }
                }

                // Filtro por caja
                if (filters.cajaId && sesion.cajaId !== filters.cajaId) {
                    return false;
                }

                // Filtro por usuario
                if (filters.usuarioId && sesion.usuarioAperturaId !== filters.usuarioId) {
                    return false;
                }

                // Filtro por estado
                if (typeof filters.estaAbierta === 'boolean' && sesion.estaAbierta !== filters.estaAbierta) {
                    return false;
                }

                return true;
            })
            .map((sesion) => ({
                ...sesion,
                cajaNombre: cajasMap.get(sesion.cajaId) || `Caja ${sesion.cajaId}`,
                usuarioNombre: usuariosMap.get(sesion.usuarioAperturaId) || 'Usuario no identificado',
                fechaAperturaDisplay: sesion.fechaApertura ? dayjs(sesion.fechaApertura).format('DD/MM/YYYY HH:mm') : '-',
                fechaCierreDisplay: sesion.fechaCierre ? dayjs(sesion.fechaCierre).format('DD/MM/YYYY HH:mm') : '-',
            }));
    }, [sesionesQuery.data, range, filters, cajasMap, usuariosMap]);

    const movimientosQueries = useQueries({
        queries: filteredSesiones.map((sesion) => ({
            queryKey: CAJA_KEYS.movimientos(tiendaId, sesion.id),
            queryFn: () => getMovimientosCaja(tiendaId, sesion.id),
            enabled: !!tiendaId && !!sesion.id,
            select: (response) => Array.isArray(response) ? response : [],
            staleTime: 60 * 1000,
        })),
    });

    const movimientosLoading = movimientosQueries.some((query) => query.isLoading || query.isFetching);

    const tableData = filteredSesiones.map((sesion, index) => {
        const movimientos = movimientosQueries[index]?.data;
        const hasMovimientos = Array.isArray(movimientos);
        const montoFinalEsperadoCalculado = hasMovimientos
            ? computeExpectedFinalCentimos(sesion, movimientos)
            : (sesion.montoFinalEsperadoCentimos ?? null);
        const diferenciaCalculada = sesion.montoFinalRealCentimos != null && montoFinalEsperadoCalculado != null
            ? sesion.montoFinalRealCentimos - montoFinalEsperadoCalculado
            : (sesion.diferenciaCentimos ?? null);

        return {
            ...sesion,
            montoFinalEsperadoCalculado,
            diferenciaCalculada,
        };
    });

    const formatCurrency = (centimos) => {
        if (centimos == null) {
            return '-';
        }
        return `S/ ${(centimos / 100).toFixed(2)}`;
    };

    const handleFilterChange = (_, allValues) => {
        setFilters({
            cajaId: allValues.cajaId || null,
            usuarioId: allValues.usuarioId || null,
            estaAbierta: typeof allValues.estaAbierta === 'boolean' ? allValues.estaAbierta : null,
        });
    };

    const handleResetFilters = () => {
        form.resetFields();
        setFilters({
            cajaId: null,
            usuarioId: null,
            estaAbierta: null,
        });
        setRange(null);
    };

    const columns = [
        {
            title: 'Caja',
            dataIndex: 'cajaNombre',
            key: 'cajaNombre',
            render: (text) => <Text strong>{text}</Text>,
        },
        {
            title: 'Usuario',
            dataIndex: 'usuarioNombre',
            key: 'usuarioNombre',
        },
        {
            title: 'Apertura',
            dataIndex: 'fechaAperturaDisplay',
            key: 'fechaAperturaDisplay',
        },
        {
            title: 'Cierre',
            dataIndex: 'fechaCierreDisplay',
            key: 'fechaCierreDisplay',
        },
        {
            title: 'Estado',
            dataIndex: 'estaAbierta',
            key: 'estaAbierta',
            render: (estaAbierta) => (
                <StatusDot
                    color={estaAbierta ? '#52c41a' : '#ff4d4f'}
                    label={estaAbierta ? 'Abierta' : 'Cerrada'}
                />
            ),
        },
        {
            title: 'Monto Inicial',
            dataIndex: 'montoInicialCentimos',
            key: 'montoInicialCentimos',
            align: 'right',
            render: (value) => <Text>{formatCurrency(value)}</Text>,
        },
        {
            title: 'Final Esperado',
            dataIndex: 'montoFinalEsperadoCalculado',
            key: 'montoFinalEsperadoCalculado',
            align: 'right',
            render: (value) => <Text type="secondary">{formatCurrency(value)}</Text>,
        },
        {
            title: 'Final Real',
            dataIndex: 'montoFinalRealCentimos',
            key: 'montoFinalRealCentimos',
            align: 'right',
            render: (value) => <Text>{formatCurrency(value)}</Text>,
        },
        {
            title: 'Diferencia',
            dataIndex: 'diferenciaCalculada',
            key: 'diferenciaCalculada',
            align: 'right',
            render: (value) => {
                if (value == null) {
                    return '-';
                }
                const amount = value / 100;
                const color = amount === 0 ? undefined : amount < 0 ? '#fa541c' : '#52c41a';
                return <Text style={{ color }}>{formatCurrency(value)}</Text>;
            },
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
                        Gestión de Cajas
                    </Typography.Title>
                    <Text type="secondary">Consulta el historial de sesiones de caja.</Text>
                </div>
            </div>

            <Form
                form={form}
                layout="vertical"
                onValuesChange={handleFilterChange}
                style={{ marginBottom: 16 }}
            >
                <Space style={{ width: '100%' }} wrap>
                    <Form.Item name="cajaId" label="Caja" style={{ minWidth: 200 }}>
                        <Select
                            allowClear
                            placeholder="Todas"
                            options={cajaOptions}
                            loading={cajasQuery.isLoading}
                        />
                    </Form.Item>
                    <Form.Item name="usuarioId" label="Usuario" style={{ minWidth: 230 }}>
                        <Select
                            allowClear
                            showSearch
                            placeholder="Todos"
                            options={usuarioOptions}
                            loading={usuariosQuery.isLoading}
                            optionFilterProp="label"
                        />
                    </Form.Item>
                    <Form.Item name="estaAbierta" label="Estado" style={{ minWidth: 150 }}>
                        <Select allowClear placeholder="Todos" options={estadoOptions} />
                    </Form.Item>
                    <Form.Item label="Rango de fechas">
                        <RangePicker value={range} onChange={setRange} format="DD/MM/YYYY" />
                    </Form.Item>
                    <Form.Item label=" ">
                        <Button icon={<ClearOutlined />} onClick={handleResetFilters}>
                            Limpiar
                        </Button>
                    </Form.Item>
                </Space>
            </Form>

            <Table
                rowKey="id"
                dataSource={tableData}
                columns={columns}
                loading={sesionesQuery.isLoading || movimientosLoading}
                pagination={{
                    pageSizeOptions: ['10', '20', '50', '100'],
                    showSizeChanger: true,
                    defaultPageSize: 10,
                    showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} sesiones`,
                }}
            />
        </Card>
    );
};

export default GestionCajasTable;
