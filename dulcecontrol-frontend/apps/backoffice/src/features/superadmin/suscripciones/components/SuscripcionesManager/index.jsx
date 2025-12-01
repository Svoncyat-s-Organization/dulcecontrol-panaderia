import { useMemo, useState } from 'react';
import { message } from 'antd';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import SuscripcionesManagerView from './SuscripcionesManagerView.jsx';
import { getPlanes, getSuscripciones, updateSuscripcion } from '../../api/suscripciones.api.js';
import { PENToCentimos } from '../../utils/currencyFormatter.js';

const SUSCRIPCIONES_QUERY_KEY = ['superadmin', 'suscripciones'];
const PLANES_QUERY_KEY = ['superadmin', 'planes', 'activos'];

const SuscripcionesManager = () => {
    const queryClient = useQueryClient();
    const [filters, setFilters] = useState({
        estado: undefined,
        fechaInicio: undefined,
        fechaFin: undefined,
    });
    const [detailSuscripcion, setDetailSuscripcion] = useState(null);
    const [editSuscripcion, setEditSuscripcion] = useState(null);

    const apiFilters = useMemo(() => (
        filters.estado ? { estado: filters.estado } : {}
    ), [filters.estado]);

    // Fetch suscripciones with filters
    const { data: suscripciones = [], isLoading, isError, refetch } = useQuery({
        queryKey: [...SUSCRIPCIONES_QUERY_KEY, apiFilters],
        queryFn: () => getSuscripciones(apiFilters),
    });

    const { data: planes = [] } = useQuery({
        queryKey: PLANES_QUERY_KEY,
        queryFn: () => getPlanes({ soloActivos: true }),
    });

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleResetFilters = () => {
        setFilters({
            estado: undefined,
            fechaInicio: undefined,
            fechaFin: undefined,
        });
    };

    const handleViewDetails = (suscripcion) => {
        setDetailSuscripcion(suscripcion);
    };

    const handleCloseDetail = () => {
        setDetailSuscripcion(null);
    };

    const handleOpenEdit = (suscripcion) => {
        setEditSuscripcion(suscripcion);
    };

    const handleCloseEdit = () => {
        setEditSuscripcion(null);
    };

    const updateMutation = useMutation({
        mutationFn: ({ id, payload }) => updateSuscripcion(id, payload),
        onSuccess: () => {
            message.success('Suscripción actualizada');
            queryClient.invalidateQueries({ queryKey: SUSCRIPCIONES_QUERY_KEY });
            handleCloseEdit();
        },
        onError: (error) => {
            const detail = error?.response?.data?.message ?? 'Error al actualizar suscripción';
            message.error(detail);
        },
    });

    const handleSaveEdit = (values) => {
        if (!editSuscripcion) return;

        const payload = {};
        if (values.planId) payload.planId = values.planId;
        if (values.ciclo) payload.ciclo = values.ciclo;
        if (values.precioPactadoSoles !== undefined && values.precioPactadoSoles !== null) {
            payload.precioPactadoCentimos = PENToCentimos(values.precioPactadoSoles);
        }
        if (values.fechaInicio === null) payload.fechaInicio = null;
        else if (values.fechaInicio) payload.fechaInicio = values.fechaInicio.toISOString();

        if (values.fechaFin === null) payload.fechaFin = null;
        else if (values.fechaFin) payload.fechaFin = values.fechaFin.toISOString();
        if (values.estado) payload.estado = values.estado;
        if (typeof values.autorenovar === 'boolean') payload.autorenovar = values.autorenovar;

        if (Object.keys(payload).length === 0) {
            message.warning('No hay cambios para guardar');
            return;
        }

        updateMutation.mutate({ id: editSuscripcion.id, payload });
    };

    return (
        <SuscripcionesManagerView
            suscripciones={suscripciones}
            loading={isLoading}
            isError={isError}
            onRetry={refetch}
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            onViewDetails={handleViewDetails}
            onCloseDetail={handleCloseDetail}
            onOpenEdit={handleOpenEdit}
            onCloseEdit={handleCloseEdit}
            detailSuscripcion={detailSuscripcion}
            editSuscripcion={editSuscripcion}
            onSaveEdit={handleSaveEdit}
            isSavingEdit={updateMutation.isPending}
            planes={planes}
        />
    );
};

export default SuscripcionesManager;
