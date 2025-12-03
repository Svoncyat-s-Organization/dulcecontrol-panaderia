// Unidades de medida disponibles para recetas
export const UNIDADES_MEDIDA = {
  UNIDAD: 'UNIDAD',
  KG: 'KG',
  G: 'G',
  L: 'L',
  ML: 'ML',
  PAQUETE: 'PAQUETE',
  SACO: 'SACO',
  LATA: 'LATA',
};

export const UNIDADES_MEDIDA_CONFIG = {
  [UNIDADES_MEDIDA.UNIDAD]: {
    label: 'Unidad(es)',
    abbreviation: 'und',
    type: 'count',
  },
  [UNIDADES_MEDIDA.KG]: {
    label: 'Kilogramo(s)',
    abbreviation: 'kg',
    type: 'weight',
  },
  [UNIDADES_MEDIDA.G]: {
    label: 'Gramo(s)',
    abbreviation: 'g',
    type: 'weight',
  },
  [UNIDADES_MEDIDA.L]: {
    label: 'Litro(s)',
    abbreviation: 'l',
    type: 'volume',
  },
  [UNIDADES_MEDIDA.ML]: {
    label: 'Mililitro(s)',
    abbreviation: 'ml',
    type: 'volume',
  },
  [UNIDADES_MEDIDA.PAQUETE]: {
    label: 'Paquete(s)',
    abbreviation: 'paq',
    type: 'package',
  },
  [UNIDADES_MEDIDA.SACO]: {
    label: 'Saco(s)',
    abbreviation: 'saco',
    type: 'package',
  },
  [UNIDADES_MEDIDA.LATA]: {
    label: 'Lata(s)',
    abbreviation: 'lata',
    type: 'package',
  },
};

// Opciones para el Select del formulario
export const UNIDADES_MEDIDA_OPTIONS = Object.entries(UNIDADES_MEDIDA_CONFIG).map(([key, config]) => ({
  value: key,
  label: config.label,
  abbreviation: config.abbreviation,
}));
