import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { App } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import PlanificacionView from './PlanificacionView.jsx';
import {
  createConteoDiario,
  getConteoDiario,
  generatePlanProduccion,
  getPlanChecklist,
  updatePlanDetalle,
  getStockIdeal,
} from '../../api/productionApi.js';
import { getProductos } from '../../../catalogo/api/productos.api.js';
import { PRODUCTION_KEYS } from '../../constants/queryKeys.js';

const PlanificacionManager = ({ tiendaId, sedeId, sedeNombre }) => {
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const productosQuery = useQuery({
    queryKey: PRODUCTION_KEYS.productos(tiendaId),
    queryFn: () =>
      getProductos(tiendaId, { soloActivos: true }).catch((error) => {
        message.error(error?.response?.data?.message ?? 'No se pudo listar los productos');
        throw error;
      }),
    enabled: Boolean(tiendaId),
    staleTime: 5 * 60 * 1000,
  });

  const productoLookup = useMemo(
    () =>
      (productosQuery.data ?? []).reduce((acc, producto) => {
        acc[producto.id] = producto;
        return acc;
      }, {}),
    [productosQuery.data]
  );

  const stockIdealQuery = useQuery({
    queryKey: PRODUCTION_KEYS.stockIdeal(tiendaId, sedeId),
    queryFn: () =>
      getStockIdeal(tiendaId, { sedeId }).catch((error) => {
        message.error(error?.response?.data?.message ?? 'No se pudo obtener el stock ideal base');
        throw error;
      }),
    enabled: Boolean(tiendaId && sedeId),
    staleTime: 2 * 60 * 1000,
  });

  const formattedDate = selectedDate.format('YYYY-MM-DD');

  const conteoQuery = useQuery({
    queryKey: PRODUCTION_KEYS.conteo(tiendaId, sedeId, formattedDate),
    queryFn: () =>
      getConteoDiario(tiendaId, { fecha: formattedDate, sedeId }).catch(() => {
        // No mostrar error si no existe conteo (es normal al inicio del día)
        return null;
      }),
    enabled: Boolean(tiendaId && sedeId),
    staleTime: 2 * 60 * 1000,
  });

  const planChecklistQuery = useQuery({
    queryKey: PRODUCTION_KEYS.planChecklist(tiendaId, sedeId, formattedDate),
    queryFn: () =>
      getPlanChecklist(tiendaId, { fecha: formattedDate, sedeId }).catch((error) => {
        message.error(error?.response?.data?.message ?? 'No se pudo obtener la planificación');
        throw error;
      }),
    enabled: Boolean(tiendaId && sedeId),
    keepPreviousData: true,
    retry: false,
  });

  const normalizedPlan = useMemo(() => {
    const raw = planChecklistQuery.data;
    if (!raw) {
      return { plan: null, detalles: [] };
    }

    if (Array.isArray(raw)) {
      return { plan: null, detalles: raw };
    }

    if (raw.detalles && Array.isArray(raw.detalles)) {
      return { plan: raw.plan ?? raw, detalles: raw.detalles };
    }

    return { plan: raw, detalles: [] };
  }, [planChecklistQuery.data]);

  const conteoMutation = useMutation({
    mutationFn: (payload) => createConteoDiario(tiendaId, payload),
    onSuccess: () => {
      message.success('Conteo registrado correctamente');
      queryClient.invalidateQueries(PRODUCTION_KEYS.conteo(tiendaId, sedeId, formattedDate));
    },
    onError: (error) => {
      console.error('Error al crear conteo:', error?.response?.data);
      
      // Extraer mensajes de validación si existen
      const data = error?.response?.data;
      let errorMsg = 'No se pudo registrar el conteo';
      
      if (data?.message) {
        errorMsg = data.message;
      } else if (data?.errors && Array.isArray(data.errors)) {
        errorMsg = data.errors.join(', ');
      } else if (data?.error) {
        errorMsg = data.error;
      } else if (error?.response?.status === 400) {
        errorMsg = 'Error de validación: revisa que todos los campos estén correctos';
      }
      
      message.error(errorMsg);
    },
  });

  const planMutation = useMutation({
    mutationFn: (payload) => generatePlanProduccion(tiendaId, payload),
    onSuccess: () => {
      message.success('Plan generado correctamente');
      queryClient.invalidateQueries(PRODUCTION_KEYS.planChecklist(tiendaId, sedeId, formattedDate));
    },
    onError: (error) => {
      message.error(error?.response?.data?.message ?? 'No se pudo generar el plan');
    },
  });

  const detalleMutation = useMutation({
    mutationFn: ({ detalleId, payload }) => updatePlanDetalle(tiendaId, detalleId, payload),
    onSuccess: () => {
      message.success('Detalle actualizado');
      queryClient.invalidateQueries(PRODUCTION_KEYS.planChecklist(tiendaId, sedeId, formattedDate));
    },
    onError: (error) => {
      message.error(error?.response?.data?.message ?? 'No se pudo actualizar el detalle');
    },
  });

  const defaultConteoRows = useMemo(
    () =>
      (stockIdealQuery.data ?? []).map((row) => ({
        productoId: row.productoId,
        productoNombre: productoLookup[row.productoId]?.nombre,
        cantidadSistema: row.cantidadIdeal ?? 0,
      })),
    [stockIdealQuery.data, productoLookup]
  );

  const handleSubmitConteo = (values) => {
    if (!sedeId) return;
    
    console.log('Form values recibidos:', values);
    
    // Validar que haya detalles
    if (!values.detalles || values.detalles.length === 0) {
      message.error('Debes agregar al menos un producto al conteo');
      return;
    }
    
    // Filtrar detalles válidos (con productoId)
    const detallesValidos = values.detalles.filter(detalle => 
      detalle && detalle.productoId && detalle.cantidadFisica != null
    );
    
    if (detallesValidos.length === 0) {
      message.error('Todos los productos deben tener un productoId y cantidad física válidos');
      return;
    }
    
    const payload = {
      sedeId,
      fechaConteo: values.fechaConteo
        ? values.fechaConteo.format('YYYY-MM-DD')
        : formattedDate,
      responsableId: values.responsableId || null,
      observaciones: values.observaciones || null,
      detalles: detallesValidos.map((detalle) => ({
        productoId: detalle.productoId,
        cantidadFisica: Number(detalle.cantidadFisica),
        cantidadSistema: detalle.cantidadSistema != null ? Number(detalle.cantidadSistema) : null,
      })),
    };
    
    console.log('Enviando payload conteo:', JSON.stringify(payload, null, 2));
    conteoMutation.mutate(payload);
  };

  const handleGeneratePlan = (values) => {
    if (!sedeId) return;
    planMutation.mutate({
      sedeId,
      fechaProduccion: values.fechaProduccion
        ? values.fechaProduccion.format('YYYY-MM-DD')
        : formattedDate,
      forzar: values.forzarRegeneracion ?? false,
      notasMaestro: values.notasMaestro || null,
    });
  };

  const handleToggleDetalle = (detalle, nextEstado, overrides = {}) => {
    detalleMutation.mutate({
      detalleId: detalle.id,
      payload: {
        estado: nextEstado,
        cantidadProducida: overrides.cantidadProducida ?? detalle.cantidadPlanificada,
        cantidadMerma: overrides.cantidadMerma ?? detalle.cantidadMerma ?? 0,
        observaciones: overrides.observaciones ?? detalle.observaciones ?? null,
      },
    });
  };

  return (
    <PlanificacionView
      selectedDate={selectedDate}
      onDateChange={setSelectedDate}
      sedeNombre={sedeNombre}
      productos={productoLookup}
      defaultConteoRows={defaultConteoRows}
      onSubmitConteo={handleSubmitConteo}
      conteoLoading={conteoMutation.isLoading}
      conteoExistente={Boolean(conteoQuery.data)}
      onGeneratePlan={handleGeneratePlan}
      planLoading={planMutation.isLoading}
      planData={normalizedPlan}
      checklistLoading={planChecklistQuery.isLoading}
      checklistError={planChecklistQuery.isError}
      onRefreshChecklist={planChecklistQuery.refetch}
      onDetalleAction={handleToggleDetalle}
      updatingDetalleId={detalleMutation.isLoading ? detalleMutation.variables?.detalleId : null}
      stockLoading={stockIdealQuery.isLoading}
      productosLoading={productosQuery.isLoading}
    />
  );
};

export default PlanificacionManager;
