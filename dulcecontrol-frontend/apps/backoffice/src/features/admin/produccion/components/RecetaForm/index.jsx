import { useEffect } from 'react';
import { message } from 'antd';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import RecetaFormView from './RecetaFormView.jsx';
import { useTokenStore } from '../../../../../shared/store/tokenStore.js';
import { postReceta, putReceta } from '../../api/recetas.api.js';
import { getProductos } from '../../../catalogo/api/productos.api.js';
import { getInsumos } from '../../../compras/api/insumos.api.js';
import { RECETA_KEYS } from '../../constants/queryKeys.js';
import { PRODUCTO_KEYS } from '../../../catalogo/constants/queryKeys.js';
import { INSUMOS_KEYS } from '../../../compras/constants/queryKeys.js';
import { prepareRecetaPayload } from '../../utils/recetasMappers.js';

const RecetaForm = ({ open, onClose, receta }) => {
  const tiendaId = useTokenStore((state) => state.tiendaId);
  const queryClient = useQueryClient();
  const isEditing = Boolean(receta);

  // Query para productos activos
  const { data: productos = [], isLoading: loadingProductos } = useQuery({
    queryKey: PRODUCTO_KEYS.lists(tiendaId),
    queryFn: () => getProductos(tiendaId),
    enabled: Boolean(tiendaId && open),
  });

  // Query para insumos activos
  const { data: insumos = [], isLoading: loadingInsumos } = useQuery({
    queryKey: INSUMOS_KEYS.lists(tiendaId),
    queryFn: () => getInsumos(tiendaId),
    enabled: Boolean(tiendaId && open),
  });

  // Mutation para crear/actualizar
  const saveMutation = useMutation({
    mutationFn: (values) => {
      const payload = prepareRecetaPayload(values);
      return isEditing 
        ? putReceta(tiendaId, receta.id, payload)
        : postReceta(tiendaId, payload);
    },
    onSuccess: () => {
      message.success(`Receta ${isEditing ? 'actualizada' : 'creada'} correctamente`);
      queryClient.invalidateQueries({ queryKey: RECETA_KEYS.lists(tiendaId) });
      onClose();
    },
    onError: (error) => {
      const detail = error?.response?.data?.message ?? error?.message ?? 'Error al guardar';
      message.error(detail);
    },
  });

  const handleSubmit = (values) => {
    saveMutation.mutate(values);
  };

  return (
    <RecetaFormView
      open={open}
      onClose={onClose}
      onSubmit={handleSubmit}
      initialValues={receta}
      isEditing={isEditing}
      saving={saveMutation.isPending}
      productos={productos}
      insumos={insumos}
      loadingProductos={loadingProductos}
      loadingInsumos={loadingInsumos}
    />
  );
};

export default RecetaForm;
