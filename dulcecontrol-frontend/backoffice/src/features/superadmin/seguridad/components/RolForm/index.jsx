import { useEffect, useMemo } from 'react';
import { App, Form, message } from 'antd';
import { useMutation } from '@tanstack/react-query';
import RolFormView from './RolFormView.jsx';
import { createSuperadminRol, updateSuperadminRol } from '../../api/seguridad.api.js';

const prettifyModulo = (value) => {
  if (!value) return 'General';
  const normalized = value.replace(/[-_]/g, ' ').toLowerCase();
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
};

const normalizeKey = (value) => (value ? value.trim().toLowerCase() : 'general');

const MODULE_METADATA = {
  seguridad: {
    label: 'Seguridad corporativa',
    description: 'Usuarios, roles y auditorías globales.',
    order: 1,
  },
  tiendas: {
    label: 'Tiendas y sucursales',
    description: 'Expansión de sedes y franquicias.',
    order: 2,
  },
  suscripciones: {
    label: 'Suscripciones',
    description: 'Planes SaaS, billing y uso.',
    order: 3,
  },
  facturacion: {
    label: 'Facturación SaaS',
    description: 'Cobros, comprobantes y conciliaciones.',
    order: 4,
  },
  soporte: {
    label: 'Soporte corporativo',
    description: 'Gestión de incidencias y acompañamiento.',
    order: 5,
  },
  reportes: {
    label: 'Reportes ejecutivos',
    description: 'Indicadores globales y tableros.',
    order: 6,
  },
};

const RolForm = ({ open, onClose, onSuccess, rol, permisos, loadingPermisos }) => {
  const [form] = Form.useForm();
  const isEditing = Boolean(rol?.id);
  const selectedPermisos = Form.useWatch('permisos', form) ?? [];
  const { modal } = App.useApp();

  const permisosPorModulo = useMemo(() => {
    if (!Array.isArray(permisos)) {
      return [];
    }

    const groups = new Map();

    permisos.forEach((permiso) => {
      if (!permiso?.slug) {
        return;
      }

      const key = normalizeKey(permiso.modulo);
      const meta = MODULE_METADATA[key] ?? {
        label: prettifyModulo(permiso.modulo || key),
        description: null,
        order: 900,
      };

      const entry = groups.get(key) ?? {
        key,
        label: meta.label,
        description: meta.description,
        order: meta.order ?? 900,
        permisos: [],
      };

      entry.permisos.push({
        id: permiso.id,
        slug: permiso.slug,
        nombreVisible: permiso.nombreVisible,
      });

      groups.set(key, entry);
    });

    return Array.from(groups.values())
      .map((group) => ({
        ...group,
        permisos: group.permisos
          .slice()
          .sort((a, b) => a.nombreVisible.localeCompare(b.nombreVisible, 'es', { sensitivity: 'base' })),
      }))
      .sort((a, b) => {
        if (a.order !== b.order) {
          return a.order - b.order;
        }
        return a.label.localeCompare(b.label, 'es', { sensitivity: 'base' });
      });
  }, [permisos]);

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
  }, [open, isEditing, rol, form]);

  const mutation = useMutation({
    mutationFn: async (values) => {
      if (isEditing) {
        const payload = {
          nombre: values.nombre,
          descripcion: values.descripcion,
          permisos: values.permisos,
          esSistema: rol.esSistema,
        };
        return updateSuperadminRol(rol.id, payload);
      }

      const payload = {
        nombre: values.nombre,
        descripcion: values.descripcion,
        permisos: values.permisos,
      };
      return createSuperadminRol(payload);
    },
    onSuccess: () => {
      message.success(`Rol ${isEditing ? 'actualizado' : 'creado'} correctamente`);
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
      title: isEditing ? 'Actualizar rol' : 'Crear rol',
      content: isEditing
        ? 'Se actualizará la configuración del rol seleccionado.'
        : 'Se creará un nuevo rol con los permisos seleccionados.',
      okText: isEditing ? 'Actualizar' : 'Crear',
      cancelText: 'Cancelar',
      onOk: () => mutation.mutate(values),
    });
  };

  const handleTogglePermission = (permisoSlug, checked) => {
    const current = new Set(selectedPermisos);
    if (checked) {
      current.add(permisoSlug);
    } else {
      current.delete(permisoSlug);
    }
    form.setFieldsValue({ permisos: Array.from(current) });
  };

  const handleToggleModulo = (moduloKey, shouldSelect) => {
    const modulo = permisosPorModulo.find((item) => item.key === moduloKey);
    if (!modulo) return;

    const current = new Set(selectedPermisos);
    modulo.permisos.forEach((permiso) => {
      if (shouldSelect) {
        current.add(permiso.slug);
      } else {
        current.delete(permiso.slug);
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
      loadingPermisos={loadingPermisos}
    />
  );
};

export default RolForm;
