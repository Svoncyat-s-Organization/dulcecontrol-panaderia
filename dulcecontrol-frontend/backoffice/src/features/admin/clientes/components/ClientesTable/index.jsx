import { useEffect, useMemo, useState } from 'react';
import { Modal, message, Input, Button } from 'antd';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import ClientesTableView from './ClientesTableView.jsx';
import { useTokenStore } from '../../../../../shared/store/tokenStore.js';
import { getClientes, searchClientes, deleteCliente } from '../../api/clientes.api.js';
import { CLIENTE_KEYS } from '../../constants/queryKeys.js';
import { mapClientesResponse } from '../../utils/clienteMappers.js';
import ClienteForm from '../ClienteForm/index.jsx';
import ClienteViewModal from '../ClienteViewModal/index.jsx';

const ClientesTable = () => {
  const tiendaId = useTokenStore((state) => state.tiendaId);
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [clienteToDelete, setClienteToDelete] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  const { data = [], isLoading, isError, refetch } = useQuery({
    queryKey: CLIENTE_KEYS.lists(tiendaId),
    queryFn: () => getClientes(tiendaId),
    enabled: Boolean(tiendaId),
    select: (response) => mapClientesResponse(response ?? []),
  });

  const searchMutation = useMutation({
    mutationFn: (busqueda) => searchClientes(tiendaId, busqueda),
    onSuccess: (response) => {
      const mappedData = mapClientesResponse(response ?? []);
      queryClient.setQueryData(CLIENTE_KEYS.lists(tiendaId), mappedData);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (clienteId) => {
      if (!tiendaId) {
        throw new Error('No se pudo identificar la tienda activa');
      }
      return deleteCliente(tiendaId, clienteId);
    },
    onSuccess: () => {
      message.success('Cliente eliminado correctamente');
      queryClient.invalidateQueries({ queryKey: CLIENTE_KEYS.lists(tiendaId) });
    },
    onError: (error) => {
      const detail = error?.response?.data?.message ?? error?.message ?? 'No se pudo eliminar el cliente';
      message.error(detail);
    },
  });

  const deletingId = deleteMutation.variables ?? null;

  const handleCreate = () => {
    setSelectedCliente(null);
    setIsModalOpen(true);
  };

  const handleEdit = (cliente) => {
    setSelectedCliente(cliente);
    setIsModalOpen(true);
  };

  const handleView = (cliente) => {
    setSelectedCliente(cliente);
    setIsViewModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCliente(null);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedCliente(null);
  };

  const handleDelete = (cliente) => {
    if (!tiendaId) {
      message.error('No se pudo identificar la tienda activa');
      return;
    }

    // Prevenir eliminación del cliente genérico
    if (cliente.numeroDoc === '00000000' || cliente.nombreDoc === 'CLIENTE GENÉRICO') {
      message.error('El cliente genérico no puede ser eliminado');
      return;
    }

    setClienteToDelete(cliente);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (clienteToDelete) {
      deleteMutation.mutate(clienteToDelete.id);
    }
    setIsDeleteModalOpen(false);
    setClienteToDelete(null);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setClienteToDelete(null);
  };

  const handleSearch = (value) => {
    setSearchText(value);
    if (value.trim()) {
      searchMutation.mutate(value.trim());
    } else {
      refetch();
    }
  };

  const clientes = useMemo(() => data, [data]);

  useEffect(() => {
    if (!clientes.length) {
      setPagination((prev) => ({ ...prev, current: 1 }));
      return;
    }

    const maxPage = Math.max(1, Math.ceil(clientes.length / pagination.pageSize));
    if (pagination.current > maxPage) {
      setPagination((prev) => ({ ...prev, current: maxPage }));
    }
  }, [clientes.length, pagination.current, pagination.pageSize]);

  const handlePaginate = (page, pageSize) => {
    setPagination({ current: page, pageSize });
  };

  const tablePagination = useMemo(
    () => ({
      current: pagination.current,
      pageSize: pagination.pageSize,
      total: clientes.length,
      showSizeChanger: true,
      pageSizeOptions: ['10', '20', '50'],
      showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} clientes`,
    }),
    [clientes.length, pagination.current, pagination.pageSize]
  );

  return (
    <>
      <ClientesTableView
        clientes={clientes}
        loading={isLoading || searchMutation.isPending}
        isError={isError}
        onRetry={refetch}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onView={handleView}
        onDelete={handleDelete}
        onSearch={handleSearch}
        searchText={searchText}
        deletingId={deletingId}
        pagination={tablePagination}
        onPaginate={handlePaginate}
      />

      <ClienteForm
        open={isModalOpen}
        onClose={handleCloseModal}
        tiendaId={tiendaId}
        cliente={selectedCliente}
      />

      <ClienteViewModal
        open={isViewModalOpen}
        onClose={handleCloseViewModal}
        tiendaId={tiendaId}
        cliente={selectedCliente}
      />

      {/* Modal de confirmación para eliminar */}
      <Modal
        title="¿Estás seguro de eliminar este cliente?"
        open={isDeleteModalOpen}
        onCancel={handleCancelDelete}
        footer={null}
      >
        <p>Se eliminará al cliente "{clienteToDelete?.nombreDoc}". Esta acción es un borrado lógico y puede ser revertida.</p>
        <div style={{ textAlign: 'right', marginTop: 16 }}>
          <Button onClick={handleCancelDelete} style={{ marginRight: 8 }}>
            No
          </Button>
          <Button type="primary" danger onClick={handleConfirmDelete}>
            Sí
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default ClientesTable;