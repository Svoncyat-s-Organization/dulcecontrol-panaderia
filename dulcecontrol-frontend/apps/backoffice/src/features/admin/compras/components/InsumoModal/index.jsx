import { useEffect } from 'react';
import { Form, App } from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import InsumoModalView from './InsumoModalView.jsx';
import { createInsumo, updateInsumo } from '../../api/insumos.api.js';
import { INSUMOS_KEYS } from '../../constants/queryKeys.js';

const InsumoModal = ({ open, onClose, tiendaId, insumo }) => {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const isEditing = Boolean(insumo);

  useEffect(() => {
    if (open && insumo) {
      form.setFieldsValue({
        nombre: insumo.nombre,
        codigoInterno: insumo.codigoInterno,
        unidadBase: insumo.unidadBase,
        unidadCompraHabitual: insumo.unidadCompraHabitual,
        factorConversion: insumo.factorConversion,
        stockMinimoGlobal: insumo.stockMinimoGlobal,
        activo: insumo.activo ?? true,
      });
    } else if (open) {
      form.resetFields();
      form.setFieldsValue({
        factorConversion: 1,
        stockMinimoGlobal: 0,
        activo: true,
      });
    }
  }, [open, insumo, form]);

  const mutation = useMutation({
    mutationFn: (values) => {
      // Asegurar que activo siempre tenga un valor
      const payload = {
        ...values,
        activo: values.activo ?? true,
      };
      
      if (isEditing) {
        return updateInsumo(tiendaId, insumo.id, payload);
      }
      return createInsumo(tiendaId, payload);
    },
    onSuccess: () => {
      message.success(isEditing ? 'Insumo actualizado correctamente' : 'Insumo creado correctamente');
      queryClient.invalidateQueries({ queryKey: INSUMOS_KEYS.all(tiendaId) });
      handleClose();
    },
    onError: (error) => {
      message.error(error?.response?.data?.message ?? 'Ocurrió un error al guardar el insumo');
    },
  });

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        mutation.mutate(values);
      })
      .catch((info) => {
        console.log('Validación fallida:', info);
      });
  };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <InsumoModalView
      open={open}
      onClose={handleClose}
      onSubmit={handleSubmit}
      form={form}
      loading={mutation.isPending}
      isEditing={isEditing}
    />
  );
};

export default InsumoModal;
