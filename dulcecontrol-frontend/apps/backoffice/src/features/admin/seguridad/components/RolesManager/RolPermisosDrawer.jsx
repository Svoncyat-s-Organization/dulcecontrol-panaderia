import { useMemo } from 'react';
import { Drawer, Space, Tag, Typography } from 'antd';
import {
  buildAdminAccessStructure,
  isAdminAccessPermission,
} from '../../../../../shared/permissions/adminPermissionConfig.js';

const { Title, Text } = Typography;

const RolPermisosDrawer = ({ open, onClose, rol, permisosCatalog }) => {
  const accessTree = useMemo(() => {
    if (!rol) {
      return [];
    }
    if (rol._permissionSummary?.accessTree) {
      return rol._permissionSummary.accessTree;
    }
    if (!rol.permisos || !permisosCatalog?.length) {
      return [];
    }
    const selectedIds = new Set(Array.from(rol.permisos));
    const permisosSeleccionados = permisosCatalog.filter((permiso) => selectedIds.has(permiso.id));
    const accessSlugs = permisosSeleccionados
      .filter((permiso) => isAdminAccessPermission(permiso.slug))
      .map((permiso) => permiso.slug);
    return buildAdminAccessStructure(accessSlugs);
  }, [rol, permisosCatalog]);

  const moduleCount = accessTree.length;
  const submoduleCount = accessTree.reduce(
    (total, module) => total + (Array.isArray(module.children) ? module.children.length : 0),
    0,
  );

  return (
    <Drawer
      title={rol ? `Permisos del rol ${rol.nombre}` : 'Permisos del rol'}
      open={open}
      width={420}
      onClose={onClose}
      destroyOnClose
    >
      {!rol ? (
        <Text type="secondary">Selecciona un rol para ver sus permisos.</Text>
      ) : (
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          {moduleCount === 0 && submoduleCount === 0 ? (
            <Text type="secondary">Este rol no tiene accesos a módulos del administrador.</Text>
          ) : (
            <>
              <Space size={32}>
                <div>
                  <Text strong style={{ fontSize: 18, display: 'block' }}>{moduleCount}</Text>
                  <Text type="secondary" style={{ display: 'block' }}>
                    {moduleCount === 1 ? 'módulo' : 'módulos'}
                  </Text>
                </div>
                <div>
                  <Text strong style={{ fontSize: 18, display: 'block' }}>{submoduleCount}</Text>
                  <Text type="secondary" style={{ display: 'block' }}>
                    {submoduleCount === 1 ? 'submódulo' : 'submódulos'}
                  </Text>
                </div>
              </Space>
              {accessTree.map((module) => (
                <div key={module.key}>
                  <Title level={5} style={{ marginBottom: 8 }}>
                    {module.label}
                  </Title>
                  {Array.isArray(module.children) && module.children.length > 0 ? (
                    <Space wrap>
                      {module.children.map((child) => (
                        <Tag key={child.key} color="blue">
                          {child.label}
                        </Tag>
                      ))}
                    </Space>
                  ) : (
                    <Text type="secondary">Acceso completo al módulo.</Text>
                  )}
                </div>
              ))}
            </>
          )}
        </Space>
      )}
    </Drawer>
  );
};

export default RolPermisosDrawer;
