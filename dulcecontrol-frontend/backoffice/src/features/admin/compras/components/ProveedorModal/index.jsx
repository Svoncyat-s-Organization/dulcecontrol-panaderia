import { useEffect } from 'react';
import { Form, App } from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ProveedorModalView from './ProveedorModalView.jsx';
import { createProveedor, updateProveedor } from '../../api/proveedores.api.js';
import { PROVEEDORES_KEYS } from '../../constants/queryKeys.js';

const ProveedorModal = ({ open, onClose, tiendaId, proveedor }) => {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const isEditing = Boolean(proveedor);

  useEffect(() => {
    if (open && proveedor) {
      form.setFieldsValue({
        nombreComercial: proveedor.nombreComercial,
        tipoDoc: proveedor.tipoDoc,
        numeroDoc: proveedor.numeroDoc,
        razonSocial: proveedor.razonSocial,
        nombreContacto: proveedor.nombreContacto,
        telefonoContacto: proveedor.telefonoContacto,
        emailContacto: proveedor.emailContacto,
        esGenerico: proveedor.esGenerico ?? false,
        activo: proveedor.activo ?? true,
      });
    } else if (open) {
      form.resetFields();
      form.setFieldsValue({
        esGenerico: false,
        activo: true,
        tipoDoc: 'RUC',
      });
    }
  }, [open, proveedor, form]);

  const mutation = useMutation({
    mutationFn: async (values) => {
      const payload = {
        ...values,
        tipoDoc: 'RUC',
        activo: values.activo ?? true,
        esGenerico: values.esGenerico ?? false,
      };
      
      if (isEditing) {
        return await updateProveedor(tiendaId, proveedor.id, payload);
      }
      return await createProveedor(tiendaId, payload);
    },
    onSuccess: async (data) => {
      message.success(isEditing ? 'Proveedor actualizado' : 'Proveedor creado');
      
      queryClient.setQueryData(
        PROVEEDORES_KEYS.lists(tiendaId, { soloActivos: true }),
        (oldData) => {
          if (!oldData) return [data];
          
          if (isEditing) {
            return oldData.map(p => p.id === data.id ? data : p);
          } else {
            return [...oldData, data];
          }
        }
      );
      
      queryClient.setQueryData(
        PROVEEDORES_KEYS.lists(tiendaId, { soloActivos: false }),
        (oldData) => {
          if (!oldData) return [data];
          
          if (isEditing) {
            return oldData.map(p => p.id === data.id ? data : p);
          } else {
            return [...oldData, data];
          }
        }
      );
      
      handleClose();
    },
    onError: (error) => {
      const errorMsg = error?.response?.data?.message || error?.response?.data?.error || 'Error al guardar';
      message.error(errorMsg);
    },
  });

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        mutation.mutate(values);
      })
      .catch((info) => {
        console.log('Validacion fallida:', info);
      });
  };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <ProveedorModalView
      open={open}
      onClose={handleClose}
      onSubmit={handleSubmit}
      form={form}
      loading={mutation.isPending}
      isEditing={isEditing}
    />
  );
};

export default ProveedorModal;
