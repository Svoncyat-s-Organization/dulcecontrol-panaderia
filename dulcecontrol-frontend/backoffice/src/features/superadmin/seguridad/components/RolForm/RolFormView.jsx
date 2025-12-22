import { App, Button, Checkbox, Divider, Form, Input, Modal, Space, Spin, Typography } from 'antd';

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
  loadingPermisos,
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

  return (
    <Modal
      title={isEditing ? 'Editar rol' : 'Nuevo rol'}
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={600}
      maskClosable={false}
    >
      <Form form={form} layout="vertical" autoComplete="off" onFinish={handleFinish}>
        <Form.Item
          label="Nombre del rol"
          name="nombre"
          rules={[{ required: true, message: 'Ingresa el nombre del rol' }]}
        >
          <Input placeholder="Ej. Equipo auditoría" />
        </Form.Item>

        <Form.Item label="Descripción" name="descripcion">
          <TextArea rows={3} placeholder="Detalla el propósito del rol (opcional)" maxLength={160} showCount />
        </Form.Item>

        <Title level={5} style={{ marginTop: 24 }}>
          Permisos asignados
        </Title>
        <Text type="secondary">
          Selecciona los accesos corporativos que definan el alcance de este rol.
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
          {loadingPermisos ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
              <Spin tip="Cargando permisos corporativos" />
            </div>
          ) : permisosPorModulo.length === 0 ? (
            <Text type="secondary">No hay permisos disponibles para asignar.</Text>
          ) : (
            permisosPorModulo.map(({ key, label, description, permisos }) => {
              const anySelected = permisos.some((permiso) => selectedPermisos.includes(permiso.slug));
              const allSelected = permisos.every((permiso) => selectedPermisos.includes(permiso.slug));

              return (
                <div
                  key={key}
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
                      gap: 12,
                      marginBottom: 12,
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <Text strong>{label}</Text>
                      {description && <Text type="secondary">{description}</Text>}
                    </div>
                    <Space size={12}>
                      <Button type="link" size="small" onClick={() => onToggleModulo(key, true)}>
                        Seleccionar todos
                      </Button>
                      <Divider type="vertical" style={{ margin: 0 }} />
                      <Button type="link" size="small" onClick={() => onToggleModulo(key, false)}>
                        Limpiar
                      </Button>
                    </Space>
                  </div>

                  <Checkbox
                    indeterminate={!allSelected && anySelected}
                    checked={allSelected}
                    onChange={(event) => onToggleModulo(key, event.target.checked)}
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
                        key={permiso.slug}
                        checked={selectedPermisos.includes(permiso.slug)}
                        onChange={(event) => onTogglePermission(permiso.slug, event.target.checked)}
                      >
                        {permiso.nombreVisible}
                      </Checkbox>
                    ))}
                  </div>
                </div>
              );
            })
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
