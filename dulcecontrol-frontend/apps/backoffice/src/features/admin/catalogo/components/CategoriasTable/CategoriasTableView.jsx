import { Avatar, Button, Card, Result, Space, Table, Tag, Typography, theme, Modal } from 'antd';
import { IconPhoto, IconPlus, IconRefresh, IconEdit, IconTrash } from '@tabler/icons-react';

const { Text, Title } = Typography;

const CategoriasTableView = ({
  categorias,
  loading,
  isError,
  onRetry,
  onCreate,
  onEdit,
  onDelete,
  deletingId,
  pagination,
  onPaginate,
}) => {
  const { token } = theme.useToken();

  if (isError) {
    return (
      <Result
        status="error"
        title="No se pudieron cargar las categorías"
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
      title: 'Imagen',
      dataIndex: 'urlImagen',
      key: 'imagen',
      width: 90,
      render: (_, record) => (
        <Avatar
          shape="square"
          size={56}
          src={record.urlImagen}
          icon={<IconPhoto size={24} />}
          style={{ backgroundColor: token.colorFillAlter }}
        />
      ),
    },
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
      render: (_, record) => (
        <Space orientation="vertical" size={0}>
          <Text strong>{record.nombre}</Text>
          <Text type="secondary">Slug: {record.slug}</Text>
        </Space>
      ),
    },
    {
      title: 'Orden',
      dataIndex: 'ordenVisual',
      key: 'ordenVisual',
      width: 120,
      render: (orden) => <Tag color="blue">#{orden}</Tag>,
    },
    {
      title: 'Estado',
      dataIndex: 'activa',
      key: 'activa',
      width: 140,
      render: (activa) => (
        <Tag color={activa ? 'green' : 'red'}>{activa ? 'Activa' : 'Inactiva'}</Tag>
      ),
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
            Categorías de productos
          </Title>
          <Text type="secondary">Gestiona las familias visibles en tus canales.</Text>
        </div>
        <Button type="primary" icon={<IconPlus size={16} />} onClick={onCreate}>
          Nueva categoría
        </Button>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={categorias}
        loading={loading}
        pagination={pagination}
        onChange={(nextPagination) =>
          onPaginate?.(nextPagination.current, nextPagination.pageSize)
        }
      />
    </Card>
  );
};

export default CategoriasTableView;
