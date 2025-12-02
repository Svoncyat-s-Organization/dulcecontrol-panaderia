import { Result } from 'antd';
import { useTokenStore } from '../../../../shared/store/tokenStore.js';
import RecetasManager from '../components/Recetas/index.jsx';

const RecetasPage = () => {
  const tiendaId = useTokenStore((state) => state.tiendaId);

  if (!tiendaId) {
    return (
      <Result
        status="warning"
        title="No se pudo identificar la tienda"
        subTitle="Vuelve a iniciar sesión para continuar"
      />
    );
  }

  return <RecetasManager tiendaId={tiendaId} />;
};

export default RecetasPage;
