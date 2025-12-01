import { useState } from 'react';
import { Modal, App } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ProveedoresTableView from './ProveedoresTableView.jsx';
import { getProveedores, deleteProveedor } from '../../api/proveedores.api.js';
import { PROVEEDORES_KEYS } from '../../constants/queryKeys.js';
import ProveedorModal from '../ProveedorModal/index.jsx';

const ProveedoresTable = ({ tiendaId }) => {
  const { message } = App.useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProveedor, setSelectedProveedor] = useState(null);
  const [soloActivos, setSoloActivos] = useState(true);
  const queryClient = useQueryClient();

  const {
    data = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: PROVEEDORES_KEYS.lists(tiendaId, { soloActivos }),
    queryFn: () =>
      getProveedores(tiendaId, soloActivos).catch((error) => {
        message.error(
          error?.response?.data?.message ?? 'No se pudo obtener la lista de proveedores'
        );
        throw error;
      }),
    enabled: Boolean(tiendaId),
  });

  const deleteMutation = useMutation({
    mutationFn: (proveedorId) => deleteProveedor(tiendaId, proveedorId),
    onSuccess: (_, proveedorId) => {
      message.success('Proveedor eliminado permanentemente');
      
      // Actualizar cache inmediatamente eliminando el proveedor
      queryClient.setQueryData(
        PROVEEDORES_KEYS.lists(tiendaId, { soloActivos: true }),
        (oldData) => oldData ? oldData.filter(p => p.id !== proveedorId) : []
      );
      
      queryClient.setQueryData(
        PROVEEDORES_KEYS.lists(tiendaId, { soloActivos: false }),
        (oldData) => oldData ? oldData.filter(p => p.id !== proveedorId) : []
      );
    },
    onError: (error) => {
      message.error(error?.response?.data?.message ?? 'No se pudo eliminar el proveedor');
    },
  });

  const handleCreate = () => {
    setSelectedProveedor(null);
    setModalOpen(true);
  };

  const handleEdit = (proveedor) => {
    setSelectedProveedor(proveedor);
    setModalOpen(true);
  };

  const handleDelete = (proveedorId) => {
    deleteMutation.mutate(proveedorId);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProveedor(null);
  };

  return (
    <>
      <ProveedoresTableView
        proveedores={data}
        loading={isLoading}
        isError={isError}
        onRetry={refetch}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
        soloActivos={soloActivos}
        onFilterChange={setSoloActivos}
      />

      <ProveedorModal
        open={modalOpen}
        onClose={handleCloseModal}
        tiendaId={tiendaId}
        proveedor={selectedProveedor}
      />
    </>
  );
};

export default ProveedoresTable;
