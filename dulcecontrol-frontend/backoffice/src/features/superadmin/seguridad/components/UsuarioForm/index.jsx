import { useEffect, useMemo } from 'react';
import { App, Form, message } from 'antd';
import { useMutation, useQuery } from '@tanstack/react-query';
import UsuarioFormView from './UsuarioFormView.jsx';
import {
  createSuperadminUsuario,
  updateSuperadminUsuario,
  getSuperadminRoles,
} from '../../api/seguridad.api.js';
import { SUPERADMIN_SEGURIDAD_KEYS } from '../../constants/queryKeys.js';

const UsuarioForm = ({
  open,
  onClose,
  onSuccess,
  usuario,
  tipoDocumentoOptions,
}) => {
  const [form] = Form.useForm();
  const isEditing = Boolean(usuario?.id);
  const { modal } = App.useApp();

  const rolesQuery = useQuery({
    queryKey: SUPERADMIN_SEGURIDAD_KEYS.roles(),
    queryFn: getSuperadminRoles,
    staleTime: 5 * 60 * 1000,
  });

  const roleOptions = useMemo(
    () =>
      (rolesQuery.data ?? []).map((rol) => ({
        value: rol.id,
        label: rol.nombre,
      })),
    [rolesQuery.data],
  );

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
        roles: (usuario.roles ?? []).map((rol) => rol.id),
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
        roles: [],
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
          roles: values.roles,
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
        roles: values.roles,
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
    modal.confirm({
      title: isEditing ? 'Actualizar superadmin' : 'Crear superadmin',
      content: isEditing
        ? 'Se actualizarán las credenciales del usuario seleccionado.'
        : 'Se creará un nuevo superadministrador con acceso total.',
      okText: isEditing ? 'Actualizar' : 'Crear',
      cancelText: 'Cancelar',
      onOk: () => mutation.mutate(values),
    });
  };

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
      onOk: closeModal,
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
      tipoDocumentoOptions={tipoDocumentoOptions}
      roleOptions={roleOptions}
      rolesLoading={rolesQuery.isLoading}
    />
  );
};

export default UsuarioForm;
