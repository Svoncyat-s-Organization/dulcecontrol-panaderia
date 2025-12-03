import { Button, Card, Col, Divider, Form, Input, InputNumber, Modal, Row, Select, Space, Statistic, Table, Tag, Typography } from 'antd';
import { IconEdit, IconCheck, IconX, IconCheckupList } from '@tabler/icons-react';
import {
  ESTADO_PLAN_CONFIG,
  ESTADO_ITEM_CONFIG,
  ORIGEN_ITEM_CONFIG,
} from '../../constants/planProduccionConstants.js';
import { getFechaLabel, calcularTotalesPlan } from '../../utils/planProduccionMappers.js';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const PlanDetalleModalView = ({
  open,
  onClose,
  plan,
  stockDiario,
  pedidosCliente,
  editingDetalle,
  onEditDetalle,
  onCancelEdit,
  onSaveDetalle,
  onMarcarTerminado,
  updating,
}) => {
  const [form] = Form.useForm();

  if (!plan) return null;

  const totales = calcularTotalesPlan(plan.detalles || []);
  const estadoConfig = ESTADO_PLAN_CONFIG[plan.estado] || {};
  const puedeEditar = plan.estado === 'EN_PROCESO' || plan.estado === 'CONFIRMADO';

  const handleStartEdit = (detalle) => {
    form.setFieldsValue({
      cantidadProducida: detalle.cantidadProducida || 0,
      cantidadMerma: detalle.cantidadMerma || 0,
      estado: detalle.estado,
      observaciones: detalle.observaciones || '',
    });
    onEditDetalle(detalle);
  };

  const handleSubmitEdit = async () => {
    try {
      const values = await form.validateFields();
      onSaveDetalle(editingDetalle.id, values);
    } catch (error) {
      console.error('Error en validación:', error);
    }
  };

  const handleCancelEdit = () => {
    form.resetFields();
    onCancelEdit();
  };

  const getColumnsStockDiario = () => [
    {
      title: 'Producto',
      dataIndex: 'productoNombre',
      key: 'productoNombre',
      width: 250,
      render: (nombre) => <Text strong>{nombre}</Text>,
    },
    {
      title: 'Planificado',
      dataIndex: 'cantidadPlanificada',
      key: 'cantidadPlanificada',
      width: 100,
      align: 'center',
      render: (cant) => <Text>{cant}</Text>,
    },
    {
      title: 'Producido',
      dataIndex: 'cantidadProducida',
      key: 'cantidadProducida',
      width: 100,
      align: 'center',
      render: (cant, record) => {
        if (editingDetalle?.id === record.id) {
          return (
            <Form.Item name="cantidadProducida" noStyle rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: 80 }} />
            </Form.Item>
          );
        }
        return <Text type={cant === record.cantidadPlanificada ? 'success' : undefined}>{cant}</Text>;
      },
    },
    {
      title: 'Merma',
      dataIndex: 'cantidadMerma',
      key: 'cantidadMerma',
      width: 90,
      align: 'center',
      render: (cant, record) => {
        if (editingDetalle?.id === record.id) {
          return (
            <Form.Item name="cantidadMerma" noStyle rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: 70 }} />
            </Form.Item>
          );
        }
        return cant > 0 ? <Text type="danger">{cant}</Text> : <Text type="secondary">0</Text>;
      },
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
      width: 130,
      render: (estado, record) => {
        if (editingDetalle?.id === record.id) {
          return (
            <Form.Item name="estado" noStyle rules={[{ required: true }]}>
              <Select style={{ width: 120 }} size="small">
                <Select.Option value="PENDIENTE">Pendiente</Select.Option>
                <Select.Option value="EN_HORNO">En Horno</Select.Option>
                <Select.Option value="TERMINADO">Terminado</Select.Option>
                <Select.Option value="MERMA">Merma</Select.Option>
              </Select>
            </Form.Item>
          );
        }
        const config = ESTADO_ITEM_CONFIG[estado] || {};
        return <Tag color={config.color}>{config.label}</Tag>;
      },
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: 150,
      fixed: 'right',
      render: (_, record) => {
        if (editingDetalle?.id === record.id) {
          return (
            <Space size="small">
              <Button
                type="primary"
                size="small"
                icon={<IconCheck size={14} />}
                onClick={handleSubmitEdit}
                loading={updating}
              >
                Guardar
              </Button>
              <Button
                size="small"
                icon={<IconX size={14} />}
                onClick={handleCancelEdit}
                disabled={updating}
              >
                Cancelar
              </Button>
            </Space>
          );
        }

        if (!puedeEditar) return null;

        return (
          <Space size="small">
            {record.estado !== 'TERMINADO' && (
              <Button
                type="link"
                size="small"
                icon={<IconCheckupList size={14} />}
                onClick={() => onMarcarTerminado(record)}
                disabled={updating || editingDetalle}
              >
                Marcar Listo
              </Button>
            )}
            <Button
              type="link"
              size="small"
              icon={<IconEdit size={14} />}
              onClick={() => handleStartEdit(record)}
              disabled={updating || editingDetalle}
            >
              Editar
            </Button>
          </Space>
        );
      },
    },
  ];

  const getColumnsPedidos = () => [
    ...getColumnsStockDiario().slice(0, -1),
    {
      title: 'Cliente',
      dataIndex: 'pedidoClienteId',
      key: 'pedidoClienteId',
      width: 120,
      render: (pedidoId) => (
        <Text type="secondary" style={{ fontSize: 12 }}>
          Pedido #{pedidoId}
        </Text>
      ),
    },
    ...getColumnsStockDiario().slice(-1),
  ];

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={
        <Space>
          <IconCheckupList size={20} />
          <span>Detalle del Plan - {getFechaLabel(plan.fechaProduccion)}</span>
        </Space>
      }
      width={1200}
      footer={[
        <Button key="close" onClick={onClose}>
          Cerrar
        </Button>,
      ]}
    >
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        {/* Header con estado y totales */}
        <Card size="small">
          <Row gutter={16}>
            <Col span={6}>
              <Statistic
                title="Estado"
                value={estadoConfig.label}
                valueStyle={{ color: estadoConfig.color === 'success' ? '#3f8600' : undefined }}
              />
            </Col>
            <Col span={6}>
              <Statistic title="Total Planificado" value={totales.planificado} suffix="und" />
            </Col>
            <Col span={6}>
              <Statistic
                title="Producido"
                value={totales.producido}
                suffix="und"
                valueStyle={{ color: '#3f8600' }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Merma"
                value={totales.merma}
                suffix="und"
                valueStyle={{ color: totales.merma > 0 ? '#cf1322' : undefined }}
              />
            </Col>
          </Row>
        </Card>

        {/* Notas del maestro */}
        {plan.notasMaestro && (
          <Card size="small" title="Observaciones del Plan">
            <Paragraph>{plan.notasMaestro}</Paragraph>
          </Card>
        )}

        <Form form={form} layout="vertical">
          {/* Tabla Stock Diario */}
          {stockDiario.length > 0 && (
            <Card
              size="small"
              title={
                <Space>
                  <span>{ORIGEN_ITEM_CONFIG.STOCK_DIARIO.icon}</span>
                  <span>Stock Diario para Vitrina ({stockDiario.length} items)</span>
                </Space>
              }
            >
              <Table
                dataSource={stockDiario}
                columns={getColumnsStockDiario()}
                rowKey="id"
                pagination={false}
                size="small"
                scroll={{ x: 900 }}
              />
            </Card>
          )}

          {/* Tabla Pedidos Cliente */}
          {pedidosCliente.length > 0 && (
            <Card
              size="small"
              title={
                <Space>
                  <span>{ORIGEN_ITEM_CONFIG.PEDIDO_CLIENTE.icon}</span>
                  <span>Pedidos de Clientes ({pedidosCliente.length} items)</span>
                </Space>
              }
            >
              <Table
                dataSource={pedidosCliente}
                columns={getColumnsPedidos()}
                rowKey="id"
                pagination={false}
                size="small"
                scroll={{ x: 1000 }}
              />
            </Card>
          )}

          {/* Campo de observaciones en modo edición */}
          {editingDetalle && (
            <Card size="small" title="Observaciones">
              <Form.Item name="observaciones" label="Notas adicionales">
                <TextArea rows={3} placeholder="Ej: Se quemó una tanda, rehacer..." />
              </Form.Item>
            </Card>
          )}
        </Form>
      </Space>
    </Modal>
  );
};

export default PlanDetalleModalView;
