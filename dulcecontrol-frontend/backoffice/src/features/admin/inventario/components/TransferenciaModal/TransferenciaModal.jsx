import { useEffect, useMemo, useState } from 'react';
import { Button, Form, Input, InputNumber, Modal, Select, Space, Typography, message, Alert, Card, Tag, Tooltip } from 'antd';
import { InfoCircleOutlined, WarningOutlined, CheckCircleOutlined } from '@ant-design/icons';

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
  inventarioProductos = [],
  inventarioInsumos = [],
}) => {
  const [form] = Form.useForm();
  const [stockWarnings, setStockWarnings] = useState([]);

  const inventarioProductosMap = useMemo(() => {
    const map = new Map();
    (inventarioProductos ?? []).forEach((inv) => {
      if (Number(inv.sedeId) === Number(sedeOrigenId)) {
        map.set(Number(inv.productoId), inv);
      }
    });
    return map;
  }, [inventarioProductos, sedeOrigenId]);

  const inventarioInsumosMap = useMemo(() => {
    const map = new Map();
    (inventarioInsumos ?? []).forEach((inv) => {
      if (Number(inv.sedeId) === Number(sedeOrigenId)) {
        map.set(Number(inv.insumoId), inv);
      }
    });
    return map;
  }, [inventarioInsumos, sedeOrigenId]);

  const getStockDisponible = (refId, tipo) => {
    if (tipo === 'producto') {
      const inv = inventarioProductosMap.get(Number(refId));
      return inv ? Number(inv.cantidadActual) || 0 : 0;
    } else {
      const inv = inventarioInsumosMap.get(Number(refId));
      return inv ? Number(inv.cantidadActual) || 0 : 0;
    }
  };

  const validateCantidad = (index) => async (_, value) => {
    const tipo = form.getFieldValue(['items', index, 'tipo']);
    const refId = form.getFieldValue(['items', index, 'refId']);
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

    // Validar stock disponible
    if (refId) {
      const stock = getStockDisponible(refId, tipo);
      if (numero > stock) {
        throw new Error(`Stock insuficiente. Disponible: ${stock}`);
      }
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

    // Validar stock antes de enviar
    const stockErrors = [];
    rawItems.forEach((row, idx) => {
      if (row?.refId && row?.cantidadEnviada) {
        const stock = getStockDisponible(row.refId, row.tipo);
        if (Number(row.cantidadEnviada) > stock) {
          const label = row.tipo === 'producto' 
            ? productos.find(p => p.id === row.refId)?.nombre 
            : insumos.find(i => i.id === row.refId)?.nombre;
          stockErrors.push(`${label || 'Item ' + (idx + 1)}: solicitado ${row.cantidadEnviada}, disponible ${stock}`);
        }
      }
    });

    if (stockErrors.length > 0) {
      message.error({
        content: (
          <div>
            <div style={{ fontWeight: 'bold', marginBottom: 8 }}>Stock insuficiente:</div>
            {stockErrors.map((err, i) => (
              <div key={i} style={{ fontSize: 12 }}>• {err}</div>
            ))}
          </div>
        ),
        duration: 6,
      });
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

  // Detectar items con stock bajo
  const lowStockWarnings = useMemo(() => {
    const warnings = [];
    const items = form.getFieldValue('items') || [];
    items.forEach((item, idx) => {
      if (item?.refId) {
        const stock = getStockDisponible(item.refId, item.tipo);
        if (stock < 5) {
          const label = item.tipo === 'producto'
            ? productos.find(p => p.id === item.refId)?.nombre
            : insumos.find(i => i.id === item.refId)?.nombre;
          warnings.push({ label: label || `Item ${idx + 1}`, stock });
        }
      }
    });
    return warnings;
  }, [form, getStockDisponible, productos, insumos]);

  return (
    <Modal
      title="Nueva transferencia"
      open={open}
      onCancel={onClose}
      footer={null}
      width={720}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish} disabled={loading}>
        {lowStockWarnings.length > 0 && (
          <Alert
            type="warning"
            message="Stock bajo detectado"
            description={
              <div>
                Los siguientes items tienen stock limitado en la sede origen:
                <ul style={{ marginTop: 8, marginBottom: 0, paddingLeft: 20 }}>
                  {lowStockWarnings.map((w, i) => (
                    <li key={i}>
                      {w.label}: {w.stock === 0 ? 'Sin stock' : `${w.stock} unidades`}
                    </li>
                  ))}
                </ul>
              </div>
            }
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

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
              <div style={{ marginBottom: 12 }}>
                <Text strong>Items a transferir</Text>
                <Text type="secondary" style={{ display: 'block', fontSize: 12, marginTop: 4 }}>
                  Agrega los productos o insumos que deseas transferir con sus cantidades
                </Text>
              </div>
              
              {fields.map(({ key, name, ...restField }) => (
                <div 
                  key={key} 
                  style={{ 
                    display: 'flex', 
                    gap: 12, 
                    marginBottom: 16,
                    padding: 12,
                    background: '#fafafa',
                    borderRadius: 8,
                    alignItems: 'flex-end',
                    flexWrap: 'wrap'
                  }}
                >
                  <Form.Item 
                    {...restField} 
                    name={[name, 'tipo']} 
                    initialValue="producto" 
                    label="Tipo"
                    style={{ width: 130, marginBottom: 0 }}
                  >
                    <Select
                      options={[
                        { label: 'Producto', value: 'producto' },
                        { label: 'Insumo', value: 'insumo' },
                      ]}
                    />
                  </Form.Item>

                  <Form.Item
                    shouldUpdate={(prev, curr) => 
                      prev?.items?.[name]?.tipo !== curr?.items?.[name]?.tipo ||
                      prev?.items?.[name]?.refId !== curr?.items?.[name]?.refId
                    }
                    noStyle
                  >
                    {({ getFieldValue }) => {
                      const tipo = getFieldValue(['items', name, 'tipo']);
                      const refId = getFieldValue(['items', name, 'refId']);
                      const options = tipo === 'insumo' ? insumoOptions : productoOptions;
                      const stock = refId ? getStockDisponible(refId, tipo) : null;
                      
                      return (
                        <div style={{ flex: 1, minWidth: 280 }}>
                          <Form.Item
                            {...restField}
                            name={[name, 'refId']}
                            label={tipo === 'insumo' ? 'Insumo' : 'Producto'}
                            rules={[{ required: true, message: 'Selecciona un item' }]}
                            style={{ marginBottom: 0 }}
                          >
                            <Select
                              placeholder={tipo === 'insumo' ? 'Selecciona insumo' : 'Selecciona producto'}
                              options={options}
                              showSearch
                              optionFilterProp="label"
                            />
                          </Form.Item>
                          {refId && stock !== null && (
                            <div style={{ marginTop: 4, fontSize: 12 }}>
                              <Tag 
                                color={stock === 0 ? 'red' : stock < 5 ? 'orange' : stock < 20 ? 'gold' : 'green'}
                                icon={stock === 0 ? <WarningOutlined /> : stock < 5 ? <WarningOutlined /> : <CheckCircleOutlined />}
                              >
                                Stock: {stock}
                              </Tag>
                              {stock === 0 && (
                                <Text type="danger" style={{ fontSize: 11 }}>Sin existencias</Text>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    }}
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    label="Cantidad"
                    name={[name, 'cantidadEnviada']}
                    rules={[{ validator: validateCantidad(name) }]}
                    style={{ width: 140, marginBottom: 0 }}
                  >
                    <InputNumber
                      min={0.01}
                      step={0.01}
                      precision={2}
                      style={{ width: '100%' }}
                      placeholder="0.00"
                    />
                  </Form.Item>

                  <Button 
                    danger 
                    onClick={() => remove(name)} 
                    disabled={fields.length === 1}
                    style={{ marginBottom: 0 }}
                  >
                    Quitar
                  </Button>
                </div>
              ))}

              <div style={{ marginTop: 8 }}>
                <Button 
                  onClick={() => add({ tipo: 'producto', refId: null, cantidadEnviada: 1 })}
                  type="dashed"
                  block
                >
                  + Agregar item
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
