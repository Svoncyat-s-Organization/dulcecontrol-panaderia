import { Form, Input, Select, Switch, Button, Modal, Space, Typography } from 'antd';
import { IconX } from '@tabler/icons-react';

const { TextArea } = Input;
const { Option } = Select;
const { Text } = Typography;

const ClienteFormView = ({ open, onClose, form, onSubmit, loading, isEditing }) => {
  const handleFinish = (values) => {
    onSubmit(values);
  };

  const handleCancel = () => {
    Modal.confirm({
      title: '¿Estás seguro de cancelar?',
      content: 'Los cambios no guardados se perderán.',
      okText: 'Sí, cancelar',
      cancelText: 'Continuar editando',
      onOk: onClose,
    });
  };

  return (
    <Modal
      title={isEditing ? 'Editar Cliente' : 'Nuevo Cliente'}
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={600}
      destroyOnHidden
      maskClosable={false}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        autoComplete="off"
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Form.Item
            label="Tipo de Documento"
            name="tipoDoc"
            rules={[{ required: true, message: 'Selecciona el tipo de documento' }]}
          >
            <Select placeholder="Selecciona">
              <Option value="DNI">DNI</Option>
              <Option value="RUC">RUC</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Número de Documento"
            name="numeroDoc"
            rules={[
              { required: true, message: 'Ingresa el número de documento' },
              { pattern: /^[0-9]+$/, message: 'Solo números' }
            ]}
          >
            <Input placeholder="Número de documento" />
          </Form.Item>
        </div>

        <Form.Item
          label="Nombre Completo"
          name="nombreDoc"
          rules={[{ required: true, message: 'Ingresa el nombre completo' }]}
        >
          <Input placeholder="Nombre completo del cliente" />
        </Form.Item>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { type: 'email', message: 'Ingresa un email válido' }
            ]}
          >
            <Input placeholder="cliente@email.com" />
          </Form.Item>

          <Form.Item
            label="Teléfono"
            name="telefono"
          >
            <Input placeholder="Número de teléfono" />
          </Form.Item>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Form.Item
            label="Tipo de Cliente"
            name="esUsuarioVirtual"
            valuePropName="checked"
          >
            <Switch
              checkedChildren="Virtual"
              unCheckedChildren="Físico"
            />
          </Form.Item>

          <Form.Item
            label="Estado"
            name="activo"
            valuePropName="checked"
          >
            <Switch
              checkedChildren="Activo"
              unCheckedChildren="Inactivo"
            />
          </Form.Item>
        </div>

        {form.getFieldValue('esUsuarioVirtual') && (
          <Form.Item
            label="Contraseña"
            name="hashContrasena"
            rules={[{ required: true, message: 'La contraseña es requerida para usuarios virtuales' }]}
          >
            <Input.Password placeholder="Contraseña" />
          </Form.Item>
        )}

        <Form.Item
          label="Notas"
          name="notas"
        >
          <TextArea
            placeholder="Notas adicionales sobre el cliente"
            rows={3}
          />
        </Form.Item>

        <div style={{ marginTop: 24, marginBottom: 16 }}>
          <Text strong style={{ fontSize: 16 }}>Dirección del Cliente</Text>
        </div>

        <Form.Item
          label="Etiqueta (opcional)"
          name="direccionEtiqueta"
        >
          <Input placeholder="Ej: Casa, Oficina, Trabajo" />
        </Form.Item>

        <Form.Item
          label="Dirección Completa"
          name="direccionCompleta"
          rules={[{ required: true, message: 'Ingresa la dirección completa' }]}
        >
          <TextArea
            placeholder="Dirección completa del cliente"
            rows={2}
          />
        </Form.Item>

        <Form.Item
          label="Referencia (opcional)"
          name="direccionReferencia"
        >
          <TextArea
            placeholder="Referencias adicionales para ubicar la dirección"
            rows={2}
          />
        </Form.Item>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Form.Item
            label="Código Postal (opcional)"
            name="direccionCodigoPostal"
          >
            <Input placeholder="Código postal" />
          </Form.Item>

          <Form.Item
            label="Distrito ID (opcional)"
            name="direccionDistritoId"
          >
            <Input placeholder="ID del distrito" type="number" />
          </Form.Item>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Form.Item
            label="Dirección Fiscal"
            name="direccionEsFiscal"
            valuePropName="checked"
          >
            <Switch
              checkedChildren="Sí"
              unCheckedChildren="No"
            />
          </Form.Item>

          <Form.Item
            label="Dirección de Entrega"
            name="direccionEsEntrega"
            valuePropName="checked"
          >
            <Switch
              checkedChildren="Sí"
              unCheckedChildren="No"
            />
          </Form.Item>
        </div>

        <Form.Item style={{ marginTop: 24, marginBottom: 0, textAlign: 'right' }}>
          <Space>
            <Button onClick={handleCancel} disabled={loading}>
              Cancelar
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {isEditing ? 'Actualizar' : 'Crear'} Cliente
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ClienteFormView;