import { useEffect, useMemo, useRef } from 'react';
import { Button, Empty, Select, Spin, Typography, message } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { getSedesAsignadas } from '../../features/admin/configuracion/api/sedes.api.js';
import { getUsuarioSedes } from '../../features/admin/seguridad/api/seguridad.api.js';
import { useTokenStore } from '../store/tokenStore.js';
import { useSedeStore } from '../store/sedeStore.js';
import { useAuthorizationStore } from '../store/authorizationStore.js';
import { hasAnyPermission } from '../utils/permissionUtils.js';

const selectStyle = {
  minWidth: 240,
  borderRadius: 12,
};

const ADMIN_ROLE_NAMES = ['administrador', 'administradora', 'administrador general', 'administrador global'];

const SedeSelector = () => {
  const tiendaId = useTokenStore((state) => state.tiendaId);
  const user = useTokenStore((state) => state.user);
  const selectedSedeId = useSedeStore((state) => state.selectedSedeId);
  const selectedSedeNombre = useSedeStore((state) => state.selectedSedeNombre);
  const selectionTiendaId = useSedeStore((state) => state.selectedTiendaId);
  const setSelectedSede = useSedeStore((state) => state.setSelectedSede);
  const clearSelection = useSedeStore((state) => state.clearSelection);
  const permissions = useAuthorizationStore((state) => state.permissions);
  const role = useAuthorizationStore((state) => state.role);
  const usuario = useAuthorizationStore((state) => state.usuario);

  const normalizedRoleName = role?.nombre ? role.nombre.trim().toLowerCase() : '';
  const isAdminRole = ADMIN_ROLE_NAMES.includes(normalizedRoleName);
  const canChangeSede = isAdminRole || hasAnyPermission(permissions, ['config.sedes']);
  const resolvedUsuarioId = usuario?.id ?? user?.id ?? null;

  const {
    data: sedes = [],
    isLoading: sedesLoading,
    isError: isSedesError,
    refetch: refetchSedes,
  } = useQuery({
    queryKey: ['admin', 'configuracion', 'sedes', tiendaId],
    queryFn: () => getSedesAsignadas(tiendaId),
    enabled: Boolean(tiendaId),
    staleTime: 5 * 60 * 1000,
  });

  const shouldFetchAssignments = Boolean(tiendaId && resolvedUsuarioId);

  const {
    data: usuarioSedes = [],
    isLoading: usuarioSedesLoading,
    isFetching: usuarioSedesFetching,
    isError: isUsuarioSedesError,
    refetch: refetchUsuarioSedes,
  } = useQuery({
    queryKey: ['admin', 'seguridad', 'usuario-sedes', tiendaId, resolvedUsuarioId],
    queryFn: () => getUsuarioSedes(tiendaId, resolvedUsuarioId),
    enabled: shouldFetchAssignments,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (!tiendaId) {
      clearSelection();
      return;
    }
    if (selectionTiendaId && selectionTiendaId !== tiendaId) {
      clearSelection();
    }
  }, [tiendaId, selectionTiendaId, clearSelection]);

  const assignmentsReady = !shouldFetchAssignments || (!usuarioSedesLoading && !usuarioSedesFetching);
  const allowedSedeIdsList = useMemo(
    () => usuarioSedes.map((item) => item.sedeId),
    [usuarioSedes]
  );
  const assignmentsCount = allowedSedeIdsList.length;
  const hasAssignments = assignmentsCount > 0;
  const enforceAssignments = assignmentsReady && hasAssignments;
  const hasNoAssignments = assignmentsReady && !hasAssignments && Boolean(resolvedUsuarioId);
  const isAssignmentsLoading = shouldFetchAssignments && !assignmentsReady;

  const assignedPrincipalId = useMemo(() => {
    const principalAssignment = usuarioSedes.find((item) => item.esSedePrincipal);
    return principalAssignment?.sedeId ?? null;
  }, [usuarioSedes]);

  const lastSuccessfulSelectionRef = useRef({
    sedeId: selectedSedeId,
    sedeNombre: selectedSedeNombre,
  });

  useEffect(() => {
    if (!tiendaId) {
      if (selectedSedeId) {
        clearSelection();
      }
      return;
    }

    if (sedesLoading || isAssignmentsLoading) {
      return;
    }

    if (!sedes.length) {
      if (selectedSedeId) {
        clearSelection();
      }
      return;
    }

    const allowedSet = new Set(allowedSedeIdsList);
    const availableSedes = enforceAssignments ? sedes.filter((sede) => allowedSet.has(sede.id)) : sedes;

    if (!availableSedes.length) {
      if (selectedSedeId) {
        clearSelection();
      }
      return;
    }

    const current = availableSedes.find((sede) => sede.id === selectedSedeId);
    const principalOption = assignedPrincipalId && allowedSet.has(assignedPrincipalId)
      ? availableSedes.find((sede) => sede.id === assignedPrincipalId) ?? null
      : null;

    if (current) {
      const shouldAlignWithPrincipal =
        !canChangeSede && principalOption && current.id !== principalOption.id;

      if (shouldAlignWithPrincipal) {
        setSelectedSede({ sedeId: principalOption.id, sedeNombre: principalOption.nombre, tiendaId });
        lastSuccessfulSelectionRef.current = {
          sedeId: principalOption.id,
          sedeNombre: principalOption.nombre,
        };
        return;
      }

      if (current.nombre !== selectedSedeNombre) {
        setSelectedSede({ sedeId: current.id, sedeNombre: current.nombre, tiendaId });
      }
      lastSuccessfulSelectionRef.current = {
        sedeId: current.id,
        sedeNombre: current.nombre,
      };
      return;
    }

    let preferred = null;

    if (principalOption) {
      preferred = principalOption;
    } else if (enforceAssignments) {
      preferred = availableSedes.find((sede) => sede.esPrincipal) ?? availableSedes[0] ?? null;
    }

    if (!preferred) {
      preferred = availableSedes[0] ?? null;
    }

    if (preferred) {
      setSelectedSede({ sedeId: preferred.id, sedeNombre: preferred.nombre, tiendaId });
      lastSuccessfulSelectionRef.current = {
        sedeId: preferred.id,
        sedeNombre: preferred.nombre,
      };
    } else if (selectedSedeId) {
      clearSelection();
    }
  }, [
    assignedPrincipalId,
    allowedSedeIdsList,
    clearSelection,
    enforceAssignments,
    isAssignmentsLoading,
    sedes,
    sedesLoading,
    selectedSedeId,
    selectedSedeNombre,
    setSelectedSede,
    tiendaId,
  ]);

  const options = useMemo(() => {
    const allowedSet = new Set(allowedSedeIdsList);
    return sedes.map((sede) => ({
      label: sede.nombre,
      value: sede.id,
      sede,
      disabled: enforceAssignments && !allowedSet.has(sede.id),
    }));
  }, [allowedSedeIdsList, enforceAssignments, sedes]);

  const handleChange = (nextSedeId) => {
    if (!canChangeSede) {
      return;
    }

    const allowedSet = new Set(allowedSedeIdsList);

    if (enforceAssignments && !allowedSet.has(nextSedeId)) {
      const previous = lastSuccessfulSelectionRef.current;
      if (previous?.sedeId) {
        setSelectedSede({
          sedeId: previous.sedeId,
          sedeNombre: previous.sedeNombre,
          tiendaId,
        });
      }
      message.warning('No tienes acceso a esa sede. Solicita permisos a un administrador.');
      return;
    }

    const nextSede = sedes.find((sede) => sede.id === nextSedeId);
    if (!nextSede) {
      clearSelection();
      return;
    }
    setSelectedSede({ sedeId: nextSede.id, sedeNombre: nextSede.nombre, tiendaId });
    lastSuccessfulSelectionRef.current = {
      sedeId: nextSede.id,
      sedeNombre: nextSede.nombre,
    };
  };

  const isLoadingAny = sedesLoading || isAssignmentsLoading;
  const notFoundContent = isLoadingAny ? (
    <div style={{ padding: '8px', textAlign: 'center' }}>
      <Spin size="small" />
    </div>
  ) : (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={hasNoAssignments ? 'Sin sedes disponibles' : tiendaId ? 'Sin sedes asignadas' : 'Selecciona una tienda'}
    />
  );

  const availableCount = enforceAssignments ? assignmentsCount : sedes.length;
  const hasSingleAvailableSede = availableCount === 1;
  const showDisabledState =
    !tiendaId || !sedes.length || hasSingleAvailableSede || hasNoAssignments;

  const helperMessages = [];
  if (!canChangeSede) {
    helperMessages.push('Solo un administrador puede cambiar la sede activa.');
  }
  if (hasNoAssignments) {
    helperMessages.push('No tienes sedes habilitadas. Solicita acceso a un administrador.');
  } else if (hasSingleAvailableSede && canChangeSede) {
    helperMessages.push('Solo cuentas con esta sede asignada.');
  }

  const displayLabel =
    selectedSedeNombre || (selectedSedeId ? options.find((opt) => opt.value === selectedSedeId)?.label : undefined);

  const hasError = isSedesError || (shouldFetchAssignments && isUsuarioSedesError);

  const handleRetry = () => {
    if (isSedesError) {
      refetchSedes();
    }
    if (shouldFetchAssignments && isUsuarioSedesError && Boolean(tiendaId && resolvedUsuarioId)) {
      refetchUsuarioSedes();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Select
        value={displayLabel ? { label: displayLabel, value: selectedSedeId } : undefined}
        labelInValue
        onChange={(option) => handleChange(option?.value)}
        options={options}
        placeholder={tiendaId ? 'Selecciona una sede' : 'Selecciona una tienda'}
        style={selectStyle}
        popupMatchSelectWidth={false}
        variant="filled"
        loading={isLoadingAny}
        disabled={showDisabledState || !canChangeSede || isAssignmentsLoading}
        notFoundContent={notFoundContent}
        status={hasError ? 'error' : undefined}
        optionRender={(option) => (
          <div style={{ display: 'flex', flexDirection: 'column', opacity: option.data.disabled ? 0.6 : 1 }}>
            <span>{option.data.label}</span>
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              {option.data.sede?.direccion ?? 'Sin dirección configurada'}
            </Typography.Text>
          </div>
        )}
      />
      {hasError && (
        <Typography.Text type="danger" style={{ fontSize: 12 }}>
          Error al cargar sedes asignadas.{' '}
          <Button type="link" size="small" onClick={handleRetry} style={{ padding: 0 }}>
            Reintentar
          </Button>
        </Typography.Text>
      )}
      {!hasError && helperMessages.map((message) => (
        <Typography.Text key={message} type="secondary" style={{ fontSize: 12 }}>
          {message}
        </Typography.Text>
      ))}
    </div>
  );
};

export default SedeSelector;
