import { useMemo } from 'react';
import { message } from 'antd';
import { useQuery } from '@tanstack/react-query';
import MovimientosInsumosTableView from './MovimientosInsumosTableView.jsx';
import { getMovimientosInsumos } from '../../api/movimientos.api.js';
import { INVENTARIO_MOVIMIENTO_KEYS } from '../../constants/queryKeys.js';
import { getUsuarios } from '../../../seguridad/api/seguridad.api.js';

const MovimientosInsumosTable = ({ tiendaId, sedeId }) => {
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
    queryKey: INVENTARIO_MOVIMIENTO_KEYS.insumos.lists(tiendaId, sedeId),
    queryFn: () =>
      getMovimientosInsumos(tiendaId, sedeId).catch((error) => {
        message.error(
          error?.response?.data?.message ?? 'No se pudo obtener los movimientos de insumos'
        );
        throw error;
      }),
    enabled: Boolean(tiendaId && sedeId),
    select: (response) =>
      (response ?? [])
        .slice()
        .sort((a, b) => new Date(b.creadoEn).getTime() - new Date(a.creadoEn).getTime()),
  });

  const movimientos = useMemo(() => {
    if (!data) return [];
    return data.map((mov) => {
      if (!mov) return mov;
      if (mov.usuarioResponsable) return mov;
      if (mov.responsableId) {
        const nombre = usuariosMap.get(mov.responsableId);
        return nombre ? { ...mov, usuarioResponsable: nombre } : mov;
      }
      return mov;
    });
  }, [data, usuariosMap]);

  return (
    <MovimientosInsumosTableView
      movimientos={movimientos}
      loading={isLoading}
      isError={isError}
      sedeId={sedeId}
      onRetry={refetch}
    />
  );
};

export default MovimientosInsumosTable;
