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

            // Validar si tiene comprobantes asociados consultando la API
            const comprobantes = await facturacionApi.listarComprobantes(tiendaId, {
                serieId: record.id,
                page: 0,
                size: 1
            });

            // Soporte para distintos formatos de respuesta (Array directo o Page object de Spring)
            const tieneUso = Array.isArray(comprobantes)
                ? comprobantes.length > 0
                : (comprobantes.content?.length > 0 || comprobantes.items?.length > 0);

            if (tieneUso) {
                message.warning('No se puede eliminar la serie porque tiene comprobantes asociados.');
                return;
            }

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

            // Validar si tiene comprobantes asociados antes de cambiar estado
            const comprobantes = await facturacionApi.listarComprobantes(tiendaId, {
                serieId: record.id,
                page: 0,
                size: 1
            });

            const tieneUso = Array.isArray(comprobantes)
                ? comprobantes.length > 0
                : (comprobantes.content?.length > 0 || comprobantes.items?.length > 0);

            if (tieneUso) {
                message.warning('No se puede modificar el estado de una serie que ya tiene comprobantes emitidos.');
                return;
            }

            const nuevoEstado = !record.activa;
            const payload = {
                serie: record.serie,
                tipoComprobante: record.tipoComprobante,
                correlativoActual: record.correlativoActual,
                sedeId: record.sedeId || selectedSedeId, // Fallback to selected if missing in record
                activa: nuevoEstado,
                tiendaId
            };

            await facturacionApi.actualizarSerie(tiendaId, record.id, payload);
            message.success(`Serie ${nuevoEstado ? 'activada' : 'desactivada'} correctamente`);
            fetchSeries();
        } catch (error) {
            console.error('Error cambiando estado:', error);
            const errorMsg = error.response?.data?.message || error.message || 'Error al cambiar el estado de la serie';
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
                        >
                            <Button
                                icon={<DeleteOutlined />}
                                danger
                                size="small"
                            />
                        </Popconfirm>

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
                            { pattern: /^[FB][A-Z0-9]{3}$/, message: 'Formato inválido. Debe empezar con F (Factura) o B (Boleta). Ej: F001, B001' }
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
                            {editingSerie && <Option value="NOTA_CREDITO">NOTA DE CRÉDITO</Option>}
                            {editingSerie && <Option value="NOTA_DEBITO">NOTA DE DÉBITO</Option>}
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
