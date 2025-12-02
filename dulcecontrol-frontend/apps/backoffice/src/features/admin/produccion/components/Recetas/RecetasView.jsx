import { Button, Card, Empty, Popconfirm, Result, Select, Space, Table, Tag, Typography, theme } from 'antd';
import { IconChefHat, IconEdit, IconPlus, IconRefresh, IconTrash } from '@tabler/icons-react';
import RecetaModal from './RecetaModal.jsx';

const RecetasView = ({
  productos,
  selectedProductoId,
  onSelectProducto,
  recetas,
  insumoLookup,
  loading,
  isError,
  onRetry,
  onOpenModal,
  onEditReceta,
  onDeleteReceta,
  deletingId,
  modalProps,
  productosLoading,
  insumosLoading,
}) => {
  const { token } = theme.useToken();
  const unidadMap = (modalProps?.unidadOptions ?? []).reduce((acc, item) => {
    acc[item.value] = item.label;
    return acc;
  }, {});

  if (isError) {
    return (
      <Result
        status="error"
        title="No se pudieron cargar las recetas"
        subTitle="Intenta nuevamente"
        extra={
          <Button icon={<IconRefresh size={16} />} onClick={onRetry}>
            Reintentar
          </Button>
        }
      />
    );
  }

  if (!productosLoading && productos.length === 0) {
    return (
      <Result
        icon={<IconChefHat size={42} />}
        title="Aún no tienes productos configurados"
        subTitle="Registra productos en el catálogo para comenzar a definir recetas"
      />
    );
  }

  const columns = [
    {
      title: 'Insumo',
      dataIndex: 'insumoId',
      key: 'insumo',
      render: (_, record) => {
        const insumo = insumoLookup[record.insumoId];
        return (
          <Space orientation="vertical" size={0}>
            <Typography.Text strong>{insumo?.nombre ?? `Insumo #${record.insumoId}`}</Typography.Text>
            <Typography.Text type="secondary">Código: {insumo?.codigoInterno ?? '--'}</Typography.Text>
          </Space>
        );
      },
    },
    {
      title: 'Cantidad requerida',
      dataIndex: 'cantidadRequerida',
      key: 'cantidad',
      width: 180,
      render: (value) => <Typography.Text>{value}</Typography.Text>,
    },
    {
      title: 'Unidad',
      dataIndex: 'unidadMedida',
      key: 'unidad',
      width: 160,
      render: (unidad) => <Tag color="purple">{unidadMap[unidad] ?? unidad}</Tag>,
    },
    {
      title: 'Notas',
      dataIndex: 'notasPreparacion',
      key: 'notas',
      render: (value) => (value ? <Typography.Text>{value}</Typography.Text> : <Typography.Text type="secondary">Sin notas</Typography.Text>),
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: 180,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<IconEdit size={16} />}
            onClick={() => onEditReceta(record)}
          >
            Editar
          </Button>
          <Popconfirm
            title="Eliminar insumo"
            description="¿Confirma que desea quitar este insumo de la receta?"
            okText="Sí, eliminar"
            cancelText="Cancelar"
            onConfirm={() => onDeleteReceta(record.id)}
          >
            <Button
              type="link"
              danger
              icon={<IconTrash size={16} />}
              loading={deletingId === record.id}
            >
              Quitar
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const currentProduct = productos.find((item) => item.value === selectedProductoId);
  const disableCreate = !selectedProductoId || modalProps?.insumoOptions?.every((opt) => opt.disabled);

  return (
    <Card
      style={{ borderRadius: token.borderRadiusLG, boxShadow: token.boxShadowTertiary }}
      styles={{ body: { padding: 24 } }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div>
          <Typography.Title level={4} style={{ margin: 0 }}>
            Recetas de producción
          </Typography.Title>
          <Typography.Text type="secondary">
            Selecciona un producto terminado para ver y editar sus insumos asociados.
          </Typography.Text>
        </div>
        <Space wrap>
          <Select
            showSearch
            style={{ minWidth: 260 }}
            placeholder="Selecciona un producto"
            loading={productosLoading}
            options={productos}
            value={selectedProductoId}
            onChange={onSelectProducto}
            optionFilterProp="label"
          />
          <Button
            type="primary"
            icon={<IconPlus size={16} />}
            onClick={onOpenModal}
            disabled={disableCreate}
          >
            Agregar insumo
          </Button>
        </Space>
      </div>

      {currentProduct && (
        <Typography.Paragraph type="secondary" style={{ marginBottom: 16 }}>
          Configurando receta para <Typography.Text strong>{currentProduct.label}</Typography.Text>
          {currentProduct.categoria ? ` · Categoría: ${currentProduct.categoria}` : ''}
        </Typography.Paragraph>
      )}

      <Table
        rowKey="id"
        columns={columns}
        dataSource={recetas}
        loading={loading || insumosLoading}
        pagination={false}
        locale={{
          emptyText: loading ? 'Cargando...' : <Empty description="Sin insumos asociados" />,
        }}
      />

      <RecetaModal {...modalProps} />
    </Card>
  );
};

export default RecetasView;
