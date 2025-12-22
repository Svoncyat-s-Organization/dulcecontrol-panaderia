const toDecimalFromCentimos = (precioBase, precioBaseCentimos) => {
  if (precioBase !== undefined && precioBase !== null) {
    return Number(precioBase);
  }
  if (precioBaseCentimos !== undefined && precioBaseCentimos !== null) {
    return Number(precioBaseCentimos) / 100;
  }
  return 0;
};

const toCentimos = (value) => {
  const numericValue = Number(value ?? 0);
  if (Number.isNaN(numericValue)) {
    return 0;
  }
  return Math.round(numericValue * 100);
};

const slugify = (text) =>
  text
    ?.toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .slice(0, 255) || '';

export const PRODUCTO_FORM_DEFAULTS = {
  nombre: '',
  sku: '',
  descripcion: '',
  tipo: 'PRODUCTO_TERMINADO',
  precioBase: 0,
  precioOferta: null,
  categoriaId: null,
  urlImagenPrincipal: '',
  esPersonalizable: false,
  visibleEnPos: true,
  visibleEnStorefront: true,
  destacadoStorefront: false,
  activo: true,
};

export const mapProductoResponse = (producto) => {
  if (!producto) {
    return null;
  }

  return {
    ...producto,
    precioBase: toDecimalFromCentimos(producto.precioBase, producto.precioBaseCentimos),
    precioOferta: toDecimalFromCentimos(producto.precioOferta, producto.precioOfertaCentimos),
  };
};

export const mapProductosResponse = (productos = []) =>
  productos.map((producto) => mapProductoResponse(producto)).filter(Boolean);

export const getProductoFormInitialValues = (producto) => ({
  ...PRODUCTO_FORM_DEFAULTS,
  nombre: producto?.nombre ?? PRODUCTO_FORM_DEFAULTS.nombre,
  sku: producto?.sku ?? PRODUCTO_FORM_DEFAULTS.sku,
  descripcion: producto?.descripcion ?? PRODUCTO_FORM_DEFAULTS.descripcion,
  tipo: producto?.tipo ?? PRODUCTO_FORM_DEFAULTS.tipo,
  precioBase:
    producto?.precioBase ?? toDecimalFromCentimos(undefined, producto?.precioBaseCentimos),
  precioOferta:
    producto?.precioOferta ?? toDecimalFromCentimos(undefined, producto?.precioOfertaCentimos),
  categoriaId: producto?.categoriaId ?? PRODUCTO_FORM_DEFAULTS.categoriaId,
  urlImagenPrincipal:
    producto?.urlImagenPrincipal ?? PRODUCTO_FORM_DEFAULTS.urlImagenPrincipal,
  esPersonalizable: producto?.esPersonalizable ?? PRODUCTO_FORM_DEFAULTS.esPersonalizable,
  visibleEnPos: producto?.visibleEnPos ?? PRODUCTO_FORM_DEFAULTS.visibleEnPos,
  visibleEnStorefront:
    producto?.visibleEnStorefront ?? PRODUCTO_FORM_DEFAULTS.visibleEnStorefront,
  destacadoStorefront:
    producto?.destacadoStorefront ?? PRODUCTO_FORM_DEFAULTS.destacadoStorefront,
  activo: producto?.activo ?? PRODUCTO_FORM_DEFAULTS.activo,
});

export const buildProductoPayload = (values, productoBase = {}) => {
  const safeProductoBase = productoBase ?? {};
  const nombre = values.nombre?.trim() ?? '';
  const slug = values.slug?.trim() ?? slugify(nombre);

  return {
    categoriaId: values.categoriaId ?? null,
    nombre,
    slug,
    sku: values.sku?.trim() ?? '',
    descripcion: values.descripcion ?? '',
    tipo: values.tipo ?? 'PRODUCTO_TERMINADO',
    esPersonalizable: values.esPersonalizable ?? safeProductoBase.esPersonalizable ?? false,
    precioBaseCentimos: toCentimos(values.precioBase),
    precioOfertaCentimos:
      values.precioOferta !== undefined && values.precioOferta !== null
        ? toCentimos(values.precioOferta)
        : safeProductoBase.precioOfertaCentimos ?? null,
    visibleEnPos: values.visibleEnPos ?? safeProductoBase.visibleEnPos ?? true,
    visibleEnStorefront:
      values.visibleEnStorefront ?? safeProductoBase.visibleEnStorefront ?? true,
    destacadoStorefront:
      values.destacadoStorefront ?? safeProductoBase.destacadoStorefront ?? false,
    urlImagenPrincipal: values.urlImagenPrincipal ?? safeProductoBase.urlImagenPrincipal ?? '',
    imagenesGaleria: safeProductoBase.imagenesGaleria ?? [],
    atributos: safeProductoBase.atributos ?? {},
    activo: values.activo ?? safeProductoBase.activo ?? true,
  };
};