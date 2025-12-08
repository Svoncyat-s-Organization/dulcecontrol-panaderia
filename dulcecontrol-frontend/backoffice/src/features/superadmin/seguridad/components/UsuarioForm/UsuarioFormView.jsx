import { Button, Form, Input, Modal, Select, Space, Switch, Typography } from 'antd';

const { Text } = Typography;

const UsuarioFormView = ({
  open,
  onClose,
  form,
  onSubmit,
  loading,
  isEditing,
  tipoDocumentoOptions,
  roleOptions,
  rolesLoading,
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
      title={isEditing ? 'Editar superadmin' : 'Nuevo superadmin'}
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={640}
      destroyOnClose
      maskClosable={false}
    >
      <Form form={form} layout="vertical" autoComplete="off" onFinish={handleFinish}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Form.Item
            label="Correo corporativo"
            name="correo"
            rules={[
              { required: true, message: 'Ingresa el correo corporativo' },
              { type: 'email', message: 'Ingresa un correo válido' },
            ]}
          >
            <Input placeholder="correo@dulcecontrol.com" />
          </Form.Item>
          <Form.Item label="Estado" name="activo" valuePropName="checked">
            <Switch checkedChildren="Activo" unCheckedChildren="Inactivo" disabled={!isEditing} />
          </Form.Item>
        </div>

        <Form.Item
          label="Nombre completo"
          name="nombres"
          rules={[{ required: true, message: 'Ingresa el nombre completo' }]}
        >
          <Input placeholder="Ej. Ana Torres" />
        </Form.Item>

        <Form.Item
          label="Roles asignados"
          name="roles"
          rules={[
            { required: true, message: 'Selecciona al menos un rol' },
            {
              validator: (_, value) => {
                if (!value || value.length === 0) {
                  return Promise.reject(new Error('Selecciona al menos un rol'));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Selecciona uno o más roles"
            options={roleOptions}
            loading={rolesLoading}
            optionFilterProp="label"
            showSearch
          />
        </Form.Item>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Form.Item label="Teléfono" name="telefono">
            <Input placeholder="Número de contacto (opcional)" />
          </Form.Item>
          <Form.Item
            label="Tipo de documento"
            name="tipoDoc"
            rules={[{ required: true, message: 'Selecciona el tipo de documento' }]}
          >
            <Select placeholder="Selecciona" options={tipoDocumentoOptions} />
          </Form.Item>
        </div>

        <Form.Item label="Número de documento" name="numeroDoc">
          <Input placeholder="Número de documento (opcional)" />
        </Form.Item>

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
            label="Contraseña temporal"
            name="contrasena"
            rules={[
              { required: true, message: 'Ingresa una contraseña temporal' },
              { min: 8, message: 'Debe tener al menos 8 caracteres' },
            ]}
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
              {isEditing ? 'Actualizar superadmin' : 'Crear superadmin'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UsuarioFormView;
