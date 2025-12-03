export const SUPERADMIN_SEGURIDAD_KEYS = {
  root: ['superadmin', 'seguridad'],
  usuarios: () => [...SUPERADMIN_SEGURIDAD_KEYS.root, 'usuarios'],
  usuario: (usuarioId) => [...SUPERADMIN_SEGURIDAD_KEYS.usuarios(), usuarioId],
  actividades: (limit) => [...SUPERADMIN_SEGURIDAD_KEYS.root, 'actividades', limit ?? 'all'],
  actividadesPorUsuario: (usuarioId, limit) => [
    ...SUPERADMIN_SEGURIDAD_KEYS.root,
    'actividades',
    'usuario',
    usuarioId,
    limit ?? 'all',
  ],
};
