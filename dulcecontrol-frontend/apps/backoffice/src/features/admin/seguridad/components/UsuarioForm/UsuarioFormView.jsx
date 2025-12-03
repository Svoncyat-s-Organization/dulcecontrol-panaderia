import { Button, Form, Input, Modal, Select, Space, Switch, Typography } from 'antd';

const { Text } = Typography;

const UsuarioFormView = ({
  open,
  onClose,
  form,
  onSubmit,
  loading,
  isEditing,
  roles,
  tipoDocumentoOptions,
}) => {
  const handleFinish = (values) => {
    onSubmit(values);
  };

  const handleCancel = () => {
    Modal.confirm({
      title: '¿Cancelar cambios?',
      content: 'Los cambios no guardados se perderán.',
      okText: 'Sí, cancelar',
      cancelText: 'Seguir editando',
      onOk: onClose,
    });
  };

  return (
    <Modal
      title={isEditing ? 'Editar usuario' : 'Nuevo usuario'}
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={640}
      destroyOnClose
      maskClosable={false}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish} autoComplete="off">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Form.Item
            label="Rol asignado"
            name="rolId"
            rules={[{ required: true, message: 'Selecciona un rol' }]}
          >
            <Select
              placeholder="Selecciona el rol"
              options={roles?.map((rol) => ({ label: rol.nombre, value: rol.id }))}
            />
          </Form.Item>
          <Form.Item
            label="Estado"
            name="activo"
            valuePropName="checked"
          >
            <Switch checkedChildren="Activo" unCheckedChildren="Inactivo" />
          </Form.Item>
        </div>

        <Form.Item
          label="Nombre completo"
          name="nombres"
          rules={[{ required: true, message: 'Ingresa el nombre completo' }]}
        >
          <Input placeholder="Ej. María Rodríguez" />
        </Form.Item>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Form.Item
            label="Correo corporativo"
            name="correo"
            rules={[{ required: true, message: 'Ingresa el correo electrónico' }, { type: 'email', message: 'Ingresa un correo válido' }]}
          >
            <Input placeholder="correo@empresa.com" />
          </Form.Item>
          <Form.Item label="Teléfono" name="telefono">
            <Input placeholder="Número de contacto (opcional)" />
          </Form.Item>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Form.Item
            label="Tipo de documento"
            name="tipoDoc"
            rules={[{ required: true, message: 'Selecciona el tipo de documento' }]}
          >
            <Select
              options={tipoDocumentoOptions}
              placeholder="Selecciona"
            />
          </Form.Item>

          <Form.Item
            label="Número de documento"
            name="numeroDoc"
            rules={[{ required: true, message: 'Ingresa el número de documento' }]}
          >
            <Input placeholder="Número de documento" />
          </Form.Item>
        </div>

        {isEditing ? (
          <Form.Item
            label="Nueva contraseña"
            name="nuevaContrasena"
            extra={<Text type="secondary">Déjalo en blanco para conservar la contraseña actual.</Text>}
            rules={[{ min: 8, message: 'La contraseña debe tener al menos 8 caracteres' }]}
          >
            <Input.Password placeholder="Actualiza la contraseña" autoComplete="new-password" />
          </Form.Item>
        ) : (
          <Form.Item
            label="Contraseña"
            name="contrasena"
            rules={[{ required: true, message: 'Ingresa una contraseña temporal' }, { min: 8, message: 'Debe tener al menos 8 caracteres' }]}
          >
            <Input.Password placeholder="Contraseña temporal" autoComplete="new-password" />
          </Form.Item>
        )}

        <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
          <Space>
            <Button onClick={handleCancel} disabled={loading}>
              Cancelar
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {isEditing ? 'Actualizar usuario' : 'Crear usuario'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UsuarioFormView;
