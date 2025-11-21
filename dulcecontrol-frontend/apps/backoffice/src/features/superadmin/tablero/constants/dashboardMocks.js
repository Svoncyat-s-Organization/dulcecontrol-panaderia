export const resumenMetrics = [
  {
    key: 'tiendas-activas',
    title: 'Tiendas activas',
    value: '58',
    description: 'Operando actualmente',
    trend: '+6 vs. mes anterior',
    trendColor: 'green',
    icon: 'store',
  },
  {
    key: 'nuevas-en-onboarding',
    title: 'Nuevas en onboarding',
    value: '12',
    description: 'Últimos 30 días',
    trend: '+3 respecto a meta',
    trendColor: 'green',
    icon: 'rocket',
  },
  {
    key: 'ingresos-brutos',
    title: 'Facturación bruta',
    value: 'S/ 142,300',
    description: 'Mes en curso',
    trend: '+12.4%',
    trendColor: 'green',
    icon: 'cash',
  },
  {
    key: 'tickets-abiertos',
    title: 'Tickets abiertos',
    value: '9',
    description: 'Soporte prioritario',
    trend: '3 críticos',
    trendColor: 'red',
    icon: 'alert',
  },
];

export const facturacionMensual = [
  { mes: 'Ene', total: 82_400 },
  { mes: 'Feb', total: 88_150 },
  { mes: 'Mar', total: 95_320 },
  { mes: 'Abr', total: 104_980 },
  { mes: 'May', total: 112_410 },
  { mes: 'Jun', total: 118_050 },
  { mes: 'Jul', total: 121_600 },
  { mes: 'Ago', total: 129_480 },
  { mes: 'Set', total: 134_200 },
  { mes: 'Oct', total: 137_840 },
  { mes: 'Nov', total: 142_300 },
  { mes: 'Dic', total: 148_900 },
];

export const distribucionPlanes = [
  { plan: 'Starter', tiendas: 24, ticket: 'S/ 350' },
  { plan: 'Growth', tiendas: 19, ticket: 'S/ 690' },
  { plan: 'Scale', tiendas: 11, ticket: 'S/ 1,200' },
  { plan: 'Enterprise', tiendas: 4, ticket: 'S/ 2,800' },
];

export const ticketsCriticos = [
  {
    id: 'SUP-3412',
    tienda: 'La Panadería de Lucho',
    prioridad: 'CRITICA',
    estado: 'ABIERTO',
    vencimiento: '20 Nov 08:00',
  },
  {
    id: 'SUP-3405',
    tienda: 'Dulce Aroma Miraflores',
    prioridad: 'ALTA',
    estado: 'PENDIENTE_CLIENTE',
    vencimiento: '20 Nov 14:00',
  },
  {
    id: 'SUP-3399',
    tienda: 'Bakery Express',
    prioridad: 'ALTA',
    estado: 'ABIERTO',
    vencimiento: '21 Nov 10:00',
  },
];

export const renovacionesProximas = [
  {
    tienda: 'Panadería Central',
    plan: 'Growth · Mensual',
    fechaRenovacion: '26 Nov 2025',
    diasRestantes: 6,
    estado: 'ACTIVA',
  },
  {
    tienda: 'Sweet Corner',
    plan: 'Starter · Anual',
    fechaRenovacion: '02 Dic 2025',
    diasRestantes: 12,
    estado: 'EN_PRUEBA',
  },
  {
    tienda: 'Pasteles & Co',
    plan: 'Scale · Mensual',
    fechaRenovacion: '05 Dic 2025',
    diasRestantes: 15,
    estado: 'ACTIVA',
  },
  {
    tienda: 'Casa del Pan',
    plan: 'Growth · Mensual',
    fechaRenovacion: '08 Dic 2025',
    diasRestantes: 18,
    estado: 'VENCIDA',
  },
];

export const actividadSeguridad = [
  {
    fecha: '19 Nov 22:15',
    evento: 'Bloqueo de IP',
    detalle: 'Intento fallido de autenticación (5) bloqueado automáticamente.',
    impacto: 'Medio',
  },
  {
    fecha: '19 Nov 18:42',
    evento: 'Token revocado',
    detalle: 'Token de integración de tienda "Nueva Miga" revocado por caducidad.',
    impacto: 'Bajo',
  },
  {
    fecha: '19 Nov 11:05',
    evento: 'Nuevo superadmin',
    detalle: 'Se creó cuenta para soporte regional (andina@suite.pe).',
    impacto: 'Alto',
  },
];
