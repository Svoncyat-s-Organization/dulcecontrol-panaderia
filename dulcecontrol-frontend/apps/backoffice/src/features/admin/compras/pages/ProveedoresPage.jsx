import { Result } from 'antd';
import { useTokenStore } from '../../../../shared/store/tokenStore.js';
import ProveedoresTable from '../components/ProveedoresTable/index.jsx';

const ProveedoresPage = () => {
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

  return <ProveedoresTable tiendaId={tiendaId} />;
};

export default ProveedoresPage;
