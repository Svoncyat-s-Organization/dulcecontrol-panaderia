import { useMemo, useState } from 'react';
import { Modal, message } from 'antd';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import ProductosTableView from './ProductosTableView.jsx';
import { useTokenStore } from '../../../../../shared/store/tokenStore.js';
import { getProductos, deleteProducto } from '../../api/productos.api.js';
import { getCategorias } from '../../api/categorias.api.js';
import { PRODUCTO_KEYS, CATEGORIA_KEYS } from '../../constants/queryKeys.js';
import { mapProductosResponse } from '../../utils/productoMappers.js';
import ProductoForm from '../ProductoForm/index.jsx';

const ProductosTable = () => {
  const tiendaId = useTokenStore((state) => state.tiendaId);
  const queryClient = useQueryClient();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState(null);

  const { data = [], isLoading, isError, refetch } = useQuery({
    queryKey: PRODUCTO_KEYS.lists(tiendaId),
    queryFn: () => getProductos(tiendaId),
    enabled: Boolean(tiendaId),
    select: (response) => mapProductosResponse(response ?? []),
  });

  const { data: categorias = [] } = useQuery({
    queryKey: CATEGORIA_KEYS.lists(tiendaId),
    queryFn: () => getCategorias(tiendaId),
    enabled: Boolean(tiendaId),
  });

  const deleteMutation = useMutation({
    mutationFn: (productoId) => {
      if (!tiendaId) {
        throw new Error('No se pudo identificar la tienda activa');
      }
      return deleteProducto(tiendaId, productoId);
    },
    onSuccess: () => {
      message.success('Producto eliminado');
      queryClient.invalidateQueries({ queryKey: PRODUCTO_KEYS.lists(tiendaId) });
    },
    onError: (error) => {
      const detail = error?.response?.data?.message ?? error?.message ?? 'No se pudo eliminar';
      message.error(detail);
    },
  });

  const deletingId = deleteMutation.variables ?? null;

  const handleCreate = () => {
    setSelectedProducto(null);
    setIsDrawerOpen(true);
  };

  const handleEdit = (producto) => {
    setSelectedProducto(producto);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedProducto(null);
  };

  const handleDelete = (producto) => {
    if (!tiendaId) {
      message.error('No se pudo identificar la tienda activa');
      return;
    }
    Modal.confirm({
      title: `Eliminar ${producto.nombre}?`,
      content: 'Esta acción no se puede deshacer.',
      okText: 'Eliminar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk: () => deleteMutation.mutate(producto.id),
    });
  };

  const productos = useMemo(() => {
    // Enriquecer productos con el nombre de la categoría
    return data.map((producto) => {
      const categoria = categorias.find((cat) => cat.id === producto.categoriaId);
      return {
        ...producto,
        categoriaNombre: categoria?.nombre || null,
      };
    });
  }, [data, categorias]);

  return (
    <>
      <ProductosTableView
        productos={productos}
        loading={isLoading}
        isError={isError}
        onRetry={refetch}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
        deletingId={deletingId}
        categorias={categorias}
      />

      {isDrawerOpen && (
        <ProductoForm
          open={isDrawerOpen}
          onClose={handleCloseDrawer}
          tiendaId={tiendaId}
          producto={selectedProducto}
        />
      )}
    </>
  );
};

export default ProductosTable;
