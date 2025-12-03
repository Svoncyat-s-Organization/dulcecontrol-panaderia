import { useState } from 'react';
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
        planes={planes}
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
