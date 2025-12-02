import { useEffect } from 'react';
import dayjs from 'dayjs';
import {
  Alert,
  Button,
  Card,
  DatePicker,
  Divider,
  Empty,
  Form,
  Input,
  InputNumber,
  List,
  Popconfirm,
  Result,
  Select,
  Space,
  Spin,
  Switch,
  Tabs,
  Tag,
  Typography,
  theme,
} from 'antd';
import {
  IconCircleCheck,
  IconCircleX,
  IconDeviceFloppy,
  IconRefresh,
  IconSparkles,
  IconUpload,
} from '@tabler/icons-react';

const { Text } = Typography;

const estadoColors = {
  BORRADOR: 'default',
  CONFIRMADO: 'warning',
  EN_PROCESO: 'blue',
  FINALIZADO: 'green',
  CANCELADO: 'red',
  PENDIENTE: 'default',
  EN_HORNO: 'processing',
  TERMINADO: 'success',
  MERMA: 'error',
};

const origenConfig = {
  STOCK_DIARIO: { label: 'Stock diario', color: 'blue' },
  PEDIDO_CLIENTE: { label: 'Pedido personalizado', color: 'purple' },
};

const PlanificacionView = ({
  selectedDate,
  onDateChange,
  sedeNombre,
  productos,
  defaultConteoRows,
  onSubmitConteo,
  conteoLoading,
  onGeneratePlan,
  planLoading,
  planData,
  checklistLoading,
  checklistError,
  onRefreshChecklist,
  onDetalleAction,
  updatingDetalleId,
  stockLoading,
  productosLoading,
}) => {
  const { token } = theme.useToken();
  const [conteoForm] = Form.useForm();
  const [planForm] = Form.useForm();

  useEffect(() => {
    conteoForm.setFieldsValue({ fechaConteo: selectedDate });
    planForm.setFieldsValue({ fechaProduccion: selectedDate });
  }, [selectedDate, conteoForm, planForm]);

  const productoOptions = Object.values(productos).map((producto) => ({
    value: producto.id,
    label: producto.nombre,
  }));

  const handlePrefillConteo = () => {
    if (!defaultConteoRows.length) return;
    conteoForm.setFieldsValue({
      detalles: defaultConteoRows.map((row) => ({
        productoId: row.productoId,
        cantidadSistema: row.cantidadSistema,
      })),
    });
  };

  const detalleStats = planData.detalles.reduce(
    (acc, detalle) => {
      acc.total += 1;
      acc[detalle.estado] = (acc[detalle.estado] ?? 0) + 1;
      return acc;
    },
    { total: 0 }
  );

  const groupedDetalles = planData.detalles.reduce((acc, detalle) => {
    const key = detalle.origen ?? 'STOCK_DIARIO';
    if (!acc[key]) acc[key] = [];
    acc[key].push(detalle);
    return acc;
  }, {});

  const checklistContent = () => {
    if (checklistError) {
      return (
        <Result
          status="error"
          title="No se pudo obtener la lista de producción"
          extra={
            <Button icon={<IconRefresh size={16} />} onClick={onRefreshChecklist}>
              Reintentar
            </Button>
          }
        />
      );
    }

    if (!checklistLoading && planData.detalles.length === 0) {
      return (
        <Empty
          description="Aún no hay un plan confirmado para esta fecha"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      );
    }

    return Object.entries(groupedDetalles).map(([origen, detalles]) => {
      const meta = origenConfig[origen] ?? { label: origen, color: 'default' };
      return (
        <Card key={origen} type="inner" title={
          <Space>
            <Tag color={meta.color}>{meta.label}</Tag>
            <Text type="secondary">{detalles.length} items</Text>
          </Space>
        } style={{ marginBottom: 16 }}>
          <List
            dataSource={detalles}
            renderItem={(detalle) => {
              const producto = productos[detalle.productoId];
              const estadoColor = estadoColors[detalle.estado] ?? 'default';
              const isTerminado = detalle.estado === 'TERMINADO';
              return (
                <List.Item
                  actions={[
                    <Button
                      key="done"
                      type="link"
                      icon={<IconCircleCheck size={18} />}
                      onClick={() =>
                        onDetalleAction(detalle, 'TERMINADO', {
                          cantidadProducida: detalle.cantidadPlanificada,
                        })
                      }
                      disabled={isTerminado}
                      loading={updatingDetalleId === detalle.id}
                    >
                      Terminar
                    </Button>,
                    <Popconfirm
                      key="merma"
                      title="Registrar merma"
                      description="Marcar este lote como merma"
                      okText="Confirmar"
                      cancelText="Cancelar"
                      onConfirm={() =>
                        onDetalleAction(detalle, 'MERMA', {
                          cantidadMerma: detalle.cantidadPlanificada,
                        })
                      }
                    >
                      <Button
                        type="link"
                        danger
                        icon={<IconCircleX size={18} />}
                        disabled={detalle.estado === 'MERMA'}
                      >
                        Merma
                      </Button>
                    </Popconfirm>,
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <Space size={8} wrap>
                        <Text strong>{producto?.nombre ?? `Producto #${detalle.productoId}`}</Text>
                        <Tag color={estadoColor}>{detalle.estado}</Tag>
                        {detalle.esPersonalizado && <Tag color="orange">Personalizado</Tag>}
                      </Space>
                    }
                    description={
                      <Space direction="vertical" size={2}>
                        <Text type="secondary">Planificado: {detalle.cantidadPlanificada} · Producido: {detalle.cantidadProducida ?? 0}</Text>
                        {detalle.observaciones && <Text type="secondary">Notas: {detalle.observaciones}</Text>}
                      </Space>
                    }
                  />
                </List.Item>
              );
            }}
          />
        </Card>
      );
    });
  };

  return (
    <Tabs
      defaultActiveKey="conteo"
      destroyOnHidden={false}
      items={[
        {
          key: 'conteo',
          label: 'Conteo matutino',
          children: (
            <Card styles={{ body: { padding: 24 } }} style={{ borderRadius: token.borderRadiusLG }}>
              <Alert
                type="info"
                title={`Sede seleccionada: ${sedeNombre ?? 'Sin seleccionar'}`}
                showIcon
                style={{ marginBottom: 16 }}
              />
              <Form
                layout="vertical"
                form={conteoForm}
                onFinish={onSubmitConteo}
                initialValues={{
                  fechaConteo: selectedDate,
                  detalles: [],
                }}
              >
                <Space size={16} align="start" wrap>
                  <Form.Item
                    name="fechaConteo"
                    label="Fecha del conteo"
                    rules={[{ required: true, message: 'Selecciona la fecha' }]}
                  >
                    <DatePicker format="DD/MM/YYYY" />
                  </Form.Item>
                  <Form.Item name="responsableId" label="Responsable (ID opcional)">
                    <InputNumber min={1} placeholder="Ej. 102" />
                  </Form.Item>
                </Space>

                <Form.Item name="observaciones" label="Observaciones">
                  <Input.TextArea rows={3} placeholder="Detalle hallazgos o incidencias" />
                </Form.Item>

                <Form.List
                  name="detalles"
                  rules={[
                    {
                      validator: async (_, value) => {
                        if (!value || value.length === 0) {
                          throw new Error('Agrega al menos un producto');
                        }
                      },
                    },
                  ]}
                >
                  {(fields, { add, remove }, { errors }) => (
                    <>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: 12,
                        }}
                      >
                        <Text strong>Detalle de productos</Text>
                        <Space>
                          <Button
                            type="default"
                            onClick={handlePrefillConteo}
                            disabled={!defaultConteoRows.length || stockLoading}
                          >
                            Usar stock ideal
                          </Button>
                          <Button type="dashed" icon={<IconUpload size={16} />} onClick={() => add({})}>
                            Agregar producto
                          </Button>
                        </Space>
                      </div>

                      {fields.map((field) => (
                        <Space key={field.key} align="baseline" style={{ display: 'flex', marginBottom: 12 }} wrap>
                          <Form.Item
                            {...field}
                            name={[field.name, 'productoId']}
                            fieldKey={[field.fieldKey, 'productoId']}
                            rules={[{ required: true, message: 'Selecciona un producto' }]}
                          >
                            <Select
                              showSearch
                              placeholder="Producto"
                              options={productoOptions}
                              style={{ minWidth: 220 }}
                              optionFilterProp="label"
                              loading={productosLoading}
                            />
                          </Form.Item>
                          <Form.Item
                            {...field}
                            name={[field.name, 'cantidadFisica']}
                            fieldKey={[field.fieldKey, 'cantidadFisica']}
                            rules={[{ required: true, message: 'Cantidad física' }]}
                          >
                            <InputNumber min={0} placeholder="Físico" />
                          </Form.Item>
                          <Form.Item
                            {...field}
                            name={[field.name, 'cantidadSistema']}
                            fieldKey={[field.fieldKey, 'cantidadSistema']}
                          >
                            <InputNumber min={0} placeholder="Sistema" />
                          </Form.Item>
                          <Button type="link" danger onClick={() => remove(field.name)}>
                            Quitar
                          </Button>
                        </Space>
                      ))}
                      <Form.ErrorList errors={errors} />
                    </>
                  )}
                </Form.List>

                <Divider />

                <Button type="primary" icon={<IconDeviceFloppy size={16} />} htmlType="submit" loading={conteoLoading}>
                  Registrar conteo
                </Button>
              </Form>
            </Card>
          ),
        },
        {
          key: 'generacion',
          label: 'Generación',
          forceRender: true,
          children: (
            <Card styles={{ body: { padding: 24 } }} style={{ borderRadius: token.borderRadiusLG }}>
              <Form
                layout="vertical"
                form={planForm}
                onFinish={onGeneratePlan}
                initialValues={{
                  fechaProduccion: selectedDate,
                  forzarRegeneracion: false,
                }}
              >
                <Space size={16} wrap>
                  <Form.Item
                    name="fechaProduccion"
                    label="Fecha"
                    rules={[{ required: true, message: 'Selecciona la fecha' }]}
                  >
                    <DatePicker format="DD/MM/YYYY" />
                  </Form.Item>
                  <Form.Item name="forzarRegeneracion" label="Recalcular desde cero" valuePropName="checked">
                    <Switch />
                  </Form.Item>
                </Space>

                <Form.Item name="notasMaestro" label="Notas para el maestro panadero">
                  <Input.TextArea rows={4} placeholder="Indicaciones para el turno" />
                </Form.Item>

                <Button type="primary" htmlType="submit" loading={planLoading} icon={<IconSparkles size={16} />}>
                  Generar plan
                </Button>
              </Form>

              {planData.plan && (
                <Card type="inner" style={{ marginTop: 24 }}>
                  <Space direction="vertical" size={4}>
                    <Space size={8} wrap>
                      <Text strong>Estado actual:</Text>
                      <Tag color={estadoColors[planData.plan.estado] ?? 'default'}>{planData.plan.estado}</Tag>
                    </Space>
                    <Text type="secondary">
                      Inició: {planData.plan.horaInicioReal ?? 'Sin registrar'} · Finalizó: {planData.plan.horaFinReal ?? 'Pendiente'}
                    </Text>
                  </Space>
                </Card>
              )}
            </Card>
          ),
        },
        {
          key: 'checklist',
          label: 'Checklist del panadero',
          children: (
            <Card styles={{ body: { padding: 24 } }} style={{ borderRadius: token.borderRadiusLG }}>
              <Space style={{ marginBottom: 16 }} wrap>
                <DatePicker
                  value={selectedDate}
                  onChange={(value) => onDateChange(value ?? dayjs())}
                  format="DD/MM/YYYY"
                />
                <Button icon={<IconRefresh size={16} />} onClick={onRefreshChecklist}>
                  Actualizar
                </Button>
              </Space>

              {planData.detalles.length > 0 && (
                <Card type="inner" style={{ marginBottom: 16 }}>
                  <Space size={24} wrap>
                    <div>
                      <Text strong>Total items</Text>
                      <div>{detalleStats.total}</div>
                    </div>
                    <div>
                      <Text>Terminados</Text>
                      <div>{detalleStats.TERMINADO ?? 0}</div>
                    </div>
                    <div>
                      <Text>En progreso</Text>
                      <div>{detalleStats.EN_HORNO ?? 0}</div>
                    </div>
                    <div>
                      <Text>Merma</Text>
                      <div>{detalleStats.MERMA ?? 0}</div>
                    </div>
                  </Space>
                </Card>
              )}

              <Spin spinning={checklistLoading} tip="Cargando lista">
                {checklistContent()}
              </Spin>
            </Card>
          ),
        },
      ]}
    />
  );
};

export default PlanificacionView;
