import { useMemo, useState } from 'react';
import { message } from 'antd';
import { useQuery } from '@tanstack/react-query';
import InventarioInsumosTableView from './InventarioInsumosTableView.jsx';
import { getInventarioInsumos } from '../../api/insumos-inventario.api.js';
import { INVENTARIO_INSUMO_KEYS } from '../../constants/queryKeys.js';
import AjusteInsumoModal from '../AjusteInsumoModal/index.jsx';

const InventarioInsumosTable = ({ tiendaId, sedeId }) => {
  const [registroSeleccionado, setRegistroSeleccionado] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  const {
    data = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: INVENTARIO_INSUMO_KEYS.lists(tiendaId, sedeId),
    queryFn: () =>
      getInventarioInsumos(tiendaId, sedeId).catch((error) => {
        message.error(
          error?.response?.data?.message ?? 'No se pudo obtener el inventario de insumos'
        );
        throw error;
      }),
    enabled: Boolean(tiendaId && sedeId),
    select: (response) => response ?? [],
  });

  const inventarios = useMemo(() => data, [data]);

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
      <InventarioInsumosTableView
        insumos={inventarios}
        loading={isLoading}
        isError={isError}
        onRetry={refetch}
        onAdjust={manejarAjuste}
        sedeId={sedeId}
      />

      <AjusteInsumoModal
        open={modalAbierto}
        onClose={cerrarModal}
        tiendaId={tiendaId}
        sedeId={sedeId}
        registro={registroSeleccionado}
      />
    </>
  );
};

export default InventarioInsumosTable;
