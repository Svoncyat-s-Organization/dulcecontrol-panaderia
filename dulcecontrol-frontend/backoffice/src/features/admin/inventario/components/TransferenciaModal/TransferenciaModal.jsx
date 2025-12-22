import { useEffect, useMemo } from 'react';
import { Button, Form, Input, InputNumber, Modal, Select, Space, Typography, message } from 'antd';

const { Text } = Typography;

const buildItemOptions = (items, kind) =>
  (items ?? []).map((item) => ({
    label: kind === 'producto'
      ? `${item.nombre ?? 'Producto'} (${item.sku ?? 'N/D'})`
      : `${item.nombre ?? item.nombreInsumo ?? 'Insumo'} (${item.codigoInterno ?? 'N/D'})`,
    value: item.id,
    item,
  }));

const TransferenciaModal = ({
  open,
  onClose,
  loading,
  onSubmit,
  sedesDestino = [],
  sedeOrigenId,
  sedeOrigenNombre,
  userId,
  productos = [],
  insumos = [],
}) => {
  const [form] = Form.useForm();

  const validateCantidad = (index) => async (_, value) => {
    const tipo = form.getFieldValue(['items', index, 'tipo']);
    const isProducto = tipo === 'producto';

    if (value === undefined || value === null || value === '') {
      throw new Error('Cantidad requerida');
    }

    const numero = Number(value);
    if (!Number.isFinite(numero) || numero <= 0) {
      throw new Error('La cantidad debe ser mayor a 0');
    }

    if (isProducto && !Number.isInteger(numero)) {
      throw new Error('Para productos, la cantidad debe ser un entero');
    }
  };

  useEffect(() => {
    if (open) {
      form.resetFields();
      form.setFieldsValue({
        sedeOrigenId,
        solicitadoPor: userId ?? null,
        items: [{ tipo: 'producto', refId: null, cantidadEnviada: 1 }],
      });
    }
  }, [open, form, sedeOrigenId, userId]);

  const productoOptions = useMemo(() => buildItemOptions(productos, 'producto'), [productos]);
  const insumoOptions = useMemo(() => buildItemOptions(insumos, 'insumo'), [insumos]);

  const handleFinish = (values) => {
    if (!values?.sedeDestinoId) {
      message.error('Selecciona una sede destino');
      return;
    }

    const rawItems = Array.isArray(values.items) ? values.items : [];
    const items = rawItems
      .filter((row) => row?.refId && row?.cantidadEnviada !== undefined && row?.cantidadEnviada !== null)
      .map((row) => {
        const isProducto = row.tipo === 'producto';
        const cantidad = isProducto ? String(parseInt(row.cantidadEnviada, 10)) : String(row.cantidadEnviada);
        return {
          productoId: isProducto ? row.refId : null,
          insumoId: !isProducto ? row.refId : null,
          cantidadEnviada: cantidad,
        };
      });

    if (!items.length) {
      message.error('Agrega al menos un item válido');
      return;
    }

    onSubmit({
      sedeOrigenId: values.sedeOrigenId,
      sedeDestinoId: values.sedeDestinoId,
      solicitadoPor: values.solicitadoPor ?? null,
      observaciones: values.observaciones ?? null,
      items,
    });
  };

  return (
    <Modal
      title="Nueva transferencia"
      open={open}
      onCancel={onClose}
      footer={null}
      width={720}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish} disabled={loading}>
        <Space style={{ width: '100%' }} size={12} wrap>
          <Form.Item label="Sede origen" name="sedeOrigenId" style={{ flex: 1, minWidth: 240 }}>
            <Select
              disabled
              options={[{ label: sedeOrigenNombre ? `${sedeOrigenNombre} (#${sedeOrigenId})` : `Sede ${sedeOrigenId}`, value: sedeOrigenId }]}
            />
          </Form.Item>
          <Form.Item
            label="Sede destino"
            name="sedeDestinoId"
            rules={[{ required: true, message: 'Selecciona la sede destino' }]}
            style={{ flex: 1, minWidth: 240 }}
          >
            <Select
              placeholder="Selecciona destino"
              options={sedesDestino.map((s) => ({ label: s.nombre, value: s.id }))}
              showSearch
              optionFilterProp="label"
            />
          </Form.Item>
        </Space>

        <Form.Item label="Observaciones" name="observaciones">
          <Input.TextArea rows={3} placeholder="Opcional" />
        </Form.Item>

        <Form.List name="items">
          {(fields, { add, remove }) => (
            <>
              <Text type="secondary">Items</Text>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} align="start" style={{ display: 'flex', marginTop: 12 }} wrap>
                  <Form.Item {...restField} name={[name, 'tipo']} initialValue="producto" style={{ width: 140 }}>
                    <Select
                      options={[
                        { label: 'Producto', value: 'producto' },
                        { label: 'Insumo', value: 'insumo' },
                      ]}
                    />
                  </Form.Item>

                  <Form.Item
                    shouldUpdate={(prev, curr) => prev?.items?.[name]?.tipo !== curr?.items?.[name]?.tipo}
                    noStyle
                  >
                    {({ getFieldValue }) => {
                      const tipo = getFieldValue(['items', name, 'tipo']);
                      const options = tipo === 'insumo' ? insumoOptions : productoOptions;
                      return (
                        <Form.Item
                          {...restField}
                          name={[name, 'refId']}
                          rules={[{ required: true, message: 'Selecciona un item' }]}
                          style={{ width: 360 }}
                        >
                          <Select
                            placeholder={tipo === 'insumo' ? 'Selecciona insumo' : 'Selecciona producto'}
                            options={options}
                            showSearch
                            optionFilterProp="label"
                          />
                        </Form.Item>
                      );
                    }}
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    label={null}
                    name={[name, 'cantidadEnviada']}
                    rules={[{ validator: validateCantidad(name) }]}
                    style={{ width: 160 }}
                  >
                    <Form.Item
                      shouldUpdate={(prev, curr) => prev?.items?.[name]?.tipo !== curr?.items?.[name]?.tipo}
                      noStyle
                    >
                      {({ getFieldValue }) => {
                        const tipo = getFieldValue(['items', name, 'tipo']);
                        const isProducto = tipo !== 'insumo';

                        return (
                          <InputNumber
                            min={isProducto ? 1 : 0.01}
                            step={isProducto ? 1 : 0.01}
                            precision={isProducto ? 0 : 4}
                            style={{ width: '100%' }}
                            placeholder="Cantidad"
                          />
                        );
                      }}
                    </Form.Item>
                  </Form.Item>

                  <Button danger onClick={() => remove(name)} disabled={fields.length === 1}>
                    Quitar
                  </Button>
                </Space>
              ))}

              <div style={{ marginTop: 16 }}>
                <Button onClick={() => add({ tipo: 'producto', refId: null, cantidadEnviada: 1 })}>
                  Agregar item
                </Button>
              </div>
            </>
          )}
        </Form.List>

        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="primary" loading={loading} onClick={() => form.submit()}>
            Crear transferencia
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default TransferenciaModal;
