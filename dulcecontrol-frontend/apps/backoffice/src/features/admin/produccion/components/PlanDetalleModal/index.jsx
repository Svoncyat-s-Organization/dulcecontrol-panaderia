import { useMemo, useState } from 'react';
import { message } from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import PlanDetalleModalView from './PlanDetalleModalView.jsx';
import { patchDetallePlan } from '../../api/planProduccion.api.js';
import { PLAN_PRODUCCION_KEYS } from '../../constants/queryKeys.js';
import { agruparDetallesPorOrigen } from '../../utils/planProduccionMappers.js';

const PlanDetalleModal = ({ open, onClose, plan, tiendaId, sedeId }) => {
  const queryClient = useQueryClient();
  const [editingDetalle, setEditingDetalle] = useState(null);

  const { stockDiario, pedidosCliente } = useMemo(() => {
    if (!plan?.detalles) return { stockDiario: [], pedidosCliente: [] };
    return agruparDetallesPorOrigen(plan.detalles);
  }, [plan]);

  const updateDetalleMutation = useMutation({
    mutationFn: ({ detalleId, payload }) => patchDetallePlan(tiendaId, detalleId, payload),
    onSuccess: () => {
      message.success('Item actualizado correctamente');
      queryClient.invalidateQueries({ queryKey: PLAN_PRODUCCION_KEYS.lists(tiendaId, sedeId) });
      setEditingDetalle(null);
    },
    onError: (error) => {
      const detail = error?.response?.data?.message ?? error?.message ?? 'Error al actualizar';
      message.error(detail);
    },
  });

  const handleEditDetalle = (detalle) => {
    setEditingDetalle(detalle);
  };

  const handleCancelEdit = () => {
    setEditingDetalle(null);
  };

  const handleSaveDetalle = (detalleId, values) => {
    updateDetalleMutation.mutate({
      detalleId,
      payload: {
        cantidadProducida: parseInt(values.cantidadProducida, 10) || 0,
        cantidadMerma: parseInt(values.cantidadMerma, 10) || 0,
        estado: values.estado,
        observaciones: values.observaciones || '',
      },
    });
  };

  const handleMarcarTerminado = (detalle) => {
    updateDetalleMutation.mutate({
      detalleId: detalle.id,
      payload: {
        cantidadProducida: detalle.cantidadPlanificada,
        cantidadMerma: 0,
        estado: 'TERMINADO',
      },
    });
  };

  return (
    <PlanDetalleModalView
      open={open}
      onClose={onClose}
      plan={plan}
      stockDiario={stockDiario}
      pedidosCliente={pedidosCliente}
      editingDetalle={editingDetalle}
      onEditDetalle={handleEditDetalle}
      onCancelEdit={handleCancelEdit}
      onSaveDetalle={handleSaveDetalle}
      onMarcarTerminado={handleMarcarTerminado}
      updating={updateDetalleMutation.isPending}
    />
  );
};

export default PlanDetalleModal;
