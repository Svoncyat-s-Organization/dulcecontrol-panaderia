import { Button, Card, Result, Space, Table, Tag, Typography, Popconfirm, Select, Dropdown } from 'antd';
import { IconPlus, IconEye, IconEdit, IconTrash, IconDots } from '@tabler/icons-react';
import { formatCurrency, formatDate } from '../../utils/formatters.js';
import { ESTADO_ORDEN_COMPRA, ESTADO_ORDEN_COMPRA_VALUES, getEstadoColor } from '../../constants/enums.js';

const { Text, Title } = Typography;

const OrdenesCompraTableView = ({
  ordenes,
  loading,
  isError,
  onRetry,
  onCreate,
  onEdit,
  onViewDetails,
  onDelete,
  onChangeStatus,
  onRecibirParcial,
  onRecibirTotal,
  filters,
  onFilterChange,
}) => {
  if (isError) {
    return (
      <Result
        status="error"
        title="No se pudo cargar las órdenes de compra"
        subTitle="Intenta refrescar la página"
        extra={
          <Button type="primary" onClick={onRetry}>
            Reintentar
          </Button>
        }
      />
    );
  }

  const estadoOptions = Object.entries(ESTADO_ORDEN_COMPRA).map(([key, label]) => ({
    value: key,
    label: label,
  }));

  const getStatusMenuItems = (record) => {
    const items = [
      {
        key: 'enviada',
        label: 'Marcar como Enviada',
        onClick: () => onChangeStatus(record.id, ESTADO_ORDEN_COMPRA_VALUES.ENVIADA),
        disabled: record.estado === ESTADO_ORDEN_COMPRA_VALUES.ENVIADA,
      },
    ];

    // Solo mostrar opciones de recepción para órdenes ENVIADAS o RECIBIDA_PARCIAL
    if (record.estado === ESTADO_ORDEN_COMPRA_VALUES.ENVIADA || 
        record.estado === ESTADO_ORDEN_COMPRA_VALUES.RECIBIDA_PARCIAL) {
      items.push(
        {
          type: 'divider',
        },
        {
          key: 'recibir_parcial',
          label: '📦 Recibir Parcial',
          onClick: () => onRecibirParcial(record),
        },
        {
          key: 'recibir_total',
          label: '✅ Recibir Total',
          onClick: () => onRecibirTotal(record.id),
        }
      );
    }

    items.push(
      {
        type: 'divider',
      },
      {
        key: 'cancelada',
        label: 'Cancelar Orden',
        onClick: () => onChangeStatus(record.id, ESTADO_ORDEN_COMPRA_VALUES.CANCELADA),
        disabled: record.estado === ESTADO_ORDEN_COMPRA_VALUES.CANCELADA,
        danger: true,
      }
    );

    return items;
  };

  const columns = [
    {
      title: 'Fecha Emisión',
      dataIndex: 'fechaEmision',
      key: 'fecha',
      width: 120,
      render: (fecha) => <Text>{formatDate(fecha)}</Text>,
    },
    {
      title: 'Proveedor',
      dataIndex: 'nombreProveedor',
      key: 'proveedor',
      render: (nombre) => <Text strong>{nombre || 'N/D'}</Text>,
    },
    {
      title: 'Sede Destino',
      dataIndex: 'nombreSede',
      key: 'sede',
      render: (nombre) => <Text>{nombre || 'N/D'}</Text>,
    },
    {
      title: 'Total',
      dataIndex: 'totalCompraCentimos',
      key: 'total',
      width: 130,
      render: (total) => <Text strong>{formatCurrency(total)}</Text>,
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
      width: 150,
      render: (estado) => (
        <Tag color={getEstadoColor(estado)}>
          {ESTADO_ORDEN_COMPRA[estado] || estado}
        </Tag>
      ),
    },
    {
      title: 'Método Pago',
      dataIndex: 'metodoPago',
      key: 'metodoPago',
      width: 130,
      render: (metodo) => metodo ? <Text>{metodo}</Text> : <Text type="secondary">N/D</Text>,
    },
    {
      title: 'Acciones',
      key: 'acciones',
      width: 140,
      render: (_, record) => (
        <Space size="small">
          <Dropdown menu={{ items: getStatusMenuItems(record) }} trigger={['click']} placement="bottomRight">
            <Button type="link" size="small" icon={<IconDots size={16} />} title="Cambiar estado" />
          </Dropdown>
          {record.estado === ESTADO_ORDEN_COMPRA_VALUES.BORRADOR ? (
            <Button
              type="link"
              size="small"
              icon={<IconEdit size={16} />}
              onClick={() => onEdit(record)}
              title="Editar orden"
            />
          ) : (
            <Button
              type="link"
              size="small"
              icon={<IconEye size={16} />}
              onClick={() => onViewDetails(record)}
              title="Ver detalles"
            />
          )}
          {record.estado === ESTADO_ORDEN_COMPRA_VALUES.BORRADOR && (
            <Popconfirm
              title="⚠️ ¿Eliminar orden permanentemente?"
              description="Esta acción NO se puede deshacer. La orden será eliminada de la base de datos."
              onConfirm={() => onDelete(record.id)}
              okText="Sí, eliminar"
              cancelText="Cancelar"
              okButtonProps={{ danger: true }}
            >
              <Button type="link" size="small" danger icon={<IconTrash size={16} />} title="Eliminar" />
            </Popconfirm>
          )}
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
            Órdenes de Compra
          </Title>
          <Button type="primary" icon={<IconPlus size={18} />} onClick={onCreate}>
            Nueva Orden
          </Button>
        </div>

        <Space>
          <Text>Filtrar por estado:</Text>
          <Select
            style={{ width: 200 }}
            placeholder="Todos los estados"
            allowClear
            options={estadoOptions}
            value={filters.estado || null}
            onChange={(value) => onFilterChange({ estado: value || undefined })}
          />
        </Space>
      </Space>

      <Table
        columns={columns}
        dataSource={ordenes}
        loading={loading}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total: ${total} órdenes`,
        }}
      />
    </Card>
  );
};

export default OrdenesCompraTableView;
