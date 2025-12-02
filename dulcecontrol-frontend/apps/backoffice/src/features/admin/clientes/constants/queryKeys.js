export const CLIENTE_KEYS = {
  all: (tiendaId) => ['clientes', tiendaId],
  lists: (tiendaId) => [...CLIENTE_KEYS.all(tiendaId), 'list'],
  details: (tiendaId) => [...CLIENTE_KEYS.all(tiendaId), 'detail'],
  detail: (tiendaId, clienteId) => [...CLIENTE_KEYS.details(tiendaId), clienteId],
};

export const DIRECCION_CLIENTE_KEYS = {
  all: (tiendaId, clienteId) => ['direcciones-cliente', tiendaId, clienteId],
  lists: (tiendaId, clienteId) => [...DIRECCION_CLIENTE_KEYS.all(tiendaId, clienteId), 'list'],
  details: (tiendaId, clienteId) => [...DIRECCION_CLIENTE_KEYS.all(tiendaId, clienteId), 'detail'],
  detail: (tiendaId, clienteId, direccionId) => [...DIRECCION_CLIENTE_KEYS.details(tiendaId, clienteId), direccionId],
};