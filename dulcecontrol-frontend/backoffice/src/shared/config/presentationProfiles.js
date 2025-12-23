const normalizeProfile = (value) => String(value ?? '').trim().toLowerCase();

export const PRESENTATION_PROFILES = {
  KEVIN: 'kevin',
  BELTHER: 'belther',
  JHEISON: 'jheison',
  FRANK: 'frank',
  JHEYLHON: 'jheylhon',
  JOY: 'joy',
  MARCO: 'marco',
};

// If unset/empty, presentation mode is disabled.
export const getPresentationProfile = () => normalizeProfile(import.meta.env.VITE_PRESENTATION_PROFILE);

// Sidebar filtering is UI-only; it doesn't replace backend permissions.
// Profiles list ONLY the assigned modules (no Tablero).
export const ADMIN_ALLOWED_PATHS_BY_PROFILE = {
  [PRESENTATION_PROFILES.KEVIN]: ['/admin/tablero', '/admin/seguridad', '/admin/reportes'],
  [PRESENTATION_PROFILES.BELTHER]: ['/admin/tablero', '/admin/ventas'],
  [PRESENTATION_PROFILES.JHEISON]: ['/admin/tablero', '/admin/compras', '/admin/produccion'],
  [PRESENTATION_PROFILES.FRANK]: ['/admin/tablero', '/admin/soporte'],
  [PRESENTATION_PROFILES.JHEYLHON]: ['/admin/tablero', '/admin/facturacion'],
  [PRESENTATION_PROFILES.JOY]: ['/admin/tablero', '/admin/catalogo', '/admin/inventario'],
  [PRESENTATION_PROFILES.MARCO]: ['/admin/tablero', '/admin/clientes', '/admin/configuracion'],
};

export const SUPERADMIN_ALLOWED_PATHS_BY_PROFILE = {
  [PRESENTATION_PROFILES.KEVIN]: ['/superadmin/tablero', '/superadmin/seguridad'],
  [PRESENTATION_PROFILES.BELTHER]: ['/superadmin/tablero', '/superadmin/suscripciones'],
  [PRESENTATION_PROFILES.FRANK]: ['/superadmin/tablero', '/superadmin/tiendas', '/superadmin/soporte'],
  [PRESENTATION_PROFILES.JHEYLHON]: ['/superadmin/tablero', '/superadmin/facturacion'],
};
