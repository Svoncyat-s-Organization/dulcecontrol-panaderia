import { useCallback, useMemo, useState } from 'react';
import { message } from 'antd';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import SuscripcionesManagerView from './SuscripcionesManagerView.jsx';
import { getPlanes, getSuscripciones, updateSuscripcion, createSuscripcion } from '../../api/suscripciones.api.js';
import { PENToCentimos } from '../../utils/currencyFormatter.js';
import { getTiendas } from '../../../tiendas/api/tiendas.api.js';
import { useAuthStore } from '../../../../../shared/hooks/useAuth.js';
import { isTiendaVisible } from '../../utils/tiendaVisibility.js';

const SUSCRIPCIONES_QUERY_KEY = ['superadmin', 'suscripciones'];
const PLANES_QUERY_KEY = ['superadmin', 'planes', 'activos'];
const TIENDAS_QUERY_KEY = ['superadmin', 'tiendas'];

const SuscripcionesManager = () => {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();
    const [filters, setFilters] = useState({
        estado: undefined,
        fechaInicio: undefined,
        fechaFin: undefined,
    });
    const [detailSuscripcion, setDetailSuscripcion] = useState(null);
    const [editSuscripcion, setEditSuscripcion] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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

    const { data: tiendasRaw = [] } = useQuery({
        queryKey: TIENDAS_QUERY_KEY,
        queryFn: getTiendas,
    });

    const tiendas = useMemo(() => (
        (tiendasRaw || []).filter(isTiendaVisible)
    ), [tiendasRaw]);

    const tiendasVisiblesIdSet = useMemo(() => (
        new Set((tiendas || []).map((t) => t?.id).filter(Boolean))
    ), [tiendas]);

    const tiendasMap = useMemo(() => {
        const map = new Map();
        tiendas.forEach((tienda) => {
            const label = tienda.nombreComercial || tienda.nombreDoc || `Tienda #${tienda.id}`;
            map.set(tienda.id, label);
        });
        return map;
    }, [tiendas]);

    const getTiendaLabel = useCallback((tiendaId) => {
        if (!tiendaId) return 'Sin tienda';
        return tiendasMap.get(tiendaId) || `Tienda #${tiendaId}`;
    }, [tiendasMap]);

    const suscripcionesConNombre = useMemo(() => (
        (suscripciones || [])
            .filter((suscripcion) => (
                !suscripcion?.tiendaId || tiendasVisiblesIdSet.has(suscripcion.tiendaId)
            ))
            .map((suscripcion) => ({
                ...suscripcion,
                tiendaNombre: getTiendaLabel(suscripcion.tiendaId),
            }))
    ), [suscripciones, getTiendaLabel, tiendasVisiblesIdSet]);

    const tiendasConSuscripcion = useMemo(() => {
        const set = new Set();
        suscripciones.forEach((suscripcion) => {
            if (suscripcion?.tiendaId) {
                set.add(suscripcion.tiendaId);
            }
        });
        return set;
    }, [suscripciones]);

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

    const handleOpenCreate = () => {
        setIsCreateModalOpen(true);
    };

    const handleCloseCreate = () => {
        setIsCreateModalOpen(false);
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

    const createMutation = useMutation({
        mutationFn: createSuscripcion,
        onSuccess: () => {
            message.success('Suscripción creada');
            queryClient.invalidateQueries({ queryKey: SUSCRIPCIONES_QUERY_KEY });
            handleCloseCreate();
        },
        onError: (error) => {
            const detail = error?.response?.data?.message ?? 'Error al crear suscripción';
            message.error(detail);
        },
    });

    const handleCreate = (values) => {
        if (tiendasConSuscripcion.has(values.tiendaId)) {
            message.warning('La tienda seleccionada ya cuenta con una suscripción.');
            return;
        }

        const payload = {
            tiendaId: values.tiendaId,
            planId: values.planId,
            ciclo: values.ciclo,
            precioPactadoCentimos: PENToCentimos(values.precioPactadoSoles),
            fechaInicio: values.fechaInicio ? values.fechaInicio.toISOString() : null,
            fechaFin: values.fechaFin ? values.fechaFin.toISOString() : null,
            estado: values.estado,
            autorenovar: values.autorenovar,
        };

        if (user?.id) {
            payload.usuarioResponsableId = user.id;
        }

        createMutation.mutate(payload);
    };

    return (
        <SuscripcionesManagerView
            suscripciones={suscripcionesConNombre}
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
            tiendas={tiendas}
            tiendasMap={tiendasMap}
            tiendasConSuscripcion={tiendasConSuscripcion}
            isCreateModalOpen={isCreateModalOpen}
            onOpenCreate={handleOpenCreate}
            onCloseCreate={handleCloseCreate}
            onCreate={handleCreate}
            isCreating={createMutation.isPending}
        />
    );
};

export default SuscripcionesManager;
