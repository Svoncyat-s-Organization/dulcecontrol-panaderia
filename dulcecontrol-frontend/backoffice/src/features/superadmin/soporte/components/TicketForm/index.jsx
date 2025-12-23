import React, { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import TicketForm from './TicketForm.jsx';
import { getTiendas } from '../../../../../api/superadmin/tiendas.js';
import { createTicket } from '../../../../../api/superadmin/soporte/tickets.js';
import { normalizeOption } from '../../utils/formatters.js';

const TicketFormContainer = ({ open, onCancel, onCreated }) => {
    const queryClient = useQueryClient();

    const { data: tiendas } = useQuery({
        queryKey: ['tiendas'],
        queryFn: getTiendas,
        staleTime: 5 * 60 * 1000,
    });

    const createMutation = useMutation({
        mutationFn: (values) => createTicket(values),
        onSuccess: (ticket) => {
            message.success('Ticket creado correctamente.');
            queryClient.invalidateQueries({ queryKey: ['superadmin', 'soporte', 'tickets'], refetchType: 'active' });
            onCreated?.(ticket);
            onCancel?.();
        },
        onError: (error) => {
            const backendMessage = error?.response?.data?.message;
            message.error(backendMessage || 'No se pudo crear el ticket.');
        },
    });

    const handleSubmit = (values) => {
        const payload = {
            tiendaId: Number(values.tiendaId),
            asunto: values.asunto?.trim(),
            prioridad: values.prioridad,
            mensaje: values.mensaje?.trim(),
        };

        if (!Number.isFinite(payload.tiendaId)) {
            message.error('La tienda seleccionada no es válida.');
            return;
        }

        createMutation.mutate(payload);
    };

    const tiendaOptions = useMemo(() => (
        (tiendas ?? [])
            .filter((tienda) => tienda?.id && tienda?.nombreComercial)
            .map((tienda) => normalizeOption(tienda.id, tienda.nombreComercial))
    ), [tiendas]);

    return (
        <TicketForm
            open={open}
            onCancel={onCancel}
            onSubmit={handleSubmit}
            submitting={createMutation.isPending}
            tiendaOptions={tiendaOptions}
        />
    );
};

export default TicketFormContainer;
