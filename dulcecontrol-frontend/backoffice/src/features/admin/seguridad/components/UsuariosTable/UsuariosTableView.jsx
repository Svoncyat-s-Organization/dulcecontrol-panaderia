import { Button, Card, Input, Result, Space, Table, Tag, Typography } from 'antd';
import {
  IconEdit,
  IconPlus,
  IconRefresh,
  IconSearch,
  IconTrash,
} from '@tabler/icons-react';
import { formatDateTime } from '../../utils/dateFormatters.js';

const { Text, Title } = Typography;

const UsuariosTableView = ({
  usuarios,
  loading,
  isError,
  onRetry,
  onCreate,
  onEdit,
  onDelete,
  onSearch,
  searchText,
  deletingId,
  rolesLoading,
  rolesReady,
  sedesLoading,
  sedesReady,
  showInactiveOnly,
  onToggleInactive,
}) => {
  if (isError) {
    return (
      <Result
        status="error"
        title="No se pudieron cargar los usuarios"
        subTitle="Intenta recargar la página o verifica tu conexión"
        extra={
          <Button icon={<IconRefresh size={16} />} onClick={onRetry}>
            Reintentar
          </Button>
        }
      />
    );
  }

  const columns = [
    {
      title: 'Colaborador',
      dataIndex: 'nombres',
      key: 'nombres',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{record.nombres}</Text>
          <Text type="secondary">{record.correo}</Text>
        </Space>
      ),
    },
    {
      title: 'Documento',
      dataIndex: 'numeroDoc',
      key: 'documento',
      render: (_, record) => (
        <Text type="secondary">
          {record.tipoDoc}: {record.numeroDoc}
        </Text>
      ),
      width: 180,
    },
    {
      title: 'Rol',
      dataIndex: 'rolNombre',
      key: 'rol',
      render: (rolNombre) => <Text>{rolNombre ?? 'Sin rol asignado'}</Text>,
      width: 200,
    },
    {
      title: 'Sedes',
      dataIndex: 'sedes',
      key: 'sedes',
      render: (_, record) => {
        if (Array.isArray(record.sedes) && record.sedes.length > 0) {
          return (
            <Space wrap size={[4, 4]}>
              {record.sedes
                .filter(Boolean)
                .map((nombre) => (
                  <Tag key={`${record.id}-${nombre}`} color="blue">{nombre}</Tag>
                ))}
            </Space>
          );
        }
        if (record.sedeNombre) {
          return <Tag color="blue">{record.sedeNombre}</Tag>;
        }
        return <Text type="secondary">Sin sede asignada</Text>;
      },
      width: 240,
    },
    {
      title: 'Estado',
      dataIndex: 'activo',
      key: 'estado',
      width: 120,
      render: (activo) => {
        const isActive = activo === true;
        return <Tag color={isActive ? 'green' : 'red'}>{isActive ? 'Activo' : 'Inactivo'}</Tag>;
      },
    },
    {
      title: 'Último acceso',
      dataIndex: 'ultimoAccesoEn',
      key: 'ultimoAccesoEn',
      width: 200,
      render: (value) => <Text>{formatDateTime(value, 'Sin acceso')}</Text>,
    },
    {
      title: 'Creado el',
      dataIndex: 'creadoEn',
      key: 'creadoEn',
      width: 200,
      render: (value) => <Text>{formatDateTime(value)}</Text>,
    },
    {
      title: 'Acciones',
      key: 'acciones',
      width: 180,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<IconEdit size={16} />}
            onClick={() => onEdit(record)}
          >
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
            Usuarios
          </Title>
          <Text type="secondary">
            Administra los accesos del personal y mantén el control de la seguridad.
          </Text>
        </div>
        <Button
          type="primary"
          icon={<IconPlus size={16} />}
          onClick={onCreate}
          disabled={rolesLoading || !rolesReady || sedesLoading || !sedesReady}
        >
          Nuevo usuario
        </Button>
      </div>

      <div
        style={{
          marginBottom: 16,
          display: 'flex',
          gap: 12,
          flexWrap: 'wrap',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}
      >
        <Input
          placeholder="Buscar por nombre, rol, sede o correo..."
          prefix={<IconSearch size={16} />}
          value={searchText}
          onChange={(event) => onSearch(event.target.value)}
          allowClear
          style={{ maxWidth: 420 }}
        />
        <Button onClick={onToggleInactive} type={showInactiveOnly ? 'primary' : 'default'}>
          {showInactiveOnly ? 'Mostrar activos' : 'Mostrar inactivos'}
        </Button>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={usuarios}
        loading={loading}
        pagination={{ pageSize: 10, showSizeChanger: false }}
      />
    </Card>
  );
};

export default UsuariosTableView;
