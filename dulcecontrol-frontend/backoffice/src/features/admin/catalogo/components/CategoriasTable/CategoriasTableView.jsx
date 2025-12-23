import { Avatar, Badge, Button, Card, Result, Space, Table, Tag, Typography, theme } from 'antd';
import { IconPhoto, IconPlus, IconRefresh, IconEdit, IconTrash, IconPackage } from '@tabler/icons-react';

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
      width: 80,
      align: 'center',
      fixed: 'left',
      render: (_, record) => (
        <Avatar
          shape="square"
          size={56}
          src={record.urlImagen ?? record.url_imagen}
          icon={<IconPhoto size={18} />}
          style={{ 
            backgroundColor: token.colorFillQuaternary,
            border: `1px solid ${token.colorBorderSecondary}`,
          }}
        >
          {(!record.urlImagen && !record.url_imagen && record.icono)
            ? String(record.icono).slice(0, 2).toUpperCase()
            : null}
        </Avatar>
      ),
    },
    {
      title: 'Categoría',
      dataIndex: 'nombre',
      key: 'nombre',
      width: 280,
      fixed: 'left',
      ellipsis: true,
      render: (_, record) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Text strong style={{ fontSize: 14 }}>{record.nombre}</Text>
          <Text type="secondary" style={{ fontSize: 12, fontFamily: 'monospace' }}>
            /{record.slug}
          </Text>
        </div>
      ),
    },
    {
      title: 'Productos',
      dataIndex: 'productosCount',
      key: 'productosCount',
      width: 120,
      align: 'center',
      render: (count) => (
        <Space size={4}>
          <IconPackage size={16} style={{ color: token.colorTextTertiary }} />
          <Text strong style={{ fontSize: 14 }}>
            {count || 0}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Orden',
      dataIndex: 'ordenVisual',
      key: 'ordenVisual',
      width: 90,
      align: 'center',
      render: (orden) => (
        <Tag color="blue" style={{ margin: 0 }}>
          #{orden}
        </Tag>
      ),
    },
    {
      title: 'Estado',
      dataIndex: 'activa',
      key: 'activa',
      width: 100,
      align: 'center',
      render: (activa) => (
        <Badge 
          status={activa ? 'success' : 'default'} 
          text={activa ? 'Activa' : 'Inactiva'}
          style={{ fontSize: 12 }}
        />
      ),
    },
    {
      title: 'Acciones',
      key: 'acciones',
      width: 160,
      align: 'center',
      fixed: 'right',
      render: (_, record) => (
        <Space size={0}>
          <Button
            type="text"
            icon={<IconEdit size={16} />}
            onClick={() => onEdit(record)}
            style={{ color: token.colorPrimary }}
          >
            Editar
          </Button>
          <Button
            type="text"
            danger
            icon={<IconTrash size={16} />}
            onClick={() => onDelete(record)}
            loading={deletingId === (record.id ?? record.categoriaId ?? record.idCategoria ?? record.categoria_id)}
            disabled={deletingId === (record.id ?? record.categoriaId ?? record.idCategoria ?? record.categoria_id)}
            title={(record.productosCount ?? 0) > 0 ? 'Se reasignarán productos a “Sin categoría” y luego se eliminará.' : ''}
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
        boxShadow: token.boxShadow,
      }}
      styles={{ body: { padding: 0 } }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          padding: '20px 24px',
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
          background: token.colorBgLayout,
        }}
      >
        <div>
          <Title level={4} style={{ margin: '0 0 4px 0', fontSize: 18 }}>
            Categorías de productos
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            Organiza tu catálogo para POS y Tienda Virtual
          </Text>
        </div>
        <Button 
          type="primary" 
          icon={<IconPlus size={16} />} 
          onClick={onCreate}
          size="large"
        >
          Nueva categoría
        </Button>
      </div>

      <div style={{ padding: '0 24px 24px' }}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={categorias}
          loading={loading}
          scroll={{ x: 1000 }}
          size="middle"
          pagination={{
            ...pagination,
            position: ['bottomCenter'],
            style: { marginTop: 16 },
          }}
          onChange={(nextPagination) =>
            onPaginate?.(nextPagination.current, nextPagination.pageSize)
          }
          style={{
            marginTop: 24,
          }}
        />
      </div>
    </Card>
  );
};

export default CategoriasTableView;
