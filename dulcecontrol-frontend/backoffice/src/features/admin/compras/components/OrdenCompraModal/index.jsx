import { useEffect, useState } from 'react';
import { Form, App } from 'antd';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import OrdenCompraModalView from './OrdenCompraModalView.jsx';
import { createOrden, updateOrden } from '../../api/ordenes-compra.api.js';
import { getProveedores } from '../../api/proveedores.api.js';
import { getInsumos } from '../../api/insumos.api.js';
import { getSedes } from '../../api/sedes.api.js';
import { ORDENES_COMPRA_KEYS, PROVEEDORES_KEYS, INSUMOS_KEYS, SEDES_KEYS } from '../../constants/queryKeys.js';
import { decimalToCentimos } from '../../utils/formatters.js';

const OrdenCompraModal = ({ open, onClose, tiendaId, sedeId, orden }) => {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const isEditing = Boolean(orden);
  const [detalles, setDetalles] = useState([]);

  // Fetch proveedores activos
  const { data: proveedores = [] } = useQuery({
    queryKey: PROVEEDORES_KEYS.lists(tiendaId, { soloActivos: true }),
    queryFn: () => getProveedores(tiendaId, true),
    enabled: open && Boolean(tiendaId),
  });

  // Fetch insumos activos
  const { data: insumos = [] } = useQuery({
    queryKey: INSUMOS_KEYS.lists(tiendaId, { soloActivos: true }),
    queryFn: () => getInsumos(tiendaId, true, false),
    enabled: open && Boolean(tiendaId),
  });

  // Fetch sedes
  const { data: sedes = [] } = useQuery({
    queryKey: SEDES_KEYS.lists(tiendaId),
    queryFn: () => getSedes(tiendaId),
    enabled: open && Boolean(tiendaId),
  });

  useEffect(() => {
    if (open && orden) {
      form.setFieldsValue({
        proveedorId: orden.proveedorId,
        sedeDestinoId: orden.sedeDestinoId,
        fechaEmision: orden.fechaEmision,
        fechaRecepcionEsperada: orden.fechaRecepcionEsperada,
        estado: orden.estado,
        metodoPago: orden.metodoPago,
        referenciaPago: orden.referenciaPago,
        tipoComprobanteProveedor: orden.tipoComprobanteProveedor,
        serieComprobanteProveedor: orden.serieComprobanteProveedor,
        numeroComprobanteProveedor: orden.numeroComprobanteProveedor,
        observaciones: orden.observaciones,
      });
      
      // Mapear los detalles de la orden para edición
      const detallesMapeados = (orden.detalles || []).map((d, index) => ({
        key: Date.now() + index,
        insumoId: d.insumoId,
        nombreInsumo: d.nombreInsumo || '',
        cantidadSolicitada: d.cantidadSolicitada,
        unidadCompra: d.unidadCompra,
        costoUnitarioPactado: d.costoUnitarioPactadoCentimos / 100, // Convertir de centimos a decimal
        totalLinea: d.totalLineaCentimos / 100, // Convertir de centimos a decimal
      }));
      setDetalles(detallesMapeados);
    } else if (open) {
      form.resetFields();
      const today = dayjs().format('YYYY-MM-DD');
      form.setFieldsValue({
        fechaEmision: today, // Fecha actual automática
        estado: 'borrador', // Backend usa minúsculas
        moneda: 'PEN',
        sedeDestinoId: sedeId ?? undefined,
      });
      setDetalles([]);
    }
  }, [open, orden, form, sedeId]);

  // Función para convertir archivo a base64
  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const mutation = useMutation({
    mutationFn: async (values) => {
      console.log('📤 Enviando orden al backend...', { tiendaId, sedeId, isEditing });
      
      const payload = {
        ...values,
        detalles: detalles.map((d) => ({
          insumoId: d.insumoId,
          cantidadSolicitada: d.cantidadSolicitada,
          unidadCompra: d.unidadCompra,
          costoUnitarioPactadoCentimos: decimalToCentimos(d.costoUnitarioPactado),
          totalLineaCentimos: decimalToCentimos(d.totalLinea),
        })),
      };

      // Convertir montoInicialCentimos si existe
      if (payload.montoInicialCentimos !== undefined && payload.montoInicialCentimos !== null) {
        payload.montoInicialCentimos = decimalToCentimos(payload.montoInicialCentimos);
      }

      // Convertir imagen a base64
      if (payload.urlFotoComprobante && Array.isArray(payload.urlFotoComprobante) && payload.urlFotoComprobante.length > 0) {
        const file = payload.urlFotoComprobante[0];
        if (file.originFileObj) {
          payload.urlFotoComprobante = await getBase64(file.originFileObj);
        } else {
          payload.urlFotoComprobante = null;
        }
      } else {
        payload.urlFotoComprobante = null;
      }

      if (!payload.sedeDestinoId && sedeId) {
        payload.sedeDestinoId = sedeId;
      }

      console.log('📦 Payload final:', payload);

      const result = isEditing 
        ? await updateOrden(tiendaId, orden.id, payload)
        : await createOrden(tiendaId, payload);
      
      console.log('📥 Respuesta del backend:', result);
      return result;
    },
    onSuccess: async (data) => {
      console.log('✅ Orden guardada exitosamente:', data);
      console.log('   - Sede de la orden:', data.sedeDestinoId);
      console.log('   - Sede actual en tabla:', sedeId);
      
      message.success(
        isEditing ? 'Orden actualizada correctamente' : 'Orden creada correctamente'
      );
      
      // Invalidar queries de la sede de destino de la orden
      const sedeDestino = data.sedeDestinoId;
      const baseKeySede = ORDENES_COMPRA_KEYS.all(tiendaId, sedeDestino);
      console.log('🔄 Invalidando queries de sede destino:', baseKeySede);
      
      await queryClient.invalidateQueries({ 
        queryKey: baseKeySede,
        exact: false
      });
      
      console.log('🔄 Refetching queries activas...');
      await queryClient.refetchQueries({ 
        queryKey: baseKeySede,
        exact: false,
        type: 'active'
      });
      
      console.log('✅ Refetch completado');
      handleClose();
    },
    onError: (error) => {
      message.error(error?.response?.data?.message ?? 'Ocurrió un error al guardar la orden');
    },
  });

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        if (detalles.length === 0) {
          message.error('Debes agregar al menos un detalle a la orden');
          return;
        }
        mutation.mutate(values);
      })
      .catch((info) => {
        console.log('Validación fallida:', info);
      });
  };

  const handleClose = () => {
    form.resetFields();
    setDetalles([]);
    onClose();
  };

  return (
    <OrdenCompraModalView
      open={open}
      onClose={handleClose}
      onSubmit={handleSubmit}
      form={form}
      loading={mutation.isPending}
      isEditing={isEditing}
      proveedores={proveedores}
      insumos={insumos}
      sedes={sedes}
      detalles={detalles}
      setDetalles={setDetalles}
    />
  );
};

export default OrdenCompraModal;
