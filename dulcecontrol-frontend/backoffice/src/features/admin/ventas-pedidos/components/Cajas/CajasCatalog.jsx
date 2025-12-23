import { useEffect, useMemo, useState } from 'react';
import {
    Card,
    Table,
    Form,
    Input,
    Select,
    Space,
    Button,
    Drawer,
    Switch,
    Popconfirm,
    Typography,
    theme,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ClearOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useTokenStore } from '../../../../../shared/store/tokenStore.js';
import { useSedeStore } from '../../../../../shared/store/sedeStore.js';
import {
    getCajas,
    createCaja,
    updateCaja,
    deleteCaja,
} from '../../api/cajas.api.js';
import { getSedesAsignadas } from '../../../configuracion/api/sedes.api.js';
import { CAJA_KEYS } from '../../constants/queryKeys.js';
import StatusDot from './StatusDot.jsx';

const { Text } = Typography;

const estadoOptions = [
    { label: 'Activa', value: true },
    { label: 'Inactiva', value: false },
];

const CajasCatalog = () => {
    const tiendaId = useTokenStore((state) => state.tiendaId);
    const selectedSedeId = useSedeStore((state) => state.selectedSedeId);
    const queryClient = useQueryClient();
    const { token } = theme.useToken();
    const [filterForm] = Form.useForm();
    const [drawerForm] = Form.useForm();
    const [filters, setFilters] = useState({ nombre: '', sedeId: null, activa: null });
    const [drawerState, setDrawerState] = useState({ open: false, editing: null });

    const cajasQuery = useQuery({
        queryKey: CAJA_KEYS.lists(tiendaId, selectedSedeId ?? null),
        queryFn: () => getCajas(tiendaId),
        enabled: !!tiendaId && !!selectedSedeId,
        select: (response) => Array.isArray(response) ? response : [],
    });

    const sedesQuery = useQuery({
        queryKey: ['sedes', tiendaId],
        queryFn: () => getSedesAsignadas(tiendaId),
        enabled: !!tiendaId,
    });

    const mutation = useMutation({
        mutationFn: ({ mode, cajaId, payload }) =>
            mode === 'edit' ? updateCaja(tiendaId, cajaId, payload) : createCaja(tiendaId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries(CAJA_KEYS.lists(tiendaId, selectedSedeId ?? null));
            handleCloseDrawer();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (cajaId) => deleteCaja(tiendaId, cajaId),
        onSuccess: () => queryClient.invalidateQueries(CAJA_KEYS.lists(tiendaId, selectedSedeId ?? null)),
    });

    // Mantener el filtro de sede alineado a la sede seleccionada globalmente
    // Requisito: al estar en una sede, solo deben mostrarse cajas de esa sede.
    useEffect(() => {
        if (!selectedSedeId) {
            return;
        }
        filterForm.setFieldsValue({ sedeId: selectedSedeId });
        setFilters((prev) => ({ ...prev, sedeId: selectedSedeId }));
    }, [selectedSedeId, filterForm]);

    const sedesMap = useMemo(() => {
        const map = new Map();
        (sedesQuery.data || []).forEach((sede) => {
            map.set(sede.id, sede.nombre);
        });
        return map;
    }, [sedesQuery.data]);

    const filteredCajas = useMemo(() => {
        const base = cajasQuery.data || [];
        return base.filter((caja) => {
            if (selectedSedeId && String(caja.sedeId) !== String(selectedSedeId)) {
                return false;
            }
            if (filters.nombre && !caja.nombre.toLowerCase().includes(filters.nombre.toLowerCase())) {
                return false;
            }
            if (filters.sedeId && caja.sedeId !== filters.sedeId) {
                return false;
            }
            if (typeof filters.activa === 'boolean' && caja.activa !== filters.activa) {
                return false;
            }
            return true;
        });
    }, [cajasQuery.data, filters, selectedSedeId]);

    const tableData = filteredCajas.map((caja) => ({
        ...caja,
        sedeNombre: sedesMap.get(caja.sedeId) || 'Sin sede',
        fechaCreacion: caja.creadoEn ? dayjs(caja.creadoEn).format('DD/MM/YYYY HH:mm') : '-',
    }));

    const handleFilterChange = (_, allValues) => {
        setFilters({
            nombre: allValues.nombre || '',
            sedeId: selectedSedeId || null,
            activa: typeof allValues.activa === 'boolean' ? allValues.activa : null,
        });
    };

    const handleResetFilters = () => {
        filterForm.resetFields();
        setFilters({ nombre: '', sedeId: selectedSedeId || null, activa: null });
        if (selectedSedeId) {
            filterForm.setFieldsValue({ sedeId: selectedSedeId });
        }
    };

    const handleOpenDrawer = (record = null) => {
        setDrawerState({ open: true, editing: record });
        if (record) {
            drawerForm.setFieldsValue({
                nombre: record.nombre,
                sedeId: record.sedeId,
                activa: record.activa,
            });
        } else {
            drawerForm.setFieldsValue({ nombre: '', sedeId: selectedSedeId ?? undefined, activa: true });
        }
    };

    const handleCloseDrawer = () => {
        setDrawerState({ open: false, editing: null });
        drawerForm.resetFields();
    };

    const handleSubmit = () => {
        drawerForm.validateFields().then((values) => {
            const payload = {
                sedeId: selectedSedeId ?? values.sedeId,
                nombre: values.nombre.trim(),
                activa: values.activa,
            };
            mutation.mutate({
                mode: drawerState.editing ? 'edit' : 'create',
                cajaId: drawerState.editing?.id,
                payload,
            });
        });
    };

    const columns = [
        {
            title: 'Nombre de la caja',
            dataIndex: 'nombre',
            key: 'nombre',
            render: (text) => <Text strong>{text}</Text>,
        },
        {
            title: 'Sede',
            dataIndex: 'sedeNombre',
            key: 'sedeNombre',
        },
        {
            title: 'Fecha de creación',
            dataIndex: 'fechaCreacion',
            key: 'fechaCreacion',
        },
        {
            title: 'Estado',
            dataIndex: 'activa',
            key: 'activa',
            render: (activa) => (
                <StatusDot color={activa ? '#52c41a' : '#ff4d4f'} label={activa ? 'Activa' : 'Inactiva'} />
            ),
        },
        {
            title: 'Acciones',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => handleOpenDrawer(record)}
                    >
                        Editar
                    </Button>
                    <Popconfirm
                        title="¿Eliminar caja?"
                        okText="Sí"
                        cancelText="No"
                        onConfirm={() => deleteMutation.mutate(record.id)}
                    >
                        <Button
                            type="link"
                            danger
                            icon={<DeleteOutlined />}
                            loading={deleteMutation.isPending}
                        >
                            Eliminar
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const sedeOptions = (sedesQuery.data || []).map((sede) => ({
        label: sede.nombre,
        value: sede.id,
    }));

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
                        Catálogo de Cajas
                    </Typography.Title>
                    <Text type="secondary">Administra las cajas de cada sede.</Text>
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => handleOpenDrawer()}
                    disabled={!selectedSedeId}
                >
                    Crear nueva caja
                </Button>
            </div>

            <Form
                form={filterForm}
                layout="vertical"
                onValuesChange={handleFilterChange}
                style={{ marginBottom: 16 }}
            >
                <Space style={{ width: '100%' }} wrap>
                    <Form.Item name="nombre" label="Nombre" style={{ minWidth: 260 }}>
                        <Input allowClear placeholder="Buscar por nombre" />
                    </Form.Item>
                    <Form.Item name="activa" label="Estado" style={{ minWidth: 150 }}>
                        <Select allowClear placeholder="Todos" options={estadoOptions} />
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
                loading={cajasQuery.isLoading}
                pagination={{
                    pageSizeOptions: ['10', '20', '50', '100'],
                    showSizeChanger: true,
                    defaultPageSize: 10,
                    showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} cajas`,
                }}
            />

            <Drawer
                title={drawerState.editing ? 'Editar caja' : 'Crear caja'}
                placement="right"
                width={420}
                open={drawerState.open}
                onClose={handleCloseDrawer}
                destroyOnClose
                extra={
                    <Space>
                        <Button onClick={handleCloseDrawer}>Cancelar</Button>
                        <Button
                            type="primary"
                            onClick={handleSubmit}
                            loading={mutation.isPending}
                        >
                            Guardar
                        </Button>
                    </Space>
                }
            >
                <Form layout="vertical" form={drawerForm} disabled={mutation.isPending}>
                    <Form.Item
                        label="Nombre"
                        name="nombre"
                        rules={[{ required: true, message: 'Ingresa el nombre de la caja' }]}
                    >
                        <Input placeholder="Caja principal" maxLength={100} />
                    </Form.Item>
                    {!selectedSedeId && (
                        <Form.Item
                            label="Sede"
                            name="sedeId"
                            rules={[{ required: true, message: 'Selecciona una sede' }]}
                        >
                            <Select
                                placeholder="Selecciona una sede"
                                options={sedeOptions}
                                loading={sedesQuery.isLoading}
                                showSearch
                                optionFilterProp="label"
                            />
                        </Form.Item>
                    )}
                    <Form.Item label="Activa" name="activa" valuePropName="checked" initialValue>
                        <Switch checkedChildren="Activa" unCheckedChildren="Inactiva" />
                    </Form.Item>
                </Form>
            </Drawer>
        </Card>
    );
};

export default CajasCatalog;
