import { useEffect } from 'react';
import { Form, Input, InputNumber, Modal, Typography, message } from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateInventarioInsumo } from '../../api/insumos-inventario.api.js';
import { INVENTARIO_INSUMO_KEYS } from '../../constants/queryKeys.js';

const { Paragraph, Text } = Typography;

const AjusteInsumoModal = ({ open, onClose, tiendaId, sedeId, registro }) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const inventarioId = registro?.id;

  useEffect(() => {
    if (open && registro) {
      form.setFieldsValue({
        cantidadActual: Number(registro.cantidadActual ?? 0),
        ubicacionFisica: registro.ubicacionFisica,
      });
    } else {
      form.resetFields();
    }
  }, [open, registro, form]);

  const mutation = useMutation({
    mutationFn: async (values) => {
      if (!tiendaId || !inventarioId) {
        throw new Error('No se pudo identificar el insumo a ajustar');
      }
      return updateInventarioInsumo(tiendaId, inventarioId, {
        cantidadActual: Number(values.cantidadActual ?? 0),
        ubicacionFisica: values.ubicacionFisica ?? '',
      });
    },
    onSuccess: () => {
      message.success('Inventario de insumo actualizado');
      queryClient.invalidateQueries({ queryKey: INVENTARIO_INSUMO_KEYS.lists(tiendaId, sedeId) });
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
      title={`Ajustar insumo${registro?.nombreInsumo ? ` · ${registro.nombreInsumo}` : ''}`}
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      okText="Guardar ajuste"
      confirmLoading={mutation.isPending}
      destroyOnClose
    >
      <Paragraph type="secondary" style={{ marginBottom: 16 }}>
        Registra el peso o volumen exacto después de una verificación manual. Esto impactará de inmediato en el stock disponible para producción.
      </Paragraph>

      <Form layout="vertical" form={form} onFinish={handleFinish} initialValues={{ cantidadActual: 0 }}>
        <Form.Item
          label="Cantidad actual"
          name="cantidadActual"
          rules={[{ required: true, message: 'Ingresa la cantidad actual' }]}
        >
          <InputNumber
            min={0}
            step={0.001}
            precision={3}
            style={{ width: '100%' }}
            stringMode
          />
        </Form.Item>

        <Form.Item label="Ubicación física" name="ubicacionFisica">
          <Input placeholder="Ej. Almacén MP - Estante 2" allowClear />
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

export default AjusteInsumoModal;
