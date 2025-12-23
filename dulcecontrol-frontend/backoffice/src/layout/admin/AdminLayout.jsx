import { useEffect, useMemo, useState } from 'react';
import { Button, Result, Space, Spin, theme, message } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { IconLogout, IconRefresh } from '@tabler/icons-react';
import { useTokenStore } from '../../shared/store/tokenStore.js';
import SedeSelector from '../../shared/components/SedeSelector.jsx';
import SubscriptionStatusIndicator from '../../shared/components/SubscriptionStatusIndicator.jsx';
import PerfilModal from '../../shared/components/PerfilModal.jsx';
import MainLayout from '../shared/MainLayout.jsx';
import { buildInitials, buildPreferredName } from '../../shared/utils/nameUtils.js';
import { useAuthorizationStore } from '../../shared/store/authorizationStore.js';
import { buildAdminMenuItems } from '../../shared/permissions/adminPermissionConfig.js';
import { getPermisos, getRol, getUsuario } from '../../features/admin/seguridad/api/seguridad.api.js';
import { perfilApi } from '../../api/admin/perfil.js';
import { SEGURIDAD_KEYS } from '../../features/admin/seguridad/constants/queryKeys.js';
import { createPermissionSet } from '../../shared/utils/permissionUtils.js';
import { DEV_AUTH_TOKEN, DEV_PERMISSION_SLUGS } from '../../shared/constants/devAuth.js';
import {
  ADMIN_ALLOWED_PATHS_BY_PROFILE,
  getPresentationProfile,
} from '../../shared/config/presentationProfiles.js';
import { filterMenuItemsByAllowedPaths } from '../../shared/utils/menuFilter.js';

const BASE_PATH = '/admin';

const AdminLayout = () => {
  const logout = useTokenStore((state) => state.logout);
  const user = useTokenStore((state) => state.user);
  const tiendaId = useTokenStore((state) => state.tiendaId);
  const userId = useTokenStore((state) => state.user?.id);
  const tokenValue = useTokenStore((state) => state.token);
  const isDevToken = tokenValue === DEV_AUTH_TOKEN;
  const setAuthContext = useAuthorizationStore((state) => state.setContext);
  const setAuthLoading = useAuthorizationStore((state) => state.setLoading);
  const permissions = useAuthorizationStore((state) => state.permissions);
  const isAuthLoading = useAuthorizationStore((state) => state.isLoading);
  const { token: themeToken } = theme.useToken();
  const queryClient = useQueryClient();
  const [perfilModalOpen, setPerfilModalOpen] = useState(false);

  const perfilQuery = useQuery({
    queryKey: ['admin', 'perfil', 'me'],
    queryFn: perfilApi.obtenerMiPerfil,
    enabled: perfilModalOpen && !isDevToken,
    staleTime: 60 * 1000,
  });

  const actualizarPerfilMutation = useMutation({
    mutationFn: perfilApi.actualizarMiPerfil,
    onSuccess: () => {
      message.success('Perfil actualizado correctamente');
      queryClient.invalidateQueries({ queryKey: ['admin', 'perfil', 'me'] });
      queryClient.invalidateQueries({ queryKey: SEGURIDAD_KEYS.usuario(tiendaId, userId) });
      setPerfilModalOpen(false);
    },
    onError: (error) => {
      const errorMsg = error?.response?.data?.message || 'Error al actualizar el perfil';
      message.error(errorMsg);
    },
  });

  const permisosQuery = useQuery({
    queryKey: SEGURIDAD_KEYS.permisos(),
    queryFn: getPermisos,
    enabled: !isDevToken,
    staleTime: 5 * 60 * 1000,
  });

  const usuarioQuery = useQuery({
    queryKey: SEGURIDAD_KEYS.usuario(tiendaId, userId),
    queryFn: () => getUsuario(tiendaId, userId),
    enabled: !isDevToken && Boolean(tiendaId && userId),
    staleTime: 60 * 1000,
  });

  const rolId = usuarioQuery.data?.rolId;

  const rolQuery = useQuery({
    queryKey: SEGURIDAD_KEYS.rol(tiendaId, rolId),
    queryFn: () => getRol(tiendaId, rolId),
    enabled: !isDevToken && Boolean(tiendaId && rolId),
    staleTime: 60 * 1000,
  });

  const authError = !isDevToken && (permisosQuery.error || usuarioQuery.error || rolQuery.error);

  useEffect(() => {
    if (isDevToken) {
      setAuthLoading(false);
      return;
    }
    const loading = permisosQuery.isLoading || usuarioQuery.isLoading || rolQuery.isLoading;
    setAuthLoading(loading);
  }, [
    isDevToken,
    permisosQuery.isLoading,
    usuarioQuery.isLoading,
    rolQuery.isLoading,
    setAuthLoading,
  ]);

  useEffect(() => {
    if (!isDevToken) {
      return;
    }
    setAuthContext({
      permissions: createPermissionSet(DEV_PERMISSION_SLUGS),
      role: null,
      usuario: null,
    });
  }, [isDevToken, setAuthContext]);

  useEffect(() => {
    if (isDevToken) {
      return;
    }

    if (!tiendaId || !userId) {
      setAuthContext({ permissions: null, role: null, usuario: null });
      return;
    }

    if (rolQuery.data && permisosQuery.data) {
      const permisosMap = new Map(permisosQuery.data.map((permiso) => [permiso.id, permiso.slug]));
      const slugs = Array.from(rolQuery.data.permisos ?? [])
        .map((permisoId) => permisosMap.get(permisoId))
        .filter(Boolean);
      setAuthContext({
        permissions: createPermissionSet(slugs),
        role: rolQuery.data,
        usuario: usuarioQuery.data ?? null,
      });
    } else if (!rolQuery.isLoading && !permisosQuery.isLoading && (rolQuery.isError || permisosQuery.isError)) {
      setAuthContext({ permissions: createPermissionSet([]), role: null, usuario: usuarioQuery.data ?? null });
    }
  }, [
    tiendaId,
    userId,
    rolQuery.data,
    rolQuery.isLoading,
    rolQuery.isError,
    permisosQuery.data,
    permisosQuery.isLoading,
    permisosQuery.isError,
    usuarioQuery.data,
    isDevToken,
    setAuthContext,
  ]);

  const profileMenuItems = useMemo(
    () => [
      { key: 'profile', label: 'Mi perfil' },
      { type: 'divider' },
      { key: 'logout', label: 'Cerrar sesión', icon: <IconLogout size={16} /> },
    ],
    []
  );

  const handleProfileClick = ({ key }) => {
    if (key === 'logout') {
      logout();
    } else if (key === 'profile') {
      setPerfilModalOpen(true);
    }
  };

  const dynamicMenuItems = useMemo(() => {
    const items = buildAdminMenuItems(permissions);
    const profile = getPresentationProfile();
    const allowedPaths = ADMIN_ALLOWED_PATHS_BY_PROFILE[profile];
    return filterMenuItemsByAllowedPaths(items, allowedPaths);
  }, [permissions]);

  if (!isDevToken && (!tiendaId || !userId)) {
    return (
      <Result
        status="warning"
        title="No pudimos cargar la tienda activa"
        subTitle="Vuelve a iniciar sesión para recuperar tus accesos."
      />
    );
  }

  if (authError) {
    const detail = authError?.response?.data?.message ?? authError?.message ?? 'Error al cargar permisos.';
    const handleRetry = () => {
      permisosQuery.refetch();
      usuarioQuery.refetch();
      if (rolId) {
        rolQuery.refetch();
      }
    };
    return (
      <Result
        status="error"
        title="No se pudieron cargar los permisos del usuario"
        subTitle={detail}
        extra={
          <Button type="primary" onClick={handleRetry} icon={<IconRefresh size={16} />}>Reintentar</Button>
        }
      />
    );
  }

  const fullName = user?.nombre_completo || user?.nombre || user?.name || '';
  const profileName = buildPreferredName(fullName) || user?.sub || 'Administrador';
  const profileInitials = buildInitials(profileName, user?.sub || 'Administrador');

  const headerExtras = (
    <Space size={12} align="center">
      <SubscriptionStatusIndicator />
      <SedeSelector />
      {isAuthLoading && <Spin size="small" />}
    </Space>
  );

  return (
    <>
      <MainLayout
        basePath={BASE_PATH}
        menuItems={dynamicMenuItems}
        headerTitle="Panel Administrativo"
        brandLabel="DulceControl Admin"
        profileMenu={{ items: profileMenuItems, onClick: handleProfileClick }}
        profileName={profileName}
        profileInitials={profileInitials}
        headerExtras={headerExtras}
        footerText="DulceControl Admin ©2025"
        headerStyle={{ borderBottom: `2px solid ${themeToken.colorPrimary}` }}
      />
      
      <PerfilModal
        open={perfilModalOpen}
        onClose={() => setPerfilModalOpen(false)}
        perfil={perfilQuery.data}
        onSubmit={(values) => actualizarPerfilMutation.mutate(values)}
        loading={actualizarPerfilMutation.isPending}
        isAdmin={true}
      />
    </>
  );
};

export default AdminLayout;
