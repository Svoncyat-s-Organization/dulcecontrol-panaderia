import { useMemo, useState } from 'react';
import { App } from 'antd';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import InventarioInsumosTableView from './InventarioInsumosTableView.jsx';
import { getInventarioInsumos, updateUbicacionInventarioInsumo } from '../../api/insumos-inventario.api.js';
import { deleteInsumo, desactivarInsumo, reactivarInsumo } from '../../../compras/api/insumos.api.js';
import { INVENTARIO_INSUMO_KEYS } from '../../constants/queryKeys.js';
import AjusteInsumoModal from '../AjusteInsumoModal/index.jsx';
import AgregarInsumoModal from '../AgregarInsumoModal/index.jsx';

const InventarioInsumosTable = ({ tiendaId, sedeId }) => {
  const { message, modal } = App.useApp();
  const queryClient = useQueryClient();
  const [registroSeleccionado, setRegistroSeleccionado] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalAgregarAbierto, setModalAgregarAbierto] = useState(false);

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

  const ubicacionMutation = useMutation({
    mutationFn: ({ inventarioId, ubicacion }) =>
      updateUbicacionInventarioInsumo(tiendaId, inventarioId, ubicacion),
    onSuccess: () => {
      message.success('Ubicación actualizada');
      queryClient.invalidateQueries({ queryKey: INVENTARIO_INSUMO_KEYS.lists(tiendaId, sedeId) });
    },
    onError: (error) => {
      const detail = error?.response?.data?.message ?? error?.response?.data?.mensaje ?? error?.message ?? 'No se pudo actualizar la ubicación';
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

  const deleteMutation = useMutation({
    mutationFn: (insumoId) => deleteInsumo(tiendaId, insumoId),
    onSuccess: () => {
      message.success('Insumo eliminado correctamente');
      queryClient.invalidateQueries({ queryKey: INVENTARIO_INSUMO_KEYS.lists(tiendaId, sedeId) });
    },
    onError: (error, insumoId) => {
      const detail = error?.response?.data?.message ?? error?.response?.data?.mensaje ?? error?.message ?? 'No se pudo eliminar el insumo';
      
      // Ofrecer desactivar como alternativa
      modal.confirm({
        title: 'No se puede eliminar',
        content: (
          <div>
            <p>{detail}</p>
            <p style={{ marginTop: 12 }}>¿Desea desactivar el insumo en su lugar? Podrá reactivarlo después si lo necesita.</p>
          </div>
        ),
        okText: 'Desactivar',
        okType: 'primary',
        cancelText: 'Cancelar',
        onOk: () => {
          desactivarMutation.mutate(insumoId);
        },
      });
    },
  });

  const desactivarMutation = useMutation({
    mutationFn: (insumoId) => desactivarInsumo(tiendaId, insumoId),
    onSuccess: () => {
      message.success('Insumo desactivado correctamente');
      queryClient.invalidateQueries({ queryKey: INVENTARIO_INSUMO_KEYS.lists(tiendaId, sedeId) });
    },
    onError: (error) => {
      const detail = error?.response?.data?.message ?? error?.response?.data?.mensaje ?? error?.message ?? 'No se pudo desactivar el insumo';
      message.error(detail);
    },
  });

  const reactivarMutation = useMutation({
    mutationFn: (insumoId) => reactivarInsumo(tiendaId, insumoId),
    onSuccess: () => {
      message.success('Insumo reactivado correctamente');
      queryClient.invalidateQueries({ queryKey: INVENTARIO_INSUMO_KEYS.lists(tiendaId, sedeId) });
    },
    onError: (error) => {
      const detail = error?.response?.data?.message ?? error?.response?.data?.mensaje ?? error?.message ?? 'No se pudo reactivar el insumo';
      message.error(detail);
    },
  });

  const manejarEliminar = (insumoId) => {
    deleteMutation.mutate(insumoId);
  };

  const manejarReactivar = (insumoId) => {
    reactivarMutation.mutate(insumoId);
  };

  const manejarAjuste = (registro) => {
    setRegistroSeleccionado(registro);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setRegistroSeleccionado(null);
  };

  const abrirModalAgregar = () => {
    setModalAgregarAbierto(true);
  };

  const cerrarModalAgregar = () => {
    setModalAgregarAbierto(false);
  };

  return (
    <>
      <InventarioInsumosTableView
        insumos={inventarios}
        loading={isLoading}
        isError={isError}
        onRetry={refetch}
        onAdjust={manejarAjuste}
        onAgregar={abrirModalAgregar}
        onUpdateUbicacion={manejarActualizarUbicacion}
        onDelete={manejarEliminar}
        onReactivar={manejarReactivar}
        sedeId={sedeId}
      />

      <AjusteInsumoModal
        open={modalAbierto}
        onClose={cerrarModal}
        tiendaId={tiendaId}
        sedeId={sedeId}
        registro={registroSeleccionado}
      />

      <AgregarInsumoModal
        open={modalAgregarAbierto}
        onClose={cerrarModalAgregar}
        tiendaId={tiendaId}
        sedeId={sedeId}
      />
    </>
  );
};

export default InventarioInsumosTable;
