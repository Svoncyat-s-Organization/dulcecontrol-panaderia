import { useEffect } from 'react';
import { Form, Input, InputNumber, Modal, Select } from 'antd';

const RecetaModal = ({ open, onCancel, onSubmit, loading, insumoOptions = [], unidadOptions = [] }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (!open) {
      form.resetFields();
    }
  }, [open, form]);

  const handleFinish = (values) => {
    onSubmit(values);
  };

  return (
    <Modal
      title="Agregar insumo a la receta"
      open={open}
      onCancel={onCancel}
      okText="Guardar"
      cancelText="Cancelar"
      onOk={() => form.submit()}
      confirmLoading={loading}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" onFinish={handleFinish} preserve={false}>
        <Form.Item
          name="insumoId"
          label="Insumo"
          rules={[{ required: true, message: 'Selecciona un insumo' }]}
        >
          <Select
            showSearch
            placeholder="Busca por nombre"
            options={insumoOptions}
            optionFilterProp="label"
            disabled={insumoOptions.length === 0}
          />
        </Form.Item>

        <Form.Item
          name="cantidadRequerida"
          label="Cantidad requerida"
          rules={[{ required: true, message: 'Ingresa la cantidad' }]}
        >
          <InputNumber
            min={0.001}
            step={0.1}
            precision={3}
            style={{ width: '100%' }}
            placeholder="Ej. 1.5"
          />
        </Form.Item>

        <Form.Item
          name="unidadMedida"
          label="Unidad"
          rules={[{ required: true, message: 'Selecciona una unidad' }]}
        >
          <Select placeholder="Unidad" options={unidadOptions} />
        </Form.Item>

        <Form.Item name="notasPreparacion" label="Notas" extra="Opcional">
          <Input.TextArea rows={3} placeholder="Indicaciones especiales" maxLength={2000} showCount />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RecetaModal;
