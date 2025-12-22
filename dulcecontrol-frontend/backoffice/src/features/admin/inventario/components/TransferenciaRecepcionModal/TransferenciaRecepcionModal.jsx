import { useEffect, useMemo } from 'react';
import { Button, Form, InputNumber, Modal, Space, Typography, message } from 'antd';

const { Text } = Typography;

const normalizeId = (value) => {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : null;
};

const toLabel = ({ item, productos, insumos }) => {
  if (item?.productoId) {
    const pid = normalizeId(item.productoId);
    const p = (productos ?? []).find((x) => normalizeId(x.id) === pid);
    return p ? `Producto: ${p.nombre ?? 'Producto'} (${p.sku ?? 'N/D'})` : `Producto #${item.productoId}`;
  }

  const iid = normalizeId(item?.insumoId);
  const i = (insumos ?? []).find((x) => normalizeId(x.id) === iid);
  return i ? `Insumo: ${i.nombre ?? i.nombreInsumo ?? 'Insumo'} (${i.codigoInterno ?? 'N/D'})` : `Insumo #${item?.insumoId}`;
};

const TransferenciaRecepcionModal = ({
  open,
  onClose,
  loading,
  transferencia,
  userId,
  productos,
  insumos,
  onSubmit,
}) => {
  const [form] = Form.useForm();

  const items = useMemo(() => transferencia?.items ?? [], [transferencia]);

  useEffect(() => {
    if (!open) return;

    const initial = (items ?? []).map((it) => ({
      itemId: it.id,
      cantidadRecibida: it.cantidadRecibida ?? it.cantidadEnviada,
      max: it.cantidadEnviada,
      tipo: it.productoId ? 'producto' : 'insumo',
    }));

    form.resetFields();
    form.setFieldsValue({
      recibidoPor: userId ?? null,
      items: initial,
    });
  }, [open, form, items, userId]);

  const handleFinish = (values) => {
    const rows = Array.isArray(values?.items) ? values.items : [];

    const payloadItems = [];
    for (const row of rows) {
      const itemId = normalizeId(row?.itemId);
      if (!itemId) continue;

      const tipo = row?.tipo;
      const cantidad = row?.cantidadRecibida;
      const max = row?.max;

      const numero = Number(cantidad);
      if (!Number.isFinite(numero) || numero <= 0) {
        message.error('Revisa las cantidades recibidas (deben ser > 0)');
        return;
      }

      if (tipo === 'producto' && !Number.isInteger(numero)) {
        message.error('Para productos, la cantidad recibida debe ser un entero');
        return;
      }

      if (max != null && Number(numero) > Number(max)) {
        message.error('La cantidad recibida no puede superar la enviada');
        return;
      }

      payloadItems.push({
        itemId,
        cantidadRecibida: tipo === 'producto' ? String(parseInt(numero, 10)) : String(cantidad),
      });
    }

    if (!payloadItems.length) {
      message.error('No hay items para recibir');
      return;
    }

    onSubmit({
      recibidoPor: values?.recibidoPor ?? null,
      items: payloadItems,
    });
  };

  return (
    <Modal
      title={transferencia?.id ? `Recibir transferencia #${transferencia.id}` : 'Recibir transferencia'}
      open={open}
      onCancel={onClose}
      footer={null}
      width={760}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish} disabled={loading}>
        <Text type="secondary">Ingresa la cantidad recibida por item.</Text>

        <Form.List name="items">
          {(fields) => (
            <>
              {fields.map(({ key, name, ...restField }) => {
                const tipo = form.getFieldValue(['items', name, 'tipo']);
                const isProducto = tipo === 'producto';
                const item = items?.[name];

                return (
                  <Space key={key} align="start" style={{ display: 'flex', marginTop: 12 }} wrap>
                    <div style={{ width: 420 }}>
                      <Text strong>{toLabel({ item, productos, insumos })}</Text>
                      <div>
                        <Text type="secondary">
                          Enviado: {String(item?.cantidadEnviada ?? '')}
                        </Text>
                      </div>
                    </div>

                    <Form.Item {...restField} name={[name, 'itemId']} hidden>
                      <input />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, 'tipo']} hidden>
                      <input />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, 'max']} hidden>
                      <input />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      label={null}
                      name={[name, 'cantidadRecibida']}
                      rules={[{ required: true, message: 'Cantidad requerida' }]}
                      style={{ width: 200 }}
                    >
                      <InputNumber
                        min={isProducto ? 1 : 0.01}
                        step={isProducto ? 1 : 0.01}
                        precision={isProducto ? 0 : 2}
                        style={{ width: '100%' }}
                        placeholder="Cantidad recibida"
                      />
                    </Form.Item>
                  </Space>
                );
              })}
            </>
          )}
        </Form.List>

        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="primary" loading={loading} onClick={() => form.submit()}>
            Confirmar recepción
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default TransferenciaRecepcionModal;
