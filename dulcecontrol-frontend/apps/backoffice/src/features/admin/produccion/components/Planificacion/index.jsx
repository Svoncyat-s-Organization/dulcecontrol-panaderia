import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { App } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import PlanificacionView from './PlanificacionView.jsx';
import {
  createConteoDiario,
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
      message.success('Conteo registrado');
    },
    onError: (error) => {
      message.error(error?.response?.data?.message ?? 'No se pudo registrar el conteo');
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
    const payload = {
      sedeId,
      fechaConteo: values.fechaConteo
        ? values.fechaConteo.format('YYYY-MM-DD')
        : formattedDate,
      responsableId: values.responsableId || null,
      observaciones: values.observaciones || null,
      detalles: (values.detalles ?? []).map((detalle) => ({
        productoId: detalle.productoId,
        cantidadFisica: Number(detalle.cantidadFisica ?? 0),
        cantidadSistema: detalle.cantidadSistema ?? null,
      })),
    };
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
