import { Form, Input, Modal, Button, Space, message, Typography, Divider } from 'antd';
import { IconUser, IconMail, IconPhone, IconLock } from '@tabler/icons-react';
import { useEffect } from 'react';

const { Text } = Typography;

const PerfilModal = ({ open, onClose, perfil, onSubmit, loading, isAdmin = false }) => {
  const [form] = Form.useForm();

  const perfilData = perfil ?? null;

  useEffect(() => {
    if (open && perfilData) {
      form.setFieldsValue({
        nombres: perfilData.nombres || perfilData.nombres_doc || '',
        correo: perfilData.correo || '',
        telefono: perfilData.telefono || '',
        contrasenaActual: '',
        nuevaContrasena: '',
        confirmarContrasena: '',
      });
    } else if (open) {
      form.resetFields();
    }
  }, [open, perfilData, form]);

  const handleFinish = (values) => {
    // Solo enviar campos que cambiaron
    const updates = {};
    
    const nombresActuales = perfilData?.nombres || perfilData?.nombres_doc || '';
    if (values.nombres && values.nombres !== nombresActuales) {
      updates.nombres = values.nombres;
    }
    
    if (values.correo && values.correo !== perfilData?.correo) {
      updates.correo = values.correo;
    }
    
    const telefonoActual = perfilData?.telefono || '';
    if (values.telefono && values.telefono !== telefonoActual) {
      updates.telefono = values.telefono;
    }
    
    // Si está cambiando la contraseña, incluir contraseña actual y nueva
    if (values.nuevaContrasena && values.nuevaContrasena.trim()) {
      updates.contrasenaActual = values.contrasenaActual;
      updates.nuevaContrasena = values.nuevaContrasena;
    }

    if (Object.keys(updates).length === 0) {
      message.info('No hay cambios para guardar');
      return;
    }

    onSubmit(updates);
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="Mi Perfil"
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={500}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        autoComplete="off"
      >
        {/* Información no editable */}
        {perfilData && (
          <div style={{ marginBottom: 24, padding: 16, background: '#fafafa', borderRadius: 8 }}>
            <Space direction="vertical" size={8} style={{ width: '100%' }}>
              <Text type="secondary" strong>Información de Identificación</Text>
              <div>
                <Text type="secondary">Tipo de documento: </Text>
                <Text strong>{perfilData.tipoDoc}</Text>
              </div>
              <div>
                <Text type="secondary">Número de documento: </Text>
                <Text strong>{perfilData.numeroDoc}</Text>
              </div>
              {isAdmin && perfilData.rol && (
                <div>
                  <Text type="secondary">Rol: </Text>
                  <Text strong>{perfilData.rol.nombre}</Text>
                </div>
              )}
            </Space>
          </div>
        )}

        <Divider orientation="left">Datos Editables</Divider>

        {/* Nombre Completo */}
        <Form.Item
          label="Nombre Completo"
          name="nombres"
          rules={[
            { required: true, message: 'Ingresa tu nombre completo' },
            { min: 3, message: 'Mínimo 3 caracteres' },
            { max: 255, message: 'Máximo 255 caracteres' }
          ]}
        >
          <Input 
            prefix={<IconUser size={16} />}
            placeholder="Tu nombre completo"
          />
        </Form.Item>

        {/* Correo Electrónico */}
        <Form.Item
          label="Correo Electrónico"
          name="correo"
          rules={[
            { required: true, message: 'Ingresa tu correo electrónico' },
            { type: 'email', message: 'Ingresa un correo válido' },
            { max: 255, message: 'Máximo 255 caracteres' }
          ]}
        >
          <Input 
            prefix={<IconMail size={16} />}
            placeholder="tu@email.com"
            type="email"
          />
        </Form.Item>

        {/* Teléfono */}
        <Form.Item
          label="Teléfono"
          name="telefono"
          rules={[
            { pattern: /^[0-9+\-\s()]+$/, message: 'Solo números y caracteres (+, -, espacio, paréntesis)' },
            { min: 7, message: 'Mínimo 7 caracteres' },
            { max: 50, message: 'Máximo 50 caracteres' }
          ]}
        >
          <Input 
            prefix={<IconPhone size={16} />}
            placeholder="+51 987 654 321"
          />
        </Form.Item>

        <Divider orientation="left">Cambiar Contraseña (Opcional)</Divider>

        <Form.Item
          label="Contraseña Actual"
          name="contrasenaActual"
          dependencies={['nuevaContrasena']}
          rules={[
            ({ getFieldValue }) => ({
              validator(_, value) {
                const nueva = (getFieldValue('nuevaContrasena') || '').trim();
                if (!nueva) {
                  return Promise.resolve();
                }
                if (value && value.trim()) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Debes ingresar tu contraseña actual para cambiarla'));
              },
            }),
          ]}
          extra="Por seguridad, confirma tu contraseña actual antes de cambiarla"
        >
          <Input.Password prefix={<IconLock size={16} />} placeholder="Tu contraseña actual" />
        </Form.Item>

        <Form.Item
          label="Nueva Contraseña"
          name="nuevaContrasena"
          rules={[
            { min: 6, message: 'Mínimo 6 caracteres' },
            { max: 100, message: 'Máximo 100 caracteres' },
          ]}
          extra="Déjalo vacío si no deseas cambiar tu contraseña"
        >
          <Input.Password prefix={<IconLock size={16} />} placeholder="Nueva contraseña (opcional)" />
        </Form.Item>

        <Form.Item
          label="Confirmar Nueva Contraseña"
          name="confirmarContrasena"
          dependencies={['nuevaContrasena']}
          rules={[
            ({ getFieldValue }) => ({
              validator(_, value) {
                const nueva = (getFieldValue('nuevaContrasena') || '').trim();
                if (!nueva) {
                  return Promise.resolve();
                }
                if (!value || !value.trim()) {
                  return Promise.reject(new Error('Debes confirmar la nueva contraseña'));
                }
                if (nueva === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Las contraseñas no coinciden'));
              },
            }),
          ]}
        >
          <Input.Password prefix={<IconLock size={16} />} placeholder="Confirma la nueva contraseña" />
        </Form.Item>

        {/* Botones */}
        <Form.Item style={{ marginTop: 24, marginBottom: 0, textAlign: 'right' }}>
          <Space>
            <Button onClick={handleCancel} disabled={loading}>
              Cancelar
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Guardar Cambios
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PerfilModal;
