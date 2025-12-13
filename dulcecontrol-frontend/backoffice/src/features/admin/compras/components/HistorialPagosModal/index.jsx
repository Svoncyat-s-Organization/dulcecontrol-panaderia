import { useQuery } from '@tanstack/react-query';
import HistorialPagosModalView from './HistorialPagosModalView';
import { obtenerHistorialPagos } from '../../api/pagos.api.js';
import { useTokenStore } from '../../../../../shared/store/tokenStore.js';

const HistorialPagosModal = ({ open, onClose, ordenCompra }) => {
  const tiendaId = useTokenStore((state) => state.tiendaId);

  const { data: pagos = [], isLoading } = useQuery({
    queryKey: ['historial-pagos', ordenCompra?.id],
    queryFn: () => obtenerHistorialPagos(tiendaId, ordenCompra?.id),
    enabled: open && !!ordenCompra?.id && !!tiendaId,
  });

  return (
    <HistorialPagosModalView
      open={open}
      onClose={onClose}
      pagos={pagos}
      loading={isLoading}
      ordenCompra={ordenCompra}
    />
  );
};

export default HistorialPagosModal;
