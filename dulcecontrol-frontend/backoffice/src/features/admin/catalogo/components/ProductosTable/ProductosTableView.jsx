import { useState, useMemo } from 'react';
import { Avatar, Badge, Button, Card, Input, Result, Select, Space, Table, Tag, Typography, theme } from 'antd';
import { IconPhoto, IconPlus, IconRefresh, IconEdit, IconTrash, IconSearch } from '@tabler/icons-react';
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
  categorias = [],
}) => {
  const { token } = theme.useToken();
  const [searchText, setSearchText] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState(null);

  // Filtrar productos según búsqueda y filtros
  const productosFiltrados = useMemo(() => {
    return productos.filter((producto) => {
      // Búsqueda por nombre o SKU
      const coincideBusqueda = searchText === '' ||
        producto.nombre?.toLowerCase().includes(searchText.toLowerCase()) ||
        producto.sku?.toLowerCase().includes(searchText.toLowerCase());

      // Filtro por categoría
      const coincideCategoria = filtroCategoria === null || producto.categoriaId === filtroCategoria;

      // Filtro por estado
      const coincideEstado = filtroEstado === null ||
        (filtroEstado === 'activo' && producto.activo === true) ||
        (filtroEstado === 'inactivo' && producto.activo === false);

      return coincideBusqueda && coincideCategoria && coincideEstado;
    });
  }, [productos, searchText, filtroCategoria, filtroEstado]);

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
      width: 80,
      align: 'center',
      fixed: 'left',
      render: (_, record) => (
        <Avatar
          shape="square"
          size={56}
          src={record.urlImagenPrincipal}
          icon={<IconPhoto size={18} />}
          style={{ 
            backgroundColor: token.colorFillQuaternary,
            border: `1px solid ${token.colorBorderSecondary}`,
          }}
        />
      ),
    },
    {
      title: 'Producto',
      dataIndex: 'nombre',
      key: 'nombre',
      width: 280,
      fixed: 'left',
      ellipsis: true,
      render: (_, record) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Text strong style={{ fontSize: 14 }}>{record.nombre}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>SKU: {record.sku}</Text>
        </div>
      ),
    },
    {
      title: 'Categoría',
      dataIndex: 'categoriaNombre',
      key: 'categoria',
      width: 150,
      ellipsis: true,
      render: (nombre) => (
        <Text type={nombre ? undefined : 'secondary'} style={{ fontSize: 13 }}>
          {nombre || 'Sin categoría'}
        </Text>
      ),
    },
    {
      title: 'Precio',
      dataIndex: 'precioBase',
      key: 'precioBase',
      width: 100,
      align: 'right',
      render: (value) => (
        <Text strong style={{ fontSize: 14, color: token.colorPrimary }}>
          {formatPen(value)}
        </Text>
      ),
    },
    {
      title: 'Canales',
      key: 'canales',
      width: 180,
      render: (_, record) => (
        <Space size={4} wrap style={{ maxWidth: 180 }}>
          {record.visibleEnPos && (
            <Tag color="blue" style={{ margin: '2px 0', fontSize: 11 }}>POS</Tag>
          )}
          {record.visibleEnStorefront && (
            <Tag color="green" style={{ margin: '2px 0', fontSize: 11 }}>Web</Tag>
          )}
          {record.destacadoStorefront && (
            <Tag color="gold" style={{ margin: '2px 0', fontSize: 11 }}>★ Destacado</Tag>
          )}
        </Space>
      ),
    },
    {
      title: 'Estado',
      dataIndex: 'activo',
      key: 'activo',
      width: 100,
      align: 'center',
      render: (activo) => (
        <Badge 
          status={activo ? 'success' : 'default'} 
          text={activo ? 'Activo' : 'Inactivo'}
          style={{ fontSize: 12 }}
        />
      ),
    },
    {
      title: 'Acciones',
      key: 'actions',
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
          <Typography.Title level={4} style={{ margin: '0 0 4px 0', fontSize: 18 }}>
            Catálogo de productos
          </Typography.Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            Administra precios, fotos y disponibilidad
          </Text>
        </div>
        <Button 
          type="primary" 
          icon={<IconPlus size={16} />} 
          onClick={onCreate}
          size="large"
        >
          Nuevo producto
        </Button>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div
        style={{
          padding: '16px 24px',
          background: token.colorBgContainer,
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        <Space wrap size={12} style={{ width: '100%' }}>
          <Input
            placeholder="Buscar por nombre o SKU..."
            prefix={<IconSearch size={16} style={{ color: token.colorTextTertiary }} />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            style={{ width: 300 }}
            size="large"
          />
          <Select
            placeholder="Todas las categorías"
            value={filtroCategoria}
            onChange={setFiltroCategoria}
            allowClear
            style={{ width: 200 }}
            size="large"
            options={[
              ...categorias.map((cat) => ({
                label: cat.nombre,
                value: cat.id,
              })),
            ]}
          />
          <Select
            placeholder="Todos los estados"
            value={filtroEstado}
            onChange={setFiltroEstado}
            allowClear
            style={{ width: 160 }}
            size="large"
            options={[
              { label: 'Activos', value: 'activo' },
              { label: 'Inactivos', value: 'inactivo' },
            ]}
          />
          {(searchText || filtroCategoria || filtroEstado) && (
            <Tag color="blue" style={{ padding: '4px 12px', fontSize: 13 }}>
              {productosFiltrados.length} de {productos.length} productos
            </Tag>
          )}
        </Space>
      </div>

      <div style={{ padding: '0 24px 24px' }}>
        <Table
          rowKey="id"
          dataSource={productosFiltrados}
          columns={columns}
          loading={loading}
          scroll={{ x: 1300 }}
          size="middle"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total: ${total} productos`,
            position: ['bottomCenter'],
            style: { marginTop: 16 },
          }}
          style={{
            marginTop: 24,
          }}
        />
      </div>
    </Card>
  );
};

export default ProductosTableView;
