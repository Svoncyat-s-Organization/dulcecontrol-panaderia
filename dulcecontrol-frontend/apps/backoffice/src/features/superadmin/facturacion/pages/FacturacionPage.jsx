import React, { useState, useEffect } from 'react';
import { Table, Card, Tag, Button, Space, DatePicker, Select, Input, Row, Col, message, Tooltip, InputNumber } from 'antd';
import { FilePdfOutlined, FileTextOutlined, SearchOutlined, ReloadOutlined, EyeOutlined } from '@ant-design/icons';
import { facturacionService } from '../services/facturacionService';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

const FacturacionPage = () => {
    const [comprobantes, setComprobantes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        tiendaId: null,
        tipo: null,
        estadoSunat: null,
        fechaInicio: null,
        fechaFin: null
    });

    const fetchComprobantes = async () => {
        setLoading(true);
        try {
            const apiFilters = {};
            if (filters.tiendaId) apiFilters.tiendaId = filters.tiendaId;
            if (filters.tipo) apiFilters.tipo = filters.tipo;
            if (filters.estadoSunat) apiFilters.estadoSunat = filters.estadoSunat;
            // Note: Backend might not support date range filtering yet based on controller signature, 
            // but we'll keep the UI ready or check if we can add it. 
            // Controller signature: listar(Long tiendaId, EstadoSunat estadoSunat, TipoComprobante tipo)
            // It seems it DOES NOT support date range yet. I will comment it out in the API call but keep UI.

            const data = await facturacionService.listarComprobantes(apiFilters);
            setComprobantes(data);
        } catch (error) {
            console.error('Error listando comprobantes:', error);
            message.error('Error al cargar los comprobantes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComprobantes();
    }, []);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleSearch = () => {
        fetchComprobantes();
    };

    const handleReset = () => {
        setFilters({
            tiendaId: null,
            tipo: null,
            estadoSunat: null,
            fechaInicio: null,
            fechaFin: null
        });
        setTimeout(() => fetchComprobantes(), 100);
    };

    const columns = [
        {
            title: 'Fecha Emisión',
            dataIndex: 'fechaEmision',
            key: 'fechaEmision',
            render: (text) => dayjs(text).format('DD/MM/YYYY HH:mm'),
            sorter: (a, b) => dayjs(a.fechaEmision).unix() - dayjs(b.fechaEmision).unix(),
            defaultSortOrder: 'descend'
        },
        {
            title: 'Tienda ID',
            dataIndex: 'tiendaId',
            key: 'tiendaId',
            width: 80,
        },
        {
            title: 'Comprobante',
            key: 'comprobante',
            render: (_, record) => (
                <Space direction="vertical" size={0}>
                    <Tag color={record.tiposComprobante === 'FACTURA' ? 'blue' : (record.tiposComprobante === 'BOLETA' ? 'green' : 'orange')}>
                        {record.tiposComprobante}
                    </Tag>
                    <span style={{ fontWeight: 'bold' }}>
                        Serie: {record.serieId} - {String(record.correlativo).padStart(8, '0')}
                    </span>
                </Space>
            )
        },
        {
            title: 'Cliente',
            key: 'cliente',
            render: (_, record) => (
                <Space direction="vertical" size={0}>
                    <span style={{ fontWeight: 500 }}>{record.clienteNombreDoc || 'Sin Nombre'}</span>
                    <span style={{ fontSize: '12px', color: '#888' }}>{record.clienteTipoDoc}: {record.clienteNumDoc}</span>
                </Space>
            )
        },
        {
            title: 'Moneda',
            dataIndex: 'moneda',
            key: 'moneda',
            width: 80,
        },
        {
            title: 'Total',
            dataIndex: 'totalImporteCentimos',
            key: 'total',
            render: (amount, record) => (
                <span style={{ fontWeight: 'bold' }}>
                    {record.moneda === 'PEN' ? 'S/ ' : '$ '}
                    {(amount / 100).toFixed(2)}
                </span>
            ),
            align: 'right'
        },
        {
            title: 'Estado SUNAT',
            dataIndex: 'estadosSunat',
            key: 'estadosSunat',
            render: (estado) => {
                let color = 'default';
                if (estado === 'ACEPTADO') color = 'success';
                if (estado === 'RECHAZADO') color = 'error';
                if (estado === 'PENDIENTE') color = 'warning';
                if (estado === 'ANULADO') color = 'red';

                return <Tag color={color}>{estado}</Tag>;
            }
        },
        {
            title: 'Acciones',
            key: 'acciones',
            render: (_, record) => (
                <Space>
                    {record.urlPdf && (
                        <Tooltip title="Descargar PDF">
                            <Button
                                type="text"
                                icon={<FilePdfOutlined style={{ color: '#f5222d' }} />}
                                href={record.urlPdf}
                                target="_blank"
                                size="small"
                            />
                        </Tooltip>
                    )}
                    {record.urlXml && (
                        <Tooltip title="Descargar XML">
                            <Button
                                type="text"
                                icon={<FileTextOutlined style={{ color: '#1890ff' }} />}
                                href={record.urlXml}
                                target="_blank"
                                size="small"
                            />
                        </Tooltip>
                    )}
                </Space>
            )
        }
    ];

    return (
        <div style={{ padding: 24 }}>
            <Card title="Gestión de Comprobantes (Superadmin)">
                <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                    <Col xs={24} sm={12} md={6} lg={4}>
                        <InputNumber
                            placeholder="Tienda ID"
                            style={{ width: '100%' }}
                            value={filters.tiendaId}
                            onChange={(val) => handleFilterChange('tiendaId', val)}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={6} lg={4}>
                        <Select
                            placeholder="Tipo"
                            style={{ width: '100%' }}
                            allowClear
                            value={filters.tipo}
                            onChange={(val) => handleFilterChange('tipo', val)}
                        >
                            <Option value="FACTURA">Factura</Option>
                            <Option value="BOLETA">Boleta</Option>
                            <Option value="NOTA_CREDITO">Nota de Crédito</Option>
                            <Option value="NOTA_DEBITO">Nota de Débito</Option>
                        </Select>
                    </Col>
                    <Col xs={24} sm={12} md={6} lg={4}>
                        <Select
                            placeholder="Estado SUNAT"
                            style={{ width: '100%' }}
                            allowClear
                            value={filters.estadoSunat}
                            onChange={(val) => handleFilterChange('estadoSunat', val)}
                        >
                            <Option value="ACEPTADO">Aceptado</Option>
                            <Option value="RECHAZADO">Rechazado</Option>
                            <Option value="PENDIENTE">Pendiente</Option>
                            <Option value="ANULADO">Anulado</Option>
                        </Select>
                    </Col>
                    <Col xs={24} sm={24} md={8} lg={4} style={{ display: 'flex', gap: '8px' }}>
                        <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch} block>
                            Buscar
                        </Button>
                        <Button icon={<ReloadOutlined />} onClick={handleReset} title="Limpiar filtros" />
                    </Col>
                </Row>

                <Table
                    columns={columns}
                    dataSource={comprobantes}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: 800 }}
                />
            </Card>
        </div>
    );
};

export default FacturacionPage;
