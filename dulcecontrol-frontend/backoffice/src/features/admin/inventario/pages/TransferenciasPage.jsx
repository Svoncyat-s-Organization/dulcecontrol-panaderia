import { Result } from 'antd';
import { useTokenStore } from '../../../../shared/store/tokenStore.js';
import { useSedeStore } from '../../../../shared/store/sedeStore.js';
import TransferenciasTable from '../components/TransferenciasTable/index.jsx';

const TransferenciasPage = () => {
  const tiendaId = useTokenStore((state) => state.tiendaId);
  const sedeIdRaw = useSedeStore((state) => state.selectedSedeId);

  const sedeId = (() => {
    const n = Number(sedeIdRaw);
    return Number.isFinite(n) && n > 0 ? n : null;
  })();

  if (!tiendaId) {
    return (
      <Result
        status="warning"
        title="No se pudo identificar la tienda"
        subTitle="Inicia sesión nuevamente o selecciona una tienda para continuar"
      />
    );
  }

  if (!sedeId) {
    return (
      <Result
        status="info"
        title="Selecciona una sede para gestionar transferencias"
        subTitle="La sede activa será el origen de la transferencia. Usa el selector del encabezado."
      />
    );
  }

  return <TransferenciasTable tiendaId={tiendaId} sedeOrigenId={sedeId} />;
};

export default TransferenciasPage;
