import { Modal, Form, Input, InputNumber, Switch, theme } from 'antd';
import { IconLink } from '@tabler/icons-react';

const CategoriaFormView = ({ open, onClose, form, onSubmit, loading, isEditing }) => {
  const { token } = theme.useToken();

  return (
    <Modal
      title={`${isEditing ? 'Editar' : 'Nueva'} categoría`}
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText={isEditing ? 'Guardar cambios' : 'Crear categoría'}
      confirmLoading={loading}
      destroyOnClose
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={onSubmit}
        disabled={loading}
        requiredMark={false}
      >
        <Form.Item
          label="Nombre"
          name="nombre"
          rules={[{ required: true, message: 'Ingresa el nombre de la categoría' }]}
        >
          <Input placeholder="Ej. Tortas" allowClear />
        </Form.Item>

        <Form.Item label="Descripción" name="descripcion">
          <Input.TextArea rows={3} placeholder="Descripción corta" />
        </Form.Item>

        <Form.Item label="URL Imagen" name="urlImagen">
          <Input prefix={<IconLink size={16} color={token.colorTextTertiary} />} placeholder="https://" allowClear />
        </Form.Item>

        <Form.Item label="Orden visual" name="ordenVisual">
          <InputNumber min={0} step={1} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="Activa" name="activa" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CategoriaFormView;
