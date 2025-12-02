import { Button, Card, Result, Space, Table, Tag, Typography } from 'antd';
import { IconRefresh, IconEdit, IconEye } from '@tabler/icons-react';

const { Text, Title } = Typography;

const ConfiguracionTableView = ({
  data,
  loading,
  isError,
  onRetry,
  onView,
  onEdit,
}) => {
  if (isError) {
    return (
      <Result
        status="error"
        title="No se pudieron cargar los datos de configuración"
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
      title: 'Elemento',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => (
        <Space orientation="vertical" size={0}>
          <Text strong>{record.name}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.type === 'configuracion' ? 'Configuración de Tienda' : 'Página Storefront'}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Descripción',
      dataIndex: 'description',
      key: 'description',
      render: (description) => (
        <Text type="secondary">{description}</Text>
      ),
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => (
        <Tag color={status === 'Activa' || status === 'Activo' ? 'green' : 'orange'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Acciones',
      key: 'acciones',
      width: 180,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<IconEye size={16} />}
            onClick={() => onView(record.data, record.type)}
          >
            Ver
          </Button>
          <Button
            type="link"
            icon={<IconEdit size={16} />}
            onClick={() => onEdit(record.data, record.type)}
          >
            Editar
          </Button>
        </Space>
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
            Configuración
          </Title>
          <Text type="secondary">
            Gestiona la configuración de tu tienda y páginas del storefront.
          </Text>
        </div>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={false}
      />
    </Card>
  );
};

export default ConfiguracionTableView;