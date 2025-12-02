import { Badge, Button, Card, Empty, InputNumber, Result, Space, Table, Tag, Typography, theme } from 'antd';
import { IconDeviceFloppy, IconRefresh, IconRestore } from '@tabler/icons-react';

const StockIdealTableView = ({
  rows,
  loading,
  productosLoading,
  isError,
  onRetry,
  productLookup,
  onValueChange,
  onSaveRow,
  onResetRow,
  savingId,
  sedeNombre,
}) => {
  const { token } = theme.useToken();
  const dataSource = rows.map((row) => {
    const producto = productLookup[row.productoId];
    return {
      ...row,
      productoNombre: producto?.nombre ?? `Producto #${row.productoId}`,
      productoSku: producto?.sku ?? '--',
      categoriaNombre: producto?.categoria?.nombre ?? producto?.categoriaNombre ?? 'Sin categoría',
      displayCantidad: row.draftCantidad ?? row.cantidadIdeal ?? 0,
      displayReposicion: row.draftReposicion ?? row.puntoReposicion ?? 0,
      hasDraft: row.draftCantidad !== undefined || row.draftReposicion !== undefined,
    };
  });

  if (isError) {
    return (
      <Result
        status="error"
        title="No se pudo cargar el stock ideal"
        subTitle="Reintenta nuevamente"
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
      title: 'Producto',
      dataIndex: 'productoNombre',
      key: 'productoNombre',
      render: (_, record) => (
        <Space orientation="vertical" size={0}>
          <Typography.Text strong>{record.productoNombre}</Typography.Text>
          <Typography.Text type="secondary">SKU: {record.productoSku}</Typography.Text>
        </Space>
      ),
    },
    {
      title: 'Categoría',
      dataIndex: 'categoriaNombre',
      key: 'categoriaNombre',
      width: 200,
      render: (value) => <Tag color="blue" bordered={false}>{value}</Tag>,
    },
    {
      title: 'Cantidad ideal',
      dataIndex: 'displayCantidad',
      key: 'cantidadIdeal',
      width: 180,
      render: (_, record) => (
        <InputNumber
          min={0}
          precision={0}
          value={record.displayCantidad}
          onChange={(value) => onValueChange(record.id, 'cantidadIdeal', value)}
          style={{ width: '100%' }}
          disabled={savingId === record.id}
        />
      ),
    },
    {
      title: 'Punto de reposición',
      dataIndex: 'displayReposicion',
      key: 'puntoReposicion',
      width: 200,
      render: (_, record) => (
        <InputNumber
          min={0}
          precision={0}
          value={record.displayReposicion}
          onChange={(value) => onValueChange(record.id, 'puntoReposicion', value)}
          style={{ width: '100%' }}
          disabled={savingId === record.id}
        />
      ),
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: 220,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<IconDeviceFloppy size={16} />}
            onClick={() => onSaveRow(record.id)}
            disabled={!record.hasDraft}
            loading={savingId === record.id}
          >
            Guardar
          </Button>
          <Button
            icon={<IconRestore size={16} />}
            onClick={() => onResetRow(record.id)}
            disabled={!record.hasDraft || savingId === record.id}
          >
            Deshacer
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card
      styles={{ body: { padding: 24 } }}
      style={{ borderRadius: token.borderRadiusLG, boxShadow: token.boxShadowTertiary }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          marginBottom: 24,
        }}
      >
        <div>
          <Typography.Title level={4} style={{ margin: 0 }}>
            Stock ideal por sede
          </Typography.Title>
          <Typography.Text type="secondary">
            {sedeNombre ? `Configurando la sede ${sedeNombre}` : 'Selecciona una sede para continuar'}
          </Typography.Text>
        </div>
        <Space>
          {rows.some((row) => row.draftCantidad !== undefined || row.draftReposicion !== undefined) && (
            <Badge color={token.colorWarning} text="Cambios sin guardar" />
          )}
          <Button icon={<IconRefresh size={16} />} onClick={onRetry} loading={loading}>
            Actualizar
          </Button>
        </Space>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={dataSource}
        loading={loading || productosLoading}
        pagination={{ pageSize: 8 }}
        locale={{
          emptyText: loading ? 'Cargando...' : <Empty description="Sin productos configurados" />,
        }}
      />
    </Card>
  );
};

export default StockIdealTableView;
