import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import HistorialManagerView from './HistorialManagerView.jsx';
import { getSuscripciones } from '../../api/suscripciones.api.js';

// Note: The API currently doesn't have a global historial endpoint
// We'll fetch all suscripciones and display them in a historical context
// If a specific historial endpoint is added later, this can be updated

const HISTORIAL_QUERY_KEY = ['superadmin', 'historial'];

const HistorialManager = () => {
    const [filters, setFilters] = useState({
        tipo_movimiento: undefined,
        fecha_inicio: undefined,
        fecha_fin: undefined,
    });

    // For now, we'll fetch suscripciones as a proxy for history
    // In a real implementation, you'd fetch from /historial endpoint
    const { data: historial = [], isLoading, isError, refetch } = useQuery({
        queryKey: [...HISTORIAL_QUERY_KEY, filters],
        queryFn: () => getSuscripciones(filters),
    });

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleResetFilters = () => {
        setFilters({
            tipo_movimiento: undefined,
            fecha_inicio: undefined,
            fecha_fin: undefined,
        });
    };

    return (
        <HistorialManagerView
            historial={historial}
            loading={isLoading}
            isError={isError}
            onRetry={refetch}
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
        />
    );
};

export default HistorialManager;
