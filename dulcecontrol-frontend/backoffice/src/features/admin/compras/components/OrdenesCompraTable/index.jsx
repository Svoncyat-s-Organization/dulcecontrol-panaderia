import { useState } from 'react';
import { App } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import OrdenesCompraTableView from './OrdenesCompraTableView.jsx';
import { getOrdenes, deleteOrden, cambiarEstadoOrden, recibirTotal } from '../../api/ordenes-compra.api.js';
import { ORDENES_COMPRA_KEYS } from '../../constants/queryKeys.js';
import OrdenCompraModal from '../OrdenCompraModal/index.jsx';
import OrdenCompraDetalleModal from '../OrdenCompraDetalleModal/index.jsx';
import RecepcionParcialModal from '../RecepcionParcialModal/index.jsx';
import PagoModal from '../PagoModal/index.jsx';
import HistorialPagosModal from '../HistorialPagosModal/index.jsx';

const OrdenesCompraTable = ({ tiendaId, sedeId }) => {
  const { message, modal } = App.useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [detalleModalOpen, setDetalleModalOpen] = useState(false);
  const [recepcionParcialModalOpen, setRecepcionParcialModalOpen] = useState(false);
  const [selectedOrden, setSelectedOrden] = useState(null);
  const [ordenDetalle, setOrdenDetalle] = useState(null);
  const [ordenRecepcion, setOrdenRecepcion] = useState(null);
  const [ordenPago, setOrdenPago] = useState(null);
  const [ordenHistorialPagos, setOrdenHistorialPagos] = useState(null);
  const [pagoModalOpen, setPagoModalOpen] = useState(false);
  const [historialPagosModalOpen, setHistorialPagosModalOpen] = useState(false);
  const [filters, setFilters] = useState({});
  const queryClient = useQueryClient();

  const {
    data = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ORDENES_COMPRA_KEYS.lists(tiendaId, sedeId, filters),
    queryFn: async () => {
      console.log('🔍 Fetching órdenes con:', { tiendaId, sedeId, filters });
      try {
        const result = await getOrdenes(tiendaId, sedeId, filters);
        console.log('✅ Órdenes obtenidas:', result.length, 'órdenes');
        return result;
      } catch (error) {
        console.error('❌ Error al obtener órdenes:', error);
        message.error(
          error?.response?.data?.message ?? 'No se pudo obtener las órdenes de compra'
        );
        throw error;
      }
    },
    enabled: Boolean(tiendaId && sedeId),
  });
  
  console.log('📊 Estado de la tabla:', { 
    tiendaId, 
    sedeId, 
    totalOrdenes: data?.length,
    isLoading,
    isError 
  });

  const deleteMutation = useMutation({
    mutationFn: (ordenId) => deleteOrden(tiendaId, ordenId),
    onSuccess: (_, ordenId) => {
      message.success('Orden de compra eliminada permanentemente');
      
      // Actualizar cache inmediatamente
      queryClient.setQueryData(
        ORDENES_COMPRA_KEYS.lists(tiendaId, sedeId, filters),
        (oldData) => oldData ? oldData.filter(o => o.id !== ordenId) : []
      );
    },
    onError: (error) => {
      message.error(error?.response?.data?.message ?? 'No se pudo eliminar la orden de compra');
    },
  });

  const cambiarEstadoMutation = useMutation({
    mutationFn: ({ ordenId, estado }) => cambiarEstadoOrden(tiendaId, ordenId, estado),
    onSuccess: (_, { ordenId, estado }) => {
      message.success('Estado actualizado correctamente');
      
      // Actualizar cache inmediatamente
      queryClient.setQueryData(
        ORDENES_COMPRA_KEYS.lists(tiendaId, sedeId, filters),
        (oldData) => oldData ? oldData.map(o => o.id === ordenId ? { ...o, estado } : o) : []
      );
    },
    onError: (error) => {
      message.error(error?.response?.data?.message ?? 'No se pudo cambiar el estado');
    },
  });

  const recibirTotalMutation = useMutation({
    mutationFn: (ordenId) => recibirTotal(tiendaId, ordenId),
    onSuccess: async () => {
      message.success('Recepción total registrada exitosamente');
      // Invalidar cache
      await queryClient.invalidateQueries(ORDENES_COMPRA_KEYS.all(tiendaId, sedeId));
      await queryClient.refetchQueries(ORDENES_COMPRA_KEYS.all(tiendaId, sedeId));
      // Forzar reload completo
      window.location.reload();
    },
    onError: (error) => {
      message.error(error?.response?.data?.message ?? 'Error al registrar la recepción total');
    },
  });

  const handleCreate = () => {
    setSelectedOrden(null);
    setModalOpen(true);
  };

  const handleEdit = (orden) => {
    setSelectedOrden(orden);
    setModalOpen(true);
  };

  const handleViewDetails = (orden) => {
    setOrdenDetalle(orden);
    setDetalleModalOpen(true);
  };

  const handleDelete = (ordenId) => {
    deleteMutation.mutate(ordenId);
  };

  const handleChangeStatus = (ordenId, estado) => {
    cambiarEstadoMutation.mutate({ ordenId, estado });
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedOrden(null);
  };

  const handleCloseDetalleModal = () => {
    setDetalleModalOpen(false);
    setOrdenDetalle(null);
  };

  const handleRecibirParcial = (orden) => {
    setOrdenRecepcion(orden);
    setRecepcionParcialModalOpen(true);
  };

  const handleRecibirTotal = (ordenId) => {
    modal.confirm({
      title: '¿Confirmar recepción total?',
      content: 'Se recibirán todos los insumos faltantes de esta orden y se actualizará el inventario.',
      okText: 'Confirmar',
      cancelText: 'Cancelar',
      onOk: () => recibirTotalMutation.mutate(ordenId),
    });
  };

  const handleCloseRecepcionModal = () => {
    setRecepcionParcialModalOpen(false);
    setOrdenRecepcion(null);
  };

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handlePagar = (orden) => {
    setOrdenPago(orden);
    setPagoModalOpen(true);
  };

  const handleClosePagoModal = () => {
    setPagoModalOpen(false);
    setOrdenPago(null);
  };

  const handleVerHistorialPagos = (orden) => {
    setOrdenHistorialPagos(orden);
    setHistorialPagosModalOpen(true);
  };

  const handleCloseHistorialPagosModal = () => {
    setHistorialPagosModalOpen(false);
    setOrdenHistorialPagos(null);
  };

  return (
    <>
      <OrdenesCompraTableView
        ordenes={data}
        loading={isLoading}
        isError={isError}
        onRetry={refetch}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onViewDetails={handleViewDetails}
        onDelete={handleDelete}
        onChangeStatus={handleChangeStatus}
        onRecibirParcial={handleRecibirParcial}
        onRecibirTotal={handleRecibirTotal}
        onPagar={handlePagar}
        onVerHistorialPagos={handleVerHistorialPagos}
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      <OrdenCompraModal
        open={modalOpen}
        onClose={handleCloseModal}
        tiendaId={tiendaId}
        sedeId={sedeId}
        orden={selectedOrden}
      />

      <OrdenCompraDetalleModal
        open={detalleModalOpen}
        onClose={handleCloseDetalleModal}
        orden={ordenDetalle}
      />

      <RecepcionParcialModal
        open={recepcionParcialModalOpen}
        onClose={handleCloseRecepcionModal}
        orden={ordenRecepcion}
        tiendaId={tiendaId}
        sedeId={sedeId}
      />

      <PagoModal
        open={pagoModalOpen}
        onClose={handleClosePagoModal}
        ordenCompra={ordenPago}
      />

      <HistorialPagosModal
        open={historialPagosModalOpen}
        onClose={handleCloseHistorialPagosModal}
        ordenCompra={ordenHistorialPagos}
      />
    </>
  );
};

export default OrdenesCompraTable;
