import { Result } from 'antd';
import RolesManager from '../components/RolesManager/index.jsx';
import { useTokenStore } from '../../../../shared/store/tokenStore.js';

const RolesPage = () => {
  const tiendaId = useTokenStore((state) => state.tiendaId);

  if (!tiendaId) {
    return (
      <Result
        status="warning"
        title="No se pudo identificar la tienda"
        subTitle="Vuelve a iniciar sesión para gestionar roles y permisos"
      />
    );
  }

  return <RolesManager />;
};

export default RolesPage;
