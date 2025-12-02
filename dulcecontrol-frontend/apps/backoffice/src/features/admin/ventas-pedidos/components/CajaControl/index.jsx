import { useEffect, useRef, useState } from 'react';
import { App as AntdApp } from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import CajaControlView from './CajaControlView.jsx';
import { useCajaSession } from '../../hooks/useCajaSession.js';
import { useTokenStore } from '../../../../../shared/store/tokenStore.js';
import { useSedeStore } from '../../../../../shared/store/sedeStore.js';
import { abrirCaja, cerrarCaja } from '../../api/cajas.api.js';
import { CAJA_KEYS } from '../../constants/queryKeys.js';
import { useCartStore } from '../../hooks/useCartStore.js';

const CajaControl = ({ children }) => {
    const { message } = AntdApp.useApp();
    const { isOpen, session, isLoading, refetchSession, usuarioId, currentCaja, cajas, cajasLoading } = useCajaSession();
    const tiendaId = useTokenStore((state) => state.tiendaId);
    const user = useTokenStore((state) => state.user);
    const queryClient = useQueryClient();
    const selectedSedeId = useSedeStore((state) => state.selectedSedeId);
    const clearCart = useCartStore((state) => state.clearCart);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [actionType, setActionType] = useState(null); // 'OPEN' or 'CLOSE'
    const previousSessionIdRef = useRef(undefined);

    useEffect(() => {
        const currentSessionId = session?.id ?? null;
        if (previousSessionIdRef.current === undefined) {
            previousSessionIdRef.current = currentSessionId;
            return;
        }
        if (previousSessionIdRef.current !== currentSessionId) {
            clearCart();
            previousSessionIdRef.current = currentSessionId;
        }
    }, [session?.id, clearCart]);

    const ensureUsuarioDisponible = () => {
        if (!usuarioId) {
            message.error('No se pudo identificar al usuario autenticado. Cierre sesión e intente nuevamente.');
            return false;
        }
        if (!tiendaId) {
            message.error('No se pudo determinar la tienda activa.');
            return false;
        }
        if (!selectedSedeId) {
            message.error('Selecciona una sede para operar el punto de venta.');
            return false;
        }
        return true;
    };

    // Mutation para abrir caja
    const openMutation = useMutation({
        mutationFn: (data) => abrirCaja(tiendaId, {
            ...data,
            usuarioAperturaId: usuarioId,
            montoInicialCentimos: Math.round(data.montoInicial * 100)
        }),
        onSuccess: () => {
            setIsModalOpen(false);
            refetchSession();
            setActionType(null);
            queryClient.invalidateQueries(CAJA_KEYS.base(tiendaId, selectedSedeId));
            queryClient.invalidateQueries(CAJA_KEYS.lists(tiendaId, selectedSedeId));
        },
        onError: (err) => message.error(err?.response?.data?.message || err.message || 'Error al abrir caja')
    });

    // Mutation para cerrar caja
    const closeMutation = useMutation({
        mutationFn: ({ values, sesionId, cajaId }) => cerrarCaja(tiendaId, sesionId, {
            cajaId,
            usuarioCierreId: usuarioId,
            montoFinalRealCentimos: Math.round(values.montoFinal * 100)
        }),
        onSuccess: () => {
            setIsModalOpen(false);
            refetchSession();
            setActionType(null);
            queryClient.invalidateQueries(CAJA_KEYS.base(tiendaId, selectedSedeId));
            queryClient.invalidateQueries(CAJA_KEYS.lists(tiendaId, selectedSedeId));
        },
        onError: (err) => message.error(err?.response?.data?.message || err.message || 'Error al cerrar caja')
    });

    const handleOpenClick = () => {
        if (!ensureUsuarioDisponible()) {
            return;
        }
        setActionType('OPEN');
        setIsModalOpen(true);
    };

    const handleCloseClick = () => {
        if (!ensureUsuarioDisponible()) {
            return;
        }
        if (!session?.id) {
            message.warning('No hay ninguna sesión abierta.');
            return;
        }
        setActionType('CLOSE');
        setIsModalOpen(true);
    };

    const handleSubmit = (values) => {
        if (!ensureUsuarioDisponible()) {
            return;
        }
        if (actionType === 'OPEN') {
            openMutation.mutate(values);
            return;
        }

        if (!session?.id) {
            message.error('No se encontró la sesión activa.');
            return;
        }

        closeMutation.mutate({ values, sesionId: session.id, cajaId: session.cajaId });
    };

    const handleModalCancel = () => {
        setIsModalOpen(false);
        setActionType(null);
    };

    return (
        <CajaControlView
            isOpen={isOpen}
            session={session}
            isLoading={isLoading}
            onOpenClick={handleOpenClick}
            onCloseClick={handleCloseClick}
            isModalVisible={isModalOpen}
            onModalCancel={handleModalCancel}
            onModalSubmit={handleSubmit}
            actionType={actionType}
            tiendaId={tiendaId}
            user={user}
            cajas={cajas}
            currentCaja={currentCaja}
            cajasLoading={cajasLoading}
        >
            {children}
        </CajaControlView>
    );
};

export default CajaControl;
