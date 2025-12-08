import React, { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDominiosByTiendaId, deleteDominio } from '../../../../../api/superadmin/dominios';
import DominiosList from './DominiosList';
import { message } from 'antd';

const DominiosListContainer = ({ tiendaId, onEdit, onCreate }) => {
    const queryClient = useQueryClient();

    const { data: dominios, isLoading } = useQuery({
        queryKey: ['dominios', tiendaId],
        queryFn: () => getDominiosByTiendaId(tiendaId),
        enabled: !!tiendaId,
    });

    const mappedDominios = useMemo(() => (
        (dominios ?? []).map((dominio) => ({
            ...dominio,
            urlDominio: dominio.urlDominio ?? dominio.url_dominio ?? '',
            urlLogo: dominio.urlLogo ?? dominio.url_logo ?? null,
            urlFavicon: dominio.urlFavicon ?? dominio.url_favicon ?? null,
            colorPrimario: dominio.colorPrimario ?? dominio.color_primario ?? '#040316',
            colorSecundario: dominio.colorSecundario ?? dominio.color_secundario ?? '#f5f5f5',
            tipo: (dominio.tipo ?? dominio.tipoDominio ?? dominio.tipo_dominio ?? 'TIENDA_VIRTUAL').toString().toUpperCase(),
        }))
    ), [dominios]);

    const deleteMutation = useMutation({
        mutationFn: (dominioId) => deleteDominio(tiendaId, dominioId),
        onSuccess: () => {
            message.success('Dominio eliminado correctamente');
            queryClient.invalidateQueries(['dominios', tiendaId]);
        },
        onError: () => {
            message.error('Error al eliminar el dominio');
        },
    });

    const handleDelete = (dominioId) => {
        deleteMutation.mutate(dominioId);
    };

    return (
        <DominiosList
            dominios={mappedDominios}
            loading={isLoading}
            onEdit={onEdit}
            onCreate={onCreate}
            onDelete={handleDelete}
        />
    );
};

export default DominiosListContainer;
