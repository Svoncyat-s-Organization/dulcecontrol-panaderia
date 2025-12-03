import { Result } from 'antd';
import UsuariosTable from '../components/UsuariosTable/index.jsx';
import { useTokenStore } from '../../../../shared/store/tokenStore.js';

const UsuariosPage = () => {
  const tiendaId = useTokenStore((state) => state.tiendaId);

  if (!tiendaId) {
    return (
      <Result
        status="warning"
        title="No se pudo identificar la tienda"
        subTitle="Vuelve a iniciar sesión para continuar gestionando la seguridad"
      />
    );
  }

  return <UsuariosTable />;
};

export default UsuariosPage;
