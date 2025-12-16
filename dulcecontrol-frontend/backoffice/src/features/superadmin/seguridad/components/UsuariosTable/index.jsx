import { useMemo, useState } from 'react';
import { App, message } from 'antd';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import UsuariosTableView from './UsuariosTableView.jsx';
import UsuarioForm from '../UsuarioForm/index.jsx';
import {
  getSuperadminUsuarios,
  deleteSuperadminUsuario,
} from '../../api/seguridad.api.js';
import { SUPERADMIN_SEGURIDAD_KEYS } from '../../constants/queryKeys.js';
import { SUPERADMIN_TIPO_DOCUMENTO_OPTIONS } from '../../constants/options.js';

const UsuariosTable = () => {
  const queryClient = useQueryClient();
  const [searchText, setSearchText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState(null);

  const { modal } = App.useApp();

  const usuariosQuery = useQuery({
    queryKey: SUPERADMIN_SEGURIDAD_KEYS.usuarios(),
    queryFn: () => getSuperadminUsuarios(),
  });

  const deleteMutation = useMutation({
    mutationFn: (usuarioId) => deleteSuperadminUsuario(usuarioId),
    onSuccess: () => {
      message.success('Superadmin eliminado correctamente');
      queryClient.invalidateQueries({ queryKey: SUPERADMIN_SEGURIDAD_KEYS.usuarios() });
    },
    onError: (error) => {
      const detail = error?.response?.data?.message ?? error?.message ?? 'No se pudo eliminar al superadmin';
      message.error(detail);
    },
  });

  const usuarios = useMemo(() => usuariosQuery.data ?? [], [usuariosQuery.data]);

  const filteredUsuarios = useMemo(() => {
    if (!searchText.trim()) return usuarios;
    const normalized = searchText.trim().toLowerCase();
    return usuarios.filter((usuario) =>
      [
        usuario.nombres,
        usuario.correo,
        usuario.numeroDoc,
        ...((usuario.roles ?? []).map((rol) => rol.nombre) ?? []),
      ]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalized)),
    );
  }, [usuarios, searchText]);

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
      title: '¿Eliminar superadmin?',
      content: `Se eliminará el acceso de "${usuario.nombres}" al panel corporativo.`,
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

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({ queryKey: SUPERADMIN_SEGURIDAD_KEYS.usuarios() });
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
      />

      <UsuarioForm
        open={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleFormSuccess}
        usuario={selectedUsuario}
        tipoDocumentoOptions={SUPERADMIN_TIPO_DOCUMENTO_OPTIONS}
      />
    </>
  );
};

export default UsuariosTable;
