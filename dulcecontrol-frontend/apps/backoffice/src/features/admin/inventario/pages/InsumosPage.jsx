import { Result } from 'antd';
import { useTokenStore } from '../../../../shared/store/tokenStore.js';
import InventarioInsumosTable from '../components/InventarioInsumosTable/index.jsx';

const InsumosPage = () => {
  const tiendaId = useTokenStore((state) => state.tiendaId);
  const sedeId = useTokenStore((state) => state.sedeId ?? null);

  if (!tiendaId) {
    return (
      <Result
        status="warning"
        title="No se pudo identificar la tienda"
        subTitle="Inicia sesión nuevamente o selecciona una tienda para continuar"
      />
    );
  }

  return <InventarioInsumosTable tiendaId={tiendaId} sedeId={sedeId} />;
};

export default InsumosPage;
