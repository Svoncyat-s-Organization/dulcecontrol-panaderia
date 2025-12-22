import { getApiUrl } from '../../../../config/api.config.js';

export const CATEGORIA_FORM_DEFAULTS = {
  nombre: '',
  slug: '',
  descripcion: '',
  urlImagen: '',
  ordenVisual: 0,
  activa: true,
};

const normalizeImageUrl = (value) => {
  const raw = (value ?? '').toString().trim();
  if (!raw) return '';
  if (raw.startsWith('http://') || raw.startsWith('https://') || raw.startsWith('data:')) {
    return raw;
  }
  if (raw.startsWith('/')) {
    const base = getApiUrl()?.replace(/\/$/, '');
    return base ? `${base}${raw}` : raw;
  }
  return raw;
};

export const mapCategoriasResponse = (categorias = []) =>
  categorias.map((categoria) => {
    const urlImagen = normalizeImageUrl(categoria?.urlImagen ?? categoria?.url_imagen);
    return {
      ...categoria,
      urlImagen,
      ordenVisual: Number.isFinite(Number(categoria.ordenVisual))
        ? Number(categoria.ordenVisual)
        : 0,
      productosCount: categoria.productosCount ?? categoria.productos_count ?? 0,
    };
  });

export const getCategoriaFormInitialValues = (categoria) => ({
  ...CATEGORIA_FORM_DEFAULTS,
  nombre: categoria?.nombre ?? CATEGORIA_FORM_DEFAULTS.nombre,
  slug: categoria?.slug ?? CATEGORIA_FORM_DEFAULTS.slug,
  descripcion: categoria?.descripcion ?? CATEGORIA_FORM_DEFAULTS.descripcion,
  urlImagen: categoria?.urlImagen ?? CATEGORIA_FORM_DEFAULTS.urlImagen,
  ordenVisual: categoria?.ordenVisual ?? CATEGORIA_FORM_DEFAULTS.ordenVisual,
  activa: categoria?.activa ?? CATEGORIA_FORM_DEFAULTS.activa,
});

export const buildCategoriaPayload = (values) => ({
  nombre: values.nombre?.trim() ?? '',
  slug: values.slug?.trim() ?? '',
  descripcion: values.descripcion ?? '',
  urlImagen: values.urlImagen?.trim() ?? '',
  activa: values.activa ?? true,
  ordenVisual: Number.isFinite(Number(values.ordenVisual))
    ? Number(values.ordenVisual)
    : 0,
});
