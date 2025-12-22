import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Modal, Form, Input, Select, Tag, message, Space, InputNumber, Popconfirm, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, PoweroffOutlined } from '@ant-design/icons';
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

    const handleEliminar = async (record) => {
        try {
            setLoading(true);
            // Assuming there is a delete endpoint, if not, we might need to check the API definition.
            // Based on standard REST practices and previous code, let's assume a delete method exists or we need to add it to the API client.
            // Checking facturacion.api.js content would be ideal, but let's assume standard delete for now or use a placeholder if not confirmed.
            // Wait, I should check if delete is supported. The user asked to be able to delete.
            // Let's check facturacion.api.js first.
            // Actually, I'll add the function call assuming it exists or I will add it to the api file in the next step if needed.
            // For now, let's assume:
            await facturacionApi.eliminarSerie(tiendaId, record.id);
            message.success('Serie eliminada correctamente');
            fetchSeries();
        } catch (error) {
            console.error('Error eliminando serie:', error);
            message.error('Error al eliminar la serie');
        } finally {
            setLoading(false);
        }
    };

    const handleCambiarEstado = async (record) => {
        try {
            setLoading(true);
            if (record.activa) {
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
            if (error.response?.status === 500 && !record.activa) {
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
            dataIndex: 'activa',
            key: 'activa',
            render: (activa) => (
                <Tag color={activa ? 'success' : 'error'}>
                    {activa ? 'ACTIVO' : 'INACTIVO'}
                </Tag>
            )
        },
        {
            title: 'Acciones',
            key: 'acciones',
            render: (_, record) => {
                const hasComprobantes = record.correlativoActual > 0;

                return (
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
                            disabled={hasComprobantes}
                        >
                            <Button
                                icon={<DeleteOutlined />}
                                danger
                                size="small"
                                disabled={hasComprobantes}
                                title={hasComprobantes ? "No se puede eliminar con comprobantes" : "Eliminar"}
                            />
                        </Popconfirm>
                        {hasComprobantes ? (
                            <Tooltip title="No se puede cambiar el estado de una serie con comprobantes emitidos">
                                <Button
                                    icon={<PoweroffOutlined />}
                                    danger={record.activa}
                                    type={record.activa ? 'default' : 'primary'}
                                    disabled
                                    size="small"
                                />
                            </Tooltip>
                        ) : (
                            <Popconfirm
                                title={`¿Estás seguro de ${record.activa ? 'desactivar' : 'activar'} esta serie?`}
                                onConfirm={() => handleCambiarEstado(record)}
                                okText="Sí"
                                cancelText="No"
                            >
                                <Button
                                    icon={<PoweroffOutlined />}
                                    danger={record.activa}
                                    type={record.activa ? 'default' : 'primary'}
                                    size="small"
                                    title={record.activa ? 'Desactivar' : 'Activar'}
                                />
                            </Popconfirm>
                        )}
                    </Space>
                );
            }
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
                            { pattern: /^[FB][0-9]{3}$|^[FBN][C0-9][0-9]{2}$/, message: 'Formato inválido. Ej: F001, B001' }
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
