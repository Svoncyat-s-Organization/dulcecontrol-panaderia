import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { message } from 'antd';
import ExistenciasTableView from './ExistenciasTableView.jsx';
import { getInventarioProductos } from '../../api/existencias.api.js';
import { INVENTARIO_PRODUCTO_KEYS } from '../../constants/queryKeys.js';
import AjusteInventarioModal from '../AjusteInventarioModal/index.jsx';

const ExistenciasTable = ({ tiendaId, sedeId }) => {
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
      getInventarioProductos(tiendaId, sedeId ? { sedeId } : undefined).catch((error) => {
        message.error(
          error?.response?.data?.message ?? 'No se pudo obtener el inventario de productos'
        );
        throw error;
      }),
    enabled: Boolean(tiendaId),
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
      <ExistenciasTableView
        inventarios={inventarios}
        loading={isLoading}
        isError={isError}
        onRetry={refetch}
        onAdjust={manejarAjuste}
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
