import { createElement } from 'react';
import {
  IconLayoutGrid,
  IconUsers,
  IconShoppingBag,
  IconInvoice,
  IconCakeRoll,
  IconBrandCakephp,
  IconBasketDollar,
  IconBuildingWarehouse,
  IconReport,
  IconShieldLock,
  IconSettings,
} from '@tabler/icons-react';
import { createPermissionSet, hasAnyPermission, normalizePermission } from '../utils/permissionUtils.js';

const BASE_PATH = '/admin';

export const ADMIN_PERMISSION_GROUPS = [
  {
    key: 'dashboard',
    label: 'Tablero',
    description: 'Acceso al panel principal con indicadores del día.',
    modules: ['dashboard'],
    slugPrefixes: ['dashboard'],
    menuPath: `${BASE_PATH}/tablero`,
    order: 1,
  },
  {
    key: 'clientes',
    label: 'Clientes',
    description: 'Gestión de fichas, historial y segmentación de clientes.',
    modules: ['clientes'],
    slugPrefixes: ['clientes'],
    menuPath: `${BASE_PATH}/clientes`,
    order: 2,
  },
  {
    key: 'ventas',
    label: 'Ventas & Pedidos',
    description: 'Operaciones de punto de venta, pedidos y cajas.',
    modules: ['ventas', 'pedidos', 'caja'],
    slugPrefixes: ['ventas', 'pedidos', 'caja'],
    menuPath: `${BASE_PATH}/ventas`,
    order: 3,
  },
  {
    key: 'facturacion',
    label: 'Facturación',
    description: 'Series, comprobantes y comunicación con SUNAT.',
    modules: ['facturacion'],
    slugPrefixes: ['facturacion'],
    menuPath: `${BASE_PATH}/facturacion`,
    order: 4,
  },
  {
    key: 'produccion',
    label: 'Producción',
    description: 'Planificación diaria, recetas y control de producción.',
    modules: ['produccion', 'recetas'],
    slugPrefixes: ['produccion', 'recetas'],
    menuPath: `${BASE_PATH}/produccion`,
    order: 5,
  },
  {
    key: 'catalogo',
    label: 'Catálogo',
    description: 'Configuración de productos, combos y categorías.',
    modules: ['productos', 'categorias'],
    slugPrefixes: ['productos', 'categorias'],
    menuPath: `${BASE_PATH}/catalogo`,
    order: 6,
  },
  {
    key: 'compras',
    label: 'Compras y Proveedores',
    description: 'Órdenes de compra, proveedores y abastecimiento.',
    modules: ['compras', 'proveedores'],
    slugPrefixes: ['compras', 'proveedores'],
    menuPath: `${BASE_PATH}/compras`,
    order: 7,
  },
  {
    key: 'inventario',
    label: 'Inventario',
    description: 'Existencias, movimientos y control por sede.',
    modules: ['inventario', 'insumos'],
    slugPrefixes: ['inventario', 'insumos'],
    menuPath: `${BASE_PATH}/inventario`,
    order: 8,
  },
  {
    key: 'reportes',
    label: 'Reportes',
    description: 'KPIs de ventas, producción e inventario.',
    modules: ['reportes'],
    slugPrefixes: ['reportes'],
    menuPath: `${BASE_PATH}/reportes`,
    order: 9,
  },
  {
    key: 'seguridad',
    label: 'Seguridad',
    description: 'Usuarios del equipo, roles y permisos.',
    modules: ['usuarios'],
    slugPrefixes: ['usuarios'],
    menuPath: `${BASE_PATH}/seguridad`,
    order: 10,
  },
  {
    key: 'configuracion',
    label: 'Configuración',
    description: 'Preferencias generales de la tienda y sedes.',
    modules: ['configuracion', 'config'],
    slugPrefixes: ['config'],
    menuPath: `${BASE_PATH}/configuracion`,
    order: 11,
  },
  {
    key: 'cms',
    label: 'CMS',
    description: 'Gestión de páginas de contenido.',
    modules: ['cms'],
    slugPrefixes: ['cms'],
    menuPath: `${BASE_PATH}/cms`,
    order: 12,
  },
];

export const ADMIN_MODULE_LOOKUP = new Map();
ADMIN_PERMISSION_GROUPS.forEach((group) => {
  group.modules.forEach((module) => {
    ADMIN_MODULE_LOOKUP.set(normalizePermission(module), group);
  });
});

const prettifyModulo = (modulo) => {
  if (!modulo) {
    return 'General';
  }
  const normalized = modulo.replace(/[-_]/g, ' ');
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
};

export const ADMIN_MENU_BLUEPRINT = [
  {
    key: `${BASE_PATH}/tablero`,
    label: 'Tablero',
    icon: IconLayoutGrid,
    permissionPrefixes: ['dashboard'],
  },
  {
    key: `${BASE_PATH}/clientes`,
    label: 'Clientes',
    icon: IconUsers,
    permissionPrefixes: ['clientes'],
  },
  {
    key: `${BASE_PATH}/ventas`,
    label: 'Ventas & Pedidos',
    icon: IconShoppingBag,
    permissionPrefixes: ['ventas', 'pedidos', 'caja'],
    children: [
      {
        key: `${BASE_PATH}/ventas/punto-de-venta`,
        label: 'Punto de venta',
        permissionPrefixes: ['ventas'],
      },
      {
        key: `${BASE_PATH}/ventas/pedidos`,
        label: 'Pedidos',
        permissionPrefixes: ['pedidos'],
      },
      {
        key: `${BASE_PATH}/ventas/cajas`,
        label: 'Cajas',
        permissionPrefixes: ['caja'],
      },
      {
        key: `${BASE_PATH}/ventas/historial`,
        label: 'Historial de ventas',
        permissionPrefixes: ['ventas'],
      },
    ],
  },
  {
    key: `${BASE_PATH}/facturacion`,
    label: 'Facturación',
    icon: IconInvoice,
    permissionPrefixes: ['facturacion'],
    children: [
      {
        key: `${BASE_PATH}/facturacion/series-correlativos`,
        label: 'Series y correlativos',
        permissionPrefixes: ['facturacion'],
      },
      {
        key: `${BASE_PATH}/facturacion/comprobantes`,
        label: 'Comprobantes',
        permissionPrefixes: ['facturacion'],
      },
    ],
  },
  {
    key: `${BASE_PATH}/produccion`,
    label: 'Producción',
    icon: IconCakeRoll,
    permissionPrefixes: ['produccion', 'recetas'],
    children: [
      {
        key: `${BASE_PATH}/produccion/planificacion`,
        label: 'Planificación',
        permissionPrefixes: ['produccion'],
      },
      {
        key: `${BASE_PATH}/produccion/stock-ideal`,
        label: 'Stock ideal',
        permissionPrefixes: ['produccion'],
      },
      {
        key: `${BASE_PATH}/produccion/recetas`,
        label: 'Recetas',
        permissionPrefixes: ['recetas'],
      },
    ],
  },
  {
    key: `${BASE_PATH}/catalogo`,
    label: 'Catálogo',
    icon: IconBrandCakephp,
    permissionPrefixes: ['productos', 'categorias'],
    children: [
      {
        key: `${BASE_PATH}/catalogo/productos`,
        label: 'Productos',
        permissionPrefixes: ['productos'],
      },
      {
        key: `${BASE_PATH}/catalogo/categorias`,
        label: 'Categorías',
        permissionPrefixes: ['categorias'],
      },
    ],
  },
  {
    key: `${BASE_PATH}/compras`,
    label: 'Compras y Proveedores',
    icon: IconBasketDollar,
    permissionPrefixes: ['compras', 'proveedores'],
    children: [
      {
        key: `${BASE_PATH}/compras/proveedores`,
        label: 'Proveedores',
        permissionPrefixes: ['proveedores'],
      },
      {
        key: `${BASE_PATH}/compras/ordenes`,
        label: 'Órdenes de Compra',
        permissionPrefixes: ['compras'],
      },
    ],
  },
  {
    key: `${BASE_PATH}/inventario`,
    label: 'Inventario',
    icon: IconBuildingWarehouse,
    permissionPrefixes: ['inventario'],
    children: [
      {
        key: `${BASE_PATH}/inventario/existencias`,
        label: 'Existencias',
        permissionPrefixes: ['inventario'],
      },
      {
        key: `${BASE_PATH}/inventario/insumos`,
        label: 'Insumos',
        permissionPrefixes: ['inventario', 'insumos'],
      },
      {
        key: `${BASE_PATH}/inventario/movimientos`,
        label: 'Movimientos',
        permissionPrefixes: ['inventario'],
      },
    ],
  },
  {
    key: `${BASE_PATH}/reportes`,
    label: 'Reportes',
    icon: IconReport,
    permissionPrefixes: ['reportes'],
  },
  {
    key: `${BASE_PATH}/seguridad`,
    label: 'Seguridad',
    icon: IconShieldLock,
    permissionPrefixes: ['usuarios'],
    children: [
      {
        key: `${BASE_PATH}/seguridad/usuarios`,
        label: 'Usuarios',
        permissionPrefixes: ['usuarios'],
      },
      {
        key: `${BASE_PATH}/seguridad/roles`,
        label: 'Roles y permisos',
        permissionPrefixes: ['usuarios', 'usuarios.roles'],
      },
    ],
  },
  {
    key: `${BASE_PATH}/configuracion`,
    label: 'Configuración',
    icon: IconSettings,
    permissionPrefixes: ['config'],
    children: [
      {
        key: `${BASE_PATH}/configuracion/preferencias`,
        label: 'Preferencias',
        permissionPrefixes: ['config'],
      },
      {
        key: `${BASE_PATH}/configuracion/sedes`,
        label: 'Sedes',
        permissionPrefixes: ['config', 'config.sedes'],
      },
    ],
  },
];

const buildMenuItemsRecursive = (items, permissionSet) =>
  items
    .map((item) => {
      const children = item.children ? buildMenuItemsRecursive(item.children, permissionSet) : undefined;
      const canRender =
        hasAnyPermission(permissionSet, item.permissionPrefixes) || (children && children.length > 0);
      if (!canRender) {
        return null;
      }
      return {
        key: item.key,
        label: item.label,
        icon: item.icon ? createElement(item.icon, { size: 18 }) : undefined,
        children,
      };
    })
    .filter(Boolean);

export const buildAdminMenuItems = (permissionsSource) => {
  const permissionSet = createPermissionSet(permissionsSource);
  return buildMenuItemsRecursive(ADMIN_MENU_BLUEPRINT, permissionSet);
};

export const ADMIN_ROUTE_PERMISSIONS = {
  'tablero': ['dashboard.view'],
  'clientes': ['clientes.view'],
  'ventas': ['ventas.view', 'pedidos.view', 'caja.view'],
  'ventas/punto-de-venta': ['ventas.view'],
  'ventas/pedidos': ['pedidos.view'],
  'ventas/historial': ['ventas.view'],
  'ventas/cajas': ['caja.view'],
  'compras': ['compras.view', 'proveedores.view', 'insumos.view'],
  'compras/ordenes': ['compras.view'],
  'compras/proveedores': ['proveedores.view'],
  'compras/insumos': ['insumos.view'],
  'inventario': ['inventario.view'],
  'inventario/existencias': ['inventario.view'],
  'inventario/insumos': ['inventario.view', 'insumos.view'],
  'inventario/movimientos': ['inventario.view'],
  'produccion': ['produccion.view', 'recetas.view'],
  'produccion/planificacion': ['produccion.view'],
  'produccion/stock-ideal': ['produccion.view'],
  'produccion/recetas': ['recetas.view'],
  'catalogo': ['productos.view', 'categorias.view'],
  'catalogo/productos': ['productos.view'],
  'catalogo/categorias': ['categorias.view'],
  'facturacion': ['facturacion.view'],
  'facturacion/series-correlativos': ['facturacion.view'],
  'facturacion/comprobantes': ['facturacion.view'],
  'reportes': ['reportes.ventas', 'reportes.produccion', 'reportes.inventario', 'reportes.financiero'],
  'configuracion': ['config.view'],
  'configuracion/datos-empresa': ['config.view'],
  'configuracion/preferencias': ['config.view'],
  'configuracion/sedes': ['config.sedes', 'config.view'],
  'configuracion/tienda-virtual': ['config.view'],
  'seguridad': ['usuarios.view', 'usuarios.roles'],
  'seguridad/usuarios': ['usuarios.view'],
  'seguridad/roles': ['usuarios.roles'],
};

const ADMIN_ACCESS_PERMISSION_SLUGS = new Set();
Object.values(ADMIN_ROUTE_PERMISSIONS).forEach((requirements) => {
  requirements.forEach((slug) => {
    const normalized = normalizePermission(slug);
    if (!normalized) {
      return;
    }
    ADMIN_ACCESS_PERMISSION_SLUGS.add(normalized);
  });
});

const isAccessPermission = (slug) => ADMIN_ACCESS_PERMISSION_SLUGS.has(normalizePermission(slug));

export const isAdminAccessPermission = (slug) => isAccessPermission(slug);

export const groupPermissionsForDisplay = (permisos = []) => {
  const groups = new Map();

  permisos.forEach((permiso) => {
    if (!permiso?.slug || !isAccessPermission(permiso.slug)) {
      return;
    }

    const modulo = normalizePermission(permiso.modulo);
    const slugRoot = normalizePermission(permiso.slug.split('.')[0]);
    const group = ADMIN_MODULE_LOOKUP.get(modulo) || ADMIN_MODULE_LOOKUP.get(slugRoot);
    const key = group?.key ?? modulo ?? slugRoot ?? 'general';
    const entry = groups.get(key) ?? {
      modulo: key,
      label: group?.label ?? prettifyModulo(modulo || slugRoot),
      description: group?.description ?? null,
      order: group?.order ?? 999,
      permisos: [],
    };
    entry.permisos.push(permiso);
    groups.set(key, entry);
  });

  return Array.from(groups.values())
    .filter((group) => group.permisos.length > 0)
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
};

  const buildAccessTreeRecursive = (items, permissionSet) =>
    items
      .map((item) => {
        const children = item.children ? buildAccessTreeRecursive(item.children, permissionSet) : [];
        const canAccess =
          hasAnyPermission(permissionSet, item.permissionPrefixes) || (children && children.length > 0);
        if (!canAccess) {
          return null;
        }
        return {
          key: item.key,
          label: item.label,
          children,
        };
      })
      .filter(Boolean);

  export const buildAdminAccessStructure = (permissionsSource) => {
    if (!permissionsSource) {
      return [];
    }
    const normalizedSet = createPermissionSet(permissionsSource);
    if (normalizedSet.size === 0) {
      return [];
    }
    const accessSet = new Set();
    normalizedSet.forEach((slug) => {
      if (isAccessPermission(slug)) {
        accessSet.add(slug);
      }
    });
    if (accessSet.size === 0) {
      return [];
    }
    return buildAccessTreeRecursive(ADMIN_MENU_BLUEPRINT, accessSet);
  };
