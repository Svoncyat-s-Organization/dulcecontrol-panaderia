import { useMemo } from 'react';
import { Button, Card, Result, Space, Table, Tag, Tooltip, Typography } from 'antd';
import {
  IconEye,
  IconPlus,
  IconRefresh,
  IconShieldLock,
  IconEdit,
  IconTrash,
} from '@tabler/icons-react';
import {
  buildAdminAccessStructure,
  groupPermissionsForDisplay,
} from '../../../../../shared/permissions/adminPermissionConfig.js';

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

  const isSystemRole = (value) => {
    if (value === true || value === 1) {
      return true;
    }
    if (value === false || value === 0) {
      return false;
    }
    if (typeof value === 'string') {
      const normalized = value.trim().toLowerCase();
      if (!normalized.length) {
        return false;
      }
      return ['true', '1', 's', 'si', 'y', 'yes', 't'].includes(normalized);
    }
    return false;
  };

  const permisosById = useMemo(() => {
    const lookup = new Map();
    (permisos ?? []).forEach((permiso) => {
      if (permiso?.id) {
        lookup.set(permiso.id, permiso);
      }
    });
    return lookup;
  }, [permisos]);

  const dataSource = useMemo(() => {
    if (!Array.isArray(roles)) {
      return [];
    }
    return roles.map((rol) => {
      const resolvedPermisos = Array.isArray(rol.permisos)
        ? rol.permisos
            .map((permiso) => {
              if (permiso && typeof permiso === 'object') {
                return permiso;
              }
              return permisosById.get(permiso);
            })
            .filter(Boolean)
        : [];

      const grouped = groupPermissionsForDisplay(resolvedPermisos);
      const accessSlugs = new Set();
      grouped.forEach((group) => {
        group.permisos.forEach((permiso) => {
          if (permiso?.slug) {
            accessSlugs.add(permiso.slug);
          }
        });
      });
      const accessTree = buildAdminAccessStructure(accessSlugs);
      const moduleCount = accessTree.length;
      const submoduleCount = accessTree.reduce(
        (total, module) => total + (Array.isArray(module.children) ? module.children.length : 0),
        0,
      );

      return {
        ...rol,
        _permissionSummary: {
          grouped,
          accessTree,
          moduleCount,
          submoduleCount,
        },
      };
    });
  }, [roles, permisosById]);

  const columns = [
    {
      title: 'Rol',
      dataIndex: 'nombre',
      key: 'nombre',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Space size={8}>
            <Text strong>{record.nombre}</Text>
            {isSystemRole(record.esSistema) && (
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
      title: 'Permisos asignados',
      dataIndex: 'permisos',
      key: 'permisos',
      width: 200,
      render: (_, record) => {
        const summary = record._permissionSummary ?? {
          moduleCount: 0,
          submoduleCount: 0,
        };
        const { moduleCount, submoduleCount } = summary;
        const moduleLabel = moduleCount === 1 ? 'módulo' : 'módulos';
        const submoduleLabel = submoduleCount === 1 ? 'submódulo' : 'submódulos';

        return (
          <Space direction="vertical" size={0}>
            <Text strong>{`${moduleCount} ${moduleLabel}`}</Text>
            <Text type="secondary">
              {submoduleCount > 0 ? `${submoduleCount} ${submoduleLabel}` : 'Sin submódulos'}
            </Text>
            <Button
              type="link"
              size="small"
              icon={<IconEye size={14} />}
              onClick={() => onViewPermissions(record)}
              disabled={moduleCount === 0 && submoduleCount === 0}
            >
              Ver detalle
            </Button>
          </Space>
        );
      },
    },
    {
      title: 'Acciones',
      key: 'acciones',
      width: 200,
      render: (_, record) => {
        const systemRole = isSystemRole(record.esSistema);
        const deleteButton = (
          <Button
            type="link"
            danger
            icon={<IconTrash size={16} />}
            onClick={() => onDelete(record)}
            loading={deletingId === record.id}
          >
            Eliminar
          </Button>
        );

        return (
          <Space>
            <Button
              type="link"
              icon={<IconEdit size={16} />}
              onClick={() => onEdit(record)}
            >
              Editar
            </Button>
            {systemRole ? (
              <Tooltip title="Rol del sistema: no se puede eliminar">
                <span>{deleteButton}</span>
              </Tooltip>
            ) : (
              deleteButton
            )}
          </Space>
        );
      },
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
            Roles y permisos
          </Title>
          <Text type="secondary">
            Define perfiles de acceso consistentes para tu equipo administrativo.
          </Text>
        </div>
        <Button
          type="primary"
          icon={<IconPlus size={16} />}
          onClick={onCreate}
          disabled={permisos.length === 0}
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
