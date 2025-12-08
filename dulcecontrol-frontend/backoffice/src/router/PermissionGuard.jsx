import { Button, Result, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuthorizationStore } from '../shared/store/authorizationStore.js';
import { createPermissionSet, hasAnyPermission } from '../shared/utils/permissionUtils.js';

const PermissionGuard = ({ anyOf = [], children, fallback = null }) => {
  const navigate = useNavigate();
  const permissions = useAuthorizationStore((state) => state.permissions);
  const isLoading = useAuthorizationStore((state) => state.isLoading);

  if (!anyOf || anyOf.length === 0) {
    return children;
  }

  if (isLoading && permissions === null) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '64px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  const permissionSet = createPermissionSet(permissions);
  const allowed = hasAnyPermission(permissionSet, anyOf);

  if (!allowed) {
    if (fallback) {
      return fallback;
    }

    return (
      <Result
        status="403"
        title="Acceso restringido"
        subTitle="No cuentas con permisos habilitados para esta sección. Solicita acceso al administrador de la tienda."
        extra={
          <Button type="primary" onClick={() => navigate('/admin/tablero')}>
            Ir al tablero
          </Button>
        }
      />
    );
  }

  return children;
};

export default PermissionGuard;
