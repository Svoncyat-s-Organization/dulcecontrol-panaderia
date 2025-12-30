import { useCallback, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import HistorialManagerView from './HistorialManagerView.jsx';
import { getSuscripciones, getHistorialBySuscripcion } from '../../api/suscripciones.api.js';
import { getTiendas } from '../../../tiendas/api/tiendas.api.js';
import { isTiendaVisible } from '../../utils/tiendaVisibility.js';

const HISTORIAL_QUERY_KEY = ['superadmin', 'historial'];
const SUSCRIPCIONES_QUERY_KEY = ['superadmin', 'suscripciones'];
const TIENDAS_QUERY_KEY = ['superadmin', 'tiendas'];

const HistorialManager = () => {
    const [selectedSuscripcionId, setSelectedSuscripcionId] = useState(null);

    // Fetch tiendas for mapping names
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
        tiendas.forEach(tienda => {
            const nombre = tienda.nombreComercial || tienda.nombreDoc || `Tienda #${tienda.id}`;
            map.set(tienda.id, nombre);
        });
        return map;
    }, [tiendas]);

    const getTiendaLabel = useCallback((tiendaId) => {
        if (!tiendaId) return 'Sin tienda';
        return tiendasMap.get(tiendaId) || `Tienda #${tiendaId}`;
    }, [tiendasMap]);

    // Fetch all subscriptions for the selector
    const { data: suscripciones = [], isLoading: isLoadingSuscripciones } = useQuery({
        queryKey: SUSCRIPCIONES_QUERY_KEY,
        queryFn: () => getSuscripciones(),
    });

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

    // Fetch history for selected subscription
    const { data: historial = [], isLoading: isLoadingHistorial, isError, refetch } = useQuery({
        queryKey: [...HISTORIAL_QUERY_KEY, selectedSuscripcionId],
        queryFn: () => getHistorialBySuscripcion(selectedSuscripcionId),
        enabled: !!selectedSuscripcionId,
    });

    const handleSelectSuscripcion = (id) => {
        setSelectedSuscripcionId(id);
    };

    return (
        <HistorialManagerView
            historial={historial}
            loading={isLoadingHistorial}
            isError={isError}
            onRetry={refetch}
            suscripciones={suscripcionesConNombre}
            tiendasMap={tiendasMap}
            selectedSuscripcionId={selectedSuscripcionId}
            onSelectSuscripcion={handleSelectSuscripcion}
            isLoadingSuscripciones={isLoadingSuscripciones}
        />
    );
};

export default HistorialManager;
