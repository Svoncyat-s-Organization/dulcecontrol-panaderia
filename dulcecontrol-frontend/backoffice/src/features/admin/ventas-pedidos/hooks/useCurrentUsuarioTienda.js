import { useQuery } from '@tanstack/react-query';
import { useTokenStore } from '../../../../shared/store/tokenStore.js';
import { getUsuariosAdmin } from '../api/usuarios.api.js';
import { CAJA_KEYS } from '../constants/queryKeys.js';

const normalizeCorreo = (correo) => correo?.trim().toLowerCase() ?? null;

export const useCurrentUsuarioTienda = () => {
    const tiendaId = useTokenStore((state) => state.tiendaId);
    const user = useTokenStore((state) => state.user);

    const fallbackId = user?.id ?? user?.userId ?? user?.usuario_id ?? null;
    const correo = user?.sub ?? user?.correo ?? null;
    const normalizedCorreo = normalizeCorreo(correo);

    const {
        data: usuarioActual,
        isLoading,
        isFetching,
        refetch,
    } = useQuery({
        queryKey: CAJA_KEYS.usuarioActual(tiendaId, normalizedCorreo),
        queryFn: async () => {
            const usuarios = await getUsuariosAdmin(tiendaId);
            return usuarios.find((u) => normalizeCorreo(u.correo) === normalizedCorreo) || null;
        },
        enabled: !fallbackId && !!tiendaId && !!normalizedCorreo,
        staleTime: 10 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
    });

    const usuarioId = fallbackId ?? usuarioActual?.id ?? null;

    return {
        usuarioActual,
        usuarioId,
        correo: normalizedCorreo,
        isResolvingUsuario: isLoading || isFetching,
        refetchUsuario: refetch,
    };
};
