export const CATEGORIA_FORM_DEFAULTS = {
  nombre: '',
  descripcion: '',
  urlImagen: '',
  ordenVisual: 0,
  activa: true,
};

export const mapCategoriasResponse = (categorias = []) =>
  categorias.map((categoria) => ({
    ...categoria,
    ordenVisual: Number.isFinite(Number(categoria.ordenVisual))
      ? Number(categoria.ordenVisual)
      : 0,
  }));

export const getCategoriaFormInitialValues = (categoria) => ({
  ...CATEGORIA_FORM_DEFAULTS,
  nombre: categoria?.nombre ?? CATEGORIA_FORM_DEFAULTS.nombre,
  descripcion: categoria?.descripcion ?? CATEGORIA_FORM_DEFAULTS.descripcion,
  urlImagen: categoria?.urlImagen ?? CATEGORIA_FORM_DEFAULTS.urlImagen,
  ordenVisual: categoria?.ordenVisual ?? CATEGORIA_FORM_DEFAULTS.ordenVisual,
  activa: categoria?.activa ?? CATEGORIA_FORM_DEFAULTS.activa,
});

export const buildCategoriaPayload = (values) => ({
  nombre: values.nombre?.trim() ?? '',
  descripcion: values.descripcion ?? '',
  urlImagen: values.urlImagen ?? '',
  activa: values.activa ?? true,
  ordenVisual: Number.isFinite(Number(values.ordenVisual))
    ? Number(values.ordenVisual)
    : 0,
});
