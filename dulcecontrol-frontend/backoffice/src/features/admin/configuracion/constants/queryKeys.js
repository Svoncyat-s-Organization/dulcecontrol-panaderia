export const DATOS_EMPRESA_KEYS = {
  all: ['datos-empresa'],
  byTienda: (tiendaId) => [...DATOS_EMPRESA_KEYS.all, tiendaId],
};

export const SEDES_KEYS = {
  all: ['sedes'],
  lists: (tiendaId) => [...SEDES_KEYS.all, 'list', tiendaId],
  detail: (tiendaId, sedeId) => [...SEDES_KEYS.all, 'detail', tiendaId, sedeId],
};

export const UBIGEO_KEYS = {
  departamentos: ['ubigeo', 'departamentos'],
  provincias: (departamentoId) => ['ubigeo', 'provincias', departamentoId],
  distritos: (provinciaId) => ['ubigeo', 'distritos', provinciaId],
};

export const CONFIGURACION_KEYS = {
  all: ['configuracion'],
  tienda: (tiendaId) => [...CONFIGURACION_KEYS.all, tiendaId],
};

export const PAGINAS_STOREFRONT_KEYS = {
  all: ['paginasStorefront'],
  lists: (tiendaId) => [...PAGINAS_STOREFRONT_KEYS.all, 'list', tiendaId],
  detail: (tiendaId, paginaId) => [...PAGINAS_STOREFRONT_KEYS.all, 'detail', tiendaId, paginaId],
};

export const BRANDING_KEYS = {
  all: ['branding'],
  byTienda: (tiendaId) => [...BRANDING_KEYS.all, tiendaId],
};

export const CONFIGURACION_PUBLICA_KEYS = {
  all: ['configuracionPublica'],
  byTienda: (tiendaId) => [...CONFIGURACION_PUBLICA_KEYS.all, tiendaId],
};
