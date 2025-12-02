import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import HistorialManagerView from './HistorialManagerView.jsx';
import { getSuscripciones, getHistorialBySuscripcion } from '../../api/suscripciones.api.js';
import { getTiendas } from '../../../../../api/superadmin/tiendas.js';

const HISTORIAL_QUERY_KEY = ['superadmin', 'historial'];
const SUSCRIPCIONES_QUERY_KEY = ['superadmin', 'suscripciones'];
const TIENDAS_QUERY_KEY = ['superadmin', 'tiendas'];

const HistorialManager = () => {
    const [selectedSuscripcionId, setSelectedSuscripcionId] = useState(null);

    // Fetch tiendas for mapping names
    const { data: tiendas = [] } = useQuery({
        queryKey: TIENDAS_QUERY_KEY,
        queryFn: getTiendas,
    });

    const tiendasMap = useMemo(() => {
        const map = new Map();
        tiendas.forEach(tienda => {
            const nombre = tienda.nombreComercial || tienda.nombreDoc || `Tienda #${tienda.id}`;
            map.set(tienda.id, nombre);
        });
        return map;
    }, [tiendas]);

    // Fetch all subscriptions for the selector
    const { data: suscripciones = [], isLoading: isLoadingSuscripciones } = useQuery({
        queryKey: SUSCRIPCIONES_QUERY_KEY,
        queryFn: () => getSuscripciones(),
    });

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
            suscripciones={suscripciones}
            tiendasMap={tiendasMap}
            selectedSuscripcionId={selectedSuscripcionId}
            onSelectSuscripcion={handleSelectSuscripcion}
            isLoadingSuscripciones={isLoadingSuscripciones}
        />
    );
};

export default HistorialManager;
