import { useEffect, useMemo, useState } from 'react';
import { App } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import RecetasView from './RecetasView.jsx';
import { getRecetas, createReceta, deleteReceta } from '../../api/productionApi.js';
import { getProductos } from '../../../catalogo/api/productos.api.js';
import { getInsumos } from '../../../compras/api/insumos.api.js';
import { PRODUCTION_KEYS } from '../../constants/queryKeys.js';
import { RECETA_UNITS } from '../../constants/unidades.js';

const RecetasManager = ({ tiendaId }) => {
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  const [selectedProductoId, setSelectedProductoId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const recetasQuery = useQuery({
    queryKey: PRODUCTION_KEYS.recetas(tiendaId),
    queryFn: () =>
      getRecetas(tiendaId).catch((error) => {
        message.error(error?.response?.data?.message ?? 'No se pudo obtener las recetas');
        throw error;
      }),
    enabled: Boolean(tiendaId),
  });

  const productosQuery = useQuery({
    queryKey: PRODUCTION_KEYS.productos(tiendaId),
    queryFn: () =>
      getProductos(tiendaId, { soloActivos: true }).catch((error) => {
        message.error(error?.response?.data?.message ?? 'No se pudo listar los productos');
        throw error;
      }),
    enabled: Boolean(tiendaId),
    staleTime: 5 * 60 * 1000,
  });

  const insumosQuery = useQuery({
    queryKey: PRODUCTION_KEYS.insumos(tiendaId),
    queryFn: () =>
      getInsumos(tiendaId, true).catch((error) => {
        message.error(error?.response?.data?.message ?? 'No se pudo listar los insumos');
        throw error;
      }),
    enabled: Boolean(tiendaId),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (selectedProductoId || !tiendaId) return;
    const firstProductWithRecipe = recetasQuery.data?.[0]?.productoId;
    if (firstProductWithRecipe) {
      setSelectedProductoId(firstProductWithRecipe);
      return;
    }
    const firstProduct = productosQuery.data?.[0]?.id;
    if (firstProduct) {
      setSelectedProductoId(firstProduct);
    }
  }, [selectedProductoId, tiendaId, recetasQuery.data, productosQuery.data]);

  const recetasByProducto = useMemo(() => {
    return (recetasQuery.data ?? []).reduce((acc, receta) => {
      if (!acc[receta.productoId]) acc[receta.productoId] = [];
      acc[receta.productoId].push(receta);
      return acc;
    }, {});
  }, [recetasQuery.data]);

  const productoOptions = useMemo(
    () =>
      (productosQuery.data ?? []).map((producto) => ({
        value: producto.id,
        label: producto.nombre,
        categoria: producto.categoria?.nombre ?? producto.categoriaNombre,
      })),
    [productosQuery.data]
  );

  const insumoLookup = useMemo(
    () =>
      (insumosQuery.data ?? []).reduce((acc, insumo) => {
        acc[insumo.id] = insumo;
        return acc;
      }, {}),
    [insumosQuery.data]
  );

  const selectedRecetas = selectedProductoId ? recetasByProducto[selectedProductoId] ?? [] : [];

  const insumoOptions = useMemo(() => {
    const usedInsumos = new Set(selectedRecetas.map((receta) => receta.insumoId));
    return (insumosQuery.data ?? []).map((insumo) => ({
      label: insumo.nombre,
      value: insumo.id,
      disabled: usedInsumos.has(insumo.id),
    }));
  }, [insumosQuery.data, selectedRecetas]);

  const createMutation = useMutation({
    mutationFn: (payload) => createReceta(tiendaId, payload),
    onSuccess: () => {
      message.success('Insumo agregado a la receta');
      setModalOpen(false);
      queryClient.invalidateQueries(PRODUCTION_KEYS.recetas(tiendaId));
    },
    onError: (error) => {
      message.error(error?.response?.data?.message ?? 'No se pudo registrar la receta');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (recetaId) => deleteReceta(tiendaId, recetaId),
    onSuccess: () => {
      message.success('Insumo eliminado de la receta');
      queryClient.invalidateQueries(PRODUCTION_KEYS.recetas(tiendaId));
    },
    onError: (error) => {
      message.error(error?.response?.data?.message ?? 'No se pudo eliminar la receta');
    },
  });

  const handleSubmitReceta = (values) => {
    if (!selectedProductoId) return;
    createMutation.mutate({
      ...values,
      productoId: selectedProductoId,
    });
  };

  const handleDelete = (recetaId) => {
    deleteMutation.mutate(recetaId);
  };

  return (
    <RecetasView
      productos={productoOptions}
      selectedProductoId={selectedProductoId}
      onSelectProducto={setSelectedProductoId}
      recetas={selectedRecetas}
      insumoLookup={insumoLookup}
      loading={recetasQuery.isLoading}
      isError={recetasQuery.isError}
      onRetry={recetasQuery.refetch}
      onOpenModal={() => setModalOpen(true)}
      onDeleteReceta={handleDelete}
      deletingId={deleteMutation.isLoading ? deleteMutation.variables : null}
      modalProps={{
        open: modalOpen,
        onCancel: () => setModalOpen(false),
        onSubmit: handleSubmitReceta,
        loading: createMutation.isLoading,
        insumoOptions,
        unidadOptions: RECETA_UNITS,
      }}
      productosLoading={productosQuery.isLoading}
      insumosLoading={insumosQuery.isLoading}
    />
  );
};

export default RecetasManager;
