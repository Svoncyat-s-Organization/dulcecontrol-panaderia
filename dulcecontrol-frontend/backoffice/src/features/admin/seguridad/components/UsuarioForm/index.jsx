import { useEffect } from 'react';
import { App, Form, message } from 'antd';
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
  sedes,
  sedesLoading,
  tipoDocumentoOptions,
}) => {
  const [form] = Form.useForm();
  const isEditing = Boolean(usuario?.id);
  const { modal } = App.useApp();

  useEffect(() => {
    if (!open) {
      form.resetFields();
      return;
    }

    if (isEditing && usuario) {
      form.setFieldsValue({
        rolId: usuario.rolId,
        sedeIds: Array.isArray(usuario.sedeIds) && usuario.sedeIds.length > 0
          ? usuario.sedeIds
          : (usuario.sedeId ? [usuario.sedeId] : []),
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
        sedeIds: sedes?.[0]?.id ? [sedes[0].id] : [],
        nombres: '',
        correo: '',
        tipoDoc: tipoDocumentoOptions?.[0]?.value ?? 'DNI',
        numeroDoc: '',
        telefono: '',
        activo: true,
        contrasena: '',
      });
    }
  }, [open, isEditing, usuario, form, roles, sedes, tipoDocumentoOptions]);

  const mutation = useMutation({
    mutationFn: async (values) => {
      if (!tiendaId) {
        throw new Error('No se pudo identificar la tienda activa');
      }

      if (isEditing) {
        const payload = {
          rolId: values.rolId,
          sedeIds: values.sedeIds,
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
        sedeIds: values.sedeIds,
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
    onSuccess: (response) => {
      message.success(`Usuario ${isEditing ? 'actualizado' : 'creado'} correctamente`);
      onSuccess?.(response, { isEditing });
      form.resetFields();
    },
    onError: (error) => {
      const detail = error?.response?.data?.message ?? error?.message ?? 'Ocurrió un error';
      message.error(detail);
    },
  });

  const handleCancel = () => {
    if (mutation.isPending) {
      return;
    }

    const closeModal = () => {
      form.resetFields();
      mutation.reset();
      onClose?.();
    };

    if (!form.isFieldsTouched(true)) {
      closeModal();
      return;
    }

    modal.confirm({
      title: '¿Cancelar cambios?',
      content: 'Los cambios no guardados se perderán.',
      okText: 'Sí, cancelar',
      cancelText: 'Seguir editando',
      onOk: () => {
        closeModal();
      },
    });
  };

  const handleSubmit = (values) => {
    modal.confirm({
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
      onCancel={handleCancel}
      form={form}
      onSubmit={handleSubmit}
      loading={mutation.isPending}
      isEditing={isEditing}
      roles={roles}
      sedes={sedes}
      sedesLoading={sedesLoading}
      tipoDocumentoOptions={tipoDocumentoOptions}
    />
  );
};

export default UsuarioForm;
