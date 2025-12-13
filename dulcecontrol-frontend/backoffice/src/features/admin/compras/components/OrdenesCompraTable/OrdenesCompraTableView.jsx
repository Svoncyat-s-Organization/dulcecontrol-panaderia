import { Button, Card, Result, Space, Table, Tag, Typography, Popconfirm, Select, Dropdown, Tooltip } from 'antd';
import { IconPlus, IconEye, IconEdit, IconTrash, IconDots, IconCash, IconHistory } from '@tabler/icons-react';
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
  onPagar,
  onVerHistorialPagos,
  filters,
  onFilterChange,
}) => {
  if (isError) {
    return (
      <Result
        status="error"
        title="No se pudo cargar las ordenes de compra"
        subTitle="Intenta refrescar la pagina"
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
      title: 'Fecha Emision',
      dataIndex: 'fechaEmision',
      key: 'fecha',
      width: 120,
      sorter: (a, b) => new Date(b.fechaEmision) - new Date(a.fechaEmision),
      defaultSortOrder: 'ascend',
      render: (fecha) => <Text>{formatDate(fecha)}</Text>,
    },
    {
      title: 'Fecha Recepcion Esperada',
      dataIndex: 'fechaRecepcionEsperada',
      key: 'fechaRecepcionEsperada',
      width: 140,
      render: (fecha) => fecha ? <Text>{formatDate(fecha)}</Text> : <Text type="secondary">N/D</Text>,
    },
    {
      title: 'Fecha Recepcion Real',
      dataIndex: 'fechaRecepcionReal',
      key: 'fechaRecepcion',
      width: 140,
      render: (fecha) => fecha ? <Text>{formatDate(fecha)}</Text> : <Text type="secondary">Pendiente</Text>,
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
      title: 'Metodo Pago',
      dataIndex: 'metodoPago',
      key: 'metodoPago',
      width: 130,
      render: (metodo) => metodo ? <Text>{metodo}</Text> : <Text type="secondary">N/D</Text>,
    },
    {
      title: 'Saldo Pendiente',
      dataIndex: 'saldoPendienteCentimos',
      key: 'saldo',
      width: 130,
      render: (saldo, record) => {
        if (record.metodoPago !== 'credito') return <Text type="secondary">N/A</Text>;
        return (
          <Tag color={(saldo || 0) > 0 ? 'red' : 'green'}>
            {formatCurrency(saldo || 0)}
          </Tag>
        );
      },
    },
    {
      title: 'Acciones',
      key: 'acciones',
      width: 180,
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
          {/* Botón de registrar pago - solo si hay saldo pendiente */}
          {record.metodoPago === 'credito' && (record.saldoPendienteCentimos || 0) > 0 && (
            <Tooltip title="Registrar pago">
              <Button
                type="link"
                size="small"
                icon={<IconCash size={16} />}
                onClick={() => onPagar(record)}
                style={{ color: '#52c41a' }}
              />
            </Tooltip>
          )}
          {/* Botón de historial - siempre visible para órdenes a crédito */}
          {record.metodoPago === 'credito' && (
            <Tooltip title={
              (record.saldoPendienteCentimos || 0) === 0 
                ? "Ver historial de pagos (Pagado completamente)" 
                : "Ver historial de pagos"
            }>
              <Button
                type="link"
                size="small"
                icon={<IconHistory size={16} />}
                onClick={() => onVerHistorialPagos(record)}
                style={{ 
                  color: (record.saldoPendienteCentimos || 0) === 0 ? '#52c41a' : '#1890ff' 
                }}
              />
            </Tooltip>
          )}
          {record.estado === ESTADO_ORDEN_COMPRA_VALUES.BORRADOR && (
            <Popconfirm
              title="Eliminar orden permanentemente?"
              description="Esta accion NO se puede deshacer."
              onConfirm={() => onDelete(record.id)}
              okText="Si, eliminar"
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexDirection: 'row', gap: '100px' }}>
          <Title level={4} style={{ margin: 0 }}>
            Ordenes de Compra
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
        scroll={{ x: 1400 }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total: ${total} ordenes`,
        }}
      />
    </Card>
  );
};

export default OrdenesCompraTableView;
