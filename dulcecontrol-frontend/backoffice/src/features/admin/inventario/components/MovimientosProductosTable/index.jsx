import { useMemo } from 'react';
import { message } from 'antd';
import { useQueries, useQuery } from '@tanstack/react-query';
import MovimientosProductosTableView from './MovimientosProductosTableView.jsx';
import { getMovimientosProductos } from '../../api/movimientos.api.js';
import { INVENTARIO_MOVIMIENTO_KEYS } from '../../constants/queryKeys.js';
import { getUsuarios } from '../../../seguridad/api/seguridad.api.js';
import { getPedidoById } from '../../../ventas-pedidos/api/pedidos.api.js';

const MovimientosProductosTable = ({ tiendaId, sedeId }) => {
  const { data: usuarios = [] } = useQuery({
    queryKey: ['usuarios', tiendaId],
    queryFn: () => getUsuarios(tiendaId),
    enabled: Boolean(tiendaId),
    staleTime: 1000 * 60 * 5,
  });

  const usuariosMap = useMemo(() => {
    const map = new Map();
    (usuarios || []).forEach((usuario) => {
      const nombre =
        usuario.nombreCompleto ||
        `${usuario.nombres || ''} ${usuario.apellidos || ''}`.trim() ||
        usuario.correo ||
        `Usuario ${usuario.id}`;
      map.set(usuario.id, nombre);
    });
    return map;
  }, [usuarios]);

  const {
    data = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: INVENTARIO_MOVIMIENTO_KEYS.productos.lists(tiendaId, sedeId),
    queryFn: () =>
      getMovimientosProductos(tiendaId, sedeId).catch((error) => {
        message.error(
          error?.response?.data?.message ?? 'No se pudo obtener los movimientos de productos'
        );
        throw error;
      }),
    enabled: Boolean(tiendaId && sedeId),
    select: (response) =>
      (response ?? [])
        .slice()
        .sort((a, b) => new Date(b.creadoEn).getTime() - new Date(a.creadoEn).getTime()),
  });

  const pedidoIdsACompletar = useMemo(() => {
    const ids = new Set();
    (data || []).forEach((mov) => {
      if (!mov?.usuarioResponsable && mov?.pedidoId) {
        ids.add(mov.pedidoId);
      }
    });
    // Evitamos disparar demasiadas consultas si hay muchos movimientos antiguos.
    return Array.from(ids).slice(0, 30);
  }, [data]);

  const pedidosQueries = useQueries({
    queries: pedidoIdsACompletar.map((pedidoId) => ({
      queryKey: ['pedido', tiendaId, pedidoId],
      queryFn: () => getPedidoById(tiendaId, pedidoId),
      enabled: Boolean(tiendaId && pedidoId),
      staleTime: 1000 * 60 * 5,
      retry: 1,
    })),
  });

  const pedidosMap = useMemo(() => {
    const map = new Map();
    pedidosQueries.forEach((q) => {
      if (q?.data?.id) {
        map.set(q.data.id, q.data);
      }
    });
    return map;
  }, [pedidosQueries]);

  const movimientos = useMemo(() => {
    if (!data) return [];

    return data.map((mov) => {
      if (!mov) return mov;
      if (mov.usuarioResponsable) return mov;

      // 1) Si el backend mandó responsableId pero no el nombre, resolvemos desde usuarios.
      if (mov.responsableId) {
        const nombre = usuariosMap.get(mov.responsableId);
        return nombre ? { ...mov, usuarioResponsable: nombre } : mov;
      }

      // 2) Si es un movimiento generado por un pedido, inferimos responsable desde vendedorId del pedido.
      if (mov.pedidoId) {
        const pedido = pedidosMap.get(mov.pedidoId);
        const vendedorId = pedido?.vendedorId;
        const nombre = vendedorId ? usuariosMap.get(vendedorId) : null;
        return nombre ? { ...mov, usuarioResponsable: nombre } : mov;
      }

      return mov;
    });
  }, [data, pedidosMap, usuariosMap]);

  return (
    <MovimientosProductosTableView
      movimientos={movimientos}
      loading={isLoading}
      isError={isError}
      sedeId={sedeId}
      onRetry={refetch}
    />
  );
};

export default MovimientosProductosTable;
