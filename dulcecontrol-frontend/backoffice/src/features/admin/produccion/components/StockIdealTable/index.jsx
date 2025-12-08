import { useState, useMemo } from 'react';
import { Modal, message } from 'antd';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import StockIdealTableView from './StockIdealTableView.jsx';
import { useTokenStore } from '../../../../../shared/store/tokenStore.js';
import { useSedeStore } from '../../../../../shared/store/sedeStore.js';
import { getStockIdeal, deleteStockIdeal } from '../../api/stockIdeal.api.js';
import { getProductos } from '../../../catalogo/api/productos.api.js';
import { STOCK_IDEAL_KEYS } from '../../constants/queryKeys.js';
import { PRODUCTO_KEYS } from '../../../catalogo/constants/queryKeys.js';
import { mergeProductosConStockIdeal } from '../../utils/stockIdealMappers.js';
import StockIdealForm from '../StockIdealForm/index.jsx';

const StockIdealTable = () => {
  const tiendaId = useTokenStore((state) => state.tiendaId);
  const sedeId = useSedeStore((state) => state.selectedSedeId);
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  // Query para obtener productos
  const { data: productosData = [] } = useQuery({
    queryKey: PRODUCTO_KEYS.lists(tiendaId),
    queryFn: () => getProductos(tiendaId),
    enabled: Boolean(tiendaId),
  });

  // Query para obtener stock ideal
  const {
    data: stockIdealData = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: STOCK_IDEAL_KEYS.lists(tiendaId, sedeId),
    queryFn: () => getStockIdeal(tiendaId, { sedeId }),
    enabled: Boolean(tiendaId && sedeId),
  });

  // Mezclar productos con stock ideal
  const dataSource = useMemo(() => {
    if (!sedeId) return [];
    return mergeProductosConStockIdeal(productosData, stockIdealData, sedeId);
  }, [productosData, stockIdealData, sedeId]);

  const deleteMutation = useMutation({
    mutationFn: (stockId) => {
      if (!tiendaId) {
        throw new Error('No se pudo identificar la tienda activa');
      }
      return deleteStockIdeal(tiendaId, stockId);
    },
    onSuccess: () => {
      message.success('Configuración eliminada');
      queryClient.invalidateQueries({ queryKey: STOCK_IDEAL_KEYS.lists(tiendaId, sedeId) });
    },
    onError: (error) => {
      const detail = error?.response?.data?.message ?? error?.message ?? 'No se pudo eliminar';
      message.error(detail);
    },
  });

  const deletingId = deleteMutation.variables ?? null;

  const handleEdit = (row) => {
    setSelectedRow(row);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRow(null);
  };

  const handleDelete = (row) => {
    if (!tiendaId) {
      message.error('No se pudo identificar la tienda activa');
      return;
    }

    if (!row.stockId) {
      message.warning('No hay configuración que eliminar');
      return;
    }

    Modal.confirm({
      title: `¿Eliminar configuración de ${row.productoNombre}?`,
      content: 'Los valores volverán a 0. Esta acción no se puede deshacer.',
      okText: 'Eliminar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk: () => deleteMutation.mutate(row.stockId),
    });
  };

  return (
    <>
      <StockIdealTableView
        dataSource={dataSource}
        loading={isLoading}
        isError={isError}
        onRetry={refetch}
        onEdit={handleEdit}
        onDelete={handleDelete}
        deletingId={deletingId}
        sedeId={sedeId}
      />

      <StockIdealForm
        open={isModalOpen}
        onClose={handleCloseModal}
        tiendaId={tiendaId}
        sedeId={sedeId}
        rowData={selectedRow}
      />
    </>
  );
};

export default StockIdealTable;
