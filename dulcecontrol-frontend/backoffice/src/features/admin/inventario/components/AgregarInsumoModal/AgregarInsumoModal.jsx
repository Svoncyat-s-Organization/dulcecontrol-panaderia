import { Form, Input, InputNumber, Modal, Select, Space, Divider } from 'antd';

const UNIDADES_MEDIDA = [
  { label: 'Unidad', value: 'UNIDAD' },
  { label: 'Kilogramo (KG)', value: 'KG' },
  { label: 'Gramo (G)', value: 'G' },
  { label: 'Litro (L)', value: 'L' },
  { label: 'Mililitro (ML)', value: 'ML' },
  { label: 'Paquete', value: 'PAQUETE' },
  { label: 'Saco', value: 'SACO' },
  { label: 'Lata', value: 'LATA' },
];

const AgregarInsumoModal = ({ open, onClose, onSubmit, loading }) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
    } catch (error) {
      // Validación falló, el form muestra los errores
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="Agregar insumo nuevo"
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Crear y agregar"
      cancelText="Cancelar"
      confirmLoading={loading}
      destroyOnClose
      width={600}
    >
      <Form form={form} layout="vertical" preserve={false}>
            <Form.Item
              label="Nombre del insumo"
              name="nombre"
              rules={[{ required: true, message: 'Ingresa el nombre del insumo' }]}
            >
              <Input placeholder="Ej: Harina preparada" />
            </Form.Item>

            <Form.Item
              label="Código interno (opcional)"
              name="codigoInterno"
            >
              <Input placeholder="Ej: HAR-001" />
            </Form.Item>

            <Space style={{ width: '100%' }} size={12}>
              <Form.Item
                label="Unidad base"
                name="unidadBase"
                rules={[{ required: true, message: 'Selecciona la unidad' }]}
                style={{ flex: 1, marginBottom: 0 }}
              >
                <Select placeholder="Seleccionar" options={UNIDADES_MEDIDA} />
              </Form.Item>

              <Form.Item
                label="Unidad de compra"
                name="unidadCompraHabitual"
                rules={[{ required: true, message: 'Selecciona la unidad' }]}
                style={{ flex: 1, marginBottom: 0 }}
              >
                <Select placeholder="Seleccionar" options={UNIDADES_MEDIDA} />
              </Form.Item>
            </Space>

            <Form.Item
              label="Factor de conversión"
              name="factorConversion"
              initialValue={1}
              rules={[
                { required: true, message: 'Ingresa el factor de conversión' },
                { type: 'number', min: 0.0001, message: 'Debe ser mayor a 0' },
              ]}
              tooltip="Cuántas unidades base equivalen a 1 unidad de compra. Ej: si compras en sacos de 50kg, factor = 50"
            >
              <InputNumber
                style={{ width: '100%' }}
                min={0.0001}
                precision={4}
                placeholder="1.0000"
              />
            </Form.Item>

            <Form.Item
              label="Stock mínimo"
              name="stockMinimoGlobal"
              initialValue={0}
              rules={[
                { type: 'number', min: 0, message: 'Debe ser mayor o igual a 0' },
              ]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                precision={3}
                placeholder="0.000"
              />
            </Form.Item>

        <Divider style={{ margin: '16px 0' }} />

        <Form.Item
          label="Cantidad inicial"
          name="cantidadActual"
          rules={[
            { required: true, message: 'Ingresa la cantidad inicial' },
            { type: 'number', min: 0, message: 'La cantidad debe ser mayor o igual a 0' },
          ]}
        >
          <InputNumber
            style={{ width: '100%' }}
            min={0}
            precision={2}
            placeholder="0.0"
          />
        </Form.Item>

        <Form.Item label="Ubicación física" name="ubicacionFisica">
          <Input placeholder="Ej: Estante A, Nivel 2" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AgregarInsumoModal;
