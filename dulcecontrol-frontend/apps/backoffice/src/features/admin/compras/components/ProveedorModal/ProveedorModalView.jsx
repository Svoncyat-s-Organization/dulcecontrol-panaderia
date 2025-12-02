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
        <Title level={5}>Datos Generales</Title>
        <Form.Item
          name="nombreComercial"
          label="Nombre Proveedor"
          rules={[{ required: true, message: 'Nombre requerido' }]}
        >
          <Input />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item 
              name="numeroDoc" 
              label="RUC"
              rules={[
                { required: true, message: 'RUC requerido' },
                { len: 11, message: 'RUC debe tener 11 digitos' },
                { pattern: /^[0-9]+$/, message: 'Solo numeros' }
              ]}
            >
              <Input maxLength={11} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="razonSocial" label="Razon Social">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Title level={5} style={{ marginTop: 16 }}>
          Datos de Contacto
        </Title>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="nombreContacto" label="Contacto">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="telefonoContacto" label="Telefono">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="emailContacto" label="Email">
          <Input type="email" />
        </Form.Item>

        <Title level={5} style={{ marginTop: 16 }}>
          Opciones
        </Title>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="esGenerico"
              label="Es Generico"
              valuePropName="checked"
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
