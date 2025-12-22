import { App, Button, Checkbox, Divider, Form, Input, Modal, Space, Typography } from 'antd';

const { Text, Title } = Typography;
const { TextArea } = Input;

const RolFormView = ({
  open,
  onClose,
  form,
  onSubmit,
  loading,
  isEditing,
  permisosPorModulo,
  selectedPermisos,
  onTogglePermission,
  onToggleModulo,
}) => {
  const { modal } = App.useApp();

  const handleFinish = (values) => {
    onSubmit(values);
  };

  const handleCancel = () => {
    modal.confirm({
      title: '¿Cancelar cambios?',
      content: 'Los cambios no guardados se perderán.',
      okText: 'Sí, cancelar',
      cancelText: 'Seguir editando',
      onOk: onClose,
    });
  };

  const allSelected = (permisos) => permisos.every((permiso) => selectedPermisos.includes(permiso.id));

  return (
    <Modal
      title={isEditing ? 'Editar rol' : 'Nuevo rol'}
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={720}
      maskClosable={false}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish} autoComplete="off">
        <Form.Item
          label="Nombre del rol"
          name="nombre"
          rules={[{ required: true, message: 'Ingresa el nombre del rol' }]}
        >
          <Input placeholder="Ej. Administrador, Gerente, Cajero" />
        </Form.Item>

        <Form.Item label="Descripción" name="descripcion">
          <TextArea
            placeholder="Describe el alcance del rol"
            rows={3}
            maxLength={160}
            showCount
          />
        </Form.Item>

        <Title level={5} style={{ marginTop: 24 }}>
          Permisos asignados
        </Title>
        <Text type="secondary">
          Selecciona los accesos que tendrá este rol dentro del panel administrativo.
        </Text>

        <Form.Item
          name="permisos"
          hidden
          rules={[
            {
              validator: (_, value) =>
                value && value.length > 0
                  ? Promise.resolve()
                  : Promise.reject(new Error('Selecciona al menos un permiso')),
            },
          ]}
        >
          <Input type="hidden" />
        </Form.Item>

        <div style={{ marginTop: 16, maxHeight: 360, overflowY: 'auto', paddingRight: 8 }}>
          {permisosPorModulo.length === 0 ? (
            <Text type="secondary">No hay permisos disponibles.</Text>
          ) : (
            permisosPorModulo.map(({ modulo, label, description, permisos }) => (
              <div
                key={modulo}
                style={{
                  border: '1px solid #f0f0f0',
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 16,
                  background: '#fafafa',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: 12,
                    gap: 12,
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <Text strong>{label}</Text>
                    {description && (
                      <Text type="secondary">{description}</Text>
                    )}
                  </div>
                  <Space size={12}>
                    <Button
                      type="link"
                      size="small"
                      onClick={() => onToggleModulo(modulo, true)}
                    >
                      Seleccionar todos
                    </Button>
                    <Divider type="vertical" />
                    <Button
                      type="link"
                      size="small"
                      onClick={() => onToggleModulo(modulo, false)}
                    >
                      Limpiar
                    </Button>
                  </Space>
                </div>

                <Checkbox
                  indeterminate={!allSelected(permisos) && permisos.some((permiso) => selectedPermisos.includes(permiso.id))}
                  checked={allSelected(permisos)}
                  onChange={(event) => onToggleModulo(modulo, event.target.checked)}
                  style={{ marginBottom: 12 }}
                >
                  Todos los permisos del módulo
                </Checkbox>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: 8,
                  }}
                >
                  {permisos.map((permiso) => (
                    <Checkbox
                      key={permiso.id}
                      checked={selectedPermisos.includes(permiso.id)}
                      onChange={(event) => onTogglePermission(permiso.id, event.target.checked)}
                    >
                      {permiso.displayName ?? permiso.nombreVisible}
                    </Checkbox>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
          <Space>
            <Button onClick={handleCancel} disabled={loading}>
              Cancelar
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {isEditing ? 'Actualizar rol' : 'Crear rol'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RolFormView;
