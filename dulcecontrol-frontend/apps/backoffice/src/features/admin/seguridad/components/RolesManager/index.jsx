import { useMemo, useState } from 'react';
import { Modal, message } from 'antd';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import RolesManagerView from './RolesManagerView.jsx';
import RolPermisosDrawer from './RolPermisosDrawer.jsx';
import RolForm from '../RolForm/index.jsx';
import { useTokenStore } from '../../../../../shared/store/tokenStore.js';
import { useAuthorizationStore } from '../../../../../shared/store/authorizationStore.js';
import { deleteRol, getPermisos, getRoles } from '../../api/seguridad.api.js';
import { SEGURIDAD_KEYS } from '../../constants/queryKeys.js';
import { DEV_AUTH_TOKEN, DEV_PERMISSIONS_CATALOG, DEV_ROLES_FIXTURES } from '../../../../../shared/constants/devAuth.js';

const RolesManager = () => {
  const tiendaId = useTokenStore((state) => state.tiendaId);
  const token = useTokenStore((state) => state.token);
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRol, setSelectedRol] = useState(null);
  const [drawerRol, setDrawerRol] = useState(null);
  const currentRoleId = useAuthorizationStore((state) => state.role?.id);
  const currentUserId = useTokenStore((state) => state.user?.id);
  const isDevToken = token === DEV_AUTH_TOKEN;

  const rolesQuery = useQuery({
    queryKey: SEGURIDAD_KEYS.roles(tiendaId),
    queryFn: () => getRoles(tiendaId),
    enabled: Boolean(tiendaId) && !isDevToken,
  });

  const permisosQuery = useQuery({
    queryKey: SEGURIDAD_KEYS.permisos(),
    queryFn: () => getPermisos(),
    enabled: !isDevToken,
    staleTime: 5 * 60 * 1000,
  });

  const deleteMutation = useMutation({
    mutationFn: (rolId) => deleteRol(tiendaId, rolId),
    onSuccess: () => {
      message.success('Rol eliminado correctamente');
      queryClient.invalidateQueries({ queryKey: SEGURIDAD_KEYS.roles(tiendaId) });
    },
    onError: (error) => {
      const detail = error?.response?.data?.message ?? error?.message ?? 'No se pudo eliminar el rol';
      message.error(detail);
    },
  });

  const roles = useMemo(() => {
    if (isDevToken) {
      return DEV_ROLES_FIXTURES;
    }
    return rolesQuery.data ?? [];
  }, [isDevToken, rolesQuery.data]);

  const permisos = useMemo(() => {
    if (isDevToken) {
      return DEV_PERMISSIONS_CATALOG;
    }
    return permisosQuery.data ?? [];
  }, [isDevToken, permisosQuery.data]);

  const loading = isDevToken ? false : rolesQuery.isLoading || rolesQuery.isFetching;
  const isError = isDevToken ? false : rolesQuery.isError;

  const handleCreate = () => {
    if (isDevToken) {
      message.info('La gestion de roles esta deshabilitada en modo desarrollo.');
      return;
    }
    setSelectedRol(null);
    setIsFormOpen(true);
  };

  const handleEdit = (rol) => {
    if (isDevToken) {
      message.info('La gestion de roles esta deshabilitada en modo desarrollo.');
      return;
    }
    setSelectedRol(rol);
    setIsFormOpen(true);
  };

  const handleDelete = (rol) => {
    if (isDevToken) {
      message.info('La gestion de roles esta deshabilitada en modo desarrollo.');
      return;
    }
    if (rol.esSistema) {
      message.warning('No puedes eliminar un rol del sistema');
      return;
    }

    Modal.confirm({
      title: '¿Eliminar rol?',
      content: `Se eliminará el rol "${rol.nombre}" y sus asignaciones.`,
      okText: 'Eliminar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk: () => deleteMutation.mutate(rol.id),
    });
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedRol(null);
  };

  const handleFormSuccess = (response) => {
    const updatedRoleId = response?.id ?? selectedRol?.id ?? null;
    queryClient.invalidateQueries({ queryKey: SEGURIDAD_KEYS.roles(tiendaId) });
    if (updatedRoleId) {
      queryClient.invalidateQueries({ queryKey: SEGURIDAD_KEYS.rol(tiendaId, updatedRoleId) });
      if (currentRoleId && updatedRoleId === currentRoleId && currentUserId) {
        queryClient.invalidateQueries({ queryKey: SEGURIDAD_KEYS.usuario(tiendaId, currentUserId) });
      }
    }
    setIsFormOpen(false);
    setSelectedRol(null);
  };

  const handleViewPermissions = (rol) => {
    setDrawerRol(rol);
  };

  const handleCloseDrawer = () => {
    setDrawerRol(null);
  };

  return (
    <>
      <RolesManagerView
        roles={roles}
        permisos={permisos}
        loading={loading}
        isError={isError}
        onRetry={rolesQuery.refetch}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onViewPermissions={handleViewPermissions}
        deletingId={deleteMutation.isPending ? deleteMutation.variables : null}
      />

      <RolForm
        open={isDevToken ? false : isFormOpen}
        onClose={handleCloseForm}
        onSuccess={handleFormSuccess}
        tiendaId={tiendaId}
        rol={selectedRol}
        permisos={permisos}
      />

      <RolPermisosDrawer
        open={Boolean(drawerRol)}
        onClose={handleCloseDrawer}
        rol={drawerRol}
        permisosCatalog={permisos}
      />
    </>
  );
};

export default RolesManager;
