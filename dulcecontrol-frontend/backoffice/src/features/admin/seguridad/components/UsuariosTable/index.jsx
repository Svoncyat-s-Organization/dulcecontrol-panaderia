import { useEffect, useMemo, useState } from 'react';
import { App, message } from 'antd';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import UsuariosTableView from './UsuariosTableView.jsx';
import UsuarioForm from '../UsuarioForm/index.jsx';
import { useTokenStore } from '../../../../../shared/store/tokenStore.js';
import { getRoles, getUsuarios, deleteUsuario, getSedes } from '../../api/seguridad.api.js';
import { SEGURIDAD_KEYS } from '../../constants/queryKeys.js';
import { TIPO_DOCUMENTO_OPTIONS } from '../../constants/options.js';

const UsuariosTable = () => {
  const tiendaId = useTokenStore((state) => state.tiendaId);
  const queryClient = useQueryClient();
  const [searchText, setSearchText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [usuariosData, setUsuariosData] = useState([]);
  const [showInactiveOnly, setShowInactiveOnly] = useState(false);

  const { modal } = App.useApp();

  const usuariosQuery = useQuery({
    queryKey: SEGURIDAD_KEYS.usuarios(tiendaId),
    queryFn: () => getUsuarios(tiendaId),
    enabled: Boolean(tiendaId),
  });

  const rolesQuery = useQuery({
    queryKey: SEGURIDAD_KEYS.roles(tiendaId),
    queryFn: () => getRoles(tiendaId),
    enabled: Boolean(tiendaId),
    staleTime: 5 * 60 * 1000,
  });

  const sedesQuery = useQuery({
    queryKey: SEGURIDAD_KEYS.sedes(tiendaId),
    queryFn: () => getSedes(tiendaId),
    enabled: Boolean(tiendaId),
    staleTime: 5 * 60 * 1000,
  });

  const deleteMutation = useMutation({
    mutationFn: (usuarioId) => deleteUsuario(tiendaId, usuarioId),
    onSuccess: () => {
      message.success('Usuario eliminado correctamente');
      queryClient.invalidateQueries({ queryKey: SEGURIDAD_KEYS.usuarios(tiendaId) });
    },
    onError: (error) => {
      const detail = error?.response?.data?.message ?? error?.message ?? 'No se pudo eliminar al usuario';
      message.error(detail);
    },
  });

  useEffect(() => {
    if (Array.isArray(usuariosQuery.data)) {
      setUsuariosData(usuariosQuery.data);
    }
  }, [usuariosQuery.data]);

  const usuarios = useMemo(() => usuariosData ?? [], [usuariosData]);
  const roles = useMemo(() => rolesQuery.data ?? [], [rolesQuery.data]);
  const sedes = useMemo(() => sedesQuery.data ?? [], [sedesQuery.data]);

  const filteredUsuarios = useMemo(() => {
    const base = usuarios.filter((usuario) => {
      const isActive = usuario.activo === true;
      return showInactiveOnly ? !isActive : isActive;
    });

    if (!searchText.trim()) {
      return base;
    }

    const normalized = searchText.trim().toLowerCase();
    return base.filter((usuario) => {
      const sedesTexto = Array.isArray(usuario.sedes)
        ? usuario.sedes.filter(Boolean).join(' ')
        : usuario.sedeNombre;

      return [
        usuario.nombres,
        usuario.correo,
        usuario.numeroDoc,
        usuario.rolNombre,
        sedesTexto,
      ]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalized));
    });
  }, [usuarios, searchText, showInactiveOnly]);

  const deletingId = deleteMutation.isPending ? deleteMutation.variables : null;

  const handleCreate = () => {
    setSelectedUsuario(null);
    setIsModalOpen(true);
  };

  const handleEdit = (usuario) => {
    setSelectedUsuario(usuario);
    setIsModalOpen(true);
  };

  const handleDelete = (usuario) => {
    modal.confirm({
      title: '¿Eliminar usuario?',
      content: `Se eliminará al usuario "${usuario.nombres}" y perderá acceso al sistema.`,
      okText: 'Eliminar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk: () => deleteMutation.mutate(usuario.id),
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUsuario(null);
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleToggleInactive = () => {
    setShowInactiveOnly((current) => !current);
  };

  const handleFormSuccess = (updatedUsuario, { isEditing } = {}) => {
    if (updatedUsuario) {
      setUsuariosData((current) => {
        if (!Array.isArray(current)) {
          return current;
        }

        if (isEditing) {
          return current.map((item) =>
            item.id === updatedUsuario.id ? { ...item, ...updatedUsuario } : item
          );
        }

        if (current.some((item) => item.id === updatedUsuario.id)) {
          return current;
        }

        return [updatedUsuario, ...current];
      });
    }

    queryClient.invalidateQueries({ queryKey: SEGURIDAD_KEYS.usuarios(tiendaId) });
    setIsModalOpen(false);
    setSelectedUsuario(null);
  };

  return (
    <>
      <UsuariosTableView
        usuarios={filteredUsuarios}
        loading={usuariosQuery.isLoading || usuariosQuery.isFetching}
        isError={usuariosQuery.isError}
        onRetry={usuariosQuery.refetch}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSearch={handleSearch}
        searchText={searchText}
        deletingId={deletingId}
        rolesLoading={rolesQuery.isLoading}
        rolesReady={roles.length > 0}
        sedesLoading={sedesQuery.isLoading}
        sedesReady={sedes.length > 0}
        showInactiveOnly={showInactiveOnly}
        onToggleInactive={handleToggleInactive}
      />

      <UsuarioForm
        open={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleFormSuccess}
        tiendaId={tiendaId}
        usuario={selectedUsuario}
        roles={roles}
        sedes={sedes}
        sedesLoading={sedesQuery.isLoading}
        tipoDocumentoOptions={TIPO_DOCUMENTO_OPTIONS}
      />
    </>
  );
};

export default UsuariosTable;
