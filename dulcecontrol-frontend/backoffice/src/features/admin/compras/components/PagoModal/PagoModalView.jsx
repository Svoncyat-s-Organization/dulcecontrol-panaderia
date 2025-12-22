import React from 'react';
import { Modal, Form, Input, InputNumber, DatePicker, Select, Row, Col } from 'antd';
import dayjs from 'dayjs';
import { formatCurrency } from '../../utils/formatters.js';

const { TextArea } = Input;

const PagoModalView = ({
  open,
  onClose,
  onSubmit,
  form,
  loading,
  ordenCompra,
}) => {
  if (!ordenCompra) return null;

  const saldoPendiente = ordenCompra.saldoPendienteCentimos || 0;
  const saldoPendienteSoles = saldoPendiente / 100;

  return (
    <Modal
      title="Registrar Pago"
      open={open}
      onCancel={onClose}
      onOk={onSubmit}
      confirmLoading={loading}
      width="95%"
      style={{ maxWidth: 600 }}
      okText="Registrar Pago"
      cancelText="Cancelar"
    >
      <div style={{ marginBottom: 16, padding: 12, backgroundColor: '#f5f5f5', borderRadius: 4 }}>
        <div><strong>Proveedor:</strong> {ordenCompra.nombreProveedor}</div>
        <div><strong>Total Orden:</strong> {formatCurrency(ordenCompra.totalCompraCentimos)}</div>
        <div><strong>Monto Pagado:</strong> {formatCurrency(ordenCompra.montoPagadoCentimos || 0)}</div>
        <div style={{ color: '#ff4d4f', fontWeight: 600 }}>
          <strong>Saldo Pendiente:</strong> {formatCurrency(saldoPendiente)}
        </div>
      </div>

      <Form form={form} layout="vertical" style={{ marginTop: 24 }}>
        <Row gutter={16}>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              name="fechaPago"
              label="Fecha de Pago"
              rules={[{ required: true, message: 'La fecha es requerida' }]}
              initialValue={dayjs()}
              getValueProps={(value) => ({
                value: value ? dayjs(value) : dayjs(),
              })}
              normalize={(value) => (value ? value.format('YYYY-MM-DD') : null)}
            >
              <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              name="montoPagadoCentimos"
              label="Monto a Pagar (S/)"
              rules={[
                { required: true, message: 'El monto es requerido' },
                {
                  validator: (_, value) => {
                    if (value && value * 100 > saldoPendiente) {
                      return Promise.reject('El monto no puede ser mayor al saldo pendiente');
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={0.01}
                max={saldoPendienteSoles}
                step={0.01}
                precision={2}
                placeholder="0.00"
                onPressEnter={(e) => {
                  e.target.blur();
                }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={24} md={12}>
            <Form.Item 
              name="metodoPago" 
              label="Tipo de Pago"
              rules={[{ required: true, message: 'El tipo de pago es requerido' }]}
            >
              <Select placeholder="Selecciona tipo de pago">
                <Select.Option value="efectivo">Efectivo</Select.Option>
                <Select.Option value="transferencia">Transferencia</Select.Option>
                <Select.Option value="tarjeta">Tarjeta</Select.Option>
                <Select.Option value="cheque">Cheque</Select.Option>
                <Select.Option value="yape">Yape</Select.Option>
                <Select.Option value="plin">Plin</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item 
              name="referenciaPago" 
              label="Referencia de Comprobante"
            >
              <Input placeholder="Ej: Boleta B001-123, Nro. Operación, etc." />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="observaciones" label="Observaciones">
          <TextArea rows={3} placeholder="Notas adicionales sobre el pago" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PagoModalView;
