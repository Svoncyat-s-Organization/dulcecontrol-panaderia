import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Modal, Form, Input, Select, Tag, message, Space, InputNumber, Popconfirm, Tooltip, Switch } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { facturacionService } from '../services/facturacionService';

const { Option } = Select;

const SeriesPage = () => {
    const [series, setSeries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingSerie, setEditingSerie] = useState(null);
    const [form] = Form.useForm();

    const fetchSeries = async () => {
        setLoading(true);
        try {
            const data = await facturacionService.listarSeries();
            setSeries(data);
        } catch (error) {
            console.error('Error cargando series:', error);
            message.error('Error al cargar las series');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSeries();
    }, []);

    const handleCrear = () => {
        setEditingSerie(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEditar = (record) => {
        setEditingSerie(record);
        form.setFieldsValue({
            serie: record.serie,
            tiposComprobante: record.tiposComprobante,
            ultimoCorrelativo: record.ultimoCorrelativo,
            activo: record.activo,
            esPredeterminada: record.esPredeterminada
        });
        setIsModalVisible(true);
    };

    const handleGuardar = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);

            if (editingSerie) {
                // Update
                const payload = {
                    ultimoCorrelativo: values.ultimoCorrelativo,
                    activo: values.activo,
                    esPredeterminada: values.esPredeterminada
                };
                await facturacionService.actualizarSerie(editingSerie.id, payload);
                message.success('Serie actualizada correctamente');
            } else {
                // Create
                const payload = {
                    serie: values.serie,
                    tiposComprobante: values.tiposComprobante,
                    esPredeterminada: values.esPredeterminada
                };
                await facturacionService.crearSerie(payload);
                message.success('Serie creada correctamente');
            }

            setIsModalVisible(false);
            fetchSeries();
        } catch (error) {
            console.error('Error guardando serie:', error);
            const errorMsg = error.response?.data?.message || error.message || 'Error al guardar la serie';
            message.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleEliminar = async (record) => {
        try {
            setLoading(true);
            await facturacionService.eliminarSerie(record.id);
            message.success('Serie eliminada correctamente');
            fetchSeries();
        } catch (error) {
            console.error('Error eliminando serie:', error);
            message.error('Error al eliminar la serie');
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: 'Serie',
            dataIndex: 'serie',
            key: 'serie',
            render: (text) => <strong>{text}</strong>
        },
        {
            title: 'Tipo Comprobante',
            dataIndex: 'tiposComprobante',
            key: 'tiposComprobante',
            render: (text) => {
                let color = 'default';
                if (text === 'FACTURA') color = 'blue';
                if (text === 'BOLETA') color = 'green';
                if (text === 'NOTA_CREDITO') color = 'orange';
                if (text === 'NOTA_DEBITO') color = 'purple';

                return (
                    <Tag color={color}>
                        {text ? text.replace('_', ' ') : ''}
                    </Tag>
                );
            }
        },
        {
            title: 'Último Correlativo',
            dataIndex: 'ultimoCorrelativo',
            key: 'ultimoCorrelativo',
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
            title: 'Predeterminada',
            dataIndex: 'esPredeterminada',
            key: 'esPredeterminada',
            render: (val) => val ? <Tag color="gold">SÍ</Tag> : 'No'
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
                        title="¿Estás seguro de eliminar esta serie?"
                        onConfirm={() => handleEliminar(record)}
                        okText="Sí"
                        cancelText="No"
                        disabled={record.ultimoCorrelativo > 0}
                    >
                        <Button
                            icon={<DeleteOutlined />}
                            danger
                            size="small"
                            disabled={record.ultimoCorrelativo > 0}
                        />
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <div style={{ padding: 24 }}>
            <Card
                title="Configuración de Series (SaaS)"
                extra={
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleCrear}>
                        Nueva Serie
                    </Button>
                }
            >
                <Table
                    columns={columns}
                    dataSource={series}
                    rowKey="id"
                    loading={loading}
                />
            </Card>

            <Modal
                title={editingSerie ? "Editar Serie" : "Nueva Serie"}
                open={isModalVisible}
                onOk={handleGuardar}
                onCancel={() => setIsModalVisible(false)}
                confirmLoading={loading}
            >
                <Form form={form} layout="vertical">

                    {/* Campos solo para creación */}
                    {!editingSerie && (
                        <>
                            <Form.Item
                                name="serie"
                                label="Serie (Ej: F001, B001)"
                                rules={[
                                    { required: true, message: 'Ingrese la serie' },
                                    { pattern: /^[FB][0-9]{3}$|^[FBN][C0-9][0-9]{2}$/, message: 'Formato inválido. Ej: F001, B001' }
                                ]}
                            >
                                <Input placeholder="F001" maxLength={4} />
                            </Form.Item>

                            <Form.Item
                                name="tiposComprobante"
                                label="Tipo de Comprobante"
                                rules={[{ required: true, message: 'Seleccione el tipo' }]}
                            >
                                <Select>
                                    <Option value="FACTURA">FACTURA</Option>
                                    <Option value="BOLETA">BOLETA</Option>
                                    <Option value="NOTA_CREDITO">NOTA DE CRÉDITO</Option>
                                    <Option value="NOTA_DEBITO">NOTA DE DÉBITO</Option>
                                </Select>
                            </Form.Item>
                        </>
                    )}

                    {/* Campos solo para edición (visualización para creación si se quisiera, pero backend no lo pide) */}
                    {editingSerie && (
                        <>
                            <Form.Item label="Serie">
                                <Input value={editingSerie.serie} disabled />
                            </Form.Item>
                            <Form.Item label="Tipo de Comprobante">
                                <Input value={editingSerie.tiposComprobante} disabled />
                            </Form.Item>
                            <Form.Item
                                name="ultimoCorrelativo"
                                label="Último Correlativo"
                                rules={[{ required: true, message: 'Ingrese el correlativo' }]}
                            >
                                <InputNumber min={0} style={{ width: '100%' }} />
                            </Form.Item>
                            <Form.Item
                                name="activo"
                                label="Activo"
                                valuePropName="checked"
                            >
                                <Switch />
                            </Form.Item>
                        </>
                    )}

                    <Form.Item
                        name="esPredeterminada"
                        label="Es Predeterminada"
                        valuePropName="checked"
                        initialValue={false}
                    >
                        <Switch />
                    </Form.Item>

                </Form>
            </Modal>
        </div>
    );
};

export default SeriesPage;
