import { useMemo } from 'react';
import { Button, Card, Result, Space, Table, Tag, Typography } from 'antd';
import { IconEye, IconEdit, IconPlus, IconRefresh, IconShieldLock, IconTrash } from '@tabler/icons-react';
import { formatDateTime } from '../../utils/dateFormatters.js';

const { Text, Title } = Typography;

const RolesManagerView = ({
  roles,
  permisos,
  loading,
  isError,
  onRetry,
  onCreate,
  onEdit,
  onDelete,
  onViewPermissions,
  deletingId,
}) => {
  if (isError) {
    return (
      <Result
        status="error"
        title="No se pudieron cargar los roles"
        subTitle="Intenta recargar la vista o verifica tu conexión"
        extra={
          <Button icon={<IconRefresh size={16} />} onClick={onRetry}>
            Reintentar
          </Button>
        }
      />
    );
  }

  const permisosList = Array.isArray(permisos) ? permisos : [];

  const permisosLookup = useMemo(() => {
    const map = new Map();
    permisosList.forEach((permiso) => {
      if (permiso?.slug) {
        map.set(permiso.slug, permiso);
      }
    });
    return map;
  }, [permisosList]);

  const dataSource = useMemo(() => {
    if (!Array.isArray(roles)) {
      return [];
    }
    return roles.map((rol) => {
      const resolvedPermisos = Array.isArray(rol.permisos)
        ? rol.permisos
            .map((slug) => permisosLookup.get(slug) ?? { slug, nombreVisible: slug, modulo: 'General' })
            .filter(Boolean)
        : [];

      const permisosPorModulo = resolvedPermisos.reduce((acc, permiso) => {
        const modulo = permiso.modulo ?? 'General';
        if (!acc.has(modulo)) {
          acc.set(modulo, []);
        }
        acc.get(modulo).push(permiso);
        return acc;
      }, new Map());

      return {
        ...rol,
        _resolvedPermisos: resolvedPermisos,
        _permisosPorModulo: permisosPorModulo,
      };
    });
  }, [roles, permisosLookup]);

  const columns = [
    {
      title: 'Rol',
      dataIndex: 'nombre',
      key: 'nombre',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Space size={8}>
            <Text strong>{record.nombre}</Text>
            {record.esSistema && (
              <Tag color="purple" icon={<IconShieldLock size={14} />}>
                Sistema
              </Tag>
            )}
          </Space>
          {record.descripcion && <Text type="secondary">{record.descripcion}</Text>}
        </Space>
      ),
    },
    {
      title: 'Usuarios asignados',
      dataIndex: 'totalUsuarios',
      key: 'totalUsuarios',
      width: 160,
      render: (value) => <Text>{value ?? 0}</Text>,
    },
    {
      title: 'Permisos',
      dataIndex: 'permisos',
      key: 'permisos',
      width: 220,
      render: (_, record) => {
        const total = record._resolvedPermisos?.length ?? 0;
        const modulos = record._permisosPorModulo?.size ?? 0;
        return (
          <Space direction="vertical" size={0}>
            <Text strong>{`${total} ${total === 1 ? 'permiso' : 'permisos'}`}</Text>
            <Text type="secondary">{`${modulos} ${modulos === 1 ? 'módulo' : 'módulos'}`}</Text>
            <Button
              type="link"
              size="small"
              icon={<IconEye size={14} />}
              onClick={() => onViewPermissions(record)}
              disabled={total === 0}
            >
              Ver detalle
            </Button>
          </Space>
        );
      },
    },
    {
      title: 'Actualizado',
      dataIndex: 'actualizadoEn',
      key: 'actualizadoEn',
      width: 200,
      render: (value) => <Text>{formatDateTime(value)}</Text>,
    },
    {
      title: 'Acciones',
      key: 'acciones',
      width: 200,
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<IconEdit size={16} />} onClick={() => onEdit(record)}>
            Editar
          </Button>
          <Button
            type="link"
            danger
            icon={<IconTrash size={16} />}
            onClick={() => onDelete(record)}
            loading={deletingId === record.id}
          >
            Eliminar
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card styles={{ body: { padding: 24 } }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
          marginBottom: 16,
        }}
      >
        <div>
          <Title level={4} style={{ margin: 0 }}>
            Roles corporativos
          </Title>
          <Text type="secondary">Agrupa permisos para administrar el acceso superadmin.</Text>
        </div>
        <Button
          type="primary"
          icon={<IconPlus size={16} />}
          onClick={onCreate}
          disabled={!permisosList.length}
        >
          Nuevo rol
        </Button>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        pagination={{ pageSize: 8, showSizeChanger: false }}
      />
    </Card>
  );
};

export default RolesManagerView;
