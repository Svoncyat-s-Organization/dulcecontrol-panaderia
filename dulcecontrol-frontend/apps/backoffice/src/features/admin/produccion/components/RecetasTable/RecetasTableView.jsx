import { Alert, Button, Card, Popconfirm, Result, Space, Table, Tag, Typography } from 'antd';
import {
  IconRefresh,
  IconEdit,
  IconTrash,
  IconAlertTriangle,
  IconChefHat,
} from '@tabler/icons-react';
import { formatCantidadConUnidad } from '../../utils/recetasMappers.js';

const { Text } = Typography;

const RecetasTableView = ({
  recetas,
  loading,
  isError,
  onRetry,
  onEdit,
  onDelete,
  deleting,
}) => {
  if (isError) {
    return (
      <Result
        status="error"
        title="No se pudieron cargar las recetas"
        subTitle="Intenta nuevamente más tarde"
        extra={
          <Button icon={<IconRefresh size={16} />} onClick={onRetry}>
            Reintentar
          </Button>
        }
      />
    );
  }

  // Agrupar recetas por producto
  const recetasAgrupadas = recetas.reduce((acc, receta) => {
    const key = receta.productoId;
    if (!acc[key]) {
      acc[key] = {
        productoId: receta.productoId,
        productoNombre: receta.productoNombre,
        productoSku: receta.productoSku,
        insumos: [],
      };
    }
    acc[key].insumos.push(receta);
    return acc;
  }, {});

  const dataSource = Object.values(recetasAgrupadas);

  // Tabla expandible con insumos
  const expandedRowRender = (record) => {
    const insumosColumns = [
      {
        title: 'Insumo',
        key: 'insumo',
        width: '30%',
        render: (_, receta) => (
          <Space direction="vertical" size={0}>
            <Text strong>{receta.insumoNombre || `Insumo #${receta.insumoId}`}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              ID: {receta.insumoId} {receta.insumoCodigoInterno ? `• ${receta.insumoCodigoInterno}` : ''}
            </Text>
          </Space>
        ),
      },
      {
        title: 'Cantidad',
        key: 'cantidad',
        width: '15%',
        align: 'center',
        render: (_, receta) => (
          <Tag color="blue" style={{ fontSize: 13 }}>
            {formatCantidadConUnidad(receta.cantidadRequerida, receta.unidadMedida)}
          </Tag>
        ),
      },
      {
        title: 'Notas',
        dataIndex: 'notasPreparacion',
        key: 'notasPreparacion',
        width: '30%',
        ellipsis: true,
        render: (notas) => (
          <Text type={notas ? undefined : 'secondary'} style={{ fontSize: 13 }}>
            {notas || 'Sin notas'}
          </Text>
        ),
      },
      {
        title: 'Acciones',
        key: 'actions',
        width: '25%',
        align: 'center',
        render: (_, receta) => (
          <Space size="small">
            <Button
              type="link"
              size="small"
              icon={<IconEdit size={16} />}
              onClick={() => onEdit(receta)}
            >
              Editar
            </Button>
            <Popconfirm
              title="¿Eliminar insumo?"
              description="Esta acción no se puede deshacer"
              onConfirm={() => onDelete(receta.id)}
              okText="Eliminar"
              cancelText="Cancelar"
              okButtonProps={{ danger: true, loading: deleting }}
            >
              <Button
                type="link"
                size="small"
                danger
                icon={<IconTrash size={16} />}
                disabled={deleting}
              >
                Eliminar
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ];

    return (
      <div style={{ padding: '0 24px 12px 48px' }}>
        <Table
          columns={insumosColumns}
          dataSource={record.insumos}
          rowKey="id"
          pagination={false}
          size="small"
          bordered
        />
      </div>
    );
  };

  const columns = [
    {
      title: 'Producto',
      key: 'producto',
      width: '60%',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong style={{ fontSize: 15 }}>
            {record.productoNombre || `Producto #${record.productoId}`}
          </Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.productoSku ? `SKU: ${record.productoSku} • ` : ''}ID: {record.productoId}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Insumos',
      key: 'insumos',
      width: '20%',
      align: 'center',
      render: (_, record) => (
        <Tag color="green" style={{ fontSize: 13 }}>
          {record.insumos.length} {record.insumos.length === 1 ? 'insumo' : 'insumos'}
        </Tag>
      ),
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: '20%',
      align: 'center',
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          onClick={() => {
            // Crear nueva receta para este producto (sin insumo preseleccionado)
            onEdit({ productoId: record.productoId, productoNombre: record.productoNombre });
          }}
        >
          Agregar Insumo
        </Button>
      ),
    },
  ];

  return (
    <Card>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Alert
          type="info"
          message="Gestión de Recetas"
          description="Cada producto está compuesto por varios insumos. Expande una fila para ver todos los insumos de ese producto. Las recetas son la base para calcular los requerimientos de inventario."
          showIcon
          icon={<IconChefHat size={20} />}
        />

        <Table
          dataSource={dataSource}
          columns={columns}
          loading={loading}
          rowKey="productoId"
          expandable={{
            expandedRowRender,
            defaultExpandAllRows: false,
            rowExpandable: (record) => record.insumos.length > 0,
          }}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Total: ${total} productos`,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
          }}
          size="middle"
        />
      </Space>
    </Card>
  );
};

export default RecetasTableView;
