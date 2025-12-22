import { useEffect, useMemo } from 'react';
import { Button, Form, Input, InputNumber, Modal, Radio, Space, Typography, message } from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { crearMovimientoInsumo } from '../../api/movimientos.api.js';
import { updateUbicacionInventarioInsumo } from '../../api/insumos-inventario.api.js';
import { INVENTARIO_INSUMO_KEYS } from '../../constants/queryKeys.js';
import { useTokenStore } from '../../../../../shared/store/tokenStore.js';

const { Paragraph, Text } = Typography;

const AjusteInsumoModal = ({ open, onClose, tiendaId, sedeId, registro }) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const responsableIdRaw = useTokenStore((state) => state.user?.id ?? null);
  const responsableId =
    typeof responsableIdRaw === 'number' && Number.isFinite(responsableIdRaw) && responsableIdRaw > 0
      ? responsableIdRaw
      : null;
  
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
  const minCantidad = needsDecimals ? 0.01 : 1;

  useEffect(() => {
    if (open && registro) {
      form.setFieldsValue({
        tipoMovimiento: 'ENTRADA',
        cantidad: minCantidad,
        motivo: '',
        ubicacionFisica: registro?.ubicacionFisica ?? '',
      });
    } else {
      form.resetFields();
    }
  }, [open, registro, form, minCantidad]);

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
        responsableId,
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

  const ubicacionMutation = useMutation({
    mutationFn: async (values) => {
      if (!tiendaId || !registro?.id) {
        throw new Error('Faltan datos requeridos para actualizar la ubicación');
      }
      const ubicacionFisica = (values?.ubicacionFisica ?? '').trim();
      return updateUbicacionInventarioInsumo(
        tiendaId,
        registro.id,
        ubicacionFisica.length ? ubicacionFisica : null
      );
    },
    onSuccess: () => {
      message.success('Ubicación actualizada');
      queryClient.invalidateQueries({ queryKey: INVENTARIO_INSUMO_KEYS.lists(tiendaId, sedeId) });
    },
    onError: (error) => {
      const detail = error?.response?.data?.message ?? error?.message ?? 'No se pudo actualizar la ubicación';
      message.error(detail);
    },
  });

  const handleOk = () => {
    form.submit();
  };

  const handleGuardarUbicacion = async () => {
    try {
      const values = await form.validateFields(['ubicacionFisica']);
      ubicacionMutation.mutate(values);
    } catch {
      // AntD ya muestra el error del campo
    }
  };

  const handleFinish = (values) => {
    mutation.mutate(values);
  };

  return (
    <Modal
      title={`Ajustar insumo${registro?.nombreInsumo ? ` · ${registro.nombreInsumo}` : ''}`}
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose} disabled={mutation.isPending || ubicacionMutation.isPending}>
          Cancelar
        </Button>,
        <Button
          key="saveLocation"
          onClick={handleGuardarUbicacion}
          loading={ubicacionMutation.isPending}
          disabled={!registro?.id || mutation.isPending}
        >
          Guardar ubicación
        </Button>,
        <Button
          key="ok"
          type="primary"
          onClick={handleOk}
          loading={mutation.isPending}
          disabled={ubicacionMutation.isPending}
        >
          Registrar movimiento
        </Button>,
      ]}
      width={520}
    >
      <Paragraph type="secondary" style={{ marginBottom: 16 }}>
        Registra entradas o salidas de inventario. Cada ajuste quedará auditado en el historial de movimientos.
      </Paragraph>

      <Form 
        layout="vertical" 
        form={form} 
        onFinish={handleFinish} 
        initialValues={{ tipoMovimiento: 'ENTRADA', cantidad: minCantidad }}
      >
        <Form.Item
          label="Ubicación física"
          name="ubicacionFisica"
          rules={[{ max: 100, message: 'Máximo 100 caracteres' }]}
        >
          <Input placeholder="Ej: Almacén, Estante B2, Cámara fría" allowClear />
        </Form.Item>

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
                const numericValue = Number(value ?? 0);
                if (!Number.isFinite(numericValue) || numericValue < minCantidad) {
                  return Promise.reject(
                    needsDecimals
                      ? `La cantidad mínima es ${minCantidad}`
                      : `La cantidad mínima es ${minCantidad} unidad`
                  );
                }
                if (tipoMovimiento === 'SALIDA' && numericValue > cantidadActual) {
                  return Promise.reject('Stock insuficiente para esta salida');
                }
                return Promise.resolve();
              }
            }
          ]}
        >
          <InputNumber
            min={minCantidad}
            step={needsDecimals ? 0.01 : 1}
            precision={needsDecimals ? 2 : 0}
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
