import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient, useQueries } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { getTiendas, deleteTienda } from '../../../../../api/superadmin/tiendas';
import { getDominiosByTiendaId } from '../../../../../api/superadmin/dominios';
import TiendasList from './TiendasList';

const normalizeDominios = (dominios) => (
    (dominios ?? []).map((dominio) => ({
        ...dominio,
        urlDominio: dominio.urlDominio ?? dominio.url_dominio ?? '',
        tipo: (dominio.tipo ?? dominio.tipoDominio ?? dominio.tipo_dominio ?? '').toString().toUpperCase(),
    }))
);

const TiendasListContainer = ({ onEdit, onCreate }) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState('');

    const { data: tiendas, isLoading } = useQuery({
        queryKey: ['tiendas'],
        queryFn: getTiendas,
    });

    const dominiosQueries = useQueries({
        queries: (tiendas ?? []).map((tienda) => ({
            queryKey: ['dominios', tienda.id],
            queryFn: () => getDominiosByTiendaId(tienda.id),
            enabled: Boolean(tienda?.id),
            staleTime: 5 * 60 * 1000,
        })),
    });

    const ultimaAlertaErrorRef = useRef(null);

    useEffect(() => {
        const queryConError = dominiosQueries.find((query) => query?.isError);
        if (!queryConError?.error) {
            return;
        }

        if (ultimaAlertaErrorRef.current === queryConError.error) {
            return;
        }

        ultimaAlertaErrorRef.current = queryConError.error;
        const backendMessage = queryConError.error?.response?.data?.message;
        message.error(backendMessage || 'No se pudieron cargar algunos dominios.');
    }, [dominiosQueries]);

    const deleteMutation = useMutation({
        mutationFn: deleteTienda,
        onSuccess: () => {
            message.success('Tienda eliminada correctamente');
            queryClient.invalidateQueries({ queryKey: ['tiendas'] });
        },
        onError: () => {
            message.error('No se pudo eliminar la tienda. Intenta nuevamente más tarde.');
        },
    });

    const handleDelete = (id) => {
        deleteMutation.mutate(id);
    };

    const filteredTiendas = useMemo(() => {
        if (!tiendas) {
            return [];
        }

        const normalizedSearch = searchText.trim().toLowerCase();
        if (!normalizedSearch) {
            return tiendas;
        }

        return tiendas.filter((tienda) =>
            tienda.nombreComercial?.toLowerCase().includes(normalizedSearch) ||
            tienda.numeroDoc?.includes(normalizedSearch)
        );
    }, [tiendas, searchText]);

    const dominiosStatusById = useMemo(() => {
        if (!tiendas) {
            return {};
        }

        return tiendas.reduce((acc, tienda, index) => {
            const query = dominiosQueries[index];
            acc[tienda.id] = {
                data: query?.data ?? null,
                isPending: Boolean(query?.isFetching || query?.isLoading),
            };
            return acc;
        }, {});
    }, [tiendas, dominiosQueries]);

    const tiendasConDominios = useMemo(() => (
        filteredTiendas.map((tienda) => {
            const status = dominiosStatusById[tienda.id] ?? {};
            return {
                ...tienda,
                dominios: normalizeDominios(status.data),
                dominiosLoading: status.isPending,
            };
        })
    ), [filteredTiendas, dominiosStatusById]);

    const handleViewSedes = (tiendaId) => {
        navigate(`/superadmin/tiendas/${tiendaId}/sedes`);
    };

    const handleViewDominios = (tiendaId) => {
        navigate(`/superadmin/tiendas/${tiendaId}/dominios`);
    };

    const handleViewUsuarios = (tiendaId) => {
        navigate(`/superadmin/tiendas/${tiendaId}/usuarios`);
    };

    return (
        <TiendasList
            tiendas={tiendasConDominios}
            loading={isLoading}
            onEdit={onEdit}
            onCreate={onCreate}
            onDelete={handleDelete}
            onViewSedes={handleViewSedes}
            onViewDominios={handleViewDominios}
            onViewUsuarios={handleViewUsuarios}
            searchText={searchText}
            setSearchText={setSearchText}
        />
    );
};

export default TiendasListContainer;
