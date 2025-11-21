import { Avatar, Badge, Button, Card, Result, Space, Table, Tag, Typography, theme } from 'antd';
import { IconPhoto, IconPlus, IconRefresh, IconEdit, IconTrash } from '@tabler/icons-react';
import { formatPen } from '../../utils/currency.js';

const { Text } = Typography;

const tipoConfig = {
  PRODUCTO_TERMINADO: { label: 'Producto', color: 'blue' },
  INSUMO_VENTA: { label: 'Insumo', color: 'green' },
  SERVICIO: { label: 'Servicio', color: 'orange' },
};

const ProductosTableView = ({
  productos,
  loading,
  isError,
  onRetry,
  onCreate,
  onEdit,
  onDelete,
  deletingId,
}) => {
  const { token } = theme.useToken();

  if (isError) {
    return (
      <Result
        status="error"
        title="No se pudo cargar el catálogo"
        subTitle="Intenta nuevamente más tarde"
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
      dataIndex: 'urlImagenPrincipal',
      key: 'imagen',
      width: 90,
      render: (_, record) => (
        <Avatar
          shape="square"
          size={48}
          src={record.urlImagenPrincipal}
          icon={<IconPhoto size={20} />}
          style={{ backgroundColor: token.colorFillAlter }}
        />
      ),
    },
    {
      title: 'Producto',
      dataIndex: 'nombre',
      key: 'nombre',
      render: (_, record) => (
        <Space direction="vertical" size={2}>
          <Text strong>{record.nombre}</Text>
          <Text type="secondary">SKU: {record.sku}</Text>
        </Space>
      ),
    },
    {
      title: 'Precio',
      dataIndex: 'precioBase',
      key: 'precioBase',
      width: 140,
      render: (value) => <Text>{formatPen(value)}</Text>,
    },
    {
      title: 'Tipo',
      dataIndex: 'tipo',
      key: 'tipo',
      width: 160,
      render: (tipo) => {
        const meta = tipoConfig[tipo] ?? { label: tipo, color: 'default' };
        return <Tag color={meta.color}>{meta.label}</Tag>;
      },
    },
    {
      title: 'Estado',
      dataIndex: 'activo',
      key: 'activo',
      width: 150,
      render: (activo) => (
        <Badge status={activo ? 'success' : 'default'} text={activo ? 'Activo' : 'Inactivo'} />
      ),
    },
    {
      title: 'Acciones',
      key: 'actions',
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
    <Card
      style={{
        borderRadius: token.borderRadiusLG,
        background: token.colorBgContainer,
        boxShadow: token.boxShadowTertiary,
      }}
      bodyStyle={{ padding: 24 }}
    >
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
          <Typography.Title level={4} style={{ margin: 0 }}>
            Catálogo de productos
          </Typography.Title>
          <Text type="secondary">Administra precios, fotos y disponibilidad.</Text>
        </div>
        <Button type="primary" icon={<IconPlus size={16} />} onClick={onCreate}>
          Nuevo producto
        </Button>
      </div>

      <Table
        rowKey="id"
        dataSource={productos}
        columns={columns}
        loading={loading}
        pagination={{ pageSize: 10, showSizeChanger: true }}
      />
    </Card>
  );
};

export default ProductosTableView;
