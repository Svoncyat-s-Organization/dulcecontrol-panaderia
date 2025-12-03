import { useEffect, useMemo } from 'react';
import { Form, Input, InputNumber, Modal, Radio, Typography, message, Space } from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { crearMovimientoInsumo } from '../../api/movimientos.api.js';
import { INVENTARIO_INSUMO_KEYS } from '../../constants/queryKeys.js';

const { Paragraph, Text } = Typography;

const AjusteInsumoModal = ({ open, onClose, tiendaId, sedeId, registro }) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  
  const tipoMovimiento = Form.useWatch('tipoMovimiento', form);
  const cantidad = Form.useWatch('cantidad', form);

  const cantidadActual = Number(registro?.cantidadActual ?? 0);
  const nuevaCantidad = useMemo(() => {
    const delta = Number(cantidad ?? 0);
    if (tipoMovimiento === 'ENTRADA') {
      return cantidadActual + delta;
    } else if (tipoMovimiento === 'SALIDA') {
      return cantidadActual - delta;
    }
    return cantidadActual;
  }, [tipoMovimiento, cantidad, cantidadActual]);

  const unidadMedida = registro?.unidadMedida ?? 'UNIDAD';
  const needsDecimals = ['KG', 'L', 'LT', 'ML'].includes(unidadMedida.toUpperCase());

  useEffect(() => {
    if (open && registro) {
      form.setFieldsValue({
        tipoMovimiento: 'ENTRADA',
        cantidad: 0,
        motivo: '',
      });
    } else {
      form.resetFields();
    }
  }, [open, registro, form]);

  const mutation = useMutation({
    mutationFn: async (values) => {
      if (!tiendaId || !sedeId || !registro?.insumoId) {
        throw new Error('No se pudo identificar el insumo a ajustar');
      }
      return crearMovimientoInsumo(tiendaId, {
        sedeId: sedeId,
        insumoId: registro.insumoId,
        tipoMovimiento: values.tipoMovimiento,
        cantidad: Number(values.cantidad),
        motivo: values.motivo || `Ajuste manual de inventario`,
        responsableId: null,
      });
    },
    onSuccess: () => {
      message.success('Movimiento registrado exitosamente');
      queryClient.invalidateQueries({ queryKey: INVENTARIO_INSUMO_KEYS.lists(tiendaId, sedeId) });
      onClose();
    },
    onError: (error) => {
      const detail = error?.response?.data?.message ?? error?.message ?? 'No se pudo registrar el movimiento';
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
      okText="Registrar movimiento"
      confirmLoading={mutation.isPending}
      destroyOnClose
      width={520}
    >
      <Paragraph type="secondary" style={{ marginBottom: 16 }}>
        Registra entradas o salidas de inventario. Cada ajuste quedará auditado en el historial de movimientos.
      </Paragraph>

      <Form 
        layout="vertical" 
        form={form} 
        onFinish={handleFinish} 
        initialValues={{ tipoMovimiento: 'ENTRADA', cantidad: 0 }}
      >
        <Form.Item
          label="Tipo de movimiento"
          name="tipoMovimiento"
          rules={[{ required: true, message: 'Selecciona el tipo de movimiento' }]}
        >
          <Radio.Group buttonStyle="solid">
            <Radio.Button value="ENTRADA">Entrada</Radio.Button>
            <Radio.Button value="SALIDA">Salida</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="Cantidad"
          name="cantidad"
          rules={[
            { required: true, message: 'Ingresa la cantidad' },
            { 
              validator: (_, value) => {
                if (tipoMovimiento === 'SALIDA' && value > cantidadActual) {
                  return Promise.reject('Stock insuficiente para esta salida');
                }
                return Promise.resolve();
              }
            }
          ]}
        >
          <InputNumber
            min={0}
            step={needsDecimals ? 0.001 : 1}
            precision={needsDecimals ? 3 : 0}
            style={{ width: '100%' }}
            stringMode={needsDecimals}
            addonAfter={unidadMedida}
          />
        </Form.Item>

        <Form.Item
          label="Motivo del ajuste"
          name="motivo"
        >
          <Input.TextArea 
            placeholder="Ej: Corrección tras conteo físico, Merma detectada, etc." 
            rows={3}
            allowClear
          />
        </Form.Item>

        <div 
          style={{ 
            padding: 12, 
            background: '#f5f5f5', 
            borderRadius: 8,
            marginTop: 16 
          }}
        >
          <Space direction="vertical" size={4} style={{ width: '100%' }}>
            <Text type="secondary">Preview del ajuste:</Text>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text>Stock actual:</Text>
              <Text strong>
                {cantidadActual.toLocaleString('es-PE', { 
                  minimumFractionDigits: needsDecimals ? 3 : 0,
                  maximumFractionDigits: needsDecimals ? 3 : 0
                })} {unidadMedida}
              </Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text>Nuevo stock:</Text>
              <Text 
                strong 
                style={{ 
                  color: nuevaCantidad < 0 ? '#ff4d4f' : '#52c41a' 
                }}
              >
                {nuevaCantidad.toLocaleString('es-PE', { 
                  minimumFractionDigits: needsDecimals ? 3 : 0,
                  maximumFractionDigits: needsDecimals ? 3 : 0
                })} {unidadMedida}
              </Text>
            </div>
          </Space>
        </div>
      </Form>
    </Modal>
  );
};

export default AjusteInsumoModal;
