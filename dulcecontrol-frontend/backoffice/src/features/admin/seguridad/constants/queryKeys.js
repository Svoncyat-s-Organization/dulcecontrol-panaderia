export const SEGURIDAD_KEYS = {
  root: ['seguridad'],
  usuarios: (tiendaId) => [...SEGURIDAD_KEYS.root, 'usuarios', tiendaId],
  usuario: (tiendaId, usuarioId) => [...SEGURIDAD_KEYS.usuarios(tiendaId), usuarioId],
  roles: (tiendaId) => [...SEGURIDAD_KEYS.root, 'roles', tiendaId],
  rol: (tiendaId, rolId) => [...SEGURIDAD_KEYS.roles(tiendaId), rolId],
  permisos: () => [...SEGURIDAD_KEYS.root, 'permisos'],
};
