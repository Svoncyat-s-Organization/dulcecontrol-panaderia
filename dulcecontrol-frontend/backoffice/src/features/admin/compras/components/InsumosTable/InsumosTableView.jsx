import { Button, Card, Result, Space, Table, Tag, Typography, Switch, App } from 'antd';
import { IconPlus, IconEdit, IconTrash, IconAlertTriangle } from '@tabler/icons-react';
import { formatCurrency, formatQuantity } from '../../utils/formatters.js';

const { Text, Title } = Typography;

const InsumosTableView = ({
  insumos,
  loading,
  isError,
  onRetry,
  onCreate,
  onEdit,
  onDelete,
  filters,
  onFilterChange,
}) => {
  const { modal } = App.useApp();
  if (isError) {
    return (
      <Result
        status="error"
        title="No se pudo cargar los insumos"
        subTitle="Intenta refrescar la página"
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
      dataIndex: 'nombre',
      key: 'nombre',
      render: (_, record) => (
        <Space style={{ display: 'flex', flexDirection: 'column' }} size={0}>
          <Text strong>{record.nombre}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            Código: {record.codigoInterno ?? 'N/D'}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Unidad Base',
      dataIndex: 'unidadBase',
      key: 'unidadBase',
      width: 120,
      render: (unidad) => <Tag color="blue">{unidad}</Tag>,
    },
    {
      title: 'Unidad Compra',
      dataIndex: 'unidadCompraHabitual',
      key: 'unidadCompra',
      width: 140,
      render: (unidad) => <Tag color="cyan">{unidad}</Tag>,
    },
    {
      title: 'Stock Actual',
      dataIndex: 'stockActualGlobal',
      key: 'stock',
      width: 130,
      render: (stock, record) => {
        const isLow = stock <= record.stockMinimoGlobal;
        return (
          <Space>
            {isLow && <IconAlertTriangle size={16} color="#ff4d4f" />}
            <Text type={isLow ? 'danger' : 'default'}>
              {formatQuantity(stock, record.unidadBase)}
            </Text>
          </Space>
        );
      },
    },
    {
      title: 'Stock Mínimo',
      dataIndex: 'stockMinimoGlobal',
      key: 'stockMin',
      width: 130,
      render: (stock, record) => formatQuantity(stock, record.unidadBase),
    },
    {
      title: 'Costo Promedio',
      dataIndex: 'costoPromedioUnitarioCentimos',
      key: 'costo',
      width: 140,
      render: (costo) => <Text>{formatCurrency(costo)}</Text>,
    },
    {
      title: 'Estado',
      dataIndex: 'activo',
      key: 'activo',
      width: 90,
      render: (activo) => (
        <Tag color={activo ? 'success' : 'default'}>{activo ? 'Activo' : 'Inactivo'}</Tag>
      ),
    },
    {
      title: 'Acciones',
      key: 'acciones',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<IconEdit size={16} />}
            onClick={() => onEdit(record)}
          />
          <Button
            type="link"
            size="small"
            danger
            icon={<IconTrash size={16} />}
            onClick={() => {
              modal.confirm({
                title: '¿Eliminar insumo?',
                content: 'Se eliminará el insumo del catálogo. Solo se permite si no tiene recetas, órdenes de compra o movimientos asociados.',
                okText: 'Eliminar',
                okType: 'danger',
                cancelText: 'Cancelar',
                onOk: () => onDelete(record.id),
              });
            }}
          />
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <Space
        style={{ display: 'flex', flexDirection: 'column', width: '100%', marginBottom: 16 }}
        size="middle"
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={4} style={{ margin: 0 }}>
            Insumos
          </Title>
          <Button type="primary" icon={<IconPlus size={18} />} onClick={onCreate}>
            Nuevo Insumo
          </Button>
        </div>

        <Space>
          <Space>
            <Text>Solo activos:</Text>
            <Switch
              checked={filters.soloActivos}
              onChange={(checked) => onFilterChange({ soloActivos: checked })}
            />
          </Space>
          <Space>
            <Text>Stock bajo:</Text>
            <Switch
              checked={filters.stockBajo}
              onChange={(checked) => onFilterChange({ stockBajo: checked })}
            />
          </Space>
        </Space>
      </Space>

      <Table
        columns={columns}
        dataSource={insumos}
        loading={loading}
        rowKey="id"
        scroll={{ x: 1200 }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total: ${total} insumos`,
        }}
      />
    </Card>
  );
};

export default InsumosTableView;
