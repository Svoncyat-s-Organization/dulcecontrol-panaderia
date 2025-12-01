import { Result } from 'antd';
import { useTokenStore } from '../../../../shared/store/tokenStore.js';
import OrdenesCompraTable from '../components/OrdenesCompraTable/index.jsx';

const OrdenesCompraPage = () => {
  const tiendaId = useTokenStore((state) => state.tiendaId);

  if (!tiendaId) {
    return (
      <Result
        status="warning"
        title="No se pudo identificar la tienda"
        subTitle="Inicia sesión nuevamente o selecciona una tienda para continuar"
      />
    );
  }

  return <OrdenesCompraTable tiendaId={tiendaId} />;
};

export default OrdenesCompraPage;
