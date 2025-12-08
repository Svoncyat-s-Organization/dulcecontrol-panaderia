import { useMemo, useState } from 'react';
import { Modal, message } from 'antd';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import RolesManagerView from './RolesManagerView.jsx';
import RolPermisosDrawer from './RolPermisosDrawer.jsx';
import RolForm from '../RolForm/index.jsx';
import {
  getSuperadminRoles,
  getSuperadminPermisos,
  deleteSuperadminRol,
} from '../../api/seguridad.api.js';
import { SUPERADMIN_SEGURIDAD_KEYS } from '../../constants/queryKeys.js';

const RolesManager = () => {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRol, setSelectedRol] = useState(null);
  const [drawerRol, setDrawerRol] = useState(null);

  const rolesQuery = useQuery({
    queryKey: SUPERADMIN_SEGURIDAD_KEYS.roles(),
    queryFn: getSuperadminRoles,
  });

  const permisosQuery = useQuery({
    queryKey: SUPERADMIN_SEGURIDAD_KEYS.permisos(),
    queryFn: getSuperadminPermisos,
    staleTime: 10 * 60 * 1000,
  });

  const deleteMutation = useMutation({
    mutationFn: (rolId) => deleteSuperadminRol(rolId),
    onSuccess: () => {
      message.success('Rol eliminado correctamente');
      queryClient.invalidateQueries({ queryKey: SUPERADMIN_SEGURIDAD_KEYS.roles() });
    },
    onError: (error) => {
      const detail = error?.response?.data?.message ?? error?.message ?? 'No se pudo eliminar el rol';
      message.error(detail);
    },
  });

  const roles = useMemo(() => rolesQuery.data ?? [], [rolesQuery.data]);
  const permisos = useMemo(() => permisosQuery.data ?? [], [permisosQuery.data]);

  const handleCreate = () => {
    setSelectedRol(null);
    setIsFormOpen(true);
  };

  const handleEdit = (rol) => {
    setSelectedRol(rol);
    setIsFormOpen(true);
  };

  const handleDelete = (rol) => {
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

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({ queryKey: SUPERADMIN_SEGURIDAD_KEYS.roles() });
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
        loading={rolesQuery.isLoading || rolesQuery.isFetching}
        isError={rolesQuery.isError}
        onRetry={rolesQuery.refetch}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onViewPermissions={handleViewPermissions}
        deletingId={deleteMutation.isPending ? deleteMutation.variables : null}
      />

      <RolForm
        open={isFormOpen}
        onClose={handleCloseForm}
        onSuccess={handleFormSuccess}
        rol={selectedRol}
        permisos={permisos}
        loadingPermisos={permisosQuery.isLoading}
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
