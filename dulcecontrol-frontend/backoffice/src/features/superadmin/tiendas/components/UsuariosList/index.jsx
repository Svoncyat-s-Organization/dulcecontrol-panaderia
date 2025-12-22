import React, { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { getUsuariosByTiendaId, deleteUsuario } from '../../../../../api/superadmin/usuarios';
import UsuariosList from './UsuariosList';

const UsuariosListContainer = ({ tiendaId, onCreate, onEdit }) => {
    const queryClient = useQueryClient();
    const [searchText, setSearchText] = useState('');

    const { data: usuarios, isLoading } = useQuery({
        queryKey: ['usuarios', tiendaId],
        queryFn: () => getUsuariosByTiendaId(tiendaId),
        enabled: !!tiendaId,
    });

    const deleteMutation = useMutation({
        mutationFn: (usuarioId) => deleteUsuario(tiendaId, usuarioId),
        onSuccess: () => {
            message.success('Usuario eliminado correctamente');
            queryClient.invalidateQueries({ queryKey: ['usuarios', tiendaId] });
        },
        onError: (error) => {
            console.error(error);
            const backendMessage = error?.response?.data?.message || error?.response?.data?.error;
            message.error(backendMessage || 'No se pudo eliminar el usuario. Intenta nuevamente.');
        },
    });

    const mappedUsuarios = useMemo(() => (
        (usuarios ?? []).map((usuario) => ({
            ...usuario,
            nombres: usuario.nombres ?? usuario.nombre ?? '',
            correo: usuario.correo ?? usuario.email ?? '',
            rolId: usuario.rolId ?? usuario.rol?.id ?? null,
            rolNombre: usuario.rolNombre ?? usuario.rol?.nombre ?? '',
            tipoDoc: usuario.tipoDoc ?? usuario.tipo_doc ?? '',
            numeroDoc: usuario.numeroDoc ?? usuario.numero_doc ?? '',
            telefono: usuario.telefono ?? usuario.telefono_contacto ?? '',
            sedeIds: usuario.sedeIds
                ?? usuario.sedesIds
                ?? (usuario.sedeId ? [usuario.sedeId] : []),
            activo: usuario.activo ?? (usuario.estado !== undefined ? usuario.estado === 'ACTIVO' : true),
            creadoEn: usuario.creadoEn ?? usuario.creado_en ?? null,
        }))
    ), [usuarios]);

    const filteredUsuarios = useMemo(() => {
        const normalized = searchText.trim().toLowerCase();
        if (!normalized) {
            return mappedUsuarios;
        }

        return mappedUsuarios.filter((usuario) =>
            (usuario.nombres || '').toLowerCase().includes(normalized) ||
            (usuario.correo || '').toLowerCase().includes(normalized) ||
            (usuario.numeroDoc || '').includes(normalized)
        );
    }, [mappedUsuarios, searchText]);

    const handleDelete = (usuarioId) => {
        deleteMutation.mutate(usuarioId);
    };

    return (
        <UsuariosList
            usuarios={filteredUsuarios}
            loading={isLoading}
            onCreate={onCreate}
            onEdit={onEdit}
            onDelete={handleDelete}
            searchText={searchText}
            setSearchText={setSearchText}
            isDeleting={deleteMutation.isPending}
        />
    );
};

export default UsuariosListContainer;
