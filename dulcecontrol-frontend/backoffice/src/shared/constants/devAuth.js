export const DEV_AUTH_TOKEN = 'dev-admin-token';

const PERMISSIONS_SEED = [
  { slug: 'dashboard.view', nombreVisible: 'Ver Dashboard', modulo: 'dashboard' },
  { slug: 'dashboard.stats', nombreVisible: 'Ver Estadisticas Avanzadas', modulo: 'dashboard' },
  { slug: 'clientes.view', nombreVisible: 'Ver Clientes', modulo: 'clientes' },
  { slug: 'clientes.create', nombreVisible: 'Crear Clientes', modulo: 'clientes' },
  { slug: 'clientes.edit', nombreVisible: 'Editar Clientes', modulo: 'clientes' },
  { slug: 'clientes.delete', nombreVisible: 'Eliminar Clientes', modulo: 'clientes' },
  { slug: 'productos.view', nombreVisible: 'Ver Productos', modulo: 'productos' },
  { slug: 'productos.create', nombreVisible: 'Crear Productos', modulo: 'productos' },
  { slug: 'productos.edit', nombreVisible: 'Editar Productos', modulo: 'productos' },
  { slug: 'productos.delete', nombreVisible: 'Eliminar Productos', modulo: 'productos' },
  { slug: 'productos.precios', nombreVisible: 'Modificar Precios', modulo: 'productos' },
  { slug: 'categorias.view', nombreVisible: 'Ver Categorias', modulo: 'categorias' },
  { slug: 'categorias.manage', nombreVisible: 'Gestionar Categorias', modulo: 'categorias' },
  { slug: 'ventas.view', nombreVisible: 'Ver Ventas', modulo: 'ventas' },
  { slug: 'ventas.create', nombreVisible: 'Registrar Ventas', modulo: 'ventas' },
  { slug: 'ventas.cancel', nombreVisible: 'Cancelar Ventas', modulo: 'ventas' },
  { slug: 'ventas.refund', nombreVisible: 'Procesar Devoluciones', modulo: 'ventas' },
  { slug: 'pedidos.view', nombreVisible: 'Ver Pedidos', modulo: 'pedidos' },
  { slug: 'pedidos.create', nombreVisible: 'Crear Pedidos', modulo: 'pedidos' },
  { slug: 'pedidos.edit', nombreVisible: 'Editar Pedidos', modulo: 'pedidos' },
  { slug: 'pedidos.cancel', nombreVisible: 'Cancelar Pedidos', modulo: 'pedidos' },
  { slug: 'pedidos.status', nombreVisible: 'Cambiar Estado de Pedidos', modulo: 'pedidos' },
  { slug: 'caja.open', nombreVisible: 'Abrir Caja', modulo: 'caja' },
  { slug: 'caja.close', nombreVisible: 'Cerrar Caja', modulo: 'caja' },
  { slug: 'caja.view', nombreVisible: 'Ver Movimientos de Caja', modulo: 'caja' },
  { slug: 'caja.adjust', nombreVisible: 'Ajustar Caja', modulo: 'caja' },
  { slug: 'produccion.view', nombreVisible: 'Ver Planes de Produccion', modulo: 'produccion' },
  { slug: 'produccion.create', nombreVisible: 'Crear Plan de Produccion', modulo: 'produccion' },
  { slug: 'produccion.edit', nombreVisible: 'Editar Plan de Produccion', modulo: 'produccion' },
  { slug: 'produccion.confirm', nombreVisible: 'Confirmar Produccion', modulo: 'produccion' },
  { slug: 'produccion.conteo', nombreVisible: 'Realizar Conteo Diario', modulo: 'produccion' },
  { slug: 'recetas.view', nombreVisible: 'Ver Recetas', modulo: 'recetas' },
  { slug: 'recetas.manage', nombreVisible: 'Gestionar Recetas', modulo: 'recetas' },
  { slug: 'insumos.view', nombreVisible: 'Ver Insumos', modulo: 'insumos' },
  { slug: 'insumos.create', nombreVisible: 'Crear Insumos', modulo: 'insumos' },
  { slug: 'insumos.edit', nombreVisible: 'Editar Insumos', modulo: 'insumos' },
  { slug: 'insumos.delete', nombreVisible: 'Eliminar Insumos', modulo: 'insumos' },
  { slug: 'compras.view', nombreVisible: 'Ver Ordenes de Compra', modulo: 'compras' },
  { slug: 'compras.create', nombreVisible: 'Crear Orden de Compra', modulo: 'compras' },
  { slug: 'compras.edit', nombreVisible: 'Editar Orden de Compra', modulo: 'compras' },
  { slug: 'compras.receive', nombreVisible: 'Recibir Mercaderia', modulo: 'compras' },
  { slug: 'compras.cancel', nombreVisible: 'Cancelar Orden de Compra', modulo: 'compras' },
  { slug: 'proveedores.view', nombreVisible: 'Ver Proveedores', modulo: 'proveedores' },
  { slug: 'proveedores.create', nombreVisible: 'Crear Proveedores', modulo: 'proveedores' },
  { slug: 'proveedores.edit', nombreVisible: 'Editar Proveedores', modulo: 'proveedores' },
  { slug: 'proveedores.delete', nombreVisible: 'Eliminar Proveedores', modulo: 'proveedores' },
  { slug: 'inventario.view', nombreVisible: 'Ver Inventario', modulo: 'inventario' },
  { slug: 'inventario.adjust', nombreVisible: 'Ajustar Inventario', modulo: 'inventario' },
  { slug: 'inventario.transfer', nombreVisible: 'Transferir entre Sedes', modulo: 'inventario' },
  { slug: 'reportes.view', nombreVisible: 'Ver Reportes Ejecutivos', modulo: 'reportes' },
  { slug: 'reportes.ventas', nombreVisible: 'Ver Reportes de Ventas', modulo: 'reportes' },
  { slug: 'reportes.produccion', nombreVisible: 'Ver Reportes de Produccion', modulo: 'reportes' },
  { slug: 'reportes.inventario', nombreVisible: 'Ver Reportes de Inventario', modulo: 'reportes' },
  { slug: 'reportes.financiero', nombreVisible: 'Ver Reportes Financieros', modulo: 'reportes' },
  { slug: 'facturacion.view', nombreVisible: 'Ver Comprobantes', modulo: 'facturacion' },
  { slug: 'facturacion.generate', nombreVisible: 'Generar Comprobantes', modulo: 'facturacion' },
  { slug: 'facturacion.cancel', nombreVisible: 'Anular Comprobantes', modulo: 'facturacion' },
  { slug: 'facturacion.sunat', nombreVisible: 'Enviar a SUNAT', modulo: 'facturacion' },
  { slug: 'usuarios.view', nombreVisible: 'Ver Usuarios', modulo: 'usuarios' },
  { slug: 'usuarios.create', nombreVisible: 'Crear Usuarios', modulo: 'usuarios' },
  { slug: 'usuarios.edit', nombreVisible: 'Editar Usuarios', modulo: 'usuarios' },
  { slug: 'usuarios.delete', nombreVisible: 'Eliminar Usuarios', modulo: 'usuarios' },
  { slug: 'usuarios.roles', nombreVisible: 'Gestionar Roles', modulo: 'usuarios' },
  { slug: 'config.view', nombreVisible: 'Ver Configuracion', modulo: 'config' },
  { slug: 'config.edit', nombreVisible: 'Editar Configuracion', modulo: 'config' },
  { slug: 'config.tienda', nombreVisible: 'Configurar Tienda', modulo: 'config' },
  { slug: 'config.sedes', nombreVisible: 'Gestionar Sedes', modulo: 'config' },
  { slug: 'cms.view', nombreVisible: 'Ver Paginas', modulo: 'cms' },
  { slug: 'cms.edit', nombreVisible: 'Editar Paginas', modulo: 'cms' },
];

export const DEV_PERMISSIONS_CATALOG = PERMISSIONS_SEED.map((permiso, index) => ({
  id: index + 1,
  slug: permiso.slug,
  nombreVisible: permiso.nombreVisible,
  modulo: permiso.modulo,
}));

export const DEV_PERMISSION_SLUGS = DEV_PERMISSIONS_CATALOG.map((permiso) => permiso.slug);

const matchesPattern = (slug, pattern) => slug === pattern || slug.startsWith(`${pattern}.`);

const collectPermissionIds = ({ include = [], exclude = [] }) =>
  DEV_PERMISSIONS_CATALOG.filter(({ slug }) => {
    if (exclude.some((pattern) => matchesPattern(slug, pattern))) {
      return false;
    }
    if (include.length === 0) {
      return true;
    }
    return include.some((pattern) => matchesPattern(slug, pattern));
  }).map(({ id }) => id);

const ALL_PERMISSION_IDS = collectPermissionIds({});
const GERENTE_PERMISSION_IDS = collectPermissionIds({ exclude: ['config', 'usuarios'] });
const VENDEDOR_PERMISSION_IDS = collectPermissionIds({
  include: ['dashboard.view', 'clientes', 'productos.view', 'ventas', 'pedidos', 'caja'],
});
const MAESTRO_PANADERO_PERMISSION_IDS = collectPermissionIds({
  include: ['dashboard.view', 'productos.view', 'produccion', 'recetas', 'inventario.view', 'reportes.produccion'],
});
const ALMACENERO_PERMISSION_IDS = collectPermissionIds({
  include: ['dashboard.view', 'insumos', 'compras', 'proveedores', 'inventario', 'reportes.inventario'],
});

export const DEV_ROLES_FIXTURES = [
  {
    id: 1,
    nombre: 'Administrador',
    descripcion: 'Acceso total al sistema',
    esSistema: true,
    permisos: ALL_PERMISSION_IDS,
  },
  {
    id: 2,
    nombre: 'Gerente',
    descripcion: 'Gestion de operaciones y reportes',
    esSistema: true,
    permisos: GERENTE_PERMISSION_IDS,
  },
  {
    id: 3,
    nombre: 'Vendedor',
    descripcion: 'Registro de ventas y atencion al cliente',
    esSistema: true,
    permisos: VENDEDOR_PERMISSION_IDS,
  },
  {
    id: 4,
    nombre: 'Maestro Panadero',
    descripcion: 'Gestion de produccion y recetas',
    esSistema: true,
    permisos: MAESTRO_PANADERO_PERMISSION_IDS,
  },
  {
    id: 5,
    nombre: 'Almacenero',
    descripcion: 'Gestion de inventario y compras',
    esSistema: true,
    permisos: ALMACENERO_PERMISSION_IDS,
  },
];
