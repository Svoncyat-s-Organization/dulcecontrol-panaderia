import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Modal, Form, Input, Select, Tag, message, Space, InputNumber, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { facturacionApi } from '../api/facturacion.api';
import { useSedeStore } from '../../../../shared/store/sedeStore';
import { useTokenStore } from '../../../../shared/store/tokenStore';

const { Option } = Select;

const SeriesPage = () => {
    const tiendaId = useTokenStore((state) => state.tiendaId);
    const selectedSedeId = useSedeStore((state) => state.selectedSedeId);

    const [series, setSeries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingSerie, setEditingSerie] = useState(null);
    const [form] = Form.useForm();

    const fetchSeries = async () => {
        if (!tiendaId) return;
        setLoading(true);
        try {
            const data = await facturacionApi.listarSeries(tiendaId);
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
    }, [tiendaId]);

    const handleCrear = () => {
        setEditingSerie(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEditar = (record) => {
        setEditingSerie(record);
        form.setFieldsValue({
            serie: record.serie,
            tipoComprobante: record.tipoComprobante,
            correlativoActual: record.correlativoActual
        });
        setIsModalVisible(true);
    };

    const handleGuardar = async () => {
        try {
            const values = await form.validateFields();

            if (!selectedSedeId) {
                message.error('Debe seleccionar una sede primero');
                return;
            }

            setLoading(true);

            const payload = {
                ...values,
                tiendaId,
                sedeId: selectedSedeId
            };

            if (editingSerie) {
                await facturacionApi.actualizarSerie(tiendaId, editingSerie.id, payload);
                message.success('Serie actualizada correctamente');
            } else {
                await facturacionApi.crearSerie(tiendaId, payload);
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

    const handleCambiarEstado = async (record) => {
        try {
            setLoading(true);
            if (record.activo) {
                await facturacionApi.desactivarSerie(tiendaId, record.id);
                message.success('Serie desactivada');
            } else {
                await facturacionApi.activarSerie(tiendaId, record.id);
                message.success('Serie activada');
            }
            fetchSeries();
        } catch (error) {
            console.error('Error cambiando estado:', error);
            let errorMsg = error.response?.data?.message || error.message || 'Error al cambiar el estado de la serie';

            // Handle specific 500 error for duplicate active series
            if (error.response?.status === 500 && !record.activo) {
                // Check if the error message indicates a duplicate series issue (even if generic 500)
                // Since the backend throws IllegalArgumentException which might result in 500 if not handled by a global exception handler
                errorMsg = 'No se pudo activar la serie. Es posible que ya exista otra serie activa con el mismo código.';
            }

            message.error(errorMsg);
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
            dataIndex: 'tipoComprobante',
            key: 'tipoComprobante',
            render: (text) => {
                let color = 'default';
                if (text === 'FACTURA') color = 'blue';
                if (text === 'BOLETA') color = 'green';
                if (text === 'NOTA_CREDITO') color = 'orange';
                if (text === 'NOTA_DEBITO') color = 'purple';

                return (
                    <Tag color={color}>
                        {text.replace('_', ' ')}
                    </Tag>
                );
            }
        },
        {
            title: 'Correlativo Actual',
            dataIndex: 'correlativoActual',
            key: 'correlativoActual',
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
                        title={`¿Estás seguro de ${record.activo ? 'desactivar' : 'activar'} esta serie?`}
                        onConfirm={() => handleCambiarEstado(record)}
                        okText="Sí"
                        cancelText="No"
                    >
                        <Button
                            icon={record.activo ? <DeleteOutlined /> : <CheckCircleOutlined />}
                            danger={record.activo}
                            type={record.activo ? 'default' : 'primary'}
                            size="small"
                            title={record.activo ? 'Desactivar' : 'Activar'}
                        />
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <div style={{ padding: 24 }}>
            <Card
                title="Gestión de Series y Correlativos"
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
                    <Form.Item
                        name="serie"
                        label="Serie (Ej: F001, B001)"
                        rules={[
                            { required: true, message: 'Ingrese la serie' },
                            { pattern: /^[FB][0-9]{3}$/, message: 'Formato inválido. Ej: F001' }
                        ]}
                    >
                        <Input placeholder="F001" maxLength={4} disabled={!!editingSerie} />
                    </Form.Item>

                    <Form.Item
                        name="tipoComprobante"
                        label="Tipo de Comprobante"
                        rules={[{ required: true, message: 'Seleccione el tipo' }]}
                    >
                        <Select disabled={!!editingSerie}>
                            <Option value="FACTURA">FACTURA</Option>
                            <Option value="BOLETA">BOLETA</Option>
                            <Option value="NOTA_CREDITO">NOTA DE CRÉDITO</Option>
                            <Option value="NOTA_DEBITO">NOTA DE DÉBITO</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="correlativoActual"
                        label="Correlativo Inicial / Actual"
                        rules={[{ required: true, message: 'Ingrese el correlativo' }]}
                    >
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default SeriesPage;
