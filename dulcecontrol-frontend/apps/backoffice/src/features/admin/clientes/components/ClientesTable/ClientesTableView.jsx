import { Button, Card, Input, Result, Space, Table, Tag, Typography } from 'antd';
import { IconPlus, IconRefresh, IconEdit, IconEye, IconTrash, IconSearch } from '@tabler/icons-react';

const { Text, Title } = Typography;

const ClientesTableView = ({
  clientes,
  loading,
  isError,
  onRetry,
  onCreate,
  onEdit,
  onView,
  onDelete,
  onSearch,
  searchText,
  deletingId,
  pagination,
  onPaginate,
}) => {
  if (isError) {
    return (
      <Result
        status="error"
        title="No se pudieron cargar los clientes"
        subTitle="Verifica tu conexión e inténtalo nuevamente"
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
      title: 'Cliente',
      dataIndex: 'nombreDoc',
      key: 'nombreDoc',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{record.nombreDoc}</Text>
          <Text type="secondary">
            {record.tipoDoc}: {record.numeroDoc}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Contacto',
      dataIndex: 'email',
      key: 'contacto',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          {record.email && <Text>{record.email}</Text>}
          {record.telefono && <Text type="secondary">{record.telefono}</Text>}
        </Space>
      ),
    },
    {
      title: 'Tipo',
      dataIndex: 'esUsuarioVirtual',
      key: 'tipo',
      width: 120,
      render: (esUsuarioVirtual) => (
        <Tag color={esUsuarioVirtual ? 'blue' : 'default'}>
          {esUsuarioVirtual ? 'Virtual' : 'Físico'}
        </Tag>
      ),
    },
    {
      title: 'Estado',
      dataIndex: 'activo',
      key: 'activo',
      width: 100,
      render: (activo) => (
        <Tag color={activo ? 'green' : 'red'}>
          {activo ? 'Activo' : 'Inactivo'}
        </Tag>
      ),
    },
    {
      title: 'Acciones',
      key: 'acciones',
      width: 220,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<IconEye size={16} />}
            onClick={() => onView(record)}
          >
            Ver
          </Button>
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
            Clientes
          </Title>
          <Text type="secondary">
            Gestiona la información de tus clientes corporativos y retail.
          </Text>
        </div>
        <Button type="primary" icon={<IconPlus size={16} />} onClick={onCreate}>
          Nuevo cliente
        </Button>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Input
          placeholder="Buscar por nombre, email o documento..."
          prefix={<IconSearch size={16} />}
          value={searchText}
          onChange={(e) => onSearch(e.target.value)}
          allowClear
          style={{ maxWidth: 400 }}
        />
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={clientes}
        loading={loading}
        pagination={pagination}
        onChange={(nextPagination) =>
          onPaginate?.(nextPagination.current, nextPagination.pageSize)
        }
      />
    </Card>
  );
};

export default ClientesTableView;