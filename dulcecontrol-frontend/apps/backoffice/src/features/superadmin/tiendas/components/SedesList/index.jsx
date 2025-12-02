import React, { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSedesByTiendaId, deleteSede } from '../../../../../api/superadmin/sedes';
import SedesList from './SedesList';
import { message } from 'antd';

const SedesListContainer = ({ tiendaId, onEdit, onCreate }) => {
    const queryClient = useQueryClient();

    const { data: sedes, isLoading } = useQuery({
        queryKey: ['sedes', tiendaId],
        queryFn: () => getSedesByTiendaId(tiendaId),
        enabled: !!tiendaId,
    });

    const mappedSedes = useMemo(() => (
        (sedes ?? []).map((sede) => ({
            ...sede,
            codigoInterno: sede.codigoInterno ?? sede['codigo_interno'] ?? null,
            esPrincipal: sede.esPrincipal ?? sede['es_principal'] ?? false,
            activo: sede.activo === undefined ? true : Boolean(sede.activo),
        }))
    ), [sedes]);

    const deleteMutation = useMutation({
        mutationFn: (sedeId) => deleteSede(tiendaId, sedeId),
        onSuccess: () => {
            message.success('Sede eliminada correctamente');
            queryClient.invalidateQueries(['sedes', tiendaId]);
        },
        onError: () => {
            message.error('Error al eliminar la sede');
        },
    });

    const handleDelete = (sedeId) => {
        deleteMutation.mutate(sedeId);
    };

    return (
        <SedesList
            sedes={mappedSedes}
            loading={isLoading}
            onEdit={onEdit}
            onCreate={onCreate}
            onDelete={handleDelete}
        />
    );
};

export default SedesListContainer;
