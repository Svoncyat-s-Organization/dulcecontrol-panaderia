import ExistenciasTable from '../components/ExistenciasTable/index.jsx';
import { useTokenStore } from '../../../../shared/store/tokenStore.js';
import { useSedeStore } from '../../../../shared/store/sedeStore.js';
import { Result } from 'antd';

const ExistenciasPage = () => {
  const tiendaId = useTokenStore((state) => state.tiendaId);
  const sedeId = useSedeStore((state) => state.selectedSedeId);

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
        title="Selecciona una sede para continuar"
        subTitle="El inventario se muestra por sede. Usa el selector en el encabezado para elegir una."
      />
    );
  }

  return <ExistenciasTable tiendaId={tiendaId} sedeId={sedeId} />;
};

export default ExistenciasPage;
