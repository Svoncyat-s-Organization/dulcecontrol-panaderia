import { useEffect } from 'react';
import { Form, Input, InputNumber, Modal, Typography, message } from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateInventarioProducto } from '../../api/existencias.api.js';
import { INVENTARIO_PRODUCTO_KEYS } from '../../constants/queryKeys.js';

const { Paragraph, Text } = Typography;

const AjusteInventarioModal = ({ open, onClose, tiendaId, sedeId, registro }) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const inventarioId = registro?.id;

  useEffect(() => {
    if (open && registro) {
      form.setFieldsValue({
        cantidadActual: registro.cantidadActual,
        ubicacionFisica: registro.ubicacionFisica,
      });
    } else {
      form.resetFields();
    }
  }, [open, registro, form]);

  const mutation = useMutation({
    mutationFn: async (values) => {
      if (!tiendaId || !inventarioId) {
        throw new Error('No se pudo identificar el inventario para ajustar');
      }
      return updateInventarioProducto(tiendaId, inventarioId, {
        cantidadActual: Number(values.cantidadActual ?? 0),
        ubicacionFisica: values.ubicacionFisica ?? '',
      });
    },
    onSuccess: () => {
      message.success('Existencia actualizada correctamente');
      queryClient.invalidateQueries({ queryKey: INVENTARIO_PRODUCTO_KEYS.lists(tiendaId, sedeId) });
      onClose();
    },
    onError: (error) => {
      const detail = error?.response?.data?.message ?? error?.message ?? 'No se pudo actualizar';
      message.error(detail);
    },
  });

  const handleOk = () => {
    form.submit();
  };

  const handleFinish = (values) => {
    mutation.mutate(values);
  };

  return (
    <Modal
      title={`Ajustar inventario${registro?.nombreProducto ? ` · ${registro.nombreProducto}` : ''}`}
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      okText="Guardar ajuste"
      confirmLoading={mutation.isPending}
      destroyOnClose
    >
      <Paragraph type="secondary" style={{ marginBottom: 16 }}>
        Este ajuste aplica un cambio manual directo sobre la existencia actual. Úsalo para
        corregir diferencias puntuales detectadas en la vitrina o almacén.
      </Paragraph>

      <Form
        layout="vertical"
        form={form}
        initialValues={{ cantidadActual: 0 }}
        onFinish={handleFinish}
      >
        <Form.Item
          label="Cantidad actual"
          name="cantidadActual"
          rules={[{ required: true, message: 'Ingresa la cantidad actual' }]}
        >
          <InputNumber min={0} step={1} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="Ubicación física" name="ubicacionFisica">
          <Input placeholder="Ej. Vitrina 1" allowClear />
        </Form.Item>

        {registro?.estadoStock && (
          <Paragraph style={{ marginBottom: 0 }}>
            Estado actual: <Text strong>{registro.estadoStock}</Text>
          </Paragraph>
        )}
      </Form>
    </Modal>
  );
};

export default AjusteInventarioModal;
