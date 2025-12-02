import { useCallback, useState } from 'react';

const defaultFilters = {
    tiendaId: undefined,
    estado: undefined,
    prioridad: undefined,
};

const useTicketFilters = () => {
    const [filters, setFilters] = useState(defaultFilters);
    const [searchTerm, setSearchTerm] = useState('');

    const updateFilter = useCallback((field, value) => {
        setFilters((prev) => ({
            ...prev,
            [field]: value === '' ? undefined : value,
        }));
    }, []);

    const resetFilters = useCallback(() => {
        setFilters(defaultFilters);
        setSearchTerm('');
    }, []);

    return {
        filters,
        searchTerm,
        setSearchTerm,
        updateFilter,
        resetFilters,
    };
};

export default useTicketFilters;
