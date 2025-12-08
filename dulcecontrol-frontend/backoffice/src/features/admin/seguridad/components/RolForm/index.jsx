import { useEffect, useMemo } from 'react';
import { Form, Modal, message } from 'antd';
import { useMutation } from '@tanstack/react-query';
import RolFormView from './RolFormView.jsx';
import { createRol, updateRol } from '../../api/seguridad.api.js';
import { groupPermissionsForDisplay } from '../../../../../shared/permissions/adminPermissionConfig.js';

const RolForm = ({ open, onClose, onSuccess, tiendaId, rol, permisos }) => {
  const [form] = Form.useForm();
  const isEditing = Boolean(rol?.id);
  const selectedPermisos = Form.useWatch('permisos', form) ?? [];

  useEffect(() => {
    if (!open) {
      form.resetFields();
      return;
    }

    if (isEditing && rol) {
      form.setFieldsValue({
        nombre: rol.nombre,
        descripcion: rol.descripcion,
        permisos: rol.permisos ? Array.from(rol.permisos) : [],
      });
    } else {
      form.setFieldsValue({
        nombre: '',
        descripcion: '',
        permisos: [],
      });
    }
  }, [open, form, isEditing, rol]);

  const permisosPorModulo = useMemo(() => groupPermissionsForDisplay(permisos), [permisos]);

  const mutation = useMutation({
    mutationFn: async (values) => {
      if (!tiendaId) {
        throw new Error('No se pudo identificar la tienda activa');
      }

      const payloadBase = {
        nombre: values.nombre,
        descripcion: values.descripcion,
        permisos: (values.permisos ?? []).map(Number),
      };

      if (isEditing) {
        const payload = {
          ...payloadBase,
          esSistema: rol.esSistema,
        };
        return updateRol(tiendaId, rol.id, payload);
      }

      return createRol(tiendaId, payloadBase);
    },
    onSuccess: (response) => {
      message.success(`Rol ${isEditing ? 'actualizado' : 'creado'} correctamente`);
      onSuccess?.(response);
      form.resetFields();
    },
    onError: (error) => {
      const detail = error?.response?.data?.message ?? error?.message ?? 'Ocurrió un error';
      message.error(detail);
    },
  });

  const handleSubmit = (values) => {
    Modal.confirm({
      title: isEditing ? 'Actualizar rol' : 'Crear rol',
      content: isEditing
        ? 'Se actualizarán los permisos del rol seleccionado.'
        : 'Se creará un nuevo rol con los permisos configurados.',
      okText: isEditing ? 'Actualizar' : 'Crear',
      cancelText: 'Cancelar',
      onOk: () => mutation.mutate(values),
    });
  };

  const handleTogglePermission = (permisoId, checked) => {
    const current = new Set(selectedPermisos);
    if (checked) {
      current.add(permisoId);
    } else {
      current.delete(permisoId);
    }
    form.setFieldsValue({ permisos: Array.from(current) });
  };

  const handleToggleModulo = (modulo, shouldSelect) => {
    const moduloPermisos = permisosPorModulo.find((item) => item.modulo === modulo);
    if (!moduloPermisos) return;

    const current = new Set(selectedPermisos);
    moduloPermisos.permisos.forEach((permiso) => {
      if (shouldSelect) {
        current.add(permiso.id);
      } else {
        current.delete(permiso.id);
      }
    });

    form.setFieldsValue({ permisos: Array.from(current) });
  };

  return (
    <RolFormView
      open={open}
      onClose={onClose}
      form={form}
      onSubmit={handleSubmit}
      loading={mutation.isPending}
      isEditing={isEditing}
      permisosPorModulo={permisosPorModulo}
      selectedPermisos={selectedPermisos}
      onTogglePermission={handleTogglePermission}
      onToggleModulo={handleToggleModulo}
    />
  );
};

export default RolForm;
