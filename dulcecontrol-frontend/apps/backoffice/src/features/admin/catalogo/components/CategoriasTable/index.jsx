import { useMemo, useState } from 'react';
import { Modal, message } from 'antd';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTokenStore } from '../../../../../shared/store/tokenStore.js';
import CategoriasTableView from './CategoriasTableView.jsx';
import { getCategorias, deleteCategoria } from '../../api/categorias.api.js';
import { CATEGORIA_KEYS } from '../../constants/queryKeys.js';
import { mapCategoriasResponse } from '../../utils/categoriaMappers.js';
import CategoriaForm from '../CategoriaForm/index.jsx';

const CategoriasTable = () => {
  const tiendaId = useTokenStore((state) => state.tiendaId);
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState(null);

  const { data = [], isLoading, isError, refetch } = useQuery({
    queryKey: CATEGORIA_KEYS.lists(tiendaId),
    queryFn: () => getCategorias(tiendaId),
    enabled: Boolean(tiendaId),
    select: (response) => mapCategoriasResponse(response ?? []),
  });

  const deleteMutation = useMutation({
    mutationFn: (categoriaId) => {
      if (!tiendaId) {
        throw new Error('No se pudo identificar la tienda activa');
      }
      return deleteCategoria(tiendaId, categoriaId);
    },
    onSuccess: () => {
      message.success('Categoría eliminada');
      queryClient.invalidateQueries({ queryKey: CATEGORIA_KEYS.lists(tiendaId) });
    },
    onError: (error) => {
      const detail = error?.response?.data?.message ?? error?.message ?? 'No se pudo eliminar';
      message.error(detail);
    },
  });

  const deletingId = deleteMutation.variables ?? null;

  const handleCreate = () => {
    setSelectedCategoria(null);
    setIsModalOpen(true);
  };

  const handleEdit = (categoria) => {
    setSelectedCategoria(categoria);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategoria(null);
  };

  const handleDelete = (categoria) => {
    if (!tiendaId) {
      message.error('No se pudo identificar la tienda activa');
      return;
    }

    Modal.confirm({
      title: `Eliminar ${categoria.nombre}?`,
      content: 'Esta acción no se puede deshacer.',
      okText: 'Eliminar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk: () => deleteMutation.mutate(categoria.id),
    });
  };

  const categorias = useMemo(() => data, [data]);

  return (
    <>
      <CategoriasTableView
        categorias={categorias}
        loading={isLoading}
        isError={isError}
        onRetry={refetch}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
        deletingId={deletingId}
      />

      <CategoriaForm
        open={isModalOpen}
        onClose={handleCloseModal}
        tiendaId={tiendaId}
        categoria={selectedCategoria}
      />
    </>
  );
};

export default CategoriasTable;
