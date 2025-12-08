import React, { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { getTicketById, updateTicket } from '../../../../../api/superadmin/soporte/tickets.js';
import { createMessage, getMessagesByTicket } from '../../../../../api/superadmin/soporte/mensajes.js';
import { getTiendas } from '../../../../../api/superadmin/tiendas.js';
import TicketDetail from './TicketDetail.jsx';

const TicketDetailContainer = ({ ticketId }) => {
    const queryClient = useQueryClient();

    const { data: tiendas } = useQuery({
        queryKey: ['tiendas'],
        queryFn: getTiendas,
        staleTime: 5 * 60 * 1000,
    });

    const {
        data: ticket,
        isLoading: loadingTicket,
    } = useQuery({
        queryKey: ['superadmin', 'soporte', 'ticket', ticketId],
        queryFn: () => getTicketById(ticketId),
        enabled: Boolean(ticketId),
    });

    const {
        data: mensajes,
        isLoading: loadingMessages,
        refetch: refetchMessages,
    } = useQuery({
        queryKey: ['superadmin', 'soporte', 'ticket', ticketId, 'mensajes'],
        queryFn: () => getMessagesByTicket(ticketId),
        enabled: Boolean(ticketId),
    });

    const tiendaPorId = useMemo(() => (
        (tiendas ?? []).reduce((acc, tienda) => {
            if (!tienda?.id) {
                return acc;
            }
            acc[tienda.id] = tienda;
            return acc;
        }, {})
    ), [tiendas]);

    const ticketConMetadata = useMemo(() => {
        if (!ticket) {
            return null;
        }

        return {
            ...ticket,
            tiendaNombre: tiendaPorId[ticket.tiendaId]?.nombreComercial ?? '—',
        };
    }, [ticket, tiendaPorId]);

    const updateTicketMutation = useMutation({
        mutationFn: (payload) => updateTicket(ticketId, payload),
        onSuccess: () => {
            message.success('Ticket actualizado correctamente.');
            queryClient.invalidateQueries({ queryKey: ['superadmin', 'soporte', 'tickets'] });
            queryClient.invalidateQueries({ queryKey: ['superadmin', 'soporte', 'ticket', ticketId] });
        },
        onError: (error) => {
            const backendMessage = error?.response?.data?.message;
            message.error(backendMessage || 'No se pudo actualizar el ticket.');
        },
    });

    const createMessageMutation = useMutation({
        mutationFn: (payload) => createMessage(payload),
        onSuccess: () => {
            message.success('Mensaje enviado.');
            refetchMessages();
        },
        onError: (error) => {
            const backendMessage = error?.response?.data?.message;
            message.error(backendMessage || 'No se pudo enviar el mensaje.');
        },
    });

    const handleUpdateTicket = (values) => {
        if (!ticketId) {
            return;
        }

        const asignadoATrim = values.asignadoAId?.trim();
        const asignadoAId = asignadoATrim ? Number(asignadoATrim) : undefined;

        const payload = {
            asignadoAId: Number.isFinite(asignadoAId) ? asignadoAId : undefined,
            prioridad: values.prioridad || undefined,
            estado: values.estado || undefined,
        };

        updateTicketMutation.mutate(payload);
    };

    const handleCreateMessage = (values) => {
        if (!ticketId) {
            return Promise.resolve();
        }

        const payload = {
            ticketId,
            tipoRemitente: 'superadmin',
            mensaje: values.mensaje?.trim(),
            esNotaInterna: values.esNotaInterna ?? false,
        };

        return createMessageMutation.mutateAsync(payload);
    };

    const sortedMensajes = useMemo(() => {
        if (!mensajes) {
            return [];
        }

        return [...mensajes].sort((a, b) => {
            const fechaA = a?.creadoEn ? new Date(a.creadoEn).getTime() : 0;
            const fechaB = b?.creadoEn ? new Date(b.creadoEn).getTime() : 0;
            return fechaA - fechaB;
        });
    }, [mensajes]);

    return (
        <TicketDetail
            ticket={ticketConMetadata}
            loadingTicket={loadingTicket}
            updatingTicket={updateTicketMutation.isPending}
            onUpdateTicket={handleUpdateTicket}
            messages={sortedMensajes}
            loadingMessages={loadingMessages}
            creatingMessage={createMessageMutation.isPending}
            onCreateMessage={handleCreateMessage}
            onRefreshMessages={() => refetchMessages()}
        />
    );
};

export default TicketDetailContainer;
