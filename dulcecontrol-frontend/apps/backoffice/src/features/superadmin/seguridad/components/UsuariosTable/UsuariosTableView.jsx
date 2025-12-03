import { Button, Card, Input, Result, Space, Table, Tag, Typography } from 'antd';
import { IconEdit, IconPlus, IconRefresh, IconSearch, IconTrash } from '@tabler/icons-react';
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
}) => {
  if (isError) {
    return (
      <Result
        status="error"
        title="No se pudieron cargar los superadministradores"
        subTitle="Intenta recargar la vista o verifica tu conexión"
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
      title: 'Superadmin',
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
      width: 180,
      render: (_, record) => (
        <Text type="secondary">
          {record.tipoDoc}: {record.numeroDoc ?? 'Sin dato'}
        </Text>
      ),
    },
    {
      title: 'Teléfono',
      dataIndex: 'telefono',
      key: 'telefono',
      width: 160,
      render: (telefono) => <Text>{telefono ?? '—'}</Text>,
    },
    {
      title: 'Estado',
      dataIndex: 'activo',
      key: 'estado',
      width: 120,
      render: (activo) => <Tag color={activo ? 'green' : 'red'}>{activo ? 'Activo' : 'Inactivo'}</Tag>,
    },
    {
      title: 'Última actualización',
      dataIndex: 'actualizadoEn',
      key: 'actualizadoEn',
      width: 200,
      render: (value) => <Text>{formatDateTime(value)}</Text>,
    },
    {
      title: 'Acciones',
      key: 'acciones',
      width: 180,
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
            Equipo superadmin
          </Title>
          <Text type="secondary">
            Controla quién tiene acceso corporativo al panel global de DulceControl.
          </Text>
        </div>
        <Button type="primary" icon={<IconPlus size={16} />} onClick={onCreate}>
          Nuevo superadmin
        </Button>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Input
          placeholder="Buscar por nombre, correo o documento..."
          prefix={<IconSearch size={16} />}
          value={searchText}
          onChange={(event) => onSearch(event.target.value)}
          allowClear
          style={{ maxWidth: 420 }}
        />
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
