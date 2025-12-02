import { useMemo, useState } from 'react';
import { App } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import StockIdealTableView from './StockIdealTable.jsx';
import { getStockIdeal, updateStockIdeal } from '../../api/productionApi.js';
import { getProductos } from '../../../catalogo/api/productos.api.js';
import { PRODUCTION_KEYS } from '../../constants/queryKeys.js';

const StockIdealManager = ({ tiendaId, sedeId, sedeNombre }) => {
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  const [drafts, setDrafts] = useState({});

  const {
    data: stock = [],
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: PRODUCTION_KEYS.stockIdeal(tiendaId, sedeId),
    queryFn: () =>
      getStockIdeal(tiendaId, { sedeId }).catch((error) => {
        message.error(error?.response?.data?.message ?? 'No se pudo cargar el stock ideal');
        throw error;
      }),
    enabled: Boolean(tiendaId && sedeId),
  });

  const { data: productos = [], isLoading: productosLoading } = useQuery({
    queryKey: PRODUCTION_KEYS.productos(tiendaId),
    queryFn: () =>
      getProductos(tiendaId, { soloActivos: true }).catch((error) => {
        message.error(error?.response?.data?.message ?? 'No se pudo listar los productos');
        throw error;
      }),
    enabled: Boolean(tiendaId),
    staleTime: 5 * 60 * 1000,
  });

  const productLookup = useMemo(
    () =>
      productos.reduce((acc, producto) => {
        acc[producto.id] = producto;
        return acc;
      }, {}),
    [productos]
  );

  const handleDraftChange = (rowId, field, value) => {
    setDrafts((prev) => {
      const next = { ...prev };
      const currentDraft = { ...(next[rowId] ?? {}) };
      currentDraft[field] = value ?? undefined;

      const original = stock.find((item) => item.id === rowId) ?? null;
      const mergedCantidad = currentDraft.cantidadIdeal ?? original?.cantidadIdeal;
      const mergedReposicion = currentDraft.puntoReposicion ?? original?.puntoReposicion;

      if (
        original &&
        mergedCantidad === original.cantidadIdeal &&
        mergedReposicion === original.puntoReposicion
      ) {
        delete next[rowId];
      } else {
        next[rowId] = currentDraft;
      }
      return next;
    });
  };

  const updateMutation = useMutation({
    mutationFn: ({ stockId, payload }) => updateStockIdeal(tiendaId, stockId, payload),
    onSuccess: (updated) => {
      message.success('Stock ideal actualizado');
      setDrafts((prev) => {
        const next = { ...prev };
        delete next[updated.id];
        return next;
      });
      queryClient.setQueryData(
        PRODUCTION_KEYS.stockIdeal(tiendaId, sedeId),
        (oldData = []) => oldData.map((item) => (item.id === updated.id ? updated : item))
      );
    },
    onError: (error) => {
      message.error(error?.response?.data?.message ?? 'No se pudo actualizar el stock ideal');
    },
  });

  const handleSaveRow = (rowId) => {
    const original = stock.find((item) => item.id === rowId);
    const draft = drafts[rowId];
    if (!original || !draft) return;
    updateMutation.mutate({
      stockId: rowId,
      payload: {
        sedeId: original.sedeId,
        productoId: original.productoId,
        cantidadIdeal: draft.cantidadIdeal ?? original.cantidadIdeal,
        puntoReposicion: draft.puntoReposicion ?? original.puntoReposicion,
      },
    });
  };

  const handleResetRow = (rowId) => {
    setDrafts((prev) => {
      const next = { ...prev };
      delete next[rowId];
      return next;
    });
  };

  const mergedRows = useMemo(
    () =>
      stock.map((item) => ({
        ...item,
        draftCantidad: drafts[item.id]?.cantidadIdeal,
        draftReposicion: drafts[item.id]?.puntoReposicion,
      })),
    [stock, drafts]
  );

  return (
    <StockIdealTableView
      rows={mergedRows}
      loading={isLoading || isFetching}
      productosLoading={productosLoading}
      isError={isError}
      onRetry={refetch}
      productLookup={productLookup}
      onValueChange={handleDraftChange}
      onSaveRow={handleSaveRow}
      onResetRow={handleResetRow}
      savingId={updateMutation.isLoading ? updateMutation.variables?.stockId : null}
      sedeNombre={sedeNombre}
    />
  );
};

export default StockIdealManager;
