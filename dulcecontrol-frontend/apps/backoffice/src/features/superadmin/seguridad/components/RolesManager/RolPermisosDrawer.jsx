import { useMemo } from 'react';
import { Divider, Drawer, Empty, List, Tag, Typography } from 'antd';

const { Title, Text } = Typography;

const RolPermisosDrawer = ({ open, onClose, rol, permisosCatalog }) => {
  const lookup = useMemo(() => {
    const map = new Map();
    (permisosCatalog ?? []).forEach((permiso) => {
      if (permiso?.slug) {
        map.set(permiso.slug, permiso);
      }
    });
    return map;
  }, [permisosCatalog]);

  const groupedPermisos = useMemo(() => {
    if (!rol?.permisos) {
      return [];
    }
    const grouped = new Map();
    rol.permisos.forEach((slug) => {
      const permiso = lookup.get(slug) ?? { slug, nombreVisible: slug, modulo: 'General' };
      const modulo = permiso.modulo ?? 'General';
      if (!grouped.has(modulo)) {
        grouped.set(modulo, []);
      }
      grouped.get(modulo).push(permiso);
    });
    return Array.from(grouped.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [rol, lookup]);

  return (
    <Drawer
      title={rol ? `Permisos asignados • ${rol.nombre}` : 'Permisos del rol'}
      placement="right"
      width={420}
      onClose={onClose}
      open={open}
    >
      {!groupedPermisos.length ? (
        <Empty description="Este rol aún no tiene permisos asignados" />
      ) : (
        groupedPermisos.map(([modulo, permisos], index) => (
          <div key={modulo} style={{ marginBottom: 24 }}>
            <Title level={5} style={{ marginBottom: 8 }}>
              {modulo}
            </Title>
            <List
              dataSource={permisos}
              split
              renderItem={(permiso) => (
                <List.Item>
                  <div>
                    <Text strong>{permiso.nombreVisible}</Text>
                    <div>
                      <Tag color="geekblue">{permiso.slug}</Tag>
                    </div>
                  </div>
                </List.Item>
              )}
            />
            {index < groupedPermisos.length - 1 && <Divider style={{ margin: '16px 0' }} />}
          </div>
        ))
      )}
    </Drawer>
  );
};

export default RolPermisosDrawer;
