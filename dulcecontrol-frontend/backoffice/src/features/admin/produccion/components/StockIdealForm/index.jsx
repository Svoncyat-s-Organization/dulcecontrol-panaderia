import { useEffect } from 'react';
import { Form, message } from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import StockIdealFormView from './StockIdealFormView.jsx';
import { postStockIdeal, putStockIdeal } from '../../api/stockIdeal.api.js';
import { STOCK_IDEAL_KEYS } from '../../constants/queryKeys.js';
import { prepareStockIdealPayload, validateStockIdealRules } from '../../utils/stockIdealMappers.js';

const StockIdealForm = ({ open, onClose, tiendaId, sedeId, rowData }) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const isEditing = Boolean(rowData?.stockId);

  useEffect(() => {
    if (open && rowData) {
      form.setFieldsValue({
        productoNombre: rowData.productoNombre,
        productoSku: rowData.productoSku,
        cantidadIdeal: rowData.cantidadIdeal || 0,
        puntoReposicion: rowData.puntoReposicion || 0,
      });
    } else if (!open) {
      form.resetFields();
    }
  }, [open, rowData, form]);

  const createMutation = useMutation({
    mutationFn: (payload) => postStockIdeal(tiendaId, payload),
    onSuccess: () => {
      message.success('Stock ideal configurado correctamente');
      queryClient.invalidateQueries({ queryKey: STOCK_IDEAL_KEYS.lists(tiendaId, sedeId) });
      onClose();
    },
    onError: (error) => {
      const detail = error?.response?.data?.message ?? error?.message ?? 'Error al guardar';
      message.error(detail);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ stockId, payload }) => putStockIdeal(tiendaId, stockId, payload),
    onSuccess: () => {
      message.success('Stock ideal actualizado correctamente');
      queryClient.invalidateQueries({ queryKey: STOCK_IDEAL_KEYS.lists(tiendaId, sedeId) });
      onClose();
    },
    onError: (error) => {
      const detail = error?.response?.data?.message ?? error?.message ?? 'Error al actualizar';
      message.error(detail);
    },
  });

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // Validar reglas de negocio
      const validation = validateStockIdealRules(values.cantidadIdeal, values.puntoReposicion);
      if (!validation.valid) {
        message.warning(validation.message);
        return;
      }

      const payload = prepareStockIdealPayload(
        {
          ...values,
          productoId: rowData.productoId,
        },
        sedeId
      );

      console.log('Stock Ideal - Modo:', isEditing ? 'Edición' : 'Creación');
      console.log('Stock Ideal - Payload:', payload);
      console.log('Stock Ideal - StockId:', rowData.stockId);

      if (isEditing) {
        updateMutation.mutate({ stockId: rowData.stockId, payload });
      } else {
        createMutation.mutate(payload);
      }
    } catch (error) {
      console.error('Error en validación:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <StockIdealFormView
      form={form}
      open={open}
      isEditing={isEditing}
      isLoading={isLoading}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
};

export default StockIdealForm;
