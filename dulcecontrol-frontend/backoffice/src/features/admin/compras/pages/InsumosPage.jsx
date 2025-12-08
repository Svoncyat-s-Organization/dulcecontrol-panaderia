import { Result } from 'antd';
import { useTokenStore } from '../../../../shared/store/tokenStore.js';
import InsumosTable from '../components/InsumosTable/index.jsx';

const InsumosPage = () => {
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

  return <InsumosTable tiendaId={tiendaId} />;
};

export default InsumosPage;
