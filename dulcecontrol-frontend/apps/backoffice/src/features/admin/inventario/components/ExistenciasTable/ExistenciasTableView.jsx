import { Avatar, Button, Card, Result, Space, Table, Typography, theme } from 'antd';
import { IconEdit } from '@tabler/icons-react';

const { Text, Title } = Typography;

const isLowStock = (registro) => {
  if (registro?.estadoStock) {
    return registro.estadoStock.toUpperCase() === 'BAJO_STOCK';
  }
  return (registro?.cantidadActual ?? 0) < 5;
};

const ExistenciasTableView = ({ inventarios, loading, isError, onRetry, onAdjust, sedeId }) => {
  const { token } = theme.useToken();

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
      render: (_, record) => (
        <Space>
          <Avatar shape="square" size={56} src={record.imagenUrl}>
            {record.nombreProducto?.charAt(0) ?? '?'}
          </Avatar>
          <Space orientation="vertical" size={0}>
            <Text strong>{record.nombreProducto}</Text>
            <Text type="secondary">SKU: {record.sku}</Text>
          </Space>
        </Space>
      ),
    },
    {
      title: 'Ubicación',
      dataIndex: 'ubicacionFisica',
      key: 'ubicacion',
      render: (ubicacion) => ubicacion || 'Sin ubicación',
    },
    {
      title: 'Stock',
      dataIndex: 'cantidadActual',
      key: 'cantidadActual',
      width: 140,
      align: 'center',
      render: (_, record) => (
        <Text
          strong
          style={{
            fontSize: 18,
            color: isLowStock(record) ? token.colorError : token.colorText,
          }}
        >
          {record.cantidadActual}
        </Text>
      ),
    },
    {
      title: 'Acciones',
      key: 'acciones',
      width: 140,
      render: (_, record) => (
        <Button type="link" icon={<IconEdit size={16} />} onClick={() => onAdjust(record)}>
          Ajustar
        </Button>
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
            Existencias por sede
          </Title>
          <Text type="secondary">
            {sedeId ? `Mostrando inventario de la sede ${sedeId}` : 'Selecciona una sede para filtrar'}
          </Text>
        </div>
      </div>

      <Table
        rowKey="id"
        dataSource={inventarios}
        columns={columns}
        loading={loading}
        pagination={{ pageSize: 10, showSizeChanger: false }}
      />
    </Card>
  );
};

export default ExistenciasTableView;
