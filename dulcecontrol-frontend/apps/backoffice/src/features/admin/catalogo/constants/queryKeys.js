export const PRODUCTO_KEYS = {
  all: (tiendaId) => ['productos', tiendaId],
  lists: (tiendaId) => [...PRODUCTO_KEYS.all(tiendaId), 'list'],
  details: (tiendaId) => [...PRODUCTO_KEYS.all(tiendaId), 'detail'],
  detail: (tiendaId, productoId) => [...PRODUCTO_KEYS.details(tiendaId), productoId],
};

export const CATEGORIA_KEYS = {
  all: (tiendaId) => ['categorias', tiendaId],
  lists: (tiendaId) => [...CATEGORIA_KEYS.all(tiendaId), 'list'],
  details: (tiendaId) => [...CATEGORIA_KEYS.all(tiendaId), 'detail'],
  detail: (tiendaId, categoriaId) => [...CATEGORIA_KEYS.details(tiendaId), categoriaId],
};
