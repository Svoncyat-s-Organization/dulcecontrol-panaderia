export const CONFIGURACION_KEYS = {
  all: (tiendaId) => ['configuracion', tiendaId],
  tienda: (tiendaId) => [...CONFIGURACION_KEYS.all(tiendaId), 'tienda'],
};

export const PAGINAS_STOREFRONT_KEYS = {
  all: (tiendaId) => ['paginas-storefront', tiendaId],
  lists: (tiendaId) => [...PAGINAS_STOREFRONT_KEYS.all(tiendaId), 'list'],
  details: (tiendaId) => [...PAGINAS_STOREFRONT_KEYS.all(tiendaId), 'detail'],
  detail: (tiendaId, paginaId) => [...PAGINAS_STOREFRONT_KEYS.details(tiendaId), paginaId],
};