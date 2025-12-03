import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Modal, Form, Input, Select, Tag, message, Space, Popconfirm, Switch } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { facturacionApi } from '../api/facturacion.api';

const { Option } = Select;

const MetodosPagoPage = () => {
    const [metodos, setMetodos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingMetodo, setEditingMetodo] = useState(null);
    const [form] = Form.useForm();

    const fetchMetodos = async () => {
        setLoading(true);
        try {
            const data = await facturacionApi.listarMetodosPago();
            setMetodos(data);
        } catch (error) {
            console.error('Error cargando métodos de pago:', error);
            message.error('Error al cargar los métodos de pago');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMetodos();
    }, []);

    const handleCrear = () => {
        setEditingMetodo(null);
        form.resetFields();
        form.setFieldsValue({ activo: true });
        setIsModalVisible(true);
    };

    const handleEditar = (record) => {
        setEditingMetodo(record);
        form.setFieldsValue({
            nombre: record.nombre,
            codigo: record.codigo,
            activo: record.activo
        });
        setIsModalVisible(true);
    };

    const handleGuardar = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);

            if (editingMetodo) {
                await facturacionApi.actualizarMetodoPago(editingMetodo.id, values);
                message.success('Método de pago actualizado correctamente');
            } else {
                await facturacionApi.crearMetodoPago(values);
                message.success('Método de pago creado correctamente');
            }

            setIsModalVisible(false);
            fetchMetodos();
        } catch (error) {
            console.error('Error guardando método de pago:', error);
            const errorMsg = error.response?.data?.message || error.message || 'Error al guardar el método de pago';
            message.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleEliminar = async (record) => {
        try {
            setLoading(true);
            await facturacionApi.eliminarMetodoPago(record.id);
            message.success('Método de pago eliminado correctamente');
            fetchMetodos();
        } catch (error) {
            console.error('Error eliminando método de pago:', error);
            message.error('Error al eliminar el método de pago');
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: 'Nombre',
            dataIndex: 'nombre',
            key: 'nombre',
            render: (text) => <strong>{text}</strong>
        },
        {
            title: 'Código',
            dataIndex: 'codigo',
            key: 'codigo',
            render: (text) => <Tag color="blue">{text}</Tag>
        },
        {
            title: 'Estado',
            dataIndex: 'activo',
            key: 'activo',
            render: (activo) => (
                <Tag color={activo ? 'success' : 'error'}>
                    {activo ? 'ACTIVO' : 'INACTIVO'}
                </Tag>
            )
        },
        {
            title: 'Acciones',
            key: 'acciones',
            render: (_, record) => (
                <Space>
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleEditar(record)}
                        size="small"
                    />
                    <Popconfirm
                        title="¿Estás seguro de eliminar este método de pago?"
                        onConfirm={() => handleEliminar(record)}
                        okText="Sí"
                        cancelText="No"
                    >
                        <Button
                            icon={<DeleteOutlined />}
                            danger
                            size="small"
                        />
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <div style={{ padding: 24 }}>
            <Card
                title="Gestión de Métodos de Pago"
                extra={
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleCrear}>
                        Nuevo Método
                    </Button>
                }
            >
                <Table
                    columns={columns}
                    dataSource={metodos}
                    rowKey="id"
                    loading={loading}
                />
            </Card>

            <Modal
                title={editingMetodo ? "Editar Método de Pago" : "Nuevo Método de Pago"}
                open={isModalVisible}
                onOk={handleGuardar}
                onCancel={() => setIsModalVisible(false)}
                confirmLoading={loading}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="nombre"
                        label="Nombre"
                        rules={[{ required: true, message: 'Ingrese el nombre del método de pago' }]}
                    >
                        <Input placeholder="Ej: Efectivo, Tarjeta de Crédito" />
                    </Form.Item>

                    <Form.Item
                        name="codigo"
                        label="Código (Interno/SUNAT)"
                        rules={[{ required: true, message: 'Ingrese el código' }]}
                    >
                        <Input placeholder="Ej: EFECTIVO, VISA, MASTERCARD" style={{ textTransform: 'uppercase' }} />
                    </Form.Item>

                    <Form.Item
                        name="activo"
                        label="Estado"
                        valuePropName="checked"
                        initialValue={true}
                    >
                        <Switch checkedChildren="Activo" unCheckedChildren="Inactivo" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default MetodosPagoPage;
