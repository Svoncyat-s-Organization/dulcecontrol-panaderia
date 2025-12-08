import { useState } from 'react';
import { message } from 'antd';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import RecetasTableView from './RecetasTableView.jsx';
import { useTokenStore } from '../../../../../shared/store/tokenStore.js';
import { getRecetas, deleteReceta } from '../../api/recetas.api.js';
import { RECETA_KEYS } from '../../constants/queryKeys.js';

const RecetasTable = ({ onEdit }) => {
  const tiendaId = useTokenStore((state) => state.tiendaId);
  const queryClient = useQueryClient();
  const [selectedReceta, setSelectedReceta] = useState(null);

  // Query para obtener recetas
  const {
    data: recetas = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: RECETA_KEYS.lists(tiendaId),
    queryFn: () => getRecetas(tiendaId),
    enabled: Boolean(tiendaId),
  });

  // Mutation para eliminar
  const deleteMutation = useMutation({
    mutationFn: (recetaId) => deleteReceta(tiendaId, recetaId),
    onSuccess: () => {
      message.success('Receta eliminada correctamente');
      queryClient.invalidateQueries({ queryKey: RECETA_KEYS.lists(tiendaId) });
      setSelectedReceta(null);
    },
    onError: (error) => {
      const detail = error?.response?.data?.message ?? error?.message ?? 'Error al eliminar';
      message.error(detail);
    },
  });

  const handleDelete = (receta) => {
    deleteMutation.mutate(receta.id);
  };

  return (
    <RecetasTableView
      recetas={recetas}
      loading={isLoading}
      isError={isError}
      onRetry={refetch}
      onEdit={onEdit}
      onDelete={handleDelete}
      deleting={deleteMutation.isPending}
    />
  );
};

export default RecetasTable;
