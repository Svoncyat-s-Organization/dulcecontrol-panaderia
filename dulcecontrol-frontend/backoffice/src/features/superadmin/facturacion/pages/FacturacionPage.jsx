import React, { useState, useEffect } from 'react';
import { Table, Card, Tag, Button, Space, Select, Input, Row, Col, message, Tooltip } from 'antd';
import { EyeOutlined, SearchOutlined, ReloadOutlined, FilePdfOutlined, FileTextOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { facturacionApi } from '../api/facturacion.api';
import dayjs from 'dayjs';

const { Option } = Select;

const FacturacionPage = () => {
    const navigate = useNavigate();

    const [comprobantes, setComprobantes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        tipo: null,
        estadoSunat: null,
        tiendaId: ''
    });

    const fetchComprobantes = async () => {
        setLoading(true);
        try {
            const apiFilters = {};
            if (filters.tipo) apiFilters.tipo = filters.tipo;
            if (filters.estadoSunat) apiFilters.estadoSunat = filters.estadoSunat;
            if (filters.tiendaId) apiFilters.tiendaId = filters.tiendaId;

            const data = await facturacionApi.listarComprobantes(apiFilters);
            setComprobantes(data);
        } catch (error) {
            console.error('Error listando comprobantes:', error);
            message.error('Error al cargar los comprobantes');
        } finally {
            setLoading(false);
        }
    };

    const [seriesList, setSeriesList] = useState([]);

    const fetchSeries = async () => {
        try {
            const data = await facturacionApi.listarSeries();
            setSeriesList(data);
        } catch (error) {
            console.error('Error cargando series:', error);
        }
    };

    useEffect(() => {
        fetchComprobantes();
        fetchSeries();
    }, []);

    const getSerieCode = (serieId) => {
        const serie = seriesList.find(s => s.id === serieId);
        return serie ? serie.serie : '';
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleSearch = () => {
        fetchComprobantes();
    };

    const handleReset = () => {
        setFilters({
            tipo: null,
            estadoSunat: null,
            tiendaId: ''
        });
        setTimeout(() => fetchComprobantes(), 100);
    };

    const handleVerDetalle = (record) => {
        navigate(`/superadmin/facturacion/comprobantes/${record.id}`);
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
            title: 'Comprobante',
            key: 'comprobante',
            render: (_, record) => (
                <Space direction="vertical" size={0}>
                    <Tag color={record.tipoComprobante === 'FACTURA' ? 'blue' : (record.tipoComprobante === 'BOLETA' ? 'green' : 'orange')}>
                        {record.tipoComprobante}
                    </Tag>
                    <span style={{ fontWeight: 'bold' }}>
                        {getSerieCode(record.serieId)}-{String(record.correlativo).padStart(8, '0')}
                    </span>
                </Space>
            )
        },
        {
            title: 'Tienda / Cliente',
            key: 'cliente',
            render: (_, record) => (
                <Space direction="vertical" size={0}>
                    <span style={{ fontWeight: 500 }}>{record.clienteNombre}</span>
                    <span style={{ fontSize: '12px', color: '#888' }}>{record.clienteTipoDoc}: {record.clienteNumeroDoc}</span>
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
                    <Tooltip title="Ver Detalle">
                        <Button
                            icon={<EyeOutlined />}
                            onClick={() => handleVerDetalle(record)}
                            size="small"
                        />
                    </Tooltip>

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
            <Card title="Gestión de Facturación de Suscripciones">
                <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
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
                    <Col xs={24} sm={24} md={8} lg={6}>
                        <Input
                            placeholder="ID de Tienda (Opcional)"
                            prefix={<SearchOutlined />}
                            value={filters.tiendaId}
                            onChange={(e) => handleFilterChange('tiendaId', e.target.value)}
                            onPressEnter={handleSearch}
                        />
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
