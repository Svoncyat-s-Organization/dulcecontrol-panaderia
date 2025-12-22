import React, { useMemo } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { message } from 'antd';
import TicketDetail from './TicketDetail.jsx';
import { getTicketById } from '../../../../../api/superadmin/soporte/tickets.js';
import { createMessage, getMessagesByTicket } from '../../../../../api/superadmin/soporte/mensajes.js';

const TicketDetailContainer = ({ ticketId, tiendaId }) => {
  const {
    data: ticket,
    isLoading: loadingTicket,
  } = useQuery({
    queryKey: ['admin', 'soporte', 'ticket', ticketId],
    queryFn: () => getTicketById(ticketId),
    enabled: Boolean(ticketId),
    select: (data) => (data?.tiendaId === tiendaId ? data : null),
  });

  const {
    data: messages,
    isLoading: loadingMessages,
    refetch: refetchMessages,
  } = useQuery({
    queryKey: ['admin', 'soporte', 'ticket', ticketId, 'mensajes'],
    queryFn: () => getMessagesByTicket(ticketId),
    enabled: Boolean(ticketId),
    select: (list) => {
      if (!Array.isArray(list)) {
        return [];
      }
      return [...list].sort((a, b) => {
        const timeA = a?.creadoEn ? new Date(a.creadoEn).getTime() : 0;
        const timeB = b?.creadoEn ? new Date(b.creadoEn).getTime() : 0;
        return timeA - timeB;
      });
    },
  });

  const createMessageMutation = useMutation({
    mutationFn: ({ mensaje }) => {
      if (!ticketId) {
        return Promise.reject(new Error('No se encontró el ticket.'));
      }
      return createMessage({
        ticketId,
        tipoRemitente: 'tienda',
        mensaje,
        esNotaInterna: false,
      });
    },
    onSuccess: () => {
      message.success('Mensaje enviado.');
      refetchMessages();
    },
    onError: (error) => {
      const backendMessage = error?.response?.data?.message;
      message.error(backendMessage || 'No se pudo enviar el mensaje.');
    },
  });

  const filteredMessages = useMemo(() => {
    if (!ticket) {
      return [];
    }
    return messages ?? [];
  }, [ticket, messages]);

  return (
    <TicketDetail
      ticket={ticket}
      loadingTicket={loadingTicket}
      messages={filteredMessages}
      loadingMessages={loadingMessages}
      creatingMessage={createMessageMutation.isPending}
      onCreateMessage={({ mensaje }) => createMessageMutation.mutateAsync({ mensaje })}
      onRefreshMessages={() => refetchMessages()}
    />
  );
};

export default TicketDetailContainer;
