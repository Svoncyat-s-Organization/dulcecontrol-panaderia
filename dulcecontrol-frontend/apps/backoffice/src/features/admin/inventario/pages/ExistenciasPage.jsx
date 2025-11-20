import ExistenciasTable from '../components/ExistenciasTable/index.jsx';
import { useTokenStore } from '../../../../shared/store/tokenStore.js';
import { Result } from 'antd';

const ExistenciasPage = () => {
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

  return <ExistenciasTable tiendaId={tiendaId} sedeId={sedeId} />;
};

export default ExistenciasPage;
