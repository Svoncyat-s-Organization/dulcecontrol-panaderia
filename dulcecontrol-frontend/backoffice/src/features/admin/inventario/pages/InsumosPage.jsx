import { Result } from 'antd';
import { useTokenStore } from '../../../../shared/store/tokenStore.js';
import { useSedeStore } from '../../../../shared/store/sedeStore.js';
import InventarioInsumosTable from '../components/InventarioInsumosTable/index.jsx';

const InsumosPage = () => {
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
        title="Selecciona una sede para ver el inventario"
        subTitle="El stock de insumos se controla por sede. Usa el selector del encabezado."
      />
    );
  }

  return <InventarioInsumosTable tiendaId={tiendaId} sedeId={sedeId} />;
};

export default InsumosPage;
