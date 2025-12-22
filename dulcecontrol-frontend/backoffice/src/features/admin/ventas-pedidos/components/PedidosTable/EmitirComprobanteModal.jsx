import { Alert, Button, Form, Input, Modal, Radio, Select, Typography } from 'antd';
import { useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSeriesPorSede } from '../../api/facturacion.api.js';

const { Text } = Typography;
const { Option } = Select;

const DEFAULT_DOC_TIPO = 'DNI';

const isClienteGenerico = (cliente) => {
    if (!cliente) {
        return true;
    }
    if (cliente?.esGenerico) {
        return true;
    }
    const nombre = (cliente?.nombreDoc || cliente?.nombre_doc || cliente?.nombre || '').toString().toLowerCase();
    if (nombre.includes('genérico') || nombre.includes('generico')) {
        return true;
    }
    const numero = (cliente?.numeroDoc || cliente?.numero_doc || '').toString().replace(/[^0-9]/g, '');
    return numero === '00000000' || numero === '00000000000';
};

const EmitirComprobanteModal = ({
    open,
    onClose,
    onConfirm,
    loading,
    tiendaId,
    sedeId,
    pedido,
    cliente,
    clientes,
    facturacionConfig,
    facturacionConfigLoading,
    isCajaOpen,
}) => {
    const [form] = Form.useForm();

    const clienteIdValue = Form.useWatch('clienteId', form);
    const selectedCliente = useMemo(() => {
        const list = Array.isArray(clientes) ? clientes : [];
        if (!clienteIdValue) {
            return null;
        }
        return list.find((c) => String(c?.id) === String(clienteIdValue)) || null;
    }, [clientes, clienteIdValue]);

    const clienteSeleccionadoEsGenerico = useMemo(() => (
        isClienteGenerico(selectedCliente || cliente)
    ), [selectedCliente, cliente]);

    const puedeEditarCliente = Boolean(clienteSeleccionadoEsGenerico || !(selectedCliente?.id || cliente?.id));

    const clienteDocTipo = Form.useWatch('clienteDocTipo', form) || DEFAULT_DOC_TIPO;
    const isRuc = String(clienteDocTipo).toUpperCase() === 'RUC';
    const tipoComprobanteValue = Form.useWatch('tipoComprobante', form) || (isRuc ? 'factura' : 'boleta');
    const serieIdValue = Form.useWatch('serieId', form);

    const facturacionReady = useMemo(() => (
        !!(facturacionConfig?.ruc && facturacionConfig?.razonSocial && facturacionConfig?.direccionFiscal)
    ), [facturacionConfig]);

    const {
        data: seriesRaw = [],
        isLoading: seriesLoading,
        isFetching: isSeriesFetching,
        error: seriesError,
    } = useQuery({
        queryKey: ['facturacion-series', tiendaId, sedeId],
        queryFn: () => getSeriesPorSede(tiendaId, sedeId),
        enabled: open && !!tiendaId && !!sedeId,
        retry: 1,
        select: (data) => (Array.isArray(data) ? data.filter((serie) => serie.activa) : []),
    });

    const series = useMemo(() => (
        [...seriesRaw].sort((a, b) => (a?.serie || '').localeCompare(b?.serie || '', 'es', { sensitivity: 'base' }))
    ), [seriesRaw]);

    const seriesPorTipo = useMemo(() => {
        return series.reduce((acc, serie) => {
            const tipo = (serie?.tipoComprobante || serie?.tipo_comprobante || '').toString().toLowerCase();
            if (!tipo) {
                return acc;
            }
            if (!acc[tipo]) {
                acc[tipo] = [];
            }
            acc[tipo].push(serie);
            return acc;
        }, {});
    }, [series]);

    const seriesDisponibles = tipoComprobanteValue ? (seriesPorTipo[tipoComprobanteValue] || []) : [];
    const selectedSerie = useMemo(() => (
        series.find((s) => String(s.id) === String(serieIdValue)) || null
    ), [series, serieIdValue]);

    const correlativoPreview = selectedSerie
        ? Number(selectedSerie.correlativoActual ?? selectedSerie.correlativo_actual ?? 0) + 1
        : null;
    const correlativoFormatted = correlativoPreview ? correlativoPreview.toString().padStart(8, '0') : '';

    useEffect(() => {
        if (!open) {
            form.resetFields();
            return;
        }

        const baseClienteId = cliente?.id || undefined;
        const baseDocTipo = (cliente?.tipoDoc || cliente?.tipo_doc || DEFAULT_DOC_TIPO).toString().toUpperCase();
        const baseDocNumero = isClienteGenerico(cliente) ? '' : (cliente?.numeroDoc || cliente?.numero_doc || '').toString();
        const baseNombre = (cliente?.nombreDoc || cliente?.nombre_doc || cliente?.nombre || '').toString();
        const baseDireccion = (cliente?.direccion || '').toString();
        const baseTipoComprobante = baseDocTipo === 'RUC' ? 'factura' : 'boleta';

        form.setFieldsValue({
            clienteId: baseClienteId,
            clienteDocTipo: baseDocTipo,
            clienteDocNumero: baseDocNumero,
            clienteNombre: baseNombre,
            clienteDireccion: baseDireccion,
            tipoComprobante: baseTipoComprobante,
            serieId: undefined,
            comprobanteCorrelativo: undefined,
        });
    }, [open, cliente, form]);

    useEffect(() => {
        if (!open) {
            return;
        }
        if (!selectedCliente) {
            return;
        }

        const docTipo = (selectedCliente?.tipoDoc || selectedCliente?.tipo_doc || DEFAULT_DOC_TIPO).toString().toUpperCase();
        const docNumero = isClienteGenerico(selectedCliente) ? '' : (selectedCliente?.numeroDoc || selectedCliente?.numero_doc || '').toString();
        const nombre = (selectedCliente?.nombreDoc || selectedCliente?.nombre_doc || selectedCliente?.nombre || '').toString();
        const direccion = (selectedCliente?.direccion || '').toString();
        const tipoComprobante = docTipo === 'RUC' ? 'factura' : 'boleta';

        form.setFieldsValue({
            clienteDocTipo: docTipo,
            clienteDocNumero: docNumero,
            clienteNombre: nombre,
            clienteDireccion: direccion,
            tipoComprobante,
            serieId: undefined,
            comprobanteCorrelativo: undefined,
        });
    }, [open, selectedCliente, form]);

    useEffect(() => {
        if (!open) {
            return;
        }
        // En Perú: DNI -> Boleta; RUC -> Factura
        form.setFieldsValue({ tipoComprobante: isRuc ? 'factura' : 'boleta' });
    }, [open, isRuc, form]);

    useEffect(() => {
        if (!open) {
            return;
        }
        // Reset serie when tipo comprobante changes
        form.setFieldsValue({ serieId: undefined, comprobanteCorrelativo: undefined });
    }, [open, tipoComprobanteValue, form]);

    useEffect(() => {
        if (!open) {
            return;
        }
        if (!selectedSerie || !correlativoFormatted) {
            return;
        }
        form.setFieldsValue({ comprobanteCorrelativo: correlativoFormatted });
    }, [open, selectedSerie, correlativoFormatted, form]);

    const canEmitirComprobante = Boolean(
        isCajaOpen
        && sedeId
        && facturacionReady
        && !facturacionConfigLoading
        && !seriesLoading
        && !isSeriesFetching
        && selectedSerie
        && correlativoPreview
    );

    const seriesWarningMessage = useMemo(() => {
        if (!open) {
            return null;
        }
        if (seriesLoading || isSeriesFetching) {
            return 'Cargando series disponibles...';
        }
        if (seriesError) {
            return 'No se pudieron cargar las series para esta sede.';
        }
        if (!tipoComprobanteValue) {
            return null;
        }
        if (!seriesDisponibles.length) {
            return `No hay series activas para ${tipoComprobanteValue.toUpperCase()} en esta sede.`;
        }
        return null;
    }, [open, seriesLoading, isSeriesFetching, seriesError, tipoComprobanteValue, seriesDisponibles.length]);

    const facturacionBlockingMessage = useMemo(() => {
        if (!open) {
            return null;
        }
        if (!isCajaOpen) {
            return 'Debes abrir una caja en el Punto de Venta para emitir comprobantes.';
        }
        if (!sedeId) {
            return 'No se pudo determinar la sede del pedido para emitir comprobantes.';
        }
        if (facturacionConfigLoading) {
            return 'Cargando configuración fiscal...';
        }
        if (!facturacionReady) {
            return 'Configuración fiscal incompleta: registra RUC, razón social y dirección fiscal.';
        }
        return null;
    }, [open, isCajaOpen, sedeId, facturacionConfigLoading, facturacionReady]);

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            if (!selectedSerie || !correlativoPreview) {
                return;
            }

            const normalizedDocTipo = String(values.clienteDocTipo || DEFAULT_DOC_TIPO).toUpperCase();
            const expectedTipoComprobante = normalizedDocTipo === 'RUC' ? 'factura' : 'boleta';

            onConfirm({
                clienteId: values.clienteId || null,
                tipoComprobante: expectedTipoComprobante,
                serieId: selectedSerie.id,
                serieCodigo: selectedSerie.serie,
                correlativo: Number(values.comprobanteCorrelativo),
                clienteDocTipo: normalizedDocTipo,
                clienteDocNumero: (values.clienteDocNumero || '').toString().trim(),
                clienteNombre: (values.clienteNombre || '').toString().trim(),
                clienteDireccion: (values.clienteDireccion || '').toString().trim() || null,
            });
        } catch {
            // Validation already shows errors
        }
    };

    const alreadyHasComprobante = Boolean(
        pedido?.tipoComprobante
        && pedido?.serieComprobante
        && pedido?.numeroComprobante
    );

    return (
        <Modal
            title="Emitir Boleta / Factura"
            open={open}
            onCancel={onClose}
            footer={
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    <Button onClick={onClose}>Cancelar</Button>
                    <Button
                        type="primary"
                        onClick={handleOk}
                        loading={loading}
                        disabled={loading || !canEmitirComprobante || alreadyHasComprobante}
                    >
                        Emitir comprobante
                    </Button>
                </div>
            }
            width={520}
            destroyOnClose
        >
            {alreadyHasComprobante && (
                <Alert
                    type="info"
                    showIcon
                    message="Este pedido ya tiene comprobante emitido"
                    description={`${String(pedido?.tipoComprobante || '').toUpperCase()} ${pedido?.serieComprobante || ''}-${String(pedido?.numeroComprobante || '').toString().padStart(8, '0')}`}
                    style={{ marginBottom: 12 }}
                />
            )}

            {facturacionBlockingMessage && (
                <Alert
                    type="warning"
                    showIcon
                    message={facturacionBlockingMessage}
                    style={{ marginBottom: 12 }}
                />
            )}

            {seriesWarningMessage && (
                <Alert
                    type={seriesLoading || isSeriesFetching ? 'info' : 'warning'}
                    showIcon
                    message={seriesWarningMessage}
                    style={{ marginBottom: 12 }}
                />
            )}

            <Form form={form} layout="vertical">
                <Form.Item name="clienteId" label="Cliente (opcional)">
                    <Select
                        allowClear
                        showSearch
                        placeholder="Selecciona un cliente existente"
                        optionFilterProp="label"
                        options={(Array.isArray(clientes) ? clientes : []).map((c) => ({
                            value: c.id,
                            label: (c.nombreDoc || c.nombre || 'Sin nombre'),
                        }))}
                    />
                </Form.Item>

                <Form.Item
                    name="clienteDocTipo"
                    label="Tipo de documento"
                    rules={[{ required: true, message: 'Seleccione el tipo de documento' }]}
                >
                    <Radio.Group buttonStyle="solid" style={{ width: '100%' }}>
                        <Radio.Button value="DNI" style={{ width: '50%', textAlign: 'center' }} disabled={!puedeEditarCliente}>DNI</Radio.Button>
                        <Radio.Button value="RUC" style={{ width: '50%', textAlign: 'center' }} disabled={!puedeEditarCliente}>RUC</Radio.Button>
                    </Radio.Group>
                </Form.Item>

                <Form.Item
                    name="clienteDocNumero"
                    label="Número de documento"
                    rules={[
                        { required: true, message: 'Ingrese el número de documento' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                const docTipo = String(getFieldValue('clienteDocTipo') || DEFAULT_DOC_TIPO).toUpperCase();
                                const digits = String(value || '').replace(/[^0-9]/g, '');
                                if (docTipo === 'DNI' && digits.length !== 8) {
                                    return Promise.reject(new Error('DNI debe tener 8 dígitos'));
                                }
                                if (docTipo === 'RUC' && digits.length !== 11) {
                                    return Promise.reject(new Error('RUC debe tener 11 dígitos'));
                                }
                                return Promise.resolve();
                            },
                        }),
                    ]}
                >
                    <Input
                        placeholder={isRuc ? '11 dígitos' : '8 dígitos'}
                        inputMode="numeric"
                        maxLength={isRuc ? 11 : 8}
                        disabled={!puedeEditarCliente}
                        onChange={(e) => {
                            const raw = e.target.value;
                            const digits = String(raw || '').replace(/[^0-9]/g, '');
                            const limited = digits.slice(0, isRuc ? 11 : 8);
                            form.setFieldsValue({ clienteDocNumero: limited });
                        }}
                    />
                </Form.Item>

                <Form.Item
                    name="clienteNombre"
                    label="Nombre / Razón social"
                    rules={[{ required: true, message: 'Ingrese el nombre del cliente' }]}
                >
                    <Input disabled={!puedeEditarCliente} />
                </Form.Item>

                <Form.Item name="clienteDireccion" label="Dirección (Opcional)">
                    <Input disabled={!puedeEditarCliente} />
                </Form.Item>

                <div style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: 12, marginBottom: 12 }}>
                    <Text strong>Datos del comprobante</Text>

                    <Form.Item
                        name="tipoComprobante"
                        label="Tipo de comprobante"
                        rules={[{ required: true, message: 'Seleccione el tipo de comprobante' }]}
                        style={{ marginTop: 12 }}
                    >
                        <Radio.Group buttonStyle="solid" style={{ width: '100%' }}>
                            <Radio.Button value="boleta" style={{ width: '50%', textAlign: 'center' }} disabled={isRuc}>
                                BOLETA
                            </Radio.Button>
                            <Radio.Button value="factura" style={{ width: '50%', textAlign: 'center' }} disabled={!isRuc}>
                                FACTURA
                            </Radio.Button>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item
                        name="serieId"
                        label="Serie"
                        rules={[{ required: true, message: 'Seleccione una serie' }]}
                    >
                        <Select
                            placeholder={seriesLoading ? 'Cargando series...' : 'Selecciona la serie'}
                            loading={seriesLoading || isSeriesFetching}
                            disabled={seriesLoading || isSeriesFetching || !tipoComprobanteValue}
                        >
                            {seriesDisponibles.map((serie) => (
                                <Option key={serie.id} value={serie.id}>
                                    {serie.serie}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="comprobanteCorrelativo"
                        label="Correlativo"
                        rules={[{ required: true, message: 'El correlativo es requerido' }]}
                    >
                        <Input />
                    </Form.Item>
                </div>
            </Form>
        </Modal>
    );
};

export default EmitirComprobanteModal;
