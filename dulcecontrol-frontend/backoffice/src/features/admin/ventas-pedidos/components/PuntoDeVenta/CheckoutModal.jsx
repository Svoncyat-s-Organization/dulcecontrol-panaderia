import { Drawer, Form, Select, Input, Radio, Typography, Row, Col, Button, Space, DatePicker, Alert, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useEffect, useMemo, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { useQuery } from '@tanstack/react-query';
import { createDireccionCliente, getClientes, getDireccionesCliente } from '../../api/clientes.api.js';
import { getSeriesPorSede } from '../../api/facturacion.api.js';
import { getUbigeoDepartamentos, getUbigeoDistritos, getUbigeoProvincias, getUbigeoRutaPorDistrito } from '../../api/ubigeo.api.js';
import { useTokenStore } from '../../../../../shared/store/tokenStore.js';
import { POS_MODES, useCartStore } from '../../hooks/useCartStore.js';
import { TIPOS_ENTREGA } from '../../constants/ventaConstants.js';
import { FACTURACION_KEYS, UBIGEO_KEYS } from '../../constants/queryKeys.js';
import MoneyInput from '../../../../../shared/components/MoneyInput.jsx';

const { Title, Text } = Typography;
const { Option } = Select;
const EMPTY_UBIGEO_LABELS = {
    departamentoNombre: null,
    provinciaNombre: null,
    distritoNombre: null,
    codigo: null,
};

const CheckoutModal = ({
    open,
    onCancel,
    onConfirm,
    total,
    loading,
    sedeId,
    facturacionConfig,
    facturacionConfigLoading,
    facturacionConfigError,
}) => {
    const [form] = Form.useForm();
    const [addressForm] = Form.useForm();
    const tiendaId = useTokenStore((state) => state.tiendaId);
    const { cliente, setCliente, posMode } = useCartStore();
    const formDocTipo = Form.useWatch('clienteDocTipo', form);
    const isRuc = formDocTipo === 'RUC';
    const CASH_METHOD = 'efectivo';
    const [metodoPago, setMetodoPago] = useState(CASH_METHOD);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [savingAddress, setSavingAddress] = useState(false);
    const [isUbigeoPrefilling, setIsUbigeoPrefilling] = useState(false);
    const [shippingUbigeoLabels, setShippingUbigeoLabels] = useState(EMPTY_UBIGEO_LABELS);
    const previousMode = useRef(posMode);
    const clienteId = cliente?.id;
    const clienteEsGenerico = useMemo(() => {
        if (!cliente) {
            return true;
        }
        if (cliente?.esGenerico) {
            return true;
        }
        const nombre = (cliente?.nombreDoc || cliente?.nombre_doc || '').toLowerCase();
        if (nombre.includes('genérico') || nombre.includes('generico')) {
            return true;
        }
        const numero = (cliente?.numeroDoc || cliente?.numero_doc || '').replace(/[^0-9]/g, '');
        return numero === '00000000' || numero === '00000000000';
    }, [cliente]);

    const isGenericAndSmallAmount = clienteEsGenerico && total <= 700;

    const facturacionReady = useMemo(() => (
        !!(facturacionConfig?.ruc && facturacionConfig?.razonSocial && facturacionConfig?.direccionFiscal)
    ), [facturacionConfig]);

    const isPedido = posMode === POS_MODES.PEDIDO;
    const tipoPagoPedidoValue = Form.useWatch('tipoPagoPedido', form) || 'adelanto';
    const requiereComprobante = !isPedido || tipoPagoPedidoValue === 'completo';
    const tipoComprobanteValue = Form.useWatch('tipoComprobante', form) || (isRuc ? 'factura' : 'boleta');
    const serieIdValue = Form.useWatch('serieId', form);
    const tipoEntregaValue = Form.useWatch('tipoEntrega', form) || (isPedido ? TIPOS_ENTREGA.RECOJO_TIENDA : TIPOS_ENTREGA.CONSUMO_LOCAL);
    const montoPagadoValue = Number(Form.useWatch('montoPagado', form) || 0);
    const showDeliveryFields = isPedido && tipoEntregaValue === TIPOS_ENTREGA.DELIVERY;
    const puedeEditarCliente = clienteEsGenerico || !clienteId;
    const shippingDepartamentoId = Form.useWatch('shippingDepartamentoId', form);
    const shippingProvinciaId = Form.useWatch('shippingProvinciaId', form);
    const shippingDistritoId = Form.useWatch('shippingDistritoId', form);
    const newAddressDepartamentoId = Form.useWatch('departamentoId', addressForm);
    const newAddressProvinciaId = Form.useWatch('provinciaId', addressForm);

    const { data: clientes = [] } = useQuery({
        queryKey: ['clientes', tiendaId],
        queryFn: () => getClientes(tiendaId),
        enabled: !!tiendaId && open
    });

    const { data: direccionesCliente = [], refetch: refetchDirecciones } = useQuery({
        queryKey: ['cliente-direcciones', tiendaId, clienteId],
        queryFn: () => getDireccionesCliente(tiendaId, clienteId),
        enabled: !!tiendaId && !!clienteId && open
    });

    const {
        data: seriesRaw = [],
        isLoading: seriesLoading,
        isFetching: isSeriesFetching,
    } = useQuery({
        queryKey: FACTURACION_KEYS.series(tiendaId, sedeId || null),
        queryFn: () => getSeriesPorSede(tiendaId, sedeId),
        enabled: open && !!tiendaId && !!sedeId,
        select: (data) => (Array.isArray(data) ? data.filter((serie) => serie.activa) : []),
    });

    const {
        data: departamentos = [],
        isLoading: departamentosLoading,
    } = useQuery({
        queryKey: UBIGEO_KEYS.departamentos(),
        queryFn: () => getUbigeoDepartamentos(),
        enabled: open,
        staleTime: 1000 * 60 * 60,
    });

    const {
        data: shippingProvinciasData = [],
        isFetching: shippingProvinciasFetching,
    } = useQuery({
        queryKey: UBIGEO_KEYS.provincias(shippingDepartamentoId),
        queryFn: () => getUbigeoProvincias(shippingDepartamentoId),
        enabled: open && !!shippingDepartamentoId,
        staleTime: 1000 * 60 * 10,
    });

    const {
        data: shippingDistritosData = [],
        isFetching: shippingDistritosFetching,
    } = useQuery({
        queryKey: UBIGEO_KEYS.distritos(shippingProvinciaId),
        queryFn: () => getUbigeoDistritos(shippingProvinciaId),
        enabled: open && !!shippingProvinciaId,
        staleTime: 1000 * 60 * 10,
    });

    const {
        data: addressProvinciasData = [],
        isFetching: addressProvinciasFetching,
    } = useQuery({
        queryKey: UBIGEO_KEYS.provincias(newAddressDepartamentoId),
        queryFn: () => getUbigeoProvincias(newAddressDepartamentoId),
        enabled: open && isAddressModalOpen && !!newAddressDepartamentoId,
    });

    const {
        data: addressDistritosData = [],
        isFetching: addressDistritosFetching,
    } = useQuery({
        queryKey: UBIGEO_KEYS.distritos(newAddressProvinciaId),
        queryFn: () => getUbigeoDistritos(newAddressProvinciaId),
        enabled: open && isAddressModalOpen && !!newAddressProvinciaId,
    });

    const shippingProvincias = shippingDepartamentoId ? shippingProvinciasData : [];
    const shippingDistritos = shippingProvinciaId ? shippingDistritosData : [];
    const addressProvincias = newAddressDepartamentoId ? addressProvinciasData : [];
    const addressDistritos = newAddressProvinciaId ? addressDistritosData : [];

    const series = useMemo(() => (
        [...seriesRaw].sort((a, b) => (a?.serie || '').localeCompare(b?.serie || '', 'es', { sensitivity: 'base' }))
    ), [seriesRaw]);

    const seriesPorTipo = useMemo(() => (
        series.reduce((acc, serie) => {
            const tipo = (serie?.tipoComprobante || '').toLowerCase();
            if (!tipo) {
                return acc;
            }
            if (!acc[tipo]) {
                acc[tipo] = [];
            }
            acc[tipo].push(serie);
            return acc;
        }, {})
    ), [series]);

    const seriesDisponibles = tipoComprobanteValue ? (seriesPorTipo[tipoComprobanteValue] || []) : [];

    const selectedSerie = useMemo(() => {
        if (!serieIdValue) {
            return null;
        }
        return series.find((serie) => String(serie.id) === String(serieIdValue)) || null;
    }, [series, serieIdValue]);

    const correlativoPreview = selectedSerie ? Number(selectedSerie.correlativoActual ?? 0) + 1 : null;
    const correlativoFormatted = correlativoPreview ? correlativoPreview.toString().padStart(8, '0') : '';
    const canEmitirComprobante = Boolean(
        selectedSerie
        && correlativoPreview
        && facturacionReady
        && !facturacionConfigLoading
        && !seriesLoading
        && !isSeriesFetching
        && !!sedeId
    );
    const docTipoLocked = false; // Allow changing doc type for generic clients
    const docTipoOptions = ['DNI', 'RUC'];
    const facturacionBlockingMessage = useMemo(() => {
        if (!requiereComprobante) {
            return null;
        }
        if (!sedeId) {
            return 'No se pudo determinar la sede activa de la caja. Selecciona una caja vinculada a una sede para emitir comprobantes.';
        }
        if (facturacionConfigError) {
            return 'No se pudo cargar la configuración fiscal. Revisa Configuración > Facturación e inténtalo nuevamente.';
        }
        if (!facturacionReady) {
            return 'Completa la configuración fiscal de la tienda antes de emitir comprobantes.';
        }
        return null;
    }, [sedeId, facturacionConfigError, facturacionReady]);
    const seriesWarningMessage = useMemo(() => {
        if (!tipoComprobanteValue || seriesLoading || isSeriesFetching) {
            return null;
        }
        if (!seriesDisponibles.length) {
            return `No hay series activas configuradas para ${tipoComprobanteValue.toUpperCase()}.`;
        }
        return null;
    }, [tipoComprobanteValue, seriesDisponibles.length, seriesLoading, isSeriesFetching]);

    useEffect(() => {
        if (!open) {
            return;
        }
        previousMode.current = posMode;
        form.resetFields();
        // Default to DNI if generic, otherwise use client's doc type
        const initialDocTipo = cliente?.tipoDoc || 'DNI';
        const initialIsRuc = initialDocTipo === 'RUC';
        const defaultComprobante = initialIsRuc ? 'factura' : 'boleta';
        const defaultMonto = isPedido ? 0 : total;
        form.setFieldsValue({
            tipoComprobante: defaultComprobante,
            metodoPago: isPedido ? 'yape' : CASH_METHOD,
            tipoPagoPedido: isPedido ? 'adelanto' : undefined,
            tipoEntrega: isPedido ? TIPOS_ENTREGA.RECOJO_TIENDA : TIPOS_ENTREGA.CONSUMO_LOCAL,
            montoPagado: defaultMonto,
            fechaEntrega: isPedido ? dayjs().add(1, 'day').hour(12).minute(0) : dayjs(),
            costoDelivery: 0,
            direccionClienteId: null,
            shippingDireccion: '',
            shippingReferencia: '',
            shippingContactoNombre: cliente?.nombreDoc || '',
            shippingContactoTelefono: cliente?.telefono || '',
            serieId: null,
            shippingDepartamentoId: null,
            shippingProvinciaId: null,
            shippingDistritoId: null,
        });
        setMetodoPago(isPedido ? 'yape' : CASH_METHOD);
        setShippingUbigeoLabels(EMPTY_UBIGEO_LABELS);
    }, [open, cliente, posMode, total, isPedido, form]);

    useEffect(() => {
        if (!open || !isPedido) {
            return;
        }
        if (tipoPagoPedidoValue === 'completo') {
            form.setFieldsValue({ montoPagado: total });
        } else {
            form.setFieldsValue({ montoPagado: 0 });
        }
    }, [open, isPedido, tipoPagoPedidoValue, total, form]);

    useEffect(() => {
        if (!open) {
            return;
        }
        if (!clienteId) {
            form.setFieldsValue({
                direccionClienteId: null,
                shippingDireccion: '',
                shippingReferencia: '',
                shippingContactoNombre: '',
                shippingContactoTelefono: '',
            });
            clearShippingUbigeoFields();
        } else {
            form.setFieldsValue({
                shippingContactoNombre: cliente?.nombreDoc || '',
                shippingContactoTelefono: cliente?.telefono || '',
            });
        }
    }, [clienteId, cliente, form, open]);

    useEffect(() => {
        if (!open) {
            return;
        }
        const defaultDocTipo = (cliente?.tipoDoc || cliente?.tipo_doc || (isRuc ? 'RUC' : 'DNI')).toUpperCase();
        const defaultDocNumero = clienteEsGenerico ? '' : (cliente?.numeroDoc || cliente?.numero_doc || '');
        form.setFieldsValue({
            clienteDocTipo: defaultDocTipo,
            clienteDocNumero: defaultDocNumero,
            clienteNombre: cliente?.nombreDoc || cliente?.nombre_doc || '',
            clienteDireccion: cliente?.direccion || '',
        });
    }, [open, cliente, clienteEsGenerico, form]); // Removed isRuc dependency to avoid loop

    // Update correlative when series changes
    useEffect(() => {
        if (selectedSerie && correlativoFormatted) {
            form.setFieldsValue({ comprobanteCorrelativo: correlativoFormatted });
        }
    }, [selectedSerie, correlativoFormatted, form]);

    useEffect(() => {
        if (!open) {
            return;
        }
        if (previousMode.current === posMode) {
            return;
        }
        previousMode.current = posMode;
        const defaultMonto = posMode === POS_MODES.PEDIDO ? 0 : total;
        form.setFieldsValue({
            metodoPago: posMode === POS_MODES.PEDIDO ? 'yape' : CASH_METHOD,
            tipoEntrega: posMode === POS_MODES.PEDIDO ? TIPOS_ENTREGA.RECOJO_TIENDA : TIPOS_ENTREGA.CONSUMO_LOCAL,
            montoPagado: defaultMonto,
            fechaEntrega: posMode === POS_MODES.PEDIDO ? dayjs().add(1, 'day').hour(12).minute(0) : dayjs(),
        });
        setMetodoPago(posMode === POS_MODES.PEDIDO ? 'yape' : CASH_METHOD);
    }, [posMode, open, total, form]);

    useEffect(() => {
        if (!open || isPedido) {
            return;
        }
        if (form.getFieldValue('tipoEntrega') === TIPOS_ENTREGA.DELIVERY) {
            form.setFieldsValue({ tipoEntrega: TIPOS_ENTREGA.CONSUMO_LOCAL });
        }
    }, [isPedido, open, form]);

    useEffect(() => {
        if (!open || !clienteId || !showDeliveryFields) {
            return;
        }
        if (direccionesCliente.length === 1) {
            const currentSelection = form.getFieldValue('direccionClienteId');
            if (currentSelection) {
                return;
            }
            const unica = direccionesCliente[0];
            form.setFieldsValue({
                direccionClienteId: unica.id,
                shippingDireccion: unica.direccionCompleta || '',
                shippingReferencia: unica.referencia || '',
            });
            if (unica.distritoId) {
                handlePrefillUbigeoFromDistrito(unica.distritoId);
            } else {
                clearShippingUbigeoFields();
            }
        }
    }, [open, clienteId, direccionesCliente, form, showDeliveryFields]);

    useEffect(() => {
        if (!open) {
            return;
        }
        // If Factura is selected, ensure RUC is selected
        if (tipoComprobanteValue === 'factura' && formDocTipo !== 'RUC') {
            form.setFieldsValue({ clienteDocTipo: 'RUC' });
        }
        // If Boleta is selected, we don't necessarily force DNI anymore, as RUCs can also have Boletas in some cases,
        // but usually RUC -> Factura. Let's keep it flexible or default to DNI if switching from Factura?
        // User asked: "si es ruc si factura si no no".
        // Logic: If RUC is selected, Factura is allowed. If DNI, Factura is disabled.
    }, [open, tipoComprobanteValue, formDocTipo, form]);

    useEffect(() => {
        if (!open) {
            return;
        }
        if (!tipoComprobanteValue) {
            form.setFieldsValue({ serieId: null });
            return;
        }
        const disponibles = seriesPorTipo[tipoComprobanteValue] || [];
        if (!disponibles.length) {
            form.setFieldsValue({ serieId: null });
            form.setFields([{ name: 'serieId', errors: ['No hay series activas para este tipo de comprobante'] }]);
            return;
        }
        const current = form.getFieldValue('serieId');
        if (!disponibles.some((serie) => String(serie.id) === String(current))) {
            form.setFieldsValue({ serieId: disponibles[0].id });
        }
        form.setFields([{ name: 'serieId', errors: [] }]);
    }, [open, tipoComprobanteValue, seriesPorTipo, form]);

    const handleOk = () => {
        form.validateFields().then((values) => {
            if (!isPedido && values.metodoPago === CASH_METHOD && values.montoPagado < total) {
                form.setFields([
                    { name: 'montoPagado', errors: ['El monto pagado debe ser mayor o igual al total'] },
                ]);
                return;
            }
            if (isPedido) {
                const monto = Number(values.montoPagado || 0);
                if (tipoPagoPedidoValue === 'adelanto') {
                    if (monto > total) {
                        form.setFields([
                            { name: 'montoPagado', errors: ['El adelanto no puede superar el total del pedido'] },
                        ]);
                        return;
                    }
                } else {
                    if (monto < total) {
                        form.setFields([
                            { name: 'montoPagado', errors: ['El pago completo debe cubrir el total del pedido'] },
                        ]);
                        return;
                    }
                    if (values.metodoPago !== CASH_METHOD && monto > total) {
                        form.setFields([
                            { name: 'montoPagado', errors: ['Con este método no se permite cambio. Ingresa el monto exacto.'] },
                        ]);
                        return;
                    }
                }
            }

            if (requiereComprobante) {
                if (!selectedSerie || !correlativoPreview) {
                    form.setFields([
                        { name: 'serieId', errors: ['Selecciona una serie válida'] },
                    ]);
                    return;
                }
                if (facturacionConfigLoading) {
                    return;
                }
                if (!facturacionReady) {
                    Modal.error({
                        title: 'Configuración fiscal incompleta',
                        content: 'Debes registrar el RUC, razón social y dirección fiscal en Configuración > Facturación antes de emitir comprobantes.',
                    });
                    return;
                }
            }

            const normalizedDocTipo = (values.clienteDocTipo || (isRuc ? 'RUC' : 'DNI')).toUpperCase();
            let normalizedDocNumero = values.clienteDocNumero
                ? values.clienteDocNumero.replace(/\D/g, '').trim()
                : '';

            // If DNI and empty, send 00000000
            if (normalizedDocTipo === 'DNI' && !normalizedDocNumero) {
                normalizedDocNumero = '00000000';
            }
            const clienteNombre = values.clienteNombre?.trim() || cliente?.nombreDoc || 'Cliente POS';
            const clienteDireccion = values.clienteDireccion?.trim()
                || (showDeliveryFields ? values.shippingDireccion?.trim() : null)
                || cliente?.direccion
                || null;
            const resolvedShippingDepartamento = values.shippingDepartamentoId
                ? departamentos.find((item) => String(item.id) === String(values.shippingDepartamentoId))
                : null;
            const resolvedShippingProvincia = values.shippingProvinciaId
                ? shippingProvincias.find((item) => String(item.id) === String(values.shippingProvinciaId))
                : null;
            const resolvedShippingDistrito = values.shippingDistritoId
                ? shippingDistritos.find((item) => String(item.id) === String(values.shippingDistritoId))
                : null;
            const shippingDepartamentoNombre = shippingUbigeoLabels.departamentoNombre
                || resolvedShippingDepartamento?.nombre
                || null;
            const shippingProvinciaNombre = shippingUbigeoLabels.provinciaNombre
                || resolvedShippingProvincia?.nombre
                || null;
            const shippingDistritoNombre = shippingUbigeoLabels.distritoNombre
                || resolvedShippingDistrito?.nombre
                || null;
            const shippingCodigoUbigeo = shippingUbigeoLabels.codigo
                || resolvedShippingDistrito?.codigoUbigeo
                || null;

            const normalizedPayload = {
                ...values,
                posMode,
                clienteId: cliente?.id,
                direccionClienteId: values.direccionClienteId || null,
                montoPagado: Number(values.montoPagado || 0),
                costoDelivery: showDeliveryFields ? Number(values.costoDelivery || 0) : 0,
                shippingDireccion: showDeliveryFields ? values.shippingDireccion?.trim() || '' : null,
                shippingReferencia: showDeliveryFields ? values.shippingReferencia?.trim() || null : null,
                shippingDepartamento: showDeliveryFields ? shippingDepartamentoNombre : null,
                shippingProvincia: showDeliveryFields ? shippingProvinciaNombre : null,
                shippingDistrito: showDeliveryFields ? shippingDistritoNombre : null,
                shippingCodigoUbigeo: showDeliveryFields ? shippingCodigoUbigeo : null,
                shippingContactoNombre: showDeliveryFields ? values.shippingContactoNombre?.trim() || cliente?.nombreDoc || '' : null,
                shippingContactoTelefono: showDeliveryFields ? values.shippingContactoTelefono?.trim() || cliente?.telefono || '' : null,
                fechaEntrega: values.fechaEntrega ? dayjs(values.fechaEntrega).format('YYYY-MM-DDTHH:mm:ss') : null,
                comprobanteSerieId: requiereComprobante ? selectedSerie?.id : null,
                comprobanteSerieCodigo: requiereComprobante ? selectedSerie?.serie : null,
                comprobanteCorrelativo: requiereComprobante ? Number(values.comprobanteCorrelativo) : null,
                tipoComprobante: requiereComprobante ? values.tipoComprobante : null,
                clienteDocTipo: normalizedDocTipo,
                clienteDocNumero: normalizedDocNumero,
                clienteNombre,
                clienteDireccion,
            };

            onConfirm(normalizedPayload);
        });
    };


    const cambio = Math.max(0, montoPagadoValue - total);
    const saldoPendiente = Math.max(0, total - montoPagadoValue);
    const actionLabel = isPedido ? 'Registrar pedido' : 'Confirmar pago';

    const handleDireccionSelect = (value) => {
        if (!value) {
            form.setFieldsValue({
                direccionClienteId: null,
                shippingDireccion: '',
                shippingReferencia: '',
            });
            clearShippingUbigeoFields();
            return;
        }
        const selected = direccionesCliente.find((dir) => dir.id === value);
        form.setFieldsValue({
            direccionClienteId: value,
            shippingDireccion: selected?.direccionCompleta || '',
            shippingReferencia: selected?.referencia || '',
        });
        if (showDeliveryFields) {
            if (selected?.distritoId) {
                handlePrefillUbigeoFromDistrito(selected.distritoId);
            } else {
                clearShippingUbigeoFields();
            }
        }
    };

    const openAddressModal = () => {
        if (!clienteId) {
            return;
        }
        addressForm.resetFields();
        setIsAddressModalOpen(true);
    };

    const handleSaveAddress = async () => {
        if (!clienteId) {
            return;
        }
        try {
            const values = await addressForm.validateFields();
            setSavingAddress(true);
            const departamentoOption = departamentos.find((item) => String(item.id) === String(values.departamentoId));
            const provinciaOption = addressProvincias.find((item) => String(item.id) === String(values.provinciaId));
            const distritoOption = addressDistritos.find((item) => String(item.id) === String(values.distritoId));
            const direccionParts = [values.direccion?.trim()].filter(Boolean);
            const extraParts = [
                distritoOption?.nombre,
                provinciaOption?.nombre,
                departamentoOption?.nombre,
            ].filter(Boolean);
            if (extraParts.length) {
                direccionParts.push(extraParts.join(', '));
            }
            const direccionCompleta = direccionParts.join(' - ');
            const payload = {
                etiqueta: values.etiqueta?.trim() || undefined,
                direccionCompleta,
                referencia: values.referencia?.trim() || null,
                esEntrega: true,
                distritoId: values.distritoId || null,
            };
            const nuevaDireccion = await createDireccionCliente(tiendaId, clienteId, payload);
            await refetchDirecciones();
            form.setFieldsValue({
                direccionClienteId: nuevaDireccion.id,
                shippingDireccion: direccionCompleta,
                shippingReferencia: values.referencia?.trim() || '',
                shippingDepartamentoId: values.departamentoId || null,
                shippingProvinciaId: values.provinciaId || null,
                shippingDistritoId: values.distritoId || null,
            });
            setShippingUbigeoLabels({
                departamentoNombre: departamentoOption?.nombre || null,
                provinciaNombre: provinciaOption?.nombre || null,
                distritoNombre: distritoOption?.nombre || null,
                codigo: distritoOption?.codigoUbigeo || null,
            });
            setIsAddressModalOpen(false);
            addressForm.resetFields();
        } catch (error) {
            console.error('No se pudo guardar la dirección del cliente', error);
        } finally {
            setSavingAddress(false);
        }
    };

    function clearShippingUbigeoFields() {
        form.setFieldsValue({
            shippingDepartamentoId: null,
            shippingProvinciaId: null,
            shippingDistritoId: null,
        });
        setShippingUbigeoLabels(EMPTY_UBIGEO_LABELS);
    }

    async function handlePrefillUbigeoFromDistrito(distritoId) {
        if (!distritoId) {
            clearShippingUbigeoFields();
            return;
        }
        try {
            setIsUbigeoPrefilling(true);
            const ruta = await getUbigeoRutaPorDistrito(distritoId);
            if (!ruta) {
                clearShippingUbigeoFields();
                return;
            }
            form.setFieldsValue({
                shippingDepartamentoId: ruta.departamento?.id || null,
                shippingProvinciaId: ruta.provincia?.id || null,
                shippingDistritoId: ruta.distrito?.id || null,
            });
            setShippingUbigeoLabels({
                departamentoNombre: ruta.departamento?.nombre || null,
                provinciaNombre: ruta.provincia?.nombre || null,
                distritoNombre: ruta.distrito?.nombre || null,
                codigo: ruta.distrito?.codigoUbigeo || null,
            });
            return;
        } catch (error) {
            console.error('No se pudo prellenar el ubigeo del cliente', error);
        } finally {
            setIsUbigeoPrefilling(false);
        }
    }

    function handleShippingDepartamentoChange(value) {
        const selected = departamentos.find((item) => String(item.id) === String(value));
        setShippingUbigeoLabels({
            departamentoNombre: selected?.nombre || null,
            provinciaNombre: null,
            distritoNombre: null,
            codigo: null,
        });
        form.setFieldsValue({
            shippingDepartamentoId: value || null,
            shippingProvinciaId: null,
            shippingDistritoId: null,
        });
    }

    function handleShippingProvinciaChange(value) {
        const selected = shippingProvincias.find((item) => String(item.id) === String(value));
        setShippingUbigeoLabels((prev) => ({
            ...prev,
            provinciaNombre: selected?.nombre || null,
            distritoNombre: null,
            codigo: null,
        }));
        form.setFieldsValue({
            shippingProvinciaId: value || null,
            shippingDistritoId: null,
        });
    }

    function handleShippingDistritoChange(value) {
        const selected = shippingDistritos.find((item) => String(item.id) === String(value));
        setShippingUbigeoLabels((prev) => ({
            ...prev,
            distritoNombre: selected?.nombre || null,
            codigo: selected?.codigoUbigeo || null,
        }));
        form.setFieldsValue({
            shippingDistritoId: value || null,
        });
    }

    function handleAddressDepartamentoChange(value) {
        addressForm.setFieldsValue({
            departamentoId: value || null,
            provinciaId: null,
            distritoId: null,
        });
    }

    function handleAddressProvinciaChange(value) {
        addressForm.setFieldsValue({
            provinciaId: value || null,
            distritoId: null,
        });
    }

    useEffect(() => {
        if (!open) {
            return;
        }
        if (!showDeliveryFields) {
            clearShippingUbigeoFields();
        }
    }, [showDeliveryFields, open]);

    const entregaOptions = [
        { value: TIPOS_ENTREGA.CONSUMO_LOCAL, label: 'Consumo en local' },
        { value: TIPOS_ENTREGA.RECOJO_TIENDA, label: 'Recojo en tienda' },
    ];

    return (
        <Drawer
            title={isPedido ? 'Registrar pedido' : 'Confirmar venta'}
            placement="right"
            size="large"
            open={open}
            onClose={onCancel}
            destroyOnClose
            maskClosable={!loading}
            styles={{
                body: { paddingBottom: 88 },
                header: { borderBottom: '1px solid #f0f0f0' }
            }}
            footer={
                <Space style={{ justifyContent: 'flex-end', width: '100%' }}>
                    <Button onClick={onCancel} disabled={loading}>Cancelar</Button>
                    <Button
                        type="primary"
                        loading={loading}
                        onClick={handleOk}
                        disabled={loading || (requiereComprobante ? !canEmitirComprobante : false)}
                    >
                        {actionLabel}
                    </Button>
                </Space>
            }
        >
            <div style={{
                border: '1px solid #e6f4ff',
                borderRadius: 12,
                padding: 16,
                marginBottom: 24,
                background: '#f0faff',
                textAlign: 'center'
            }}>
                <Text type="secondary">Total del {isPedido ? 'pedido' : 'pago'}</Text>
                <Title level={2} style={{ margin: 0, color: '#1677ff' }}>S/ {total.toFixed(2)}</Title>
            </div>

            <Form form={form} layout="vertical" onSubmitCapture={(e) => e.preventDefault()}>
                <Form.Item label="Cliente">
                    <Select
                        showSearch
                        style={{ width: '100%' }}
                        placeholder="Seleccionar Cliente"
                        optionFilterProp="children"
                        value={cliente?.id}
                        onChange={(val) => setCliente(clientes.find((c) => c.id === val))}
                        allowClear
                        filterOption={(input, option) => (option?.children ?? '').toLowerCase().includes(input.toLowerCase())}
                    >
                        {clientes.map((c) => (
                            <Option key={c.id} value={c.id}>
                                {c.nombreDoc} ({c.tipoDoc || 'DOC'})
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                {facturacionBlockingMessage && (
                    <Alert
                        type="warning"
                        showIcon
                        message={facturacionBlockingMessage}
                        style={{ marginBottom: 16 }}
                    />
                )}

                <Form.Item
                    name="tipoEntrega"
                    label="Modalidad de entrega"
                    rules={[{ required: true, message: 'Seleccione una modalidad de entrega' }]}
                >
                    <Select>
                        {entregaOptions.map((option) => (
                            <Option key={option.value} value={option.value}>{option.label}</Option>
                        ))}
                    </Select>
                </Form.Item>

                {isPedido && (
                    <Form.Item
                        name="fechaEntrega"
                        label="Fecha de entrega pactada"
                        rules={[{ required: true, message: 'Seleccione una fecha estimada' }]}
                    >
                        <DatePicker
                            showTime
                            style={{ width: '100%' }}
                            format="DD/MM/YYYY HH:mm"
                            getPopupContainer={(trigger) => trigger.parentElement}
                        />
                    </Form.Item>
                )}

                {requiereComprobante && (
                    <>
                        <Form.Item
                            name="tipoComprobante"
                            label="Tipo de Comprobante"
                            rules={[{ required: true, message: 'Seleccione tipo de comprobante' }]}
                        >
                            <Radio.Group buttonStyle="solid" style={{ width: '100%' }}>
                                <Radio.Button value="boleta" style={{ width: '50%', textAlign: 'center' }}>BOLETA</Radio.Button>
                                <Radio.Button value="factura" style={{ width: '50%', textAlign: 'center' }} disabled={!isRuc}>
                                    FACTURA
                                </Radio.Button>
                            </Radio.Group>
                        </Form.Item>

                        {seriesWarningMessage && (
                            <Alert
                                type="warning"
                                showIcon
                                style={{ marginBottom: 12 }}
                                message={seriesWarningMessage}
                            />
                        )}

                        <Form.Item
                            name="serieId"
                            label="Serie de comprobante"
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
                    </>
                )}

                <div style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: 16, marginBottom: 24 }}>
                    <Text strong>Datos del cliente para el comprobante</Text>
                    <Row gutter={12} style={{ marginTop: 12 }}>
                        <Col span={8}>
                            <Form.Item
                                name="clienteDocTipo"
                                label="Tipo"
                                rules={[{ required: true, message: 'Selecciona el tipo de documento' }]}
                            >
                                <Select disabled={!puedeEditarCliente}>
                                    {docTipoOptions.map((tipo) => (
                                        <Option key={tipo} value={tipo}>{tipo}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={16}>
                            <Form.Item
                                name="clienteDocNumero"
                                label="Número"
                                rules={[
                                    { required: !isGenericAndSmallAmount, message: 'Ingresa el documento del cliente' },
                                    () => ({
                                        validator(_, value) {
                                            // If empty, we will default to 00000000 for DNI later, so it is valid if it's DNI.
                                            // If it's RUC, it might be required depending on logic, but user said "si no se llena se mande 8 ceros" for DNI.
                                            const tipo = (form.getFieldValue('clienteDocTipo') || 'DNI').toUpperCase();
                                            const sanitized = (value || '').replace(/\D/g, '');

                                            if (!sanitized) {
                                                // If empty:
                                                // For DNI: Valid (will be 00000000)
                                                // For RUC: Required if Factura (handled by other rules? or just let it be empty?)
                                                // User only mentioned DNI behavior for empty.
                                                // Let's assume RUC needs to be typed if selected.
                                                if (tipo === 'DNI') return Promise.resolve();
                                                return isGenericAndSmallAmount ? Promise.resolve() : Promise.reject(new Error('Ingresa el documento del cliente'));
                                            }

                                            if (tipo === 'RUC') {
                                                // User asked for max 20 chars input, but RUC is 11. 
                                                // "en ruc no deje escribir mas de 20" -> maxLength=20.
                                                // Validation? Usually 11. I will keep 11 validation but allow 20 input length as requested?
                                                // Or maybe they want to allow foreign RUCs? 
                                                // "en ruc no deje escribir mas de 20".
                                                // I will relax the exact 11 check if they want up to 20, or just check it's not too long.
                                                // Let's keep 11 digits validation for standard RUC but allow input up to 20.
                                                return /^\d{11}$/.test(sanitized)
                                                    ? Promise.resolve()
                                                    : Promise.reject(new Error('El RUC debe tener 11 dígitos'));
                                            }
                                            // DNI validation: 8 digits
                                            return /^\d{8}$/.test(sanitized)
                                                ? Promise.resolve()
                                                : Promise.reject(new Error('El DNI debe tener 8 dígitos'));
                                        },
                                    }),
                                ]}
                            >
                                <Input
                                    maxLength={form.getFieldValue('clienteDocTipo') === 'RUC' ? 20 : 8}
                                    disabled={!puedeEditarCliente}
                                    placeholder={form.getFieldValue('clienteDocTipo') === 'RUC' ? "RUC del cliente" : "00000000"}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item
                        name="clienteNombre"
                        label="Nombre o razón social"
                        rules={[{ required: !isGenericAndSmallAmount, message: 'Ingresa el nombre del cliente' }]}
                    >
                        <Input disabled={!puedeEditarCliente} placeholder="Nombre del cliente" />
                    </Form.Item>
                    <Form.Item
                        name="clienteDireccion"
                        label="Dirección"
                    >
                        <Input
                            disabled={!puedeEditarCliente && !showDeliveryFields}
                            placeholder={showDeliveryFields ? 'Se usará la dirección de envío si la dejas vacía' : 'Opcional'}
                        />
                    </Form.Item>
                </div>

                <Form.Item
                    name="metodoPago"
                    label="Método de Pago"
                    dependencies={['montoPagado', 'tipoPagoPedido']}
                    rules={[({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!isPedido) {
                                return value ? Promise.resolve() : Promise.reject(new Error('Seleccione método de pago'));
                            }
                            const tipoPago = (getFieldValue('tipoPagoPedido') || 'adelanto').toString().toLowerCase();
                            const monto = Number(getFieldValue('montoPagado') || 0);
                            if (tipoPago === 'completo' && !value) {
                                return Promise.reject(new Error('Seleccione método de pago'));
                            }
                            if (tipoPago === 'adelanto' && monto > 0 && !value) {
                                return Promise.reject(new Error('Seleccione método de pago para registrar el adelanto'));
                            }
                            return Promise.resolve();
                        }
                    })]}
                >
                    <Radio.Group
                        buttonStyle="solid"
                        style={{ width: '100%' }}
                        onChange={(e) => setMetodoPago(e.target.value)}
                    >
                        <Row gutter={[8, 8]}>
                            <Col span={12}><Radio.Button value="efectivo" style={{ width: '100%', textAlign: 'center' }}>Efectivo</Radio.Button></Col>
                            <Col span={12}><Radio.Button value="yape" style={{ width: '100%', textAlign: 'center' }}>Yape / Plin</Radio.Button></Col>
                            <Col span={12}><Radio.Button value="tarjeta_credito" style={{ width: '100%', textAlign: 'center' }}>Tarjeta</Radio.Button></Col>
                            <Col span={12}><Radio.Button value="transferencia" style={{ width: '100%', textAlign: 'center' }}>Transferencia</Radio.Button></Col>
                        </Row>
                    </Radio.Group>
                </Form.Item>

                {isPedido && (
                    <Form.Item
                        name="tipoPagoPedido"
                        label="Tipo de pago"
                        rules={[{ required: true, message: 'Seleccione el tipo de pago' }]}
                    >
                        <Radio.Group buttonStyle="solid" style={{ width: '100%' }}>
                            <Radio.Button value="completo" style={{ width: '50%', textAlign: 'center' }}>
                                Pago completo
                            </Radio.Button>
                            <Radio.Button value="adelanto" style={{ width: '50%', textAlign: 'center' }}>
                                Adelanto
                            </Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                )}

                {showDeliveryFields && (
                    <div style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: 16, marginBottom: 24 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                            <Text strong>Dirección para delivery</Text>
                            <Button type="link" icon={<PlusOutlined />} onClick={openAddressModal} disabled={!clienteId}>
                                Nueva dirección
                            </Button>
                        </div>
                        {!clienteId && (
                            <Alert
                                type="info"
                                showIcon
                                style={{ marginBottom: 12 }}
                                message="Selecciona un cliente para registrar o reutilizar direcciones"
                            />
                        )}
                        <Form.Item name="direccionClienteId" label="Dirección del cliente">
                            <Select
                                placeholder={clienteId ? 'Selecciona una dirección guardada (opcional)' : 'Sin cliente seleccionado'}
                                allowClear
                                disabled={!clienteId || direccionesCliente.length === 0}
                                onChange={handleDireccionSelect}
                            >
                                {direccionesCliente.map((dir) => (
                                    <Option key={dir.id} value={dir.id}>
                                        {dir.etiqueta ? `${dir.etiqueta} · ` : ''}{dir.direccionCompleta}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="shippingDireccion"
                            label="Dirección"
                            rules={[{ required: true, message: 'Ingresa la dirección de entrega' }]}
                        >
                            <Input placeholder="Calle, número, urbanización, distrito, provincia, departamento" />
                        </Form.Item>
                        <Form.Item name="shippingReferencia" label="Referencia">
                            <Input placeholder="Punto de referencia" />
                        </Form.Item>
                        <Row gutter={12}>
                            <Col span={8}>
                                <Form.Item
                                    name="shippingDepartamentoId"
                                    label="Departamento"
                                    rules={[{ required: true, message: 'Selecciona el departamento' }]}
                                >
                                    <Select
                                        showSearch
                                        placeholder="Departamento"
                                        loading={departamentosLoading || isUbigeoPrefilling}
                                        onChange={handleShippingDepartamentoChange}
                                        allowClear
                                        filterOption={(input, option) => (option?.children ?? '').toLowerCase().includes(input.toLowerCase())}
                                    >
                                        {departamentos.map((dep) => (
                                            <Option key={dep.id} value={dep.id}>{dep.nombre}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="shippingProvinciaId"
                                    label="Provincia"
                                    rules={[{ required: true, message: 'Selecciona la provincia' }]}
                                >
                                    <Select
                                        showSearch
                                        placeholder="Provincia"
                                        disabled={!shippingDepartamentoId}
                                        loading={shippingProvinciasFetching || isUbigeoPrefilling}
                                        onChange={handleShippingProvinciaChange}
                                        allowClear
                                        filterOption={(input, option) => (option?.children ?? '').toLowerCase().includes(input.toLowerCase())}
                                    >
                                        {shippingProvincias.map((prov) => (
                                            <Option key={prov.id} value={prov.id}>{prov.nombre}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="shippingDistritoId"
                                    label="Distrito"
                                    rules={[{ required: true, message: 'Selecciona el distrito' }]}
                                >
                                    <Select
                                        showSearch
                                        placeholder="Distrito"
                                        disabled={!shippingProvinciaId}
                                        loading={shippingDistritosFetching || isUbigeoPrefilling}
                                        onChange={handleShippingDistritoChange}
                                        allowClear
                                        filterOption={(input, option) => (option?.children ?? '').toLowerCase().includes(input.toLowerCase())}
                                    >
                                        {shippingDistritos.map((dist) => (
                                            <Option key={dist.id} value={dist.id}>{dist.nombre}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={12}>
                            <Col span={12}>
                                <Form.Item
                                    name="shippingContactoNombre"
                                    label="Contacto"
                                    rules={[{ required: true, message: 'Ingresa el nombre de contacto' }]}
                                >
                                    <Input placeholder="Nombre de la persona que recibe" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="shippingContactoTelefono"
                                    label="Teléfono"
                                    rules={[{ required: true, message: 'Ingresa un teléfono de contacto' }]}
                                >
                                    <Input placeholder="Ej: 999888777" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item
                            name="costoDelivery"
                            label="Costo de delivery"
                            rules={[{ type: 'number', min: 0, message: 'Ingrese un monto válido' }]}
                        >
                            <MoneyInput
                                style={{ width: '100%' }}
                                placeholder="0.00"
                            />
                        </Form.Item>
                    </div>
                )}

                {!isPedido && metodoPago === CASH_METHOD && (
                    <div style={{ background: '#ffffff', padding: 16, borderRadius: 8, border: '1px solid #d9d9d9', marginBottom: 24 }}>
                        <Row gutter={16} align="middle">
                            <Col span={12}>
                                <Form.Item
                                    name="montoPagado"
                                    label="Monto Recibido"
                                    rules={[{ required: true, message: 'Ingrese monto' }]}
                                    style={{ marginBottom: 0 }}
                                >
                                    <MoneyInput
                                        style={{ width: '100%' }}
                                        size="large"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12} style={{ textAlign: 'right' }}>
                                <Text type="secondary">Vuelto / Cambio</Text>
                                <Title level={3} style={{ margin: 0, color: cambio > 0 ? '#faad14' : '#595959' }}>
                                    S/ {cambio.toFixed(2)}
                                </Title>
                            </Col>
                        </Row>
                    </div>
                )}


                {isPedido && tipoPagoPedidoValue === 'adelanto' && (
                    <div style={{ background: '#fff', padding: 16, borderRadius: 8, border: '1px dashed #d9d9d9', marginBottom: 24 }}>
                        <Row gutter={16} align="middle">
                            <Col span={12}>
                                <Form.Item
                                    name="montoPagado"
                                    label="Adelanto recibido"
                                    style={{ marginBottom: 0 }}
                                    rules={[{ type: 'number', min: 0, message: 'El adelanto no puede ser negativo' }]}
                                >
                                    <MoneyInput
                                        style={{ width: '100%' }}
                                        placeholder="0.00"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12} style={{ textAlign: 'right' }}>
                                <Text type="secondary">Saldo pendiente</Text>
                                <Title level={3} style={{ margin: 0, color: saldoPendiente > 0 ? '#faad14' : '#52c41a' }}>
                                    S/ {saldoPendiente.toFixed(2)}
                                </Title>
                            </Col>
                        </Row>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            Si no se recibió adelanto, deje el valor en 0.
                        </Text>
                    </div>
                )}

                {isPedido && tipoPagoPedidoValue === 'completo' && (
                    <div style={{ background: '#ffffff', padding: 16, borderRadius: 8, border: '1px solid #d9d9d9', marginBottom: 24 }}>
                        <Row gutter={16} align="middle">
                            <Col span={12}>
                                <Form.Item
                                    name="montoPagado"
                                    label="Monto recibido"
                                    rules={[{ required: true, message: 'Ingrese monto' }]}
                                    style={{ marginBottom: 0 }}
                                >
                                    <MoneyInput style={{ width: '100%' }} size="large" />
                                </Form.Item>
                            </Col>
                            <Col span={12} style={{ textAlign: 'right' }}>
                                <Text type="secondary">Vuelto / Cambio</Text>
                                <Title level={3} style={{ margin: 0, color: cambio > 0 ? '#faad14' : '#595959' }}>
                                    S/ {(metodoPago === CASH_METHOD ? cambio : 0).toFixed(2)}
                                </Title>
                            </Col>
                        </Row>
                    </div>
                )}

                <Form.Item name="notasPedido" label="Notas (Opcional)">
                    <Input.TextArea rows={2} placeholder="Observaciones de la venta..." />
                </Form.Item>
            </Form>

            <Modal
                title="Nueva dirección del cliente"
                open={isAddressModalOpen}
                onCancel={() => setIsAddressModalOpen(false)}
                onOk={handleSaveAddress}
                okText="Guardar"
                cancelText="Cancelar"
                confirmLoading={savingAddress}
            >
                {!clienteId ? (
                    <Alert type="warning" showIcon message="Selecciona primero un cliente" />
                ) : (
                    <Form form={addressForm} layout="vertical" onFinish={handleSaveAddress}>
                        <Form.Item name="etiqueta" label="Etiqueta">
                            <Input placeholder="Ej: Casa, Oficina" />
                        </Form.Item>
                        <Form.Item
                            name="direccion"
                            label="Dirección"
                            rules={[{ required: true, message: 'Ingresa la dirección principal' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item name="referencia" label="Referencia">
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="departamentoId"
                            label="Departamento"
                            rules={[{ required: true, message: 'Selecciona el departamento' }]}
                        >
                            <Select
                                placeholder="Departamento"
                                showSearch
                                loading={departamentosLoading}
                                onChange={handleAddressDepartamentoChange}
                                filterOption={(input, option) => (option?.children ?? '').toLowerCase().includes(input.toLowerCase())}
                            >
                                {departamentos.map((dep) => (
                                    <Option key={dep.id} value={dep.id}>{dep.nombre}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="provinciaId"
                            label="Provincia"
                            rules={[{ required: true, message: 'Selecciona la provincia' }]}
                        >
                            <Select
                                placeholder="Provincia"
                                showSearch
                                disabled={!newAddressDepartamentoId}
                                loading={addressProvinciasFetching}
                                onChange={handleAddressProvinciaChange}
                                filterOption={(input, option) => (option?.children ?? '').toLowerCase().includes(input.toLowerCase())}
                            >
                                {addressProvincias.map((prov) => (
                                    <Option key={prov.id} value={prov.id}>{prov.nombre}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="distritoId"
                            label="Distrito"
                            rules={[{ required: true, message: 'Selecciona el distrito' }]}
                        >
                            <Select
                                placeholder="Distrito"
                                showSearch
                                disabled={!newAddressProvinciaId}
                                loading={addressDistritosFetching}
                                filterOption={(input, option) => (option?.children ?? '').toLowerCase().includes(input.toLowerCase())}
                            >
                                {addressDistritos.map((dist) => (
                                    <Option key={dist.id} value={dist.id}>{dist.nombre}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Form>
                )}
            </Modal>
        </Drawer >
    );
};

export default CheckoutModal;
