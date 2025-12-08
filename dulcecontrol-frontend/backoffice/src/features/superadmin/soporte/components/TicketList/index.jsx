import React, { useEffect, useMemo, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { getTickets } from '../../../../../api/superadmin/soporte/tickets.js';
import { getTiendas } from '../../../../../api/superadmin/tiendas.js';
import TicketList from './TicketList.jsx';

const TicketListContainer = ({
    filters,
    searchTerm,
    selectedTicketId,
    onSelect,
    onCreate,
}) => {
    const queryClient = useQueryClient();
    const ultimaAlertaRef = useRef(null);

    const { data: tiendas } = useQuery({
        queryKey: ['tiendas'],
        queryFn: getTiendas,
        staleTime: 5 * 60 * 1000,
    });

    const {
        data: tickets,
        isLoading,
        refetch,
        error,
    } = useQuery({
        queryKey: ['superadmin', 'soporte', 'tickets', filters],
        queryFn: () => getTickets(filters),
        keepPreviousData: true,
    });

    useEffect(() => {
        if (!error) {
            ultimaAlertaRef.current = null;
            return;
        }

        if (ultimaAlertaRef.current === error) {
            return;
        }

        ultimaAlertaRef.current = error;
        const backendMessage = error?.response?.data?.message;
        message.error(backendMessage || 'No se pudieron cargar los tickets de soporte.');
    }, [error]);

    const tiendaPorId = useMemo(() => (
        (tiendas ?? []).reduce((acc, tienda) => {
            if (!tienda?.id) {
                return acc;
            }
            acc[tienda.id] = tienda;
            return acc;
        }, {})
    ), [tiendas]);

    const filteredTickets = useMemo(() => {
        const list = tickets ?? [];
        if (!searchTerm?.trim()) {
            return list;
        }

        const normalized = searchTerm.trim().toLowerCase();
        return list.filter((ticket) => (
            ticket?.asunto?.toLowerCase().includes(normalized)
            || ticket?.id?.toString().includes(normalized)
        ));
    }, [tickets, searchTerm]);

    const mappedTickets = useMemo(() => (
        [...filteredTickets]
            .sort((a, b) => {
                const fechaA = a?.creadoEn ? new Date(a.creadoEn).getTime() : 0;
                const fechaB = b?.creadoEn ? new Date(b.creadoEn).getTime() : 0;
                return fechaB - fechaA;
            })
            .map((ticket) => ({
                ...ticket,
                tiendaNombre: tiendaPorId[ticket.tiendaId]?.nombreComercial ?? '—',
            }))
    ), [filteredTickets, tiendaPorId]);

    const handleRefresh = () => {
        queryClient.invalidateQueries({ queryKey: ['superadmin', 'soporte', 'tickets'] });
        refetch();
    };

    return (
        <TicketList
            tickets={mappedTickets}
            loading={isLoading}
            onSelect={onSelect}
            selectedTicketId={selectedTicketId}
            onCreate={onCreate}
            onRefresh={handleRefresh}
        />
    );
};

export default TicketListContainer;
