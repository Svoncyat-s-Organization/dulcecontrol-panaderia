import { useEffect } from 'react';
import { Form, message } from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import CategoriaFormView from './CategoriaFormView.jsx';
import {
  createCategoria,
  updateCategoria,
} from '../../api/categorias.api.js';
import { CATEGORIA_KEYS } from '../../constants/queryKeys.js';
import {
  buildCategoriaPayload,
  getCategoriaFormInitialValues,
} from '../../utils/categoriaMappers.js';

const CategoriaForm = ({ open, onClose, tiendaId, categoria }) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const isEditing = Boolean(categoria?.id);

  useEffect(() => {
    if (open) {
      form.setFieldsValue(getCategoriaFormInitialValues(categoria));
    } else {
      form.resetFields();
    }
  }, [open, categoria, form]);

  const mutation = useMutation({
    mutationFn: async (values) => {
      if (!tiendaId) {
        throw new Error('No hay tienda activa para gestionar categorías');
      }
      const payload = buildCategoriaPayload(values);
      if (isEditing) {
        return updateCategoria(tiendaId, categoria.id, payload);
      }
      return createCategoria(tiendaId, payload);
    },
    onSuccess: () => {
      message.success(`Categoría ${isEditing ? 'actualizada' : 'creada'} correctamente`);
      queryClient.invalidateQueries({ queryKey: CATEGORIA_KEYS.lists(tiendaId) });
      onClose();
    },
    onError: (error) => {
      const detail = error?.response?.data?.message ?? error?.message ?? 'Ocurrió un error';
      message.error(detail);
    },
  });

  const handleSubmit = (values) => {
    if (!tiendaId) {
      message.error('No se pudo identificar la tienda activa');
      return;
    }
    mutation.mutate(values);
  };

  return (
    <CategoriaFormView
      open={open}
      onClose={onClose}
      form={form}
      onSubmit={handleSubmit}
      loading={mutation.isPending}
      isEditing={isEditing}
    />
  );
};

export default CategoriaForm;
