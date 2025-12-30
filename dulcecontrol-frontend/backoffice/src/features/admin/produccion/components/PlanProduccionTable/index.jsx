import { useState, useMemo } from 'react';
import { message } from 'antd';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import dayjs from 'dayjs';
import PlanProduccionTableView from './PlanProduccionTableView.jsx';
import { useTokenStore } from '../../../../../shared/store/tokenStore.js';
import { useSedeStore } from '../../../../../shared/store/sedeStore.js';
import { getPlanesProduccion, patchPlanProduccion } from '../../api/planProduccion.api.js';
import { PLAN_PRODUCCION_KEYS } from '../../constants/queryKeys.js';
import PlanDetalleModal from '../PlanDetalleModal/index.jsx';

const PlanProduccionTable = () => {
  const tiendaId = useTokenStore((state) => state.tiendaId);
  const sedeId = useSedeStore((state) => state.selectedSedeId);
  const queryClient = useQueryClient();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Filtros
  const [filtroEstado, setFiltroEstado] = useState(null);
  const [filtroFecha, setFiltroFecha] = useState(null);
  const [filtroBusqueda, setFiltroBusqueda] = useState('');

  // Query para obtener planes
  const {
    data: planes = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: PLAN_PRODUCCION_KEYS.lists(tiendaId, sedeId),
    queryFn: () => getPlanesProduccion(tiendaId, { sedeId }),
    enabled: Boolean(tiendaId && sedeId),
  });

  // Filtrar planes
  const planesFiltrados = useMemo(() => {
    let resultado = planes;

    // Filtro por estado
    if (filtroEstado) {
      resultado = resultado.filter(p => p.estado === filtroEstado);
    }

    // Filtro por fecha
    if (filtroFecha) {
      resultado = resultado.filter(p => p.fechaProduccion === filtroFecha);
    }

    // Filtro por búsqueda (nombre de producto en detalles)
    if (filtroBusqueda.trim()) {
      const busqueda = filtroBusqueda.toLowerCase().trim();
      resultado = resultado.filter(p => 
        p.detalles?.some(d => 
          d.productoNombre?.toLowerCase().includes(busqueda)
        )
      );
    }

    return resultado;
  }, [planes, filtroEstado, filtroFecha, filtroBusqueda]);

  const handleLimpiarFiltros = () => {
    setFiltroEstado(null);
    setFiltroFecha(null);
    setFiltroBusqueda('');
  };

  // Mutation para actualizar estado del plan
  const updatePlanMutation = useMutation({
    mutationFn: ({ planId, payload }) => patchPlanProduccion(tiendaId, planId, payload),
    onSuccess: () => {
      message.success('Plan actualizado correctamente');
      queryClient.invalidateQueries({ queryKey: PLAN_PRODUCCION_KEYS.lists(tiendaId, sedeId) });
    },
    onError: (error) => {
      const detail = error?.response?.data?.message ?? error?.message ?? 'Error al actualizar';
      message.error(detail);
    },
  });

  const handleVerDetalle = (plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPlan(null);
  };

  const handleConfirmarPlan = (plan) => {
    updatePlanMutation.mutate({
      planId: plan.id,
      payload: { estado: 'CONFIRMADO' },
    });
  };

  const handleIniciarProduccion = (plan) => {
    updatePlanMutation.mutate({
      planId: plan.id,
      payload: {
        estado: 'EN_PROCESO',
        horaInicioReal: dayjs().toISOString(),
      },
    });
  };

  const handleFinalizarPlan = (plan) => {
    updatePlanMutation.mutate({
      planId: plan.id,
      payload: {
        estado: 'FINALIZADO',
        horaFinReal: dayjs().toISOString(),
      },
    });
  };

  const handleCancelarPlan = (plan) => {
    updatePlanMutation.mutate({
      planId: plan.id,
      payload: { estado: 'CANCELADO' },
    });
  };

  return (
    <>
      <PlanProduccionTableView
        planes={planesFiltrados}
        loading={isLoading}
        isError={isError}
        onRetry={refetch}
        onVerDetalle={handleVerDetalle}
        onConfirmar={handleConfirmarPlan}
        onIniciar={handleIniciarProduccion}
        onFinalizar={handleFinalizarPlan}
        onCancelar={handleCancelarPlan}
        sedeId={sedeId}
        updating={updatePlanMutation.isPending}
        filtroEstado={filtroEstado}
        setFiltroEstado={setFiltroEstado}
        filtroFecha={filtroFecha}
        setFiltroFecha={setFiltroFecha}
        filtroBusqueda={filtroBusqueda}
        setFiltroBusqueda={setFiltroBusqueda}
        onLimpiarFiltros={handleLimpiarFiltros}
        totalPlanes={planes.length}
      />

      <PlanDetalleModal
        open={isModalOpen}
        onClose={handleCloseModal}
        plan={selectedPlan}
        tiendaId={tiendaId}
        sedeId={sedeId}
      />
    </>
  );
};

export default PlanProduccionTable;
