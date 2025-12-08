import { Result, Tabs } from 'antd';
import { useTokenStore } from '../../../../shared/store/tokenStore.js';
import { useSedeStore } from '../../../../shared/store/sedeStore.js';
import MovimientosProductosTable from '../components/MovimientosProductosTable/index.jsx';
import MovimientosInsumosTable from '../components/MovimientosInsumosTable/index.jsx';

const MovimientosPage = () => {
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
        title="Selecciona una sede para ver los movimientos"
        subTitle="Los kardex de inventario dependen de la sede activa. Usa el selector del encabezado."
      />
    );
  }

  const tabItems = [
    {
      key: 'productos',
      label: 'Kardex Productos',
      children: <MovimientosProductosTable tiendaId={tiendaId} sedeId={sedeId} />,
    },
    {
      key: 'insumos',
      label: 'Kardex Insumos',
      children: <MovimientosInsumosTable tiendaId={tiendaId} sedeId={sedeId} />,
    },
  ];

  return <Tabs defaultActiveKey="productos" items={tabItems} />;
};

export default MovimientosPage;
