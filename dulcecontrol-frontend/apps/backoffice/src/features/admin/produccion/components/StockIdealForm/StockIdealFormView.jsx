import { Alert, Col, Divider, Form, Input, InputNumber, Modal, Row, Space, Typography } from 'antd';
import { IconPackage, IconAlertTriangle } from '@tabler/icons-react';

const { Text } = Typography;

const StockIdealFormView = ({ form, open, isEditing, isLoading, onSubmit, onCancel }) => {
  return (
    <Modal
      open={open}
      title={
        <Space>
          <IconPackage size={20} />
          <span>{isEditing ? 'Editar Stock Ideal' : 'Configurar Stock Ideal'}</span>
        </Space>
      }
      onOk={onSubmit}
      onCancel={onCancel}
      confirmLoading={isLoading}
      width={600}
      okText={isEditing ? 'Actualizar' : 'Guardar'}
      cancelText="Cancelar"
      maskClosable={false}
    >
      <Divider style={{ margin: '16px 0' }} />

      <Alert
        type="info"
        message="Define el stock objetivo"
        description="Estos valores determinarán cuánto debe producirse diariamente para mantener el inventario óptimo en esta sede."
        showIcon
        style={{ marginBottom: 24 }}
      />

      <Form form={form} layout="vertical" autoComplete="off">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Producto" name="productoNombre">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="SKU" name="productoSku">
              <Input disabled />
            </Form.Item>
          </Col>
        </Row>

        <Divider style={{ margin: '16px 0' }} />

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={
                <Space direction="vertical" size={0}>
                  <Text>Cantidad Ideal</Text>
                  <Text type="secondary" style={{ fontSize: 12, fontWeight: 'normal' }}>
                    Stock objetivo diario
                  </Text>
                </Space>
              }
              name="cantidadIdeal"
              rules={[
                { required: true, message: 'Requerido' },
                { type: 'number', min: 0, message: 'Debe ser mayor o igual a 0' },
              ]}
            >
              <InputNumber
                min={0}
                style={{ width: '100%' }}
                placeholder="Ej: 100"
                addonAfter="unidades"
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label={
                <Space direction="vertical" size={0}>
                  <Text>Punto de Reposición</Text>
                  <Text type="secondary" style={{ fontSize: 12, fontWeight: 'normal' }}>
                    Alerta cuando baje de:
                  </Text>
                </Space>
              }
              name="puntoReposicion"
              rules={[
                { required: true, message: 'Requerido' },
                { type: 'number', min: 0, message: 'Debe ser mayor o igual a 0' },
              ]}
            >
              <InputNumber
                min={0}
                style={{ width: '100%' }}
                placeholder="Ej: 30"
                addonAfter="unidades"
              />
            </Form.Item>
          </Col>
        </Row>

        <Alert
          type="warning"
          icon={<IconAlertTriangle size={16} />}
          message="Importante"
          description="El punto de reposición debe ser menor o igual a la cantidad ideal. Este valor se usa para generar alertas durante el día cuando el stock baje del umbral definido."
          showIcon
        />
      </Form>
    </Modal>
  );
};

export default StockIdealFormView;
