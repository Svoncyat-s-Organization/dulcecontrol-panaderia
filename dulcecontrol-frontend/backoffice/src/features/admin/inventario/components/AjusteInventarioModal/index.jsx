import { useEffect, useMemo, useState } from 'react';
import { Alert, Button, Form, Input, InputNumber, Modal, Select, Space, Typography, message } from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { crearMovimientoProducto } from '../../api/movimientos.api.js';
import { updateUbicacionInventarioProducto } from '../../api/existencias.api.js';
import { INVENTARIO_PRODUCTO_KEYS } from '../../constants/queryKeys.js';
import { useTokenStore } from '../../../../../shared/store/tokenStore.js';

const { Paragraph, Text } = Typography;

const AjusteInventarioModal = ({ open, onClose, tiendaId, sedeId, registro }) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [tipoMovimiento, setTipoMovimiento] = useState('ENTRADA');
  const [cantidad, setCantidad] = useState(1);
  const ubicacionActual = useMemo(() => registro?.ubicacionFisica ?? '', [registro]);
  const responsableIdRaw = useTokenStore((state) => state.user?.id ?? null);
  const responsableId =
    typeof responsableIdRaw === 'number' && Number.isFinite(responsableIdRaw) && responsableIdRaw > 0
      ? responsableIdRaw
      : null;

  useEffect(() => {
    if (open && registro) {
      form.resetFields();
      form.setFieldsValue({ ubicacionFisica: ubicacionActual });
      setTipoMovimiento('ENTRADA');
      setCantidad(1);
    }
  }, [open, registro, form, ubicacionActual]);

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
        responsableId,
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

  const ubicacionMutation = useMutation({
    mutationFn: async (values) => {
      if (!tiendaId || !registro?.id) {
        throw new Error('Faltan datos requeridos para actualizar la ubicación');
      }
      const ubicacionFisica = (values?.ubicacionFisica ?? '').trim();
      return updateUbicacionInventarioProducto(
        tiendaId,
        registro.id,
        ubicacionFisica.length ? ubicacionFisica : null
      );
    },
    onSuccess: () => {
      message.success('Ubicación actualizada');
      queryClient.invalidateQueries({ queryKey: INVENTARIO_PRODUCTO_KEYS.lists(tiendaId, sedeId) });
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
    const actual = registro?.cantidadActual ?? 0;
    const cantidadSolicitada = Number(values?.cantidad);
    const tipo = String(values?.tipoMovimiento ?? '').toUpperCase();

    if (!Number.isFinite(cantidadSolicitada) || cantidadSolicitada <= 0) {
      message.error('Cantidad inválida');
      return;
    }

    if (tipo === 'SALIDA' && cantidadSolicitada > actual) {
      message.error('Stock insuficiente para registrar esta salida');
      return;
    }

    mutation.mutate({ ...values, cantidad: cantidadSolicitada, tipoMovimiento: tipo });
  };

  const nuevaCantidad = calcularNuevaCantidad();
  const esInsuficiente = tipoMovimiento === 'SALIDA' && cantidad > (registro?.cantidadActual ?? 0);

  return (
    <Modal
      title={`Ajustar inventario${registro?.nombreProducto ? ` · ${registro.nombreProducto}` : ''}`}
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
          disabled={esInsuficiente || ubicacionMutation.isPending}
        >
          Registrar ajuste
        </Button>,
      ]}
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
          label="Ubicación física"
          name="ubicacionFisica"
          rules={[{ max: 100, message: 'Máximo 100 caracteres' }]}
        >
          <Input placeholder="Ej: Estante A1, Cámara fría, Depósito" allowClear />
        </Form.Item>

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
      </Form>
    </Modal>
  );
};

export default AjusteInventarioModal;
