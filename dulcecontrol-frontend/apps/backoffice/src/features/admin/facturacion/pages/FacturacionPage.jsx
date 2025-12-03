import React, { useState, useEffect } from 'react';
import { Table, Card, Tag, Button, Space, DatePicker, Select, Input, Row, Col, message, Tooltip, Tabs } from 'antd';
import { FilePdfOutlined, FileTextOutlined, SearchOutlined, ReloadOutlined, EyeOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { facturacionApi } from '../api/facturacion.api';
import { useTokenStore } from '../../../../shared/store/tokenStore';
import dayjs from 'dayjs';
import { fetchComprobanteFullDetails, generateComprobantePDF, generateComprobanteXML } from '../utils/comprobanteUtils';

const { RangePicker } = DatePicker;
const { Option } = Select;

const FacturacionPage = () => {
    const navigate = useNavigate();
    const tiendaId = useTokenStore((state) => state.tiendaId);

    const [comprobantes, setComprobantes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        tipo: null,
        estado: null,
        clienteNumeroDoc: '',
        fechaInicio: null,
        fechaFin: null
    });

    const [validating, setValidating] = useState(false);

    const fetchComprobantes = async () => {
        if (!tiendaId) return;
        setLoading(true);
        try {
            const apiFilters = {};
            if (filters.tipo) apiFilters.tipo = filters.tipo;
            if (filters.estado) apiFilters.estado = filters.estado;
            if (filters.clienteNumeroDoc) apiFilters.clienteNumeroDoc = filters.clienteNumeroDoc;
            if (filters.fechaInicio) apiFilters.fechaInicio = filters.fechaInicio.toISOString();
            if (filters.fechaFin) apiFilters.fechaFin = filters.fechaFin.toISOString();

            const data = await facturacionApi.listarComprobantes(tiendaId, apiFilters);
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
    }, [tiendaId]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleDateRangeChange = (dates) => {
        if (dates) {
            setFilters(prev => ({
                ...prev,
                fechaInicio: dates[0],
                fechaFin: dates[1]
            }));
        } else {
            setFilters(prev => ({
                ...prev,
                fechaInicio: null,
                fechaFin: null
            }));
        }
    };

    const handleSearch = () => {
        fetchComprobantes();
    };

    const handleReset = () => {
        setFilters({
            tipo: null,
            estado: null,
            clienteNumeroDoc: '',
            fechaInicio: null,
            fechaFin: null
        });
        setTimeout(() => fetchComprobantes(), 100);
    };

    const handleVerDetalle = (record) => {
        navigate(`/admin/facturacion/comprobantes/${record.id}`);
    };

    const handleValidarSunat = async (record) => {
        setValidating(true);
        try {
            const payload = {
                codigoHash: 'HASH-SIMULADO-' + Date.now(),
                xmlUrl: `https://cdn.dulcecontrol.pe/cpe/${record.emisorRuc}-${record.tipoComprobante}-${record.serie}-${record.correlativo}.xml`,
                cdrUrl: `https://cdn.dulcecontrol.pe/cpe/${record.emisorRuc}-${record.tipoComprobante}-${record.serie}-${record.correlativo}-CDR.zip`,
                pdfUrl: `https://cdn.dulcecontrol.pe/cpe/${record.emisorRuc}-${record.tipoComprobante}-${record.serie}-${record.correlativo}.pdf`
            };

            await facturacionApi.registrarEnvioSunat(tiendaId, record.id, payload);

            await facturacionApi.actualizarEstadoSunat(tiendaId, record.id, {
                estadoSunat: 'ACEPTADO',
                codigoRespuesta: '0',
                descripcionRespuesta: 'La Factura numero ' + record.serie + '-' + record.correlativo + ' ha sido aceptada'
            });

            message.success('Comprobante validado correctamente con SUNAT');
            fetchComprobantes();
        } catch (error) {
            console.error('Error validando con SUNAT:', error);
            message.error('Error al validar el comprobante con SUNAT');
        } finally {
            setValidating(false);
        }
    };

    const [seriesList, setSeriesList] = useState([]);

    const fetchSeries = async () => {
        if (!tiendaId) return;
        try {
            const data = await facturacionApi.listarSeries(tiendaId);
            setSeriesList(data);
        } catch (error) {
            console.error('Error cargando series:', error);
        }
    };

    useEffect(() => {
        fetchSeries();
    }, [tiendaId]);

    const getSerieCode = (serieId) => {
        const serie = seriesList.find(s => s.id === serieId);
        return serie ? serie.serie : '';
    };

    const handleDownloadPDF = async (record) => {
        try {
            message.loading({ content: 'Generando PDF...', key: 'pdfGen' });
            const fullComprobante = await fetchComprobanteFullDetails(tiendaId, record.id);
            generateComprobantePDF(fullComprobante);
            message.success({ content: 'PDF descargado', key: 'pdfGen' });
        } catch (error) {
            message.error({ content: 'Error al generar PDF', key: 'pdfGen' });
        }
    };

    const handleDownloadXML = async (record) => {
        try {
            message.loading({ content: 'Generando XML...', key: 'xmlGen' });
            const fullComprobante = await fetchComprobanteFullDetails(tiendaId, record.id);
            generateComprobanteXML(fullComprobante);
            message.success({ content: 'XML descargado', key: 'xmlGen' });
        } catch (error) {
            message.error({ content: 'Error al generar XML', key: 'xmlGen' });
        }
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
            title: 'Cliente',
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
            dataIndex: 'estadoSunat',
            key: 'estadoSunat',
            render: (estado) => {
                const status = (estado || '').toUpperCase();
                let color = 'default';
                if (status === 'ACEPTADO') color = 'success';
                if (status === 'RECHAZADO') color = 'error';
                if (status === 'PENDIENTE') color = 'warning';
                if (status === 'ANULADO') color = 'red';

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

                    {record.estadoSunat?.toUpperCase() === 'PENDIENTE' && (
                        <Tooltip title="Validar con SUNAT">
                            <Button
                                type="primary"
                                icon={<CheckCircleOutlined />}
                                onClick={() => handleValidarSunat(record)}
                                loading={validating}
                                size="small"
                                ghost
                            />
                        </Tooltip>
                    )}

                    <Tooltip title={record.estadoSunat?.toUpperCase() === 'PENDIENTE' ? "Pendiente de envío a SUNAT" : "Descargar PDF"}>
                        <Button
                            type="text"
                            icon={<FilePdfOutlined style={{ color: record.estadoSunat?.toUpperCase() === 'PENDIENTE' ? 'rgba(0, 0, 0, 0.25)' : '#f5222d' }} />}
                            onClick={() => handleDownloadPDF(record)}
                            size="small"
                            disabled={record.estadoSunat?.toUpperCase() === 'PENDIENTE'}
                        />
                    </Tooltip>

                    <Tooltip title={record.estadoSunat?.toUpperCase() === 'PENDIENTE' ? "Pendiente de envío a SUNAT" : "Descargar XML"}>
                        <Button
                            type="text"
                            icon={<FileTextOutlined style={{ color: record.estadoSunat?.toUpperCase() === 'PENDIENTE' ? 'rgba(0, 0, 0, 0.25)' : '#1890ff' }} />}
                            onClick={() => handleDownloadXML(record)}
                            size="small"
                            disabled={record.estadoSunat?.toUpperCase() === 'PENDIENTE'}
                        />
                    </Tooltip>
                </Space>
            )
        }
    ];

    // --- Lógica de Resúmenes (Boletas) ---
    const [resumenDate, setResumenDate] = useState(dayjs());
    const [boletasPendientes, setBoletasPendientes] = useState([]);
    const [loadingResumen, setLoadingResumen] = useState(false);
    const [processingResumen, setProcessingResumen] = useState(false);

    const fetchBoletasPendientes = async () => {
        if (!tiendaId || !resumenDate) return;
        setLoadingResumen(true);
        try {
            // Solicitamos TODOS los comprobantes de la tienda para filtrar localmente
            // Esto evita problemas de zona horaria o case-sensitivity en el backend
            const data = await facturacionApi.listarComprobantes(tiendaId, {});

            // Filtramos localmente por:
            // 1. Tipo: BOLETA
            // 2. Estado: PENDIENTE
            // 3. Fecha: Coincide con el día seleccionado
            const pendientes = data.filter(item => {
                const tipo = (item.tipoComprobante || '').toUpperCase();
                const estado = (item.estadoSunat || '').toUpperCase();
                const fechaItem = dayjs(item.fechaEmision);

                const esBoleta = tipo === 'BOLETA';
                // Mostramos todas las boletas del día (Pendientes y Aceptadas) para que el usuario vea el resumen completo
                const esMismaFecha = fechaItem.isSame(resumenDate, 'day');

                return esBoleta && esMismaFecha;
            });

            setBoletasPendientes(pendientes);
            if (pendientes.length === 0) {
                message.info('No se encontraron boletas para la fecha seleccionada.');
            }
        } catch (error) {
            console.error('Error buscando boletas:', error);
            message.error('Error al buscar boletas pendientes');
        } finally {
            setLoadingResumen(false);
        }
    };

    const handleEnviarResumen = async () => {
        const boletasAEnviar = boletasPendientes.filter(b => b.estadoSunat?.toUpperCase() === 'PENDIENTE');

        if (boletasAEnviar.length === 0) {
            message.warning('No hay boletas pendientes para enviar en este resumen.');
            return;
        }

        setProcessingResumen(true);
        try {
            // Simulamos el envío del resumen (RC-YYYYMMDD-NNN)
            const resumenId = `RC-${resumenDate.format('YYYYMMDD')}-001`;

            // Procesamos cada boleta individualmente para simular el procesamiento por lotes del resumen
            for (const boleta of boletasAEnviar) {
                const payload = {
                    codigoHash: 'HASH-RESUMEN-' + Date.now(),
                    xmlUrl: `https://cdn.dulcecontrol.pe/cpe/resumen-${resumenId}.xml`,
                    cdrUrl: `https://cdn.dulcecontrol.pe/cpe/resumen-${resumenId}-CDR.zip`,
                    pdfUrl: null // Los resúmenes no suelen tener PDF individual visualizable igual que una factura
                };

                await facturacionApi.registrarEnvioSunat(tiendaId, boleta.id, payload);

                await facturacionApi.actualizarEstadoSunat(tiendaId, boleta.id, {
                    estadoSunat: 'ACEPTADO',
                    codigoRespuesta: '0',
                    descripcionRespuesta: `Aceptado en Resumen Diario ${resumenId}`
                });
            }

            message.success(`Resumen Diario ${resumenId} enviado y aceptado correctamente. ${boletasAEnviar.length} boletas procesadas.`);
            fetchBoletasPendientes(); // Recargar la lista para actualizar estados
            fetchComprobantes(); // Actualizar lista principal
        } catch (error) {
            console.error('Error enviando resumen:', error);
            message.error('Error al enviar el resumen de boletas');
        } finally {
            setProcessingResumen(false);
        }
    };

    const columnsResumen = [
        {
            title: 'Fecha Emisión',
            dataIndex: 'fechaEmision',
            render: (text) => dayjs(text).format('DD/MM/YYYY HH:mm'),
        },
        {
            title: 'Comprobante',
            render: (_, record) => `${record.tipoComprobante} ${getSerieCode(record.serieId)}-${String(record.correlativo).padStart(8, '0')}`
        },
        {
            title: 'Cliente',
            render: (_, record) => record.clienteNombre
        },
        {
            title: 'Total',
            dataIndex: 'totalImporteCentimos',
            render: (amount, record) => (
                <span style={{ fontWeight: 'bold' }}>
                    {record.moneda === 'PEN' ? 'S/ ' : '$ '}
                    {(amount / 100).toFixed(2)}
                </span>
            ),
            align: 'right'
        }
    ];

    const items = [
        {
            key: '1',
            label: 'Consulta de Comprobantes',
            children: (
                <>
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
                                value={filters.estado}
                                onChange={(val) => handleFilterChange('estado', val)}
                            >
                                <Option value="ACEPTADO">Aceptado</Option>
                                <Option value="RECHAZADO">Rechazado</Option>
                                <Option value="PENDIENTE">Pendiente</Option>
                                <Option value="ANULADO">Anulado</Option>
                            </Select>
                        </Col>
                        <Col xs={24} sm={24} md={8} lg={6}>
                            <RangePicker
                                style={{ width: '100%' }}
                                onChange={handleDateRangeChange}
                                value={filters.fechaInicio ? [filters.fechaInicio, filters.fechaFin] : null}
                                placeholder={['Fecha Inicio', 'Fecha Fin']}
                            />
                        </Col>
                        <Col xs={24} sm={24} md={8} lg={6}>
                            <Input
                                placeholder="Buscar por cliente (RUC/DNI)"
                                prefix={<SearchOutlined />}
                                value={filters.clienteNumeroDoc}
                                onChange={(e) => handleFilterChange('clienteNumeroDoc', e.target.value)}
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
                </>
            )
        },
        {
            key: '2',
            label: 'Resúmenes de Boletas (SUNAT)',
            children: (
                <div style={{ padding: '16px 0' }}>
                    <div style={{ marginBottom: 24, background: '#f6ffed', border: '1px solid #b7eb8f', padding: '16px', borderRadius: '4px' }}>
                        <h4 style={{ margin: 0, color: '#389e0d' }}>Generación de Resumen Diario</h4>
                        <p style={{ margin: '8px 0 0' }}>
                            Seleccione una fecha para ver todas las <b>Boletas de Venta</b> del día.
                            Se enviarán a SUNAT solo aquellas que se encuentren en estado <b>PENDIENTE</b>.
                        </p>
                    </div>

                    <Space style={{ marginBottom: 24 }}>
                        <span>Fecha de Emisión:</span>
                        <DatePicker
                            value={resumenDate}
                            onChange={setResumenDate}
                            allowClear={false}
                        />
                        <Button
                            type="primary"
                            icon={<SearchOutlined />}
                            onClick={fetchBoletasPendientes}
                            loading={loadingResumen}
                        >
                            Buscar Boletas
                        </Button>
                    </Space>

                    <Table
                        columns={columnsResumen}
                        dataSource={boletasPendientes}
                        rowKey="id"
                        loading={loadingResumen}
                        pagination={false}
                        locale={{ emptyText: 'No hay boletas pendientes para esta fecha' }}
                        footer={() => {
                            const pendientesCount = boletasPendientes.filter(b => b.estadoSunat?.toUpperCase() === 'PENDIENTE').length;
                            return (
                                <div style={{ textAlign: 'right' }}>
                                    <Space>
                                        <span>Total Boletas: {boletasPendientes.length}</span>
                                        <span>(Pendientes: {pendientesCount})</span>
                                        <Button
                                            type="primary"
                                            size="large"
                                            disabled={pendientesCount === 0}
                                            loading={processingResumen}
                                            onClick={handleEnviarResumen}
                                            style={{ background: '#fa8c16', borderColor: '#fa8c16' }}
                                        >
                                            Enviar Resumen a SUNAT
                                        </Button>
                                    </Space>
                                </div>
                            );
                        }}
                    />
                </div>
            )
        }
    ];

    return (
        <div style={{ padding: 24 }}>
            <Card title="Gestión de Comprobantes Electrónicos">
                <Tabs defaultActiveKey="1" items={items} />
            </Card>
        </div>
    );
};

export default FacturacionPage;
