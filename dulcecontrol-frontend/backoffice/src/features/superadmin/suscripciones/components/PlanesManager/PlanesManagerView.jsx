import { useEffect } from 'react';
import { Button, Table, Tag, Alert, Modal, Form, Input, InputNumber, Switch, Space, Card, Typography, theme } from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import { centimosToPEN } from '../../utils/currencyFormatter.js';

const { TextArea } = Input;
const { Text } = Typography;

const PlanesManagerView = ({
    planes,
    loading,
    isError,
    onRetry,
    onCreate,
    onEdit,
    isModalOpen,
    onCloseModal,
    onSave,
    selectedPlan,
    isSaving,
    setForm,
}) => {
    const [form] = Form.useForm();
    const { token } = theme.useToken();

    useEffect(() => {
        setForm(form);
    }, [form, setForm]);

    useEffect(() => {
        if (isModalOpen && selectedPlan) {
            const limites = selectedPlan.limites || {};
            const usuarios = limites.usuarios;
            const sedes = limites.sedes;

            const limitesEntries = [
                {
                    clave: 'usuarios',
                    valor: typeof usuarios === 'number' ? usuarios : Number(usuarios ?? 0),
                },
                {
                    clave: 'sedes',
                    valor: typeof sedes === 'number' ? sedes : Number(sedes ?? 0),
                },
            ];

            form.setFieldsValue({
                codigo: selectedPlan.codigo,
                nombre: selectedPlan.nombre,
                descripcion: selectedPlan.descripcion || '',
                precioMensualSoles: typeof selectedPlan.precioMensualCentimos === 'number'
                    ? selectedPlan.precioMensualCentimos / 100
                    : undefined,
                precioAnualSoles: typeof selectedPlan.precioAnualCentimos === 'number'
                    ? selectedPlan.precioAnualCentimos / 100
                    : undefined,
                limitesEntries,
                activo: selectedPlan.activo,
            });
        } else if (isModalOpen) {
            form.resetFields();
            form.setFieldsValue({
                limitesEntries: [
                    { clave: 'usuarios', valor: 5 },
                    { clave: 'sedes', valor: 1 },
                ],
                activo: true,
            });
        }
    }, [isModalOpen, selectedPlan, form]);

    const columns = [
        {
            title: 'Código',
            dataIndex: 'codigo',
            key: 'codigo',
            width: 250,
            render: (codigo) => <Text strong>{codigo}</Text>,
        },
        {
            title: 'Nombre',
            dataIndex: 'nombre',
            key: 'nombre',
            width: 200,
            render: (nombre) => <Text>{nombre}</Text>,
        },
        {
            title: 'Descripción',
            dataIndex: 'descripcion',
            key: 'descripcion',
            ellipsis: true,
            render: (descripcion) => <Text type="secondary">{descripcion}</Text>,
        },
        {
            title: 'Precio Mensual',
            dataIndex: 'precioMensualCentimos',
            key: 'precio_mensual',
            width: 150,
            render: (centimos) => <Text>{centimosToPEN(centimos)}</Text>,
        },
        {
            title: 'Precio Anual',
            dataIndex: 'precioAnualCentimos',
            key: 'precio_anual',
            width: 150,
            render: (centimos) => <Text>{centimosToPEN(centimos)}</Text>,
        },
        {
            title: 'Estado',
            dataIndex: 'activo',
            key: 'activo',
            width: 100,
            render: (activo) => (
                <Tag color={activo ? 'green' : 'red'}>
                    {activo ? 'Activo' : 'Inactivo'}
                </Tag>
            ),
        },
        {
            title: 'Acciones',
            key: 'acciones',
            width: 100,
            render: (_, plan) => (
                <Button
                    type="link"
                    icon={<EditOutlined />}
                    onClick={() => onEdit(plan)}
                >
                    Editar
                </Button>
            ),
        },
    ];

    if (isError) {
        return (
            <Alert
                message="Error al cargar planes"
                description="No se pudieron cargar los planes. Intenta nuevamente."
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
                    marginBottom: 16,
                }}
            >
                <div>
                    <Typography.Title level={4} style={{ margin: 0 }}>
                        Gestión de Planes
                    </Typography.Title>
                    <Text type="secondary">Administra los planes de suscripción disponibles.</Text>
                </div>
                <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
                    Crear Plan
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={planes}
                loading={loading}
                rowKey="id"
                pagination={{
                    pageSizeOptions: ['10', '20', '50', '100'],
                    showSizeChanger: true,
                    defaultPageSize: 10,
                    showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} planes`,
                }}
            />

            <Modal
                title={selectedPlan ? 'Editar Plan' : 'Crear Plan'}
                open={isModalOpen}
                onCancel={onCloseModal}
                footer={null}
                width={700}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onSave}
                    disabled={isSaving}
                >
                    <Form.Item
                        label="Código"
                        name="codigo"
                        rules={[{ required: true, message: 'El código es requerido' }]}
                    >
                        <Input placeholder="Ej: PLAN_BASIC" />
                    </Form.Item>

                    <Form.Item
                        label="Nombre"
                        name="nombre"
                        rules={[{ required: true, message: 'El nombre es requerido' }]}
                    >
                        <Input placeholder="Ej: Plan Básico" />
                    </Form.Item>

                    <Form.Item label="Descripción" name="descripcion">
                        <TextArea rows={3} placeholder="Descripción del plan" />
                    </Form.Item>

                    <Space style={{ width: '100%' }} size="large">
                        <Form.Item
                            label="Precio Mensual (Soles)"
                            name="precioMensualSoles"
                            rules={[{ required: true, message: 'Requerido' }]}
                        >
                            <InputNumber
                                min={0}
                                step={0.01}
                                precision={2}
                                placeholder="99.00"
                                style={{ width: 150 }}
                                addonBefore="S/"
                            />
                        </Form.Item>

                        <Form.Item
                            label="Precio Anual (Soles)"
                            name="precioAnualSoles"
                            rules={[{ required: true, message: 'Requerido' }]}
                        >
                            <InputNumber
                                min={0}
                                step={0.01}
                                precision={2}
                                placeholder="990.00"
                                style={{ width: 150 }}
                                addonBefore="S/"
                            />
                        </Form.Item>
                    </Space>

                    <Form.List
                        name="limitesEntries"
                        rules={[
                            {
                                validator: async (_, entries) => {
                                    if (!entries || entries.length === 0) {
                                        return Promise.reject(new Error('Agrega al menos un límite'));
                                    }
                                    const hasInvalid = entries.some((entry) => {
                                        const clave = entry?.clave?.trim();
                                        const valor = entry?.valor;
                                        return !clave || valor === undefined || valor === null || `${valor}`.trim() === '';
                                    });
                                    if (hasInvalid) {
                                        return Promise.reject(new Error('Completa todos los límites'));
                                    }
                                    return Promise.resolve();
                                },
                            },
                        ]}
                    >
                        {(fields, _operations, { errors }) => (
                            <div>
                                <label style={{ fontWeight: 500 }}>Límites del Plan</label>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Space
                                        key={key}
                                        style={{ display: 'flex', marginBottom: 8, width: '100%' }}
                                        align="baseline"
                                        wrap
                                    >
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'clave']}
                                            rules={[{ required: true, message: 'Campo requerido' }]}
                                            style={{ flex: 1 }}
                                        >
                                            <Input disabled />
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'valor']}
                                            rules={[{ required: true, message: 'Campo requerido' }]}
                                            style={{ flex: 1 }}
                                        >
                                            <InputNumber min={0} style={{ width: '100%' }} />
                                        </Form.Item>
                                    </Space>
                                ))}
                                <Form.ErrorList errors={errors} />
                            </div>
                        )}
                    </Form.List>

                    <Form.Item label="Activo" name="activo" valuePropName="checked">
                        <Switch />
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit" loading={isSaving}>
                                {selectedPlan ? 'Actualizar' : 'Crear'}
                            </Button>
                            <Button onClick={onCloseModal}>
                                Cancelar
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default PlanesManagerView;
