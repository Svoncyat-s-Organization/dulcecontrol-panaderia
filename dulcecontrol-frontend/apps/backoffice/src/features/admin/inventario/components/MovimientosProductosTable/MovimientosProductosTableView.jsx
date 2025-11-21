import dayjs from 'dayjs';
import { Button, Card, Empty, Result, Space, Table, Tag, Typography } from 'antd';
import { IconArrowDownRight, IconArrowUpRight, IconRepeat } from '@tabler/icons-react';

const { Text, Title } = Typography;

const TIPO_CONFIG = {
  ENTRADA: { color: 'green', icon: <IconArrowUpRight size={14} />, label: 'Entrada' },
  SALIDA: { color: 'red', icon: <IconArrowDownRight size={14} />, label: 'Salida' },
};

const MOTIVO_CONFIG = {
  VENTA: { color: 'geekblue' },
  PRODUCCION: { color: 'geekblue' },
  COMPRA: { color: 'green' },
  DEVOLUCION: { color: 'green' },
  MERMA: { color: 'red' },
  CADUCIDAD: { color: 'red' },
  AJUSTE: { color: 'orange', icon: <IconRepeat size={14} /> },
};

const formatFecha = (value) => {
  const fecha = dayjs(value);
  return fecha.isValid() ? fecha.format('DD/MM/YYYY HH:mm') : '—';
};

const MovimientosProductosTableView = ({ movimientos, loading, isError, sedeId, onRetry }) => {
  if (!sedeId) {
    return (
      <Card bodyStyle={{ padding: 24 }}>
        <Title level={4} style={{ marginBottom: 8 }}>
          Kardex de productos
        </Title>
        <Text type="secondary">Selecciona una sede para ver el historial.</Text>
        <div style={{ marginTop: 40 }}>
          <Empty description="Selecciona una sede para ver el historial" />
        </div>
      </Card>
    );
  }

  if (isError) {
    return (
      <Result
        status="error"
        title="No se pudo cargar el kardex de productos"
        subTitle="Intenta nuevamente o elige otra sede"
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
      title: 'Fecha',
      dataIndex: 'creadoEn',
      key: 'fecha',
      width: 180,
      render: (value) => formatFecha(value),
    },
    {
      title: 'Producto',
      key: 'producto',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{record.nombreProducto}</Text>
          <Text type="secondary">SKU: {record.sku ?? 'N/D'}</Text>
        </Space>
      ),
    },
    {
      title: 'Tipo',
      dataIndex: 'tipoMovimiento',
      key: 'tipo',
      width: 120,
      render: (tipo) => {
        const config = TIPO_CONFIG[tipo] ?? { color: 'default', label: tipo };
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.label ?? tipo}
          </Tag>
        );
      },
    },
    {
      title: 'Motivo',
      dataIndex: 'motivo',
      key: 'motivo',
      width: 160,
      render: (motivo) => {
        const config = MOTIVO_CONFIG[motivo] ?? {};
        return (
          <Tag color={config.color} icon={config.icon}>
            {motivo ?? 'N/D'}
          </Tag>
        );
      },
    },
    {
      title: 'Cantidad',
      dataIndex: 'cantidad',
      key: 'cantidad',
      width: 120,
      align: 'right',
      render: (cantidad) => <Text strong>{Number(cantidad ?? 0)}</Text>,
    },
    {
      title: 'Responsable',
      dataIndex: 'usuarioResponsable',
      key: 'responsable',
      render: (usuario) => usuario ?? '—',
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
            Kardex de productos
          </Title>
          <Text type="secondary">Movimientos recientes en la sede {sedeId}</Text>
        </div>
      </div>

      <Table
        rowKey="id"
        dataSource={movimientos}
        columns={columns}
        loading={loading}
        pagination={{ pageSize: 10, showSizeChanger: false }}
        locale={{ emptyText: 'Sin movimientos registrados' }}
      />
    </Card>
  );
};

export default MovimientosProductosTableView;
