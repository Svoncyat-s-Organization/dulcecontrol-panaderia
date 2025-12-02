import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTokenStore } from '../../../../shared/store/tokenStore.js';
import { useSedeStore } from '../../../../shared/store/sedeStore.js';
import { getCajas, getSesionesCaja } from '../api/cajas.api.js';
import { CAJA_KEYS } from '../constants/queryKeys.js';
import { useCurrentUsuarioTienda } from './useCurrentUsuarioTienda.js';

export const useCajaSession = () => {
    const tiendaId = useTokenStore((state) => state.tiendaId);
    const selectedSedeId = useSedeStore((state) => state.selectedSedeId);
    const { usuarioId, isResolvingUsuario } = useCurrentUsuarioTienda();

    const { data: cajas = [], isLoading: isCajasLoading } = useQuery({
        queryKey: CAJA_KEYS.lists(tiendaId),
        queryFn: () => getCajas(tiendaId),
        enabled: !!tiendaId,
        staleTime: 5 * 60 * 1000,
    });

    // Buscar sesiones abiertas para este usuario en esta tienda
    const { data: sesiones = [], isLoading, refetch } = useQuery({
        queryKey: CAJA_KEYS.sesionActive(tiendaId, usuarioId),
        queryFn: () => getSesionesCaja(tiendaId, {
            estaAbierta: true,
        }),
        enabled: !!tiendaId && !!usuarioId,
        select: (data) => data.filter((s) => s.estaAbierta && String(s.usuarioAperturaId) === String(usuarioId))
    });

    const sortedCajas = useMemo(() => {
        if (!Array.isArray(cajas)) {
            return [];
        }
        const copia = [...cajas];
        return copia.sort((a, b) => (a?.nombre || '').localeCompare(b?.nombre || '', 'es', { sensitivity: 'base' }));
    }, [cajas]);

    const filteredCajas = useMemo(() => {
        if (!selectedSedeId) {
            return sortedCajas;
        }
        const objetivo = String(selectedSedeId);
        return sortedCajas.filter((c) => String(c?.sedeId) === objetivo);
    }, [sortedCajas, selectedSedeId]);

    const activeSession = sesiones.length > 0 ? sesiones[0] : null;
    const currentCaja = activeSession
        ? sortedCajas.find((c) => String(c.id) === String(activeSession.cajaId)) || null
        : null;

    return {
        isOpen: !!activeSession,
        session: activeSession,
        isLoading: isLoading || isResolvingUsuario || isCajasLoading,
        refetchSession: refetch,
        usuarioId,
        cajas: filteredCajas,
        currentCaja,
        cajasLoading: isCajasLoading,
    };
};
