import { useState } from 'react';
import { App } from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import AgregarInsumoModal from './AgregarInsumoModal.jsx';
import { createInventarioInsumo } from '../../api/insumos-inventario.api.js';
import { createInsumo } from '../../../compras/api/insumos.api.js';
import { INVENTARIO_INSUMO_KEYS } from '../../constants/queryKeys.js';

const AgregarInsumoModalContainer = ({ open, onClose, tiendaId, sedeId }) => {
  const { notification } = App.useApp();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mutation para crear nuevo insumo en catálogo
  const createInsumoMutation = useMutation({
    mutationFn: (payload) => createInsumo(tiendaId, payload),
    onError: (error) => {
      const detail = error?.response?.data?.mensaje ?? error?.message ?? 'No se pudo crear el insumo';
      notification.error({
        message: 'Error al crear insumo',
        description: detail,
        placement: 'topRight',
      });
      setIsSubmitting(false);
    },
  });

  // Mutation para agregar insumo al inventario
  const createInventarioMutation = useMutation({
    mutationFn: (payload) => createInventarioInsumo(tiendaId, payload),
    onSuccess: () => {
      notification.success({
        message: 'Insumo agregado',
        description: 'El insumo se agregó correctamente al inventario de la sede',
        placement: 'topRight',
      });
      queryClient.invalidateQueries({ queryKey: INVENTARIO_INSUMO_KEYS.lists(tiendaId, sedeId) });
      queryClient.invalidateQueries({ queryKey: ['compras', 'insumos', tiendaId] });
      setIsSubmitting(false);
      onClose();
    },
    onError: (error) => {
      const detail = error?.response?.data?.mensaje ?? error?.message ?? 'No se pudo agregar el insumo al inventario';
      notification.error({
        message: 'Error al agregar',
        description: detail,
        placement: 'topRight',
      });
      setIsSubmitting(false);
    },
  });

  const handleSubmit = async (values) => {
    setIsSubmitting(true);

    try {
      // 1. Crear el insumo en el catálogo
      const insumoCreado = await createInsumoMutation.mutateAsync({
        tiendaId,
        ...values,
      });

      // 2. Agregar el insumo al inventario de la sede con cantidad 0
      await createInventarioMutation.mutateAsync({
        sedeId,
        insumoId: insumoCreado.id,
        cantidadActual: 0,
        ubicacionFisica: null,
      });

    } catch (error) {
      // Los errores ya se manejan en las mutaciones individuales
      setIsSubmitting(false);
    }
  };

  return (
    <AgregarInsumoModal
      open={open}
      onClose={onClose}
      onSubmit={handleSubmit}
      loading={isSubmitting}
    />
  );
};

export default AgregarInsumoModalContainer;
