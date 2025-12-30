import { useEffect, useMemo } from 'react';
import { Button, Form, InputNumber, Modal, Space, Typography, message, Card, Alert, Divider, Tag, Row, Col, Statistic, Progress } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, InboxOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

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

  const itemsConProgreso = useMemo(() => {
    return (items ?? []).map((it) => {
      const enviada = Number(it.cantidadEnviada) || 0;
      const recibida = Number(it.cantidadRecibida) || 0;
      const pendiente = enviada - recibida;
      const porcentaje = enviada > 0 ? Math.round((recibida / enviada) * 100) : 0;
      const completo = porcentaje >= 100;
      
      return {
        ...it,
        enviada,
        recibida,
        pendiente,
        porcentaje,
        completo,
      };
    });
  }, [items]);

  const estadisticas = useMemo(() => {
    const total = itemsConProgreso.length;
    const completos = itemsConProgreso.filter((it) => it.completo).length;
    const pendientes = total - completos;
    const porcentajeTotal = total > 0 ? Math.round((completos / total) * 100) : 0;

    return { total, completos, pendientes, porcentajeTotal };
  }, [itemsConProgreso]);

  useEffect(() => {
    if (!open) return;

    const initial = (itemsConProgreso ?? []).map((it) => ({
      itemId: it.id,
      cantidadRecibida: it.pendiente > 0 ? it.pendiente : null, // Sugerir pendiente
      max: it.enviada,
      tipo: it.productoId ? 'producto' : 'insumo',
      yaRecibido: it.recibida,
    }));

    form.resetFields();
    form.setFieldsValue({
      recibidoPor: userId ?? null,
      items: initial,
    });
  }, [open, form, itemsConProgreso, userId]);

  const handleFinish = (values) => {
    const rows = Array.isArray(values?.items) ? values.items : [];

    const payloadItems = [];
    const errores = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const itemId = normalizeId(row?.itemId);
      if (!itemId) continue;

      const tipo = row?.tipo;
      const cantidad = row?.cantidadRecibida;
      const max = row?.max;
      const yaRecibido = Number(row?.yaRecibido) || 0;

      const numero = Number(cantidad);

      // Validar que haya cantidad
      if (cantidad === null || cantidad === undefined || cantidad === '') {
        continue; // Permitir omitir items
      }

      // Validar número válido
      if (!Number.isFinite(numero) || numero <= 0) {
        errores.push(`Item ${i + 1}: La cantidad debe ser mayor a 0`);
        continue;
      }

      // Validar entero para productos
      if (tipo === 'producto' && !Number.isInteger(numero)) {
        errores.push(`Item ${i + 1}: Para productos, la cantidad debe ser un número entero`);
        continue;
      }

      // Validar que no exceda el pendiente
      const pendiente = max - yaRecibido;
      if (numero > pendiente) {
        errores.push(`Item ${i + 1}: La cantidad excede lo pendiente (${pendiente}). Ya se recibieron ${yaRecibido} de ${max}`);
        continue;
      }

      payloadItems.push({
        itemId,
        cantidadRecibida: tipo === 'producto' ? String(parseInt(numero, 10)) : String(cantidad),
      });
    }

    if (errores.length > 0) {
      message.error({
        content: (
          <div>
            <strong>Errores de validación:</strong>
            <ul style={{ marginTop: 8, paddingLeft: 20 }}>
              {errores.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        ),
        duration: 6,
      });
      return;
    }

    if (!payloadItems.length) {
      message.warning('No has ingresado cantidades para ningún item');
      return;
    }

    onSubmit({
      recibidoPor: values?.recibidoPor ?? null,
      items: payloadItems,
    });
  };

  return (
    <Modal
      title={
        <Space>
          <InboxOutlined style={{ fontSize: 20, color: '#1890ff' }} />
          {transferencia?.id ? `Recibir Transferencia #${transferencia.id}` : 'Recibir Transferencia'}
        </Space>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={920}
      style={{ top: 20 }}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish} disabled={loading}>
        {/* Estadísticas generales */}
        <Card size="small" style={{ marginBottom: 16, background: '#fafafa' }}>
          <Row gutter={16}>
            <Col span={6}>
              <Statistic
                title="Total Items"
                value={estadisticas.total}
                prefix={<InboxOutlined />}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Completos"
                value={estadisticas.completos}
                valueStyle={{ color: '#52c41a' }}
                prefix={<CheckCircleOutlined />}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Pendientes"
                value={estadisticas.pendientes}
                valueStyle={{ color: '#faad14' }}
                prefix={<ClockCircleOutlined />}
              />
            </Col>
            <Col span={6}>
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>Progreso Total</Text>
                <div style={{ marginTop: 4 }}>
                  <Progress
                    percent={estadisticas.porcentajeTotal}
                    size="small"
                    status={estadisticas.porcentajeTotal === 100 ? 'success' : 'active'}
                  />
                </div>
              </div>
            </Col>
          </Row>
        </Card>

        <Alert
          message="Recepción Parcial Permitida"
          description="Puedes recibir solo algunos items o cantidades parciales. Los items pendientes quedarán disponibles para futuras recepciones."
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />

        <Divider orientation="left">Items a Recibir</Divider>

        <Form.List name="items">
          {(fields) => (
            <>
              {fields.map(({ key, name, ...restField }) => {
                const tipo = form.getFieldValue(['items', name, 'tipo']);
                const isProducto = tipo === 'producto';
                const item = itemsConProgreso?.[name];

                if (!item) return null;

                const esCompleto = item.completo;

                return (
                  <Card
                    key={key}
                    size="small"
                    style={{
                      marginBottom: 12,
                      borderColor: esCompleto ? '#52c41a' : '#d9d9d9',
                      background: esCompleto ? '#f6ffed' : '#fff',
                    }}
                  >
                    <Row gutter={16} align="middle">
                      <Col span={12}>
                        <Space direction="vertical" size={2}>
                          <Space>
                            <Text strong>{toLabel({ item, productos, insumos })}</Text>
                            {esCompleto && (
                              <Tag icon={<CheckCircleOutlined />} color="success">
                                Completo
                              </Tag>
                            )}
                          </Space>
                          <Space size={16}>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              Enviado: <strong>{item.enviada}</strong>
                            </Text>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              Ya recibido: <strong>{item.recibida}</strong>
                            </Text>
                            <Text style={{ fontSize: 12, color: item.pendiente > 0 ? '#fa8c16' : '#52c41a' }}>
                              Pendiente: <strong>{item.pendiente}</strong>
                            </Text>
                          </Space>
                          <Progress
                            percent={item.porcentaje}
                            size="small"
                            status={item.porcentaje === 100 ? 'success' : 'active'}
                            style={{ marginTop: 4 }}
                          />
                        </Space>
                      </Col>

                      <Col span={12}>
                        <Form.Item {...restField} name={[name, 'itemId']} hidden>
                          <input />
                        </Form.Item>
                        <Form.Item {...restField} name={[name, 'tipo']} hidden>
                          <input />
                        </Form.Item>
                        <Form.Item {...restField} name={[name, 'max']} hidden>
                          <input />
                        </Form.Item>
                        <Form.Item {...restField} name={[name, 'yaRecibido']} hidden>
                          <input />
                        </Form.Item>

                        <Form.Item
                          {...restField}
                          label="Cantidad a recibir ahora"
                          name={[name, 'cantidadRecibida']}
                          style={{ marginBottom: 0 }}
                          tooltip={`Máximo pendiente: ${item.pendiente}`}
                        >
                          <InputNumber
                            min={isProducto ? 1 : 0.01}
                            max={item.pendiente}
                            step={isProducto ? 1 : 0.01}
                            precision={isProducto ? 0 : 2}
                            style={{ width: '100%' }}
                            placeholder={esCompleto ? 'Ya completo' : `Máx: ${item.pendiente}`}
                            disabled={esCompleto}
                            addonAfter={isProducto ? 'unid' : item.yaRecibido > 0 ? 'más' : null}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                );
              })}
            </>
          )}
        </Form.List>

        <Divider />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            💡 Tip: Deja en blanco los items que no vas a recibir en este momento
          </Text>
          <Space>
            <Button onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="primary" loading={loading} onClick={() => form.submit()} icon={<CheckCircleOutlined />}>
              Confirmar Recepción
            </Button>
          </Space>
        </div>
      </Form>
    </Modal>
  );
};

export default TransferenciaRecepcionModal;
