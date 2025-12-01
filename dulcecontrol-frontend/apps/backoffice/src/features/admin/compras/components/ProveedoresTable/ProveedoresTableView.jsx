import { Button, Card, Empty, Result, Space, Table, Tag, Typography, Popconfirm, Switch } from 'antd';
import { IconPlus, IconEdit, IconTrash } from '@tabler/icons-react';

const { Text, Title } = Typography;

const ProveedoresTableView = ({
  proveedores,
  loading,
  isError,
  onRetry,
  onCreate,
  onEdit,
  onDelete,
  soloActivos,
  onFilterChange,
}) => {
  const emptyConfig = {
    description: 'No hay proveedores registrados',
  };

  if (!proveedores || proveedores.length === 0) {
    return (
      <Card>
        <Empty
          description={emptyConfig.description}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </Card>
    );
  }

  if (isError) {
    return (
      <Result
        status="error"
        title="No se pudo cargar los proveedores"
        subTitle="Intenta refrescar la pagina"
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
      title: 'Proveedor',
      dataIndex: 'nombreComercial',
      key: 'nombreComercial',
      width: 200,
      render: (text) => <Text strong>{text || '-'}</Text>,
    },
    {
      title: 'RUC',
      dataIndex: 'numeroDoc',
      key: 'numeroDoc',
      width: 140,
      render: (text) => text || '-',
    },
    {
      title: 'Razon Social',
      dataIndex: 'razonSocial',
      key: 'razonSocial',
      width: 200,
      render: (text) => <Text type="secondary">{text || '-'}</Text>,
    },
    {
      title: 'Contacto',
      dataIndex: 'nombreContacto',
      key: 'nombreContacto',
      width: 150,
      render: (text) => text || '-',
    },
    {
      title: 'Telefono',
      dataIndex: 'telefonoContacto',
      key: 'telefonoContacto',
      width: 120,
      render: (text) => text || '-',
    },
    {
      title: 'Email',
      dataIndex: 'emailContacto',
      key: 'emailContacto',
      width: 200,
      render: (text) => text || '-',
    },
    {
      title: 'Generico',
      dataIndex: 'esGenerico',
      key: 'esGenerico',
      width: 100,
      align: 'center',
      render: (esGenerico) => (
        <Tag color={esGenerico ? 'default' : 'blue'}>
          {esGenerico ? 'Si' : 'No'}
        </Tag>
      ),
    },
    {
      title: 'Estado',
      dataIndex: 'activo',
      key: 'activo',
      width: 100,
      align: 'center',
      render: (activo) => (
        <Tag color={activo ? 'success' : 'default'}>{activo ? 'Activo' : 'Inactivo'}</Tag>
      ),
    },
    {
      title: 'Acciones',
      key: 'acciones',
      width: 120,
      fixed: 'right',
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<IconEdit size={16} />}
            onClick={() => onEdit(record)}
          />
          <Popconfirm
            title="Eliminar proveedor?"
            description="Esta accion NO se puede deshacer."
            onConfirm={() => onDelete(record.id)}
            okText="Si, eliminar"
            cancelText="Cancelar"
            okButtonProps={{ danger: true }}
          >
            <Button type="link" size="small" danger icon={<IconTrash size={16} />} />
          </Popconfirm>
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '100px' }}>
          <Title level={4} style={{ margin: 0 }}>
            Proveedores
          </Title>
          <Button type="primary" icon={<IconPlus size={18} />} onClick={onCreate}>
            Nuevo Proveedor
          </Button>
        </div>

        <Space>
          <Text>Solo activos:</Text>
          <Switch checked={soloActivos} onChange={onFilterChange} />
        </Space>
      </Space>

      <Table
        columns={columns}
        dataSource={proveedores}
        loading={loading}
        rowKey="id"
        scroll={{ x: 1400 }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total: ${total} proveedores`,
        }}
      />
    </Card>
  );
};

export default ProveedoresTableView;
