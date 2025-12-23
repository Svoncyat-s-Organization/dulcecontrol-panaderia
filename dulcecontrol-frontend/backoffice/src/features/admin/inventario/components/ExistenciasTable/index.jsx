import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { App } from 'antd';
import ExistenciasTableView from './ExistenciasTableView.jsx';
import { getInventarioProductosPorSede, updateUbicacionInventarioProducto } from '../../api/existencias.api.js';
import { INVENTARIO_PRODUCTO_KEYS } from '../../constants/queryKeys.js';
import AjusteInventarioModal from '../AjusteInventarioModal/index.jsx';
import { getProductos } from '../../../catalogo/api/productos.api.js';

const ExistenciasTable = ({ tiendaId, sedeId }) => {
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  const [registroSeleccionado, setRegistroSeleccionado] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  const {
    data = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: INVENTARIO_PRODUCTO_KEYS.lists(tiendaId, sedeId),
    queryFn: () =>
      getInventarioProductosPorSede(tiendaId, sedeId).catch((error) => {
        message.error(
          error?.response?.data?.message ?? 'No se pudo obtener el inventario de productos'
        );
        throw error;
      }),
    enabled: Boolean(tiendaId && sedeId),
    select: (response) => response ?? [],
  });

  const productosQuery = useQuery({
    queryKey: ['catalogo-productos', tiendaId],
    queryFn: () =>
      getProductos(tiendaId).catch((error) => {
        message.error(
          error?.response?.data?.message ?? 'No se pudo obtener el catálogo de productos'
        );
        throw error;
      }),
    enabled: Boolean(tiendaId),
    staleTime: 60 * 1000,
    select: (response) => response ?? [],
  });

  const inventarios = useMemo(() => {
    const productos = productosQuery.data ?? [];
    const imagenPorProductoId = new Map(
      productos.map((producto) => [String(producto.id), producto.urlImagenPrincipal ?? null])
    );

    return (data ?? []).map((registro) => ({
      ...registro,
      imagenUrl: imagenPorProductoId.get(String(registro.productoId)) ?? null,
    }));
  }, [data, productosQuery.data]);

  const ubicacionMutation = useMutation({
    mutationFn: ({ inventarioId, ubicacion }) =>
      updateUbicacionInventarioProducto(tiendaId, inventarioId, ubicacion),
    onSuccess: () => {
      message.success('Ubicación actualizada');
      queryClient.invalidateQueries({ queryKey: INVENTARIO_PRODUCTO_KEYS.lists(tiendaId, sedeId) });
    },
    onError: (error) => {
      const detail = error?.response?.data?.mensaje ?? error?.message ?? 'No se pudo actualizar la ubicación';
      message.error(detail);
    },
  });

  const manejarActualizarUbicacion = async (inventarioId, ubicacion) => {
    try {
      await ubicacionMutation.mutateAsync({ inventarioId, ubicacion });
      return true;
    } catch {
      return false;
    }
  };

  const manejarAjuste = (registro) => {
    setRegistroSeleccionado(registro);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setRegistroSeleccionado(null);
  };

  return (
    <>
      <ExistenciasTableView
        inventarios={inventarios}
        loading={isLoading}
        isError={isError}
        onRetry={refetch}
        onAdjust={manejarAjuste}
        onUpdateUbicacion={manejarActualizarUbicacion}
        sedeId={sedeId}
      />

      <AjusteInventarioModal
        open={modalAbierto}
        onClose={cerrarModal}
        tiendaId={tiendaId}
        sedeId={sedeId}
        registro={registroSeleccionado}
      />
    </>
  );
};

export default ExistenciasTable;
