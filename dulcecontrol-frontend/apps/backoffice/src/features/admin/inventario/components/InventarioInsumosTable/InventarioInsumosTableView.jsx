import { Button, Card, Empty, Result, Space, Table, Tag, Typography, theme } from 'antd';
import { IconEdit } from '@tabler/icons-react';

const { Text, Title } = Typography;
const DECIMAL_UNITS = ['KG', 'KILOGRAMOS', 'KILOGRAMO', 'L', 'LT', 'LTS', 'LITROS'];

const needsDecimals = (unidadMedida) => DECIMAL_UNITS.includes((unidadMedida ?? '').toUpperCase());

const formatCantidad = (cantidad, unidadMedida) => {
  const rawValue = Number(cantidad ?? 0);
  const precision = needsDecimals(unidadMedida) ? 3 : 0;
  const formatted = Number.isFinite(rawValue)
    ? rawValue.toLocaleString('es-PE', {
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
      })
    : '0';
  return `${formatted} ${unidadMedida ?? ''}`.trim();
};

const isLowStock = (estadoStock) => (estadoStock ?? '').toUpperCase() === 'BAJO_STOCK';

const InventarioInsumosTableView = ({ insumos, loading, isError, onRetry, onAdjust, sedeId }) => {
  const { token } = theme.useToken();

  if (!sedeId) {
    return (
      <Card bodyStyle={{ padding: 24 }}>
        <Title level={4} style={{ marginBottom: 8 }}>
          Inventario de insumos
        </Title>
        <Text type="secondary">Selecciona una sede para consultar existencias de materia prima.</Text>
        <div style={{ marginTop: 40 }}>
          <Empty description="Selecciona una sede arriba" />
        </div>
      </Card>
    );
  }

  if (isError) {
    return (
      <Result
        status="error"
        title="No se pudo cargar el inventario"
        subTitle="Intenta refrescar o cambia de sede"
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
      title: 'Insumo',
      dataIndex: 'nombreInsumo',
      key: 'insumo',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{record.nombreInsumo}</Text>
          <Text type="secondary">Código: {record.codigoInterno ?? 'N/D'}</Text>
        </Space>
      ),
    },
    {
      title: 'Unidad',
      dataIndex: 'unidadMedida',
      key: 'unidad',
      width: 120,
      render: (unidad) => (
        <Tag color={token.colorPrimary} style={{ marginRight: 0 }}>
          {unidad ?? 'N/D'}
        </Tag>
      ),
    },
    {
      title: 'Stock',
      dataIndex: 'cantidadActual',
      key: 'stock',
      width: 160,
      render: (_, record) => (
        <Text
          strong
          style={{
            fontSize: 16,
            color: isLowStock(record.estadoStock) ? token.colorError : token.colorText,
          }}
        >
          {formatCantidad(record.cantidadActual, record.unidadMedida)}
        </Text>
      ),
    },
    {
      title: 'Ubicación',
      dataIndex: 'ubicacionFisica',
      key: 'ubicacion',
      render: (ubicacion) => ubicacion || 'Sin ubicación',
    },
    {
      title: 'Acciones',
      key: 'acciones',
      width: 120,
      render: (_, record) => (
        <Button type="link" icon={<IconEdit size={16} />} onClick={() => onAdjust(record)}>
          Ajustar
        </Button>
      ),
    },
  ];

  return (
    <Card bodyStyle={{ padding: 24 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          marginBottom: 16,
        }}
      >
        <div>
          <Title level={4} style={{ margin: 0 }}>
            Inventario de insumos
          </Title>
          <Text type="secondary">Sede seleccionada: {sedeId}</Text>
        </div>
        <Text type="secondary">
          Ajusta cantidades en kilos, litros o unidades con precisión de tres decimales.
        </Text>
      </div>

      <Table
        rowKey="id"
        dataSource={insumos}
        columns={columns}
        loading={loading}
        pagination={{ pageSize: 10, showSizeChanger: false }}
        locale={{ emptyText: 'No hay insumos registrados en esta sede' }}
      />
    </Card>
  );
};

export default InventarioInsumosTableView;
