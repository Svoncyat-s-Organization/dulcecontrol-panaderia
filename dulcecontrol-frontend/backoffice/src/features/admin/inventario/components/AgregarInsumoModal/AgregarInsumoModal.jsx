import { Alert, Form, Input, InputNumber, Modal, Select, Space, Divider } from 'antd';

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

  const unidadBase = Form.useWatch('unidadBase', form);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
    } catch {
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
      <Alert
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
        message="Creación rápida de insumo"
        description={(
          <div>
            <div>
              El insumo se creará en el catálogo y se agregará al inventario con cantidad 0.
            </div>
            <div style={{ marginTop: 8 }}>
              Usa el botón "Ajustar" después para agregar stock inicial.
            </div>
          </div>
        )}
      />

      <Form form={form} layout="vertical" preserve={false}>
        {/*
          El backend espera "factorConversion". En Inventario lo ocultamos y enviamos un valor seguro por defecto.
          No se valida porque no es editable.
        */}
        <Form.Item name="factorConversion" initialValue={1} hidden>
          <Input />
        </Form.Item>
            <Form.Item
              label="Nombre del insumo"
              name="nombre"
              rules={[{ required: true, message: 'Ingresa el nombre del insumo' }]}
              tooltip="Nombre visible en recetas, compras e inventario"
            >
              <Input placeholder="Ej: Harina preparada" />
            </Form.Item>

            <Form.Item
              label="Código interno (opcional)"
              name="codigoInterno"
              tooltip="Útil para búsquedas rápidas o integración con etiquetas"
            >
              <Input placeholder="Ej: HAR-001" />
            </Form.Item>

            <Space style={{ width: '100%' }} size={12}>
              <Form.Item
                label="Unidad base"
                name="unidadBase"
                rules={[{ required: true, message: 'Selecciona la unidad' }]}
                style={{ flex: 1, marginBottom: 0 }}
                tooltip="Unidad en la que se controla el stock del insumo"
              >
                <Select placeholder="Seleccionar" options={UNIDADES_MEDIDA} />
              </Form.Item>

              <Form.Item
                label="Unidad de compra"
                name="unidadCompraHabitual"
                rules={[{ required: true, message: 'Selecciona la unidad' }]}
                style={{ flex: 1, marginBottom: 0 }}
                tooltip="Cómo suele comprarse este insumo (saco, kg, litro, etc.)"
              >
                <Select placeholder="Seleccionar" options={UNIDADES_MEDIDA} />
              </Form.Item>
            </Space>

            <Form.Item
              label="Stock mínimo"
              name="stockMinimoGlobal"
              initialValue={0}
              rules={[
                { type: 'number', min: 0, message: 'Debe ser mayor o igual a 0' },
              ]}
              tooltip="Alerta cuando el stock total/por sede esté por debajo de este valor"
              extra={unidadBase ? `Se interpreta en ${unidadBase}.` : 'Se interpreta en unidad base.'}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                precision={2}
                placeholder="0.00"
                addonAfter={unidadBase || undefined}
              />
            </Form.Item>
      </Form>
    </Modal>
  );
};

export default AgregarInsumoModal;
