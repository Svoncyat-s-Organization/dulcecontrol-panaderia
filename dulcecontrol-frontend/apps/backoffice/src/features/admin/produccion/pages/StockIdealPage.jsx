import { Result } from 'antd';
import { useTokenStore } from '../../../../shared/store/tokenStore.js';
import { useSedeStore } from '../../../../shared/store/sedeStore.js';
import StockIdealManager from '../components/StockIdeal/index.jsx';

const StockIdealPage = () => {
  const tiendaId = useTokenStore((state) => state.tiendaId);
  const sedeId = useSedeStore((state) => state.selectedSedeId);
  const sedeNombre = useSedeStore((state) => state.selectedSedeNombre);

  if (!tiendaId) {
    return (
      <Result
        status="warning"
        title="No se pudo identificar la tienda"
        subTitle="Vuelve a iniciar sesión para continuar"
      />
    );
  }

  if (!sedeId) {
    return (
      <Result
        status="info"
        title="Selecciona una sede"
        subTitle="El stock ideal se configura por sede. Usa el selector en el encabezado."
      />
    );
  }

  return <StockIdealManager tiendaId={tiendaId} sedeId={sedeId} sedeNombre={sedeNombre} />;
};

export default StockIdealPage;
