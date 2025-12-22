import { useState } from 'react';
import { Modal, App } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import InsumosTableView from './InsumosTableView.jsx';
import { getInsumos, deleteInsumo } from '../../api/insumos.api.js';
import { INSUMOS_KEYS } from '../../constants/queryKeys.js';
import InsumoModal from '../InsumoModal/index.jsx';

const InsumosTable = ({ tiendaId }) => {
  const { message } = App.useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedInsumo, setSelectedInsumo] = useState(null);
  const [filters, setFilters] = useState({ soloActivos: true, stockBajo: false });
  const queryClient = useQueryClient();

  const {
    data = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: INSUMOS_KEYS.lists(tiendaId, filters),
    queryFn: () =>
      getInsumos(tiendaId, filters.soloActivos, filters.stockBajo).catch((error) => {
        message.error(
          error?.response?.data?.message ?? 'No se pudo obtener la lista de insumos'
        );
        throw error;
      }),
    enabled: Boolean(tiendaId),
  });

  const deleteMutation = useMutation({
    mutationFn: (insumoId) => deleteInsumo(tiendaId, insumoId),
    onSuccess: () => {
      message.success('Insumo eliminado correctamente');
      queryClient.invalidateQueries({ queryKey: INSUMOS_KEYS.all(tiendaId) });
    },
    onError: (error) => {
      const detail = error?.response?.data?.mensaje ?? error?.message ?? 'No se pudo eliminar el insumo';
      message.error(detail, 5);
    },
  });

  const handleCreate = () => {
    setSelectedInsumo(null);
    setModalOpen(true);
  };

  const handleEdit = (insumo) => {
    setSelectedInsumo(insumo);
    setModalOpen(true);
  };

  const handleDelete = (insumoId) => {
    deleteMutation.mutate(insumoId);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedInsumo(null);
  };

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return (
    <>
      <InsumosTableView
        insumos={data}
        loading={isLoading}
        isError={isError}
        onRetry={refetch}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      <InsumoModal
        open={modalOpen}
        onClose={handleCloseModal}
        tiendaId={tiendaId}
        insumo={selectedInsumo}
      />
    </>
  );
};

export default InsumosTable;
