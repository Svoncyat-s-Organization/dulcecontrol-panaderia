import { useMemo } from 'react';
import { message } from 'antd';
import { useQuery } from '@tanstack/react-query';
import MovimientosInsumosTableView from './MovimientosInsumosTableView.jsx';
import { getMovimientosInsumos } from '../../api/movimientos.api.js';
import { INVENTARIO_MOVIMIENTO_KEYS } from '../../constants/queryKeys.js';

const MovimientosInsumosTable = ({ tiendaId, sedeId }) => {
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

  const movimientos = useMemo(() => data, [data]);

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
