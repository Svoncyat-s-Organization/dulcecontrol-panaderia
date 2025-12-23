import { useMemo } from 'react';
import { Alert, Form, Input, InputNumber, Modal, Select, Space, Divider, Typography } from 'antd';

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
  const unidadCompraHabitual = Form.useWatch('unidadCompraHabitual', form);
  const factorConversionRaw = Form.useWatch('factorConversion', form);

  const factorConversion = useMemo(() => {
    const n = Number(factorConversionRaw);
    return Number.isFinite(n) ? n : null;
  }, [factorConversionRaw]);

  const conversionText = useMemo(() => {
    if (!unidadBase || !unidadCompraHabitual || !factorConversion || factorConversion <= 0) {
      return null;
    }
    return `1 ${unidadCompraHabitual} = ${factorConversion} ${unidadBase}`;
  }, [unidadBase, unidadCompraHabitual, factorConversion]);

  const shouldSuggestFactorOne = Boolean(unidadBase && unidadCompraHabitual && unidadBase === unidadCompraHabitual);

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
              Aquí creas el insumo y lo agregas al inventario de la sede con una cantidad inicial.
            </div>
            {conversionText ? (
              <div style={{ marginTop: 8 }}>
                <Typography.Text type="secondary">Vista previa conversión: </Typography.Text>
                <Typography.Text strong>{conversionText}</Typography.Text>
              </div>
            ) : (
              <div style={{ marginTop: 8 }}>
                <Typography.Text type="secondary">
                  Selecciona unidades y factor para ver la equivalencia.
                </Typography.Text>
              </div>
            )}
          </div>
        )}
      />

      <Form form={form} layout="vertical" preserve={false}>
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
              label="Factor de conversión"
              name="factorConversion"
              initialValue={1}
              rules={[
                { required: true, message: 'Ingresa el factor de conversión' },
                { type: 'number', min: 0.0001, message: 'Debe ser mayor a 0' },
              ]}
              tooltip="Cuántas unidades base equivalen a 1 unidad de compra. Ej: si compras en sacos de 50kg, factor = 50"
              extra={
                conversionText
                  ? conversionText
                  : shouldSuggestFactorOne
                    ? 'Si ambas unidades son iguales, usa factor 1.'
                    : 'Completa unidades para ver la equivalencia.'
              }
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
              tooltip="Alerta cuando el stock total/por sede esté por debajo de este valor"
              extra={unidadBase ? `Se interpreta en ${unidadBase}.` : 'Se interpreta en unidad base.'}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                precision={3}
                placeholder="0.000"
                addonAfter={unidadBase || undefined}
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
          tooltip="Este será el stock inicial en la sede seleccionada"
          extra={unidadBase ? `Se registra en ${unidadBase}. Puedes iniciar en 0.` : 'Se registra en unidad base. Puedes iniciar en 0.'}
        >
          <InputNumber
            style={{ width: '100%' }}
            min={0}
            precision={2}
            placeholder="0.0"
            addonAfter={unidadBase || undefined}
          />
        </Form.Item>

        <Form.Item
          label="Ubicación física"
          name="ubicacionFisica"
          tooltip="Opcional: ayuda al equipo a ubicar el insumo (estante, cámara fría, depósito)"
          rules={[{ max: 100, message: 'Máximo 100 caracteres' }]}
        >
          <Input placeholder="Ej: Estante A, Nivel 2" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AgregarInsumoModal;
