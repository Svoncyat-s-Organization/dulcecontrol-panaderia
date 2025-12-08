import { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Modal, Select, Typography, message, Alert, Space } from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { crearMovimientoProducto } from '../../api/movimientos.api.js';
import { INVENTARIO_PRODUCTO_KEYS } from '../../constants/queryKeys.js';

const { Paragraph, Text } = Typography;

const AjusteInventarioModal = ({ open, onClose, tiendaId, sedeId, registro }) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [tipoMovimiento, setTipoMovimiento] = useState('ENTRADA');
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    if (open && registro) {
      form.resetFields();
      setTipoMovimiento('ENTRADA');
      setCantidad(1);
    }
  }, [open, registro, form]);

  const calcularNuevaCantidad = () => {
    const actual = registro?.cantidadActual ?? 0;
    if (tipoMovimiento === 'ENTRADA') {
      return actual + cantidad;
    } else if (tipoMovimiento === 'SALIDA') {
      return Math.max(0, actual - cantidad);
    }
    return actual;
  };

  const mutation = useMutation({
    mutationFn: async (values) => {
      if (!tiendaId || !sedeId || !registro?.productoId) {
        throw new Error('Faltan datos requeridos para el ajuste');
      }
      return crearMovimientoProducto(tiendaId, {
        sedeId,
        productoId: registro.productoId,
        tipoMovimiento: values.tipoMovimiento,
        cantidad: Number(values.cantidad),
        motivo: 'AJUSTE',
        descripcionMotivo: values.descripcionMotivo,
      });
    },
    onSuccess: () => {
      message.success('Ajuste registrado correctamente');
      queryClient.invalidateQueries({ queryKey: INVENTARIO_PRODUCTO_KEYS.lists(tiendaId, sedeId) });
      onClose();
    },
    onError: (error) => {
      const detail = error?.response?.data?.message ?? error?.message ?? 'No se pudo registrar el ajuste';
      message.error(detail);
    },
  });

  const handleOk = () => {
    form.submit();
  };

  const handleFinish = (values) => {
    mutation.mutate(values);
  };

  const nuevaCantidad = calcularNuevaCantidad();
  const esInsuficiente = tipoMovimiento === 'SALIDA' && cantidad > (registro?.cantidadActual ?? 0);

  return (
    <Modal
      title={`Ajustar inventario${registro?.nombreProducto ? ` · ${registro.nombreProducto}` : ''}`}
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      okText="Registrar ajuste"
      okButtonProps={{ disabled: esInsuficiente }}
      confirmLoading={mutation.isPending}
      destroyOnClose
      width={560}
    >
      <Paragraph type="secondary" style={{ marginBottom: 16 }}>
        Los ajustes quedan registrados en el historial de movimientos con motivo y responsable.
        Usa esta función para corregir diferencias detectadas en conteos físicos.
      </Paragraph>

      <Alert
        message={(
          <Space direction="vertical" size={4} style={{ width: '100%' }}>
            <div>
              <Text type="secondary">Stock actual: </Text>
              <Text strong style={{ fontSize: 16 }}>{registro?.cantidadActual ?? 0}</Text>
            </div>
            <div>
              <Text type="secondary">Nuevo stock: </Text>
              <Text 
                strong 
                style={{ 
                  fontSize: 18, 
                  color: esInsuficiente ? '#ff4d4f' : '#52c41a' 
                }}
              >
                {nuevaCantidad}
              </Text>
              {esInsuficiente && (
                <Text type="danger" style={{ marginLeft: 8, fontSize: 12 }}>
                  (Stock insuficiente)
                </Text>
              )}
            </div>
          </Space>
        )}
        type={esInsuficiente ? 'error' : 'info'}
        showIcon
        style={{ marginBottom: 16 }}
      />

      <Form
        layout="vertical"
        form={form}
        initialValues={{ tipoMovimiento: 'ENTRADA', cantidad: 1 }}
        onFinish={handleFinish}
      >
        <Form.Item
          label="Tipo de movimiento"
          name="tipoMovimiento"
          rules={[{ required: true, message: 'Selecciona el tipo' }]}
        >
          <Select 
            onChange={(value) => setTipoMovimiento(value)}
            options={[
              { label: '➡️ Entrada (encontrado extra, devolución)', value: 'ENTRADA' },
              { label: '⬅️ Salida (merma, robo, regalo)', value: 'SALIDA' },
            ]}
          />
        </Form.Item>

        <Form.Item
          label="Cantidad a ajustar"
          name="cantidad"
          rules={[
            { required: true, message: 'Ingresa la cantidad' },
            { type: 'number', min: 1, message: 'Mínimo 1 unidad' },
          ]}
        >
          <InputNumber 
            min={1} 
            step={1} 
            style={{ width: '100%' }}
            addonAfter="unidades"
            onChange={(value) => setCantidad(value || 1)}
          />
        </Form.Item>

        <Form.Item
          label="Motivo del ajuste"
          name="descripcionMotivo"
          rules={[{ required: true, message: 'Describe el motivo' }]}
        >
          <Input.TextArea 
            rows={3}
            placeholder="Ej: Error de conteo en inventario físico, producto caído, regalo a cliente VIP"
            showCount
            maxLength={255}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AjusteInventarioModal;
