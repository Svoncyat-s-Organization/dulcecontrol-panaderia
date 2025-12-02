import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTiendas } from '../../../../../api/superadmin/tiendas.js';
import TicketFilters from './TicketFilters.jsx';
import { normalizeOption } from '../../utils/formatters.js';

const TicketFiltersContainer = (props) => {
    const { data: tiendas, isLoading } = useQuery({
        queryKey: ['tiendas'],
        queryFn: getTiendas,
        staleTime: 5 * 60 * 1000,
    });

    const tiendaOptions = useMemo(() => (
        (tiendas ?? [])
            .filter((tienda) => tienda?.id && tienda?.nombreComercial)
            .map((tienda) => normalizeOption(tienda.id, tienda.nombreComercial))
    ), [tiendas]);

    return (
        <TicketFilters
            {...props}
            tiendaOptions={tiendaOptions}
            tiendasLoading={isLoading}
        />
    );
};

export default TicketFiltersContainer;
