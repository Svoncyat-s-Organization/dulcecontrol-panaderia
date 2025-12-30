import { useMemo, useState } from 'react';
import { message } from 'antd';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import TransferenciasTableView from './TransferenciasTableView.jsx';
import TransferenciaModal from '../TransferenciaModal/TransferenciaModal.jsx';
import { getTransferencias, createTransferencia, cambiarEstadoTransferencia, recibirTransferencia } from '../../api/transferencias.api.js';
import { getSedesAsignadas } from '../../../configuracion/api/sedes.api.js';
import { getUsuarioSedes } from '../../../seguridad/api/seguridad.api.js';
import { getProductos } from '../../../catalogo/api/productos.api.js';
import { getInsumos } from '../../../compras/api/insumos.api.js';
import { getInventarioProductosPorSede } from '../../api/existencias.api.js';
import { getInventarioInsumos } from '../../api/insumos-inventario.api.js';
import { useTokenStore } from '../../../../../shared/store/tokenStore.js';
import { useAuthorizationStore } from '../../../../../shared/store/authorizationStore.js';
import TransferenciaRecepcionModal from '../TransferenciaRecepcionModal/TransferenciaRecepcionModal.jsx';
import TransferenciaItemsModal from '../TransferenciaItemsModal/TransferenciaItemsModal.jsx';

const TRANSFERENCIA_KEYS = {
  lists: (tiendaId) => ['inventario-transferencias', tiendaId],
};

const normalizeAllowedSedes = (sedes, usuarioSedes, canSeeAll) => {
  if (!Array.isArray(sedes) || !sedes.length) {
    return [];
  }

  const allowedIds = new Set((usuarioSedes ?? []).map((s) => s.sedeId));
  const hasAssignments = allowedIds.size > 0;
  const enforce = !canSeeAll && hasAssignments;

  return enforce ? sedes.filter((s) => allowedIds.has(s.id)) : sedes;
};

const TransferenciasTable = ({ tiendaId, sedeOrigenId }) => {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [recepcionOpen, setRecepcionOpen] = useState(false);
  const [selectedTransferencia, setSelectedTransferencia] = useState(null);
  const [itemsOpen, setItemsOpen] = useState(false);
  const [itemsTransferencia, setItemsTransferencia] = useState(null);

  const activeSedeId = useMemo(() => {
    const n = Number(sedeOrigenId);
    return Number.isFinite(n) && n > 0 ? n : null;
  }, [sedeOrigenId]);

  const user = useTokenStore((state) => state.user);
  const usuario = useAuthorizationStore((state) => state.usuario);
  const role = useAuthorizationStore((state) => state.role);
  const permissions = useAuthorizationStore((state) => state.permissions);

  const resolvedUserIdRaw = usuario?.id ?? user?.id ?? null;
  const resolvedUserId = Number.isFinite(Number(resolvedUserIdRaw)) && Number(resolvedUserIdRaw) > 0
    ? Number(resolvedUserIdRaw)
    : null;

  const normalizedRoleName = role?.nombre ? role.nombre.trim().toLowerCase() : '';
  const ADMIN_ROLE_NAMES = ['administrador', 'administradora', 'administrador general', 'administrador global'];
  const isAdminRole = ADMIN_ROLE_NAMES.includes(normalizedRoleName);
  const canSeeAllSedes = isAdminRole || (permissions ?? []).some((p) => String(p?.slug ?? '').includes('config.sedes'));

  const { data: transferencias = [], isLoading, isError, refetch } = useQuery({
    queryKey: TRANSFERENCIA_KEYS.lists(tiendaId),
    queryFn: () => getTransferencias(tiendaId),
    enabled: Boolean(tiendaId),
    select: (data) => data ?? [],
  });

  const { data: sedes = [] } = useQuery({
    queryKey: ['admin', 'configuracion', 'sedes', tiendaId],
    queryFn: () => getSedesAsignadas(tiendaId),
    enabled: Boolean(tiendaId),
    staleTime: 5 * 60 * 1000,
  });

  const { data: usuarioSedes = [] } = useQuery({
    queryKey: ['admin', 'seguridad', 'usuario-sedes', tiendaId, resolvedUserIdRaw],
    queryFn: () => getUsuarioSedes(tiendaId, resolvedUserIdRaw),
    enabled: Boolean(tiendaId && resolvedUserIdRaw),
    staleTime: 5 * 60 * 1000,
  });

  const allowedSedes = useMemo(
    () => normalizeAllowedSedes(sedes, usuarioSedes, canSeeAllSedes),
    [sedes, usuarioSedes, canSeeAllSedes]
  );

  const sedeOrigen = useMemo(
    () => (allowedSedes ?? []).find((s) => Number(s.id) === activeSedeId) ?? (sedes ?? []).find((s) => Number(s.id) === activeSedeId) ?? null,
    [allowedSedes, sedes, activeSedeId]
  );

  const sedesDestino = useMemo(
    () => (allowedSedes ?? []).filter((s) => Number(s.id) !== activeSedeId),
    [allowedSedes, activeSedeId]
  );

  const createDisabledReason = useMemo(() => {
    if (!Array.isArray(sedes) || sedes.length <= 1) {
      return 'Necesitas al menos 2 sedes para realizar transferencias.';
    }
    if (!sedesDestino.length) {
      return 'No hay sedes destino disponibles.';
    }
    return null;
  }, [sedes, sedesDestino]);

  const { data: productos = [] } = useQuery({
    queryKey: ['catalogo', 'productos', tiendaId],
    queryFn: () => getProductos(tiendaId),
    enabled: Boolean(tiendaId),
    select: (data) => data ?? [],
    staleTime: 5 * 60 * 1000,
  });

  const { data: insumos = [] } = useQuery({
    queryKey: ['compras', 'insumos', tiendaId],
    queryFn: () => getInsumos(tiendaId),
    enabled: Boolean(tiendaId),
    select: (data) => data ?? [],
    staleTime: 5 * 60 * 1000,
  });

  // Inventario de productos de la sede origen
  const { data: inventarioProductos = [] } = useQuery({
    queryKey: ['inventario', 'productos', 'sede', tiendaId, activeSedeId],
    queryFn: () => getInventarioProductosPorSede(tiendaId, activeSedeId),
    enabled: Boolean(tiendaId && activeSedeId),
    select: (data) => data ?? [],
    staleTime: 2 * 60 * 1000, // 2 minutos - el stock cambia frecuentemente
  });

  // Inventario de insumos de la sede origen
  const { data: inventarioInsumos = [] } = useQuery({
    queryKey: ['inventario', 'insumos', 'sede', tiendaId, activeSedeId],
    queryFn: () => getInventarioInsumos(tiendaId, activeSedeId),
    enabled: Boolean(tiendaId && activeSedeId),
    select: (data) => data ?? [],
    staleTime: 2 * 60 * 1000, // 2 minutos
  });

  const createMutation = useMutation({
    mutationFn: (payload) => createTransferencia(tiendaId, payload),
    onSuccess: () => {
      message.success('Transferencia creada');
      queryClient.invalidateQueries({ queryKey: TRANSFERENCIA_KEYS.lists(tiendaId) });
      // Invalidar inventario porque el stock cambió
      queryClient.invalidateQueries({ queryKey: ['inventario', 'productos', 'sede', tiendaId, activeSedeId] });
      queryClient.invalidateQueries({ queryKey: ['inventario', 'insumos', 'sede', tiendaId, activeSedeId] });
      setModalOpen(false);
    },
    onError: (error) => {
      const detail = error?.response?.data?.message ?? error?.message ?? 'No se pudo crear la transferencia';
      message.error(detail);
    },
  });

  const changeEstadoMutation = useMutation({
    mutationFn: ({ transferenciaId, nuevoEstado }) =>
      cambiarEstadoTransferencia(tiendaId, transferenciaId, nuevoEstado),
    onSuccess: () => {
      message.success('Estado actualizado');
      queryClient.invalidateQueries({ queryKey: TRANSFERENCIA_KEYS.lists(tiendaId) });
    },
    onError: (error) => {
      const detail = error?.response?.data?.message ?? error?.message ?? 'No se pudo actualizar el estado';
      message.error(detail);
    },
  });

  const receiveMutation = useMutation({
    mutationFn: ({ transferenciaId, payload }) => recibirTransferencia(tiendaId, transferenciaId, payload),
    onSuccess: () => {
      message.success('Transferencia recibida');
      queryClient.invalidateQueries({ queryKey: TRANSFERENCIA_KEYS.lists(tiendaId) });
      setRecepcionOpen(false);
      setSelectedTransferencia(null);
    },
    onError: (error) => {
      const detail = error?.response?.data?.message ?? error?.message ?? 'No se pudo recibir la transferencia';
      message.error(detail);
    },
  });

  const handleCreate = () => {
    if (!sedesDestino.length) {
      message.warning('No hay sedes destino disponibles');
      return;
    }
    setModalOpen(true);
  };

  const handleSubmit = (values) => {
    createMutation.mutate(values);
  };

  const handleChangeEstado = (record, nuevoEstado) => {
    if (!record?.id) {
      return;
    }

    const normalized = String(nuevoEstado ?? '').toUpperCase();
    if (normalized === 'EN_TRANSITO' && Number(record.sedeOrigenId) !== activeSedeId) {
      message.warning('Para enviar, debes estar en la sede de origen de la transferencia');
      return;
    }

    // Recibir se gestiona con modal para cantidades recibidas
    if (normalized === 'RECIBIDO') {
      setSelectedTransferencia(record);
      setRecepcionOpen(true);
      return;
    }

    changeEstadoMutation.mutate({ transferenciaId: record.id, nuevoEstado });
  };

  const handleOpenRecepcion = (record) => {
    if (!record?.id) return;
    if (Number(record.sedeDestinoId) !== activeSedeId) {
      message.warning('Para recibir, debes estar en la sede de destino de la transferencia');
      return;
    }
    setSelectedTransferencia(record);
    setRecepcionOpen(true);
  };

  const handleOpenItems = (record) => {
    if (!record?.id) return;
    setItemsTransferencia(record);
    setItemsOpen(true);
  };

  return (
    <>
      <TransferenciasTableView
        transferencias={transferencias}
        loading={isLoading}
        isError={isError}
        onRetry={refetch}
        sedes={sedes}
        sedeOrigenId={sedeOrigenId}
        productos={productos}
        insumos={insumos}
        onCreate={handleCreate}
        createDisabled={Boolean(createDisabledReason)}
        createDisabledReason={createDisabledReason}
        onChangeEstado={handleChangeEstado}
        onOpenRecepcion={handleOpenRecepcion}
        onOpenItems={handleOpenItems}
        changingId={changeEstadoMutation.variables?.transferenciaId ?? null}
      />

      <TransferenciaModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        loading={createMutation.isPending}
        onSubmit={handleSubmit}
        sedesDestino={sedesDestino}
        sedeOrigenId={sedeOrigenId}
        sedeOrigenNombre={sedeOrigen?.nombre ?? null}
        userId={resolvedUserId}
        productos={productos}
        insumos={insumos}
        inventarioProductos={inventarioProductos}
        inventarioInsumos={inventarioInsumos}
      />

      <TransferenciaRecepcionModal
        open={recepcionOpen}
        onClose={() => {
          if (receiveMutation.isPending) return;
          setRecepcionOpen(false);
          setSelectedTransferencia(null);
        }}
        loading={receiveMutation.isPending}
        transferencia={selectedTransferencia}
        userId={resolvedUserId}
        productos={productos}
        insumos={insumos}
        onSubmit={(payload) => {
          if (!selectedTransferencia?.id) return;
          receiveMutation.mutate({ transferenciaId: selectedTransferencia.id, payload });
        }}
      />

      <TransferenciaItemsModal
        open={itemsOpen}
        onClose={() => {
          setItemsOpen(false);
          setItemsTransferencia(null);
        }}
        transferencia={itemsTransferencia}
        productos={productos}
        insumos={insumos}
      />
    </>
  );
};

export default TransferenciasTable;
