import { useEffect } from 'react';
import { Form, Modal, message } from 'antd';
import { useMutation } from '@tanstack/react-query';
import UsuarioFormView from './UsuarioFormView.jsx';
import { createUsuario, updateUsuario } from '../../api/seguridad.api.js';

const UsuarioForm = ({
  open,
  onClose,
  onSuccess,
  tiendaId,
  usuario,
  roles,
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
        rolId: usuario.rolId,
        nombres: usuario.nombres,
        correo: usuario.correo,
        tipoDoc: usuario.tipoDoc,
        numeroDoc: usuario.numeroDoc,
        telefono: usuario.telefono,
        activo: usuario.activo,
        nuevaContrasena: '',
      });
    } else {
      form.setFieldsValue({
        rolId: roles?.[0]?.id,
        nombres: '',
        correo: '',
        tipoDoc: tipoDocumentoOptions?.[0]?.value ?? 'DNI',
        numeroDoc: '',
        telefono: '',
        activo: true,
        contrasena: '',
      });
    }
  }, [open, isEditing, usuario, form, roles, tipoDocumentoOptions]);

  const mutation = useMutation({
    mutationFn: async (values) => {
      if (!tiendaId) {
        throw new Error('No se pudo identificar la tienda activa');
      }

      if (isEditing) {
        const payload = {
          rolId: values.rolId,
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

        return updateUsuario(tiendaId, usuario.id, payload);
      }

      const payload = {
        rolId: values.rolId,
        correo: values.correo,
        contrasena: values.contrasena,
        tipoDoc: values.tipoDoc,
        numeroDoc: values.numeroDoc,
        nombres: values.nombres,
        telefono: values.telefono,
        activo: values.activo,
      };

      return createUsuario(tiendaId, payload);
    },
    onSuccess: () => {
      message.success(`Usuario ${isEditing ? 'actualizado' : 'creado'} correctamente`);
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
      title: isEditing ? 'Actualizar usuario' : 'Crear usuario',
      content: isEditing
        ? 'Se actualizarán los datos del usuario seleccionado.'
        : 'Se creará un nuevo usuario con acceso al sistema.',
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
      roles={roles}
      tipoDocumentoOptions={tipoDocumentoOptions}
    />
  );
};

export default UsuarioForm;
