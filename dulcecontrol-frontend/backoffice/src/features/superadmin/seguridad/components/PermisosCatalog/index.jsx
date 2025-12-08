import { useMemo } from 'react';
import { Button, Card, Empty, Result, Space, Typography } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { IconListDetails, IconRefresh } from '@tabler/icons-react';
import { getSuperadminPermisos } from '../../api/seguridad.api.js';
import { SUPERADMIN_SEGURIDAD_KEYS } from '../../constants/queryKeys.js';

const { Title, Text } = Typography;

const PermisosCatalog = () => {
  const permisosQuery = useQuery({
    queryKey: SUPERADMIN_SEGURIDAD_KEYS.permisos(),
    queryFn: getSuperadminPermisos,
    staleTime: 10 * 60 * 1000,
  });

  if (permisosQuery.isError) {
    return (
      <Result
        status="error"
        title="No se pudieron cargar los permisos"
        subTitle="Intenta recargar la vista o verifica tu conexión"
        extra={
          <Button icon={<IconRefresh size={16} />} onClick={() => permisosQuery.refetch()}>
            Reintentar
          </Button>
        }
      />
    );
  }

  const grouped = useMemo(() => {
    const mapa = new Map();
    (permisosQuery.data ?? []).forEach((permiso) => {
      const modulo = permiso.modulo ?? 'General';
      if (!mapa.has(modulo)) {
        mapa.set(modulo, []);
      }
      mapa.get(modulo).push(permiso);
    });
    return Array.from(mapa.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [permisosQuery.data]);

  if (permisosQuery.isLoading) {
    return (
      <Card>
        <Text>Cargando permisos corporativos...</Text>
      </Card>
    );
  }

  if (!grouped.length) {
    return (
      <Empty description="No hay permisos registrados todavía" />
    );
  }

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      {grouped.map(([modulo, permisos]) => (
        <Card key={modulo}>
          <Space direction="vertical" size={12} style={{ width: '100%' }}>
            <Space size={8}>
              <IconListDetails size={18} />
              <Title level={5} style={{ margin: 0 }}>
                {modulo}
              </Title>
            </Space>
            <Space direction="vertical" size={6} style={{ width: '100%' }}>
              {permisos.map((permiso) => (
                <div key={permiso.slug}>
                  <Text strong>{permiso.nombreVisible}</Text>
                  <div>
                    <Text type="secondary">{permiso.slug}</Text>
                  </div>
                </div>
              ))}
            </Space>
          </Space>
        </Card>
      ))}
    </Space>
  );
};

export default PermisosCatalog;
