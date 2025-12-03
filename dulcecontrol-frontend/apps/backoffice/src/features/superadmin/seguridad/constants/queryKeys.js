export const SUPERADMIN_SEGURIDAD_KEYS = {
  root: ['superadmin', 'seguridad'],
  usuarios: () => [...SUPERADMIN_SEGURIDAD_KEYS.root, 'usuarios'],
  usuario: (usuarioId) => [...SUPERADMIN_SEGURIDAD_KEYS.usuarios(), usuarioId],
  roles: () => [...SUPERADMIN_SEGURIDAD_KEYS.root, 'roles'],
  rol: (rolId) => [...SUPERADMIN_SEGURIDAD_KEYS.roles(), rolId],
  permisos: () => [...SUPERADMIN_SEGURIDAD_KEYS.root, 'permisos'],
  actividades: (limit) => [...SUPERADMIN_SEGURIDAD_KEYS.root, 'actividades', limit ?? 'all'],
  actividadesPorUsuario: (usuarioId, limit) => [
    ...SUPERADMIN_SEGURIDAD_KEYS.root,
    'actividades',
    'usuario',
    usuarioId,
    limit ?? 'all',
  ],
};
