import { Alert, Button, Card, InputNumber, Result, Space, Table, Tag, Typography } from 'antd';
import { IconRefresh, IconEdit, IconTrash, IconAlertTriangle } from '@tabler/icons-react';

const { Text } = Typography;

const StockIdealTableView = ({
  dataSource,
  loading,
  isError,
  onRetry,
  onEdit,
  onDelete,
  deletingId,
  sedeId,
}) => {
  if (!sedeId) {
    return (
      <Alert
        type="warning"
        message="Selecciona una sede"
        description="Para configurar el stock ideal, primero selecciona una sede desde el menú superior."
        showIcon
        icon={<IconAlertTriangle size={20} />}
      />
    );
  }

  if (isError) {
    return (
      <Result
        status="error"
        title="No se pudo cargar el stock ideal"
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
      title: 'Producto',
      dataIndex: 'productoNombre',
      key: 'productoNombre',
      fixed: 'left',
      width: 280,
      render: (_, record) => (
        <Space direction="vertical" size={2}>
          <Text strong>{record.productoNombre}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            SKU: {record.productoSku}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Categoría',
      dataIndex: 'productoCategoria',
      key: 'productoCategoria',
      width: 160,
      render: (categoria) => <Text type="secondary">{categoria || '-'}</Text>,
    },
    {
      title: (
        <Space direction="vertical" size={0}>
          <Text>Cantidad Ideal</Text>
          <Text type="secondary" style={{ fontSize: 11, fontWeight: 'normal' }}>
            Stock objetivo diario
          </Text>
        </Space>
      ),
      dataIndex: 'cantidadIdeal',
      key: 'cantidadIdeal',
      width: 180,
      align: 'center',
      render: (value, record) => (
        <Space>
          <InputNumber
            value={value}
            disabled
            min={0}
            style={{ width: 90 }}
            controls={false}
          />
          {!record.tieneConfiguracion && (
            <Tag color="default">Sin configurar</Tag>
          )}
        </Space>
      ),
    },
    {
      title: (
        <Space direction="vertical" size={0}>
          <Text>Punto de Reposición</Text>
          <Text type="secondary" style={{ fontSize: 11, fontWeight: 'normal' }}>
            Alerta de reabastecimiento
          </Text>
        </Space>
      ),
      dataIndex: 'puntoReposicion',
      key: 'puntoReposicion',
      width: 200,
      align: 'center',
      render: (value, record) => (
        <Space>
          <InputNumber
            value={value}
            disabled
            min={0}
            style={{ width: 90 }}
            controls={false}
          />
          {value > 0 && value >= record.cantidadIdeal && (
            <Tag color="warning" icon={<IconAlertTriangle size={12} />}>
              Revisar
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: 'Estado',
      key: 'estado',
      width: 140,
      align: 'center',
      render: (_, record) => {
        if (!record.tieneConfiguracion) {
          return <Tag color="default">Pendiente</Tag>;
        }
        if (record.cantidadIdeal === 0) {
          return <Tag color="red">Deshabilitado</Tag>;
        }
        return <Tag color="success">Configurado</Tag>;
      },
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: 180,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<IconEdit size={16} />}
            onClick={() => onEdit(record)}
          >
            {record.tieneConfiguracion ? 'Editar' : 'Configurar'}
          </Button>
          {record.tieneConfiguracion && (
            <Button
              type="link"
              size="small"
              danger
              icon={<IconTrash size={16} />}
              onClick={() => onDelete(record)}
              loading={deletingId === record.stockId}
              disabled={deletingId && deletingId !== record.stockId}
            >
              Eliminar
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Alert
          type="info"
          message="Configura el stock ideal por producto"
          description="Define cuántas unidades de cada producto deberían estar disponibles en esta sede. El sistema usará estos valores para calcular la producción diaria automáticamente."
          showIcon
        />
        
        <Table
          dataSource={dataSource}
          columns={columns}
          loading={loading}
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (total) => `Total: ${total} productos`,
          }}
          scroll={{ x: 1200 }}
          size="small"
        />
      </Space>
    </Card>
  );
};

export default StockIdealTableView;
