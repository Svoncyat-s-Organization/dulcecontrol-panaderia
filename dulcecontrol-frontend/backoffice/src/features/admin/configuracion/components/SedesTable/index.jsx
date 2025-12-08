import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message, Modal } from 'antd';
import { getSedes, createSede, updateSede, deleteSede, desactivarSede } from '../../api/sedes.api';
import { SEDES_KEYS } from '../../constants/queryKeys';
import { useTokenStore } from '../../../../../shared/store/tokenStore.js';
import SedesTableView from './SedesTableView';

/**
 * Container: Lógica de negocio para la tabla de sedes
 */
export default function SedesTable() {
  const queryClient = useQueryClient();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSede, setEditingSede] = useState(null);
  const tiendaId = useTokenStore((state) => state.tiendaId);

  // Consulta para obtener las sedes
  const { data: sedes = [], isLoading } = useQuery({
    queryKey: SEDES_KEYS.lists(tiendaId),
    queryFn: () => getSedes(tiendaId),
    enabled: !!tiendaId,
    staleTime: 5 * 60 * 1000,
  });

  // Mutación para crear sede
  const createMutation = useMutation({
    mutationFn: (payload) => createSede(tiendaId, payload),
    onSuccess: () => {
      message.success('Sede creada exitosamente');
      queryClient.invalidateQueries({ queryKey: SEDES_KEYS.lists(tiendaId) });
      handleCloseModal();
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Error al crear la sede');
    },
  });

  // Mutación para actualizar sede
  const updateMutation = useMutation({
    mutationFn: ({ sedeId, payload }) => updateSede(tiendaId, sedeId, payload),
    onSuccess: () => {
      message.success('Sede actualizada exitosamente');
      queryClient.invalidateQueries({ queryKey: SEDES_KEYS.lists(tiendaId) });
      handleCloseModal();
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Error al actualizar la sede');
    },
  });

  // Mutación para desactivar sede
  const desactivarMutation = useMutation({
    mutationFn: (sedeId) => desactivarSede(tiendaId, sedeId),
    onSuccess: () => {
      message.success('Sede desactivada exitosamente');
      queryClient.invalidateQueries({ queryKey: SEDES_KEYS.lists(tiendaId) });
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Error al desactivar la sede');
    },
  });

  // Mutación para eliminar sede
  const deleteMutation = useMutation({
    mutationFn: (sedeId) => deleteSede(tiendaId, sedeId),
    onSuccess: () => {
      message.success('Sede eliminada exitosamente');
      queryClient.invalidateQueries({ queryKey: SEDES_KEYS.lists(tiendaId) });
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Error al eliminar la sede');
    },
  });

  const handleOpenModal = (sede = null) => {
    setEditingSede(sede);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setEditingSede(null);
    setIsModalVisible(false);
  };

  const handleSubmit = (values) => {
    if (editingSede) {
      updateMutation.mutate({ sedeId: editingSede.id, payload: values });
    } else {
      createMutation.mutate(values);
    }
  };

  const handleDesactivar = (sede) => {
    Modal.confirm({
      title: '¿Desactivar sede?',
      content: `¿Está seguro que desea desactivar la sede "${sede.nombre}"?`,
      okText: 'Desactivar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk: () => desactivarMutation.mutate(sede.id),
    });
  };

  const handleDelete = (sede) => {
    Modal.confirm({
      title: '¿Eliminar sede?',
      content: `¿Está seguro que desea eliminar permanentemente la sede "${sede.nombre}"? Esta acción no se puede deshacer.`,
      okText: 'Eliminar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk: () => deleteMutation.mutate(sede.id),
    });
  };

  return (
    <SedesTableView
      sedes={sedes}
      isLoading={isLoading}
      isModalVisible={isModalVisible}
      editingSede={editingSede}
      isSaving={createMutation.isPending || updateMutation.isPending}
      onOpenModal={handleOpenModal}
      onCloseModal={handleCloseModal}
      onSubmit={handleSubmit}
      onDesactivar={handleDesactivar}
      onDelete={handleDelete}
    />
  );
}
