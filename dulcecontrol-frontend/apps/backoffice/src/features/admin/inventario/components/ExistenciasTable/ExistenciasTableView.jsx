import { useState } from 'react';
import { Avatar, Badge, Button, Card, Input, Result, Select, Space, Table, Tag, Typography, theme } from 'antd';
import { IconEdit, IconSearch } from '@tabler/icons-react';

const { Text, Title } = Typography;

const getEstadoBadge = (estadoStock, stockIdeal) => {
  if (!stockIdeal) {
    return <Badge status="default" text="Sin configurar" />;
  }
  
  switch (estadoStock) {
    case 'OK':
      return <Badge status="success" text="Stock OK" />;
    case 'BAJO_STOCK':
      return <Badge status="warning" text="Bajo stock" />;
    case 'CRITICO':
      return <Badge status="error" text="Crítico" />;
    default:
      return <Badge status="default" text="Sin datos" />;
  }
};

const ExistenciasTableView = ({ inventarios, loading, isError, onRetry, onAdjust, sedeId, categorias = [] }) => {
  const { token } = theme.useToken();
  const [searchText, setSearchText] = useState('');
  const [categoriaFilter, setCategoriaFilter] = useState(null);
  const [estadoFilter, setEstadoFilter] = useState(null);
  
  // Filtrar datos
  const filteredData = inventarios?.filter(item => {
    const matchSearch = !searchText || 
      item.nombreProducto?.toLowerCase().includes(searchText.toLowerCase()) ||
      item.sku?.toLowerCase().includes(searchText.toLowerCase());
    
    const matchCategoria = !categoriaFilter || item.categoriaNombre === categoriaFilter;
    
    const matchEstado = !estadoFilter || item.estadoStock === estadoFilter;
    
    return matchSearch && matchCategoria && matchEstado;
  }) || [];

  if (isError) {
    return (
      <Result
        status="error"
        title="No se pudo cargar el inventario"
        subTitle="Intenta refrescar o selecciona otra sede"
        extra={
          <Button type="primary" onClick={onRetry}>
            Reintentar
          </Button>
        }
      />
    );
  }

  const columns = [
    {
      title: 'Producto',
      dataIndex: 'nombreProducto',
      key: 'producto',
      width: 300,
      fixed: 'left',
      render: (_, record) => (
        <Space>
          <Avatar shape="square" size={56} src={record.imagenUrl}>
            {record.nombreProducto?.charAt(0) ?? '?'}
          </Avatar>
          <Space direction="vertical" size={0}>
            <Text strong>{record.nombreProducto}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>SKU: {record.sku}</Text>
          </Space>
        </Space>
      ),
    },
    {
      title: 'Categoría',
      dataIndex: 'categoriaNombre',
      key: 'categoria',
      width: 150,
      render: (nombre) => nombre ? <Tag>{nombre}</Tag> : <Text type="secondary">Sin categoría</Text>,
    },
    {
      title: 'Ubicación',
      dataIndex: 'ubicacionFisica',
      key: 'ubicacion',
      width: 150,
      render: (ubicacion) => ubicacion || <Text type="secondary">Sin ubicación</Text>,
    },
    {
      title: 'Stock Actual',
      dataIndex: 'cantidadActual',
      key: 'cantidadActual',
      width: 120,
      align: 'center',
      render: (cantidad, record) => (
        <Space direction="vertical" size={0} align="center">
          <Text
            strong
            style={{
              fontSize: 20,
              color: record.estadoStock === 'CRITICO' ? token.colorError : 
                     record.estadoStock === 'BAJO_STOCK' ? token.colorWarning : 
                     token.colorSuccess,
            }}
          >
            {cantidad}
          </Text>
          {record.stockIdeal && (
            <Text type="secondary" style={{ fontSize: 11 }}>
              Ideal: {record.stockIdeal}
            </Text>
          )}
        </Space>
      ),
    },
    {
      title: 'Estado',
      key: 'estado',
      width: 150,
      render: (_, record) => getEstadoBadge(record.estadoStock, record.stockIdeal),
    },
    {
      title: 'Acciones',
      key: 'acciones',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Button 
          type="link" 
          icon={<IconEdit size={16} />} 
          onClick={() => onAdjust(record)}
        >
          Ajustar
        </Button>
      ),
    },
  ];

  // Extraer categorías únicas del inventario
  const categoriasUnicas = [...new Set(
    inventarios?.map(item => item.categoriaNombre).filter(Boolean) || []
  )];

  return (
    <Card styles={{ body: { padding: 0 } }}>
      {/* Header con título */}
      <div
        style={{
          padding: '20px 24px',
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
          background: token.colorBgContainer,
        }}
      >
        <Title level={4} style={{ margin: 0, marginBottom: 4 }}>
          Existencias por sede
        </Title>
        <Text type="secondary">
          {sedeId ? `Mostrando inventario de la sede ${sedeId}` : 'Selecciona una sede para filtrar'}
        </Text>
      </div>

      {/* Barra de filtros */}
      <div
        style={{
          padding: '16px 24px',
          background: token.colorFillAlter,
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        <Space wrap style={{ width: '100%' }}>
          <Input
            placeholder="Buscar por nombre o SKU..."
            prefix={<IconSearch size={16} />}
            style={{ width: 280 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
          <Select
            placeholder="Filtrar por categoría"
            style={{ width: 200 }}
            value={categoriaFilter}
            onChange={setCategoriaFilter}
            allowClear
            options={categoriasUnicas.map(cat => ({ label: cat, value: cat }))}
          />
          <Select
            placeholder="Filtrar por estado"
            style={{ width: 180 }}
            value={estadoFilter}
            onChange={setEstadoFilter}
            allowClear
            options={[
              { label: 'Stock OK', value: 'OK' },
              { label: 'Bajo stock', value: 'BAJO_STOCK' },
              { label: 'Crítico', value: 'CRITICO' },
              { label: 'Sin configurar', value: 'SIN_CONFIGURAR' },
            ]}
          />
          <Text type="secondary" style={{ marginLeft: 'auto' }}>
            {filteredData.length} productos
          </Text>
        </Space>
      </div>

      <Table
        rowKey="id"
        dataSource={filteredData}
        columns={columns}
        loading={loading}
        pagination={{ 
          pageSize: 15, 
          showSizeChanger: true,
          showTotal: (total) => `Total: ${total} productos`,
        }}
        scroll={{ x: 1200 }}
        style={{ margin: 0 }}
      />
    </Card>
  );
};

export default ExistenciasTableView;
