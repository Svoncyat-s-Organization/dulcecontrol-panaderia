import { useEffect, useMemo, useRef, useState } from 'react';
import { App as AntdApp } from 'antd';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import CajaControlView from './CajaControlView.jsx';
import { useCajaSession } from '../../hooks/useCajaSession.js';
import { useTokenStore } from '../../../../../shared/store/tokenStore.js';
import { abrirCaja, cerrarCaja, getMovimientosCaja, registrarMovimientoCaja } from '../../api/cajas.api.js';
import { useSedeStore } from '../../../../../shared/store/sedeStore.js';
import { CAJA_KEYS } from '../../constants/queryKeys.js';
import { useCartStore } from '../../hooks/useCartStore.js';
import { computeExpectedFinalCentimos } from '../../utils/cajaCalculations.js';
import { nowLocalApiDateTime } from '../../utils/dateTime.js';

const CAJA_SESSION_BROADCAST_KEY = 'dc-caja-session-changed';

const broadcastCajaSessionChange = ({ tiendaId, sedeId, usuarioId, type }) => {
    if (typeof window === 'undefined') {
        return;
    }
    try {
        window.localStorage.setItem(
            CAJA_SESSION_BROADCAST_KEY,
            JSON.stringify({ at: Date.now(), tiendaId: tiendaId ?? null, sedeId: sedeId ?? null, usuarioId: usuarioId ?? null, type })
        );
    } catch {
        // ignore
    }
};

const CajaControl = ({ children }) => {
    const { message } = AntdApp.useApp();
    const { isOpen, session, isLoading, refetchSession, usuarioId, currentCaja, cajas, cajasLoading } = useCajaSession();
    const tiendaId = useTokenStore((state) => state.tiendaId);
    const user = useTokenStore((state) => state.user);
    const queryClient = useQueryClient();
    const selectedSedeId = useSedeStore((state) => state.selectedSedeId);
    const clearCart = useCartStore((state) => state.clearCart);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [actionType, setActionType] = useState(null); // 'OPEN' | 'CLOSE' | 'WITHDRAW'
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
        mutationFn: (data) => {
            const montoInicialCentimos = Math.round(data.montoInicial * 100);
            return abrirCaja(tiendaId, {
                ...data,
                usuarioAperturaId: usuarioId,
                montoInicialCentimos,
                montoFinalEsperadoCentimos: montoInicialCentimos,
                fechaApertura: nowLocalApiDateTime(),
                estaAbierta: true,
            });
        },
        onSuccess: () => {
            setIsModalOpen(false);
            refetchSession();
            setActionType(null);
            queryClient.invalidateQueries(CAJA_KEYS.base(tiendaId, selectedSedeId));
            queryClient.invalidateQueries(CAJA_KEYS.lists(tiendaId, selectedSedeId));
            queryClient.invalidateQueries(CAJA_KEYS.sesionActive(tiendaId, selectedSedeId, usuarioId));
            queryClient.invalidateQueries(CAJA_KEYS.sesiones(tiendaId, selectedSedeId));
            broadcastCajaSessionChange({ tiendaId, sedeId: selectedSedeId, usuarioId, type: 'open' });
        },
        onError: (err) => message.error(err?.response?.data?.message || err.message || 'Error al abrir caja')
    });

    // Mutation para cerrar caja
    const closeMutation = useMutation({
        mutationFn: ({ values, sesionId, cajaId, montoFinalEsperadoCentimos }) => cerrarCaja(tiendaId, sesionId, {
            cajaId,
            usuarioCierreId: usuarioId,
            montoFinalRealCentimos: Math.round(values.montoFinal * 100),
            montoFinalEsperadoCentimos,
            fechaCierre: nowLocalApiDateTime(),
            estaAbierta: false,
        }),
        onSuccess: () => {
            setIsModalOpen(false);
            // Limpieza inmediata del carrito, incluso si la sesión tarda en refrescar
            clearCart();
            refetchSession();
            setActionType(null);
            queryClient.invalidateQueries(CAJA_KEYS.base(tiendaId, selectedSedeId));
            queryClient.invalidateQueries(CAJA_KEYS.lists(tiendaId, selectedSedeId));
            queryClient.invalidateQueries(CAJA_KEYS.sesionActive(tiendaId, selectedSedeId, usuarioId));
            queryClient.invalidateQueries(CAJA_KEYS.sesiones(tiendaId, selectedSedeId));
            if (session?.id) {
                queryClient.invalidateQueries(CAJA_KEYS.movimientos(tiendaId, selectedSedeId, session.id));
            }
            broadcastCajaSessionChange({ tiendaId, sedeId: selectedSedeId, usuarioId, type: 'close' });
        },
        onError: (err) => message.error(err?.response?.data?.message || err.message || 'Error al cerrar caja')
    });

    const movimientosQuery = useQuery({
        queryKey: CAJA_KEYS.movimientos(tiendaId, selectedSedeId, session?.id),
        queryFn: () => getMovimientosCaja(tiendaId, session.id),
        enabled: !!tiendaId && !!session?.id,
        select: (response) => Array.isArray(response) ? response : [],
        staleTime: 60 * 1000,
    });

    const saldoDisponibleCentimos = useMemo(() => {
        if (!session?.id) {
            return null;
        }
        return computeExpectedFinalCentimos(session, movimientosQuery.data || []);
    }, [session, movimientosQuery.data]);

    const withdrawMutation = useMutation({
        mutationFn: ({ sesionId, montoCentimos, tipoMovimiento, concepto }) => registrarMovimientoCaja(tiendaId, sesionId, {
            tipoMovimiento,
            montoCentimos,
            metodoPago: 'efectivo',
            concepto,
            comprobanteAsociado: null,
        }),
        onSuccess: () => {
            message.success('Retiro registrado correctamente');
            setIsModalOpen(false);
            setActionType(null);
            movimientosQuery.refetch();
            queryClient.invalidateQueries(CAJA_KEYS.movimientos(tiendaId, selectedSedeId, session?.id));
        },
        onError: (err) => message.error(err?.response?.data?.message || err.message || 'No se pudo registrar el retiro'),
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

    const handleWithdrawClick = () => {
        if (!ensureUsuarioDisponible()) {
            return;
        }
        if (!session?.id) {
            message.warning('No hay ninguna sesión abierta.');
            return;
        }
        setActionType('WITHDRAW');
        setIsModalOpen(true);
    };

    const handleSubmit = (values) => {
        if (!ensureUsuarioDisponible()) {
            return;
        }
        if (actionType === 'WITHDRAW') {
            if (!session?.id) {
                message.error('No se encontró la sesión activa.');
                return;
            }
            const montoRetiroCentimos = Math.round(Math.abs(values.montoRetiro || 0) * 100);
            if (montoRetiroCentimos <= 0) {
                message.error('Ingrese un monto válido para el retiro.');
                return;
            }
            if (!values?.tipoMovimiento) {
                message.error('Seleccione el tipo de movimiento.');
                return;
            }
            const concepto = values.concepto?.trim();
            if (!concepto) {
                message.error('Ingrese una nota para registrar el movimiento.');
                return;
            }
            if (saldoDisponibleCentimos == null) {
                message.warning('Aún se está calculando el saldo disponible. Intente nuevamente en unos segundos.');
                return;
            }
            if (montoRetiroCentimos > saldoDisponibleCentimos) {
                message.error('El retiro no puede exceder el efectivo disponible en la caja.');
                return;
            }
            withdrawMutation.mutate({
                sesionId: session.id,
                montoCentimos: montoRetiroCentimos,
                tipoMovimiento: values.tipoMovimiento,
                concepto,
            });
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

        const expectedForClose = typeof saldoDisponibleCentimos === 'number'
            ? saldoDisponibleCentimos
            : (session?.montoFinalEsperadoCentimos ?? session?.montoInicialCentimos ?? 0);

        closeMutation.mutate({
            values,
            sesionId: session.id,
            cajaId: session.cajaId,
            montoFinalEsperadoCentimos: expectedForClose,
        });
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
            onWithdrawClick={handleWithdrawClick}
            isModalVisible={isModalOpen}
            onModalCancel={handleModalCancel}
            onModalSubmit={handleSubmit}
            actionType={actionType}
            tiendaId={tiendaId}
            user={user}
            cajas={cajas}
            currentCaja={currentCaja}
            cajasLoading={cajasLoading}
            saldoDisponibleCentimos={saldoDisponibleCentimos}
            saldoLoading={(movimientosQuery.isLoading || movimientosQuery.isFetching) && !!session?.id}
            withdrawLoading={withdrawMutation.isPending}
        >
            {children}
        </CajaControlView>
    );
};

export default CajaControl;
