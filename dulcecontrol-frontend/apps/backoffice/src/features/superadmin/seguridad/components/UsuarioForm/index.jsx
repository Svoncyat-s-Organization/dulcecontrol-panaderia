import { useEffect } from 'react';
import { Form, Modal, message } from 'antd';
import { useMutation } from '@tanstack/react-query';
import UsuarioFormView from './UsuarioFormView.jsx';
import {
  createSuperadminUsuario,
  updateSuperadminUsuario,
} from '../../api/seguridad.api.js';

const UsuarioForm = ({
  open,
  onClose,
  onSuccess,
  usuario,
  tipoDocumentoOptions,
}) => {
  const [form] = Form.useForm();
  const isEditing = Boolean(usuario?.id);

  useEffect(() => {
    if (!open) {
      form.resetFields();
      return;
    }

    if (isEditing && usuario) {
      form.setFieldsValue({
        correo: usuario.correo,
        nombres: usuario.nombres,
        telefono: usuario.telefono,
        tipoDoc: usuario.tipoDoc,
        numeroDoc: usuario.numeroDoc,
        activo: usuario.activo,
        nuevaContrasena: '',
      });
    } else {
      form.setFieldsValue({
        correo: '',
        nombres: '',
        telefono: '',
        tipoDoc: tipoDocumentoOptions?.[0]?.value ?? 'DNI',
        numeroDoc: '',
        activo: true,
        contrasena: '',
      });
    }
  }, [open, isEditing, usuario, form, tipoDocumentoOptions]);

  const mutation = useMutation({
    mutationFn: async (values) => {
      if (isEditing) {
        const payload = {
          correo: values.correo,
          tipoDoc: values.tipoDoc,
          numeroDoc: values.numeroDoc,
          nombres: values.nombres,
          telefono: values.telefono,
          activo: values.activo,
        };
        if (values.nuevaContrasena) {
          payload.nuevaContrasena = values.nuevaContrasena;
        }
        return updateSuperadminUsuario(usuario.id, payload);
      }

      const payload = {
        correo: values.correo,
        contrasena: values.contrasena,
        tipoDoc: values.tipoDoc,
        numeroDoc: values.numeroDoc,
        nombres: values.nombres,
        telefono: values.telefono,
      };
      return createSuperadminUsuario(payload);
    },
    onSuccess: () => {
      message.success(`Superadmin ${isEditing ? 'actualizado' : 'creado'} correctamente`);
      onSuccess?.();
      form.resetFields();
    },
    onError: (error) => {
      const detail = error?.response?.data?.message ?? error?.message ?? 'Ocurrió un error';
      message.error(detail);
    },
  });

  const handleSubmit = (values) => {
    Modal.confirm({
      title: isEditing ? 'Actualizar superadmin' : 'Crear superadmin',
      content: isEditing
        ? 'Se actualizarán las credenciales del usuario seleccionado.'
        : 'Se creará un nuevo superadministrador con acceso total.',
      okText: isEditing ? 'Actualizar' : 'Crear',
      cancelText: 'Cancelar',
      onOk: () => mutation.mutate(values),
    });
  };

  return (
    <UsuarioFormView
      open={open}
      onClose={onClose}
      form={form}
      onSubmit={handleSubmit}
      loading={mutation.isPending}
      isEditing={isEditing}
      tipoDocumentoOptions={tipoDocumentoOptions}
    />
  );
};

export default UsuarioForm;
