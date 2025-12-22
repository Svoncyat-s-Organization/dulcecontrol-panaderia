import React, { useEffect, useMemo, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import TicketList from './TicketList.jsx';
import { getTickets } from '../../../../../api/superadmin/soporte/tickets.js';

const TicketListContainer = ({
  tiendaId,
  searchTerm,
  onSearchTermChange,
  selectedTicketId,
  onSelect,
  onCreate,
}) => {
  const queryClient = useQueryClient();
  const lastErrorRef = useRef(null);

  const {
    data: tickets,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['admin', 'soporte', 'tickets', tiendaId],
    queryFn: () => getTickets({ tiendaId }),
    enabled: Boolean(tiendaId),
    keepPreviousData: true,
  });

  useEffect(() => {
    if (!error) {
      lastErrorRef.current = null;
      return;
    }
    if (lastErrorRef.current === error) {
      return;
    }
    lastErrorRef.current = error;
    const backendMessage = error?.response?.data?.message;
    message.error(backendMessage || 'No se pudieron cargar tus tickets de soporte.');
  }, [error]);

  const filteredTickets = useMemo(() => {
    if (!tickets) {
      return [];
    }
    if (!searchTerm?.trim()) {
      return tickets;
    }
    const normalized = searchTerm.trim().toLowerCase();
    return tickets.filter((ticket) => (
      ticket?.asunto?.toLowerCase().includes(normalized)
      || ticket?.id?.toString().includes(normalized)
    ));
  }, [tickets, searchTerm]);

  const handleRefresh = () => {
    if (!tiendaId) {
      return;
    }
    queryClient.invalidateQueries({ queryKey: ['admin', 'soporte', 'tickets', tiendaId] });
    refetch();
  };

  return (
    <TicketList
      tickets={filteredTickets}
      loading={isLoading}
      onSelect={onSelect}
      selectedTicketId={selectedTicketId}
      onCreate={onCreate}
      onRefresh={handleRefresh}
      searchTerm={searchTerm}
      onSearchTermChange={onSearchTermChange}
    />
  );
};

export default TicketListContainer;
