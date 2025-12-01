import { Modal, Form, Input, Switch, Row, Col, Typography } from 'antd';

const { Title } = Typography;

const ProveedorModalView = ({ open, onClose, onSubmit, form, loading, isEditing }) => {
  return (
    <Modal
      title={isEditing ? 'Editar Proveedor' : 'Nuevo Proveedor'}
      open={open}
      onCancel={onClose}
      onOk={onSubmit}
      confirmLoading={loading}
      width={800}
      okText={isEditing ? 'Actualizar' : 'Crear'}
      cancelText="Cancelar"
    >
      <Form form={form} layout="vertical" style={{ marginTop: 24 }}>
        <Title level={5}>Información General</Title>
        <Form.Item
          name="nombreComercial"
          label="Nombre Comercial"
          rules={[{ required: true, message: 'El nombre comercial es requerido' }]}
        >
          <Input placeholder="Ej: Distribuidora Global SAC" />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item 
              name="numeroDoc" 
              label="Número de RUC"
              rules={[
                { required: true, message: 'El RUC es requerido' },
                { len: 11, message: 'El RUC debe tener 11 dígitos' },
                { pattern: /^[0-9]+$/, message: 'Solo se permiten números' }
              ]}
            >
              <Input placeholder="Ej: 20501234567" maxLength={11} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="razonSocial" label="Razón Social">
              <Input placeholder="Ej: Distribuidora Global SAC" />
            </Form.Item>
          </Col>
        </Row>

        <Title level={5} style={{ marginTop: 16 }}>
          Información de Contacto
        </Title>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="nombreContacto" label="Nombre de Contacto">
              <Input placeholder="Ej: Juan Pérez" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="telefonoContacto" label="Teléfono de Contacto">
              <Input placeholder="Ej: 945123456" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="emailContacto" label="Email de Contacto">
          <Input type="email" placeholder="Ej: contacto@proveedor.com" />
        </Form.Item>

        <Title level={5} style={{ marginTop: 16 }}>
          Configuración
        </Title>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="esGenerico"
              label="Proveedor Genérico"
              valuePropName="checked"
              tooltip="Marcar si es un proveedor genérico sin datos específicos"
            >
              <Switch />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="activo" label="Estado" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ProveedorModalView;
