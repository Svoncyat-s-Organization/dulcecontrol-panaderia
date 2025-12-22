import { useEffect } from 'react';
import { Form, message } from 'antd';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import ProductoFormView from './ProductoFormView.jsx';
import { postProducto, putProducto } from '../../api/productos.api.js';
import { getCategorias } from '../../api/categorias.api.js';
import { PRODUCTO_KEYS, CATEGORIA_KEYS } from '../../constants/queryKeys.js';
import { mapCategoriasResponse } from '../../utils/categoriaMappers.js';
import { buildProductoPayload, getProductoFormInitialValues } from '../../utils/productoMappers.js';

const ProductoForm = ({ open, onClose, tiendaId, producto }) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const isEditing = Boolean(producto?.id);

  const { data: categorias = [], isLoading: loadingCategorias } = useQuery({
    queryKey: CATEGORIA_KEYS.lists(tiendaId),
    queryFn: () => getCategorias(tiendaId),
    enabled: open && Boolean(tiendaId),
    select: (response) =>
      mapCategoriasResponse(response ?? []).filter((categoria) => categoria.activa !== false),
  });

  useEffect(() => {
    if (open) {
      form.setFieldsValue(getProductoFormInitialValues(producto));
    } else {
      form.resetFields();
    }
  }, [open, producto, form]);

  const mutation = useMutation({
    mutationFn: async (values) => {
      const payload = buildProductoPayload(values, producto ?? {});
      if (isEditing) {
        return putProducto(tiendaId, producto.id, payload);
      }
      return postProducto(tiendaId, payload);
    },
    onSuccess: () => {
      message.success(`Producto ${isEditing ? 'actualizado' : 'creado'} correctamente`);
      queryClient.invalidateQueries({ queryKey: PRODUCTO_KEYS.lists(tiendaId) });
      onClose();
    },
    onError: (error) => {
      const status = error?.response?.status;
      const backendMessage = error?.response?.data?.message;
      const fallback = error?.message ?? 'Ocurrió un error';
      const detail = backendMessage || (status ? `Error ${status}: ${fallback}` : fallback);
      // Dejar rastro para depuración (Network/Response)
      // eslint-disable-next-line no-console
      console.error('Error creando/actualizando producto', {
        status,
        data: error?.response?.data,
        message: error?.message,
        error,
      });
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
    <ProductoFormView
      open={open}
      onClose={onClose}
      form={form}
      onSubmit={handleSubmit}
      loading={mutation.isPending}
      isEditing={isEditing}
      categorias={categorias}
      loadingCategorias={loadingCategorias}
    />
  );
};

export default ProductoForm;
