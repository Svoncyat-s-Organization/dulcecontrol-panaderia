export const resumenMetrics = [
  {
    key: 'ventas-dia',
    title: 'Ventas del día',
    value: 'S/ 1,250.00',
    description: 'vs. ayer',
    trend: '+15%',
    trendColor: 'green',
    icon: 'cash',
  },
  {
    key: 'pedidos-nuevos',
    title: 'Pedidos nuevos',
    value: '12',
    description: 'Últimas 24h',
    trend: '+2 vs. ayer',
    trendColor: 'green',
    icon: 'shopping',
  },
  {
    key: 'bajo-stock',
    title: 'Productos con bajo stock',
    value: '3',
    description: 'Revisa inventario',
    trend: 'Alerta',
    trendColor: 'red',
    icon: 'alert',
  },
  {
    key: 'clientes-activos',
    title: 'Clientes activos',
    value: '45',
    description: 'Últimos 30 días',
    trend: '+5 nuevos',
    trendColor: 'green',
    icon: 'users',
  },
];

export const ventasHistoricas = [
  { dia: '07 Nov', monto: 740 },
  { dia: '08 Nov', monto: 810 },
  { dia: '09 Nov', monto: 920 },
  { dia: '10 Nov', monto: 860 },
  { dia: '11 Nov', monto: 1_040 },
  { dia: '12 Nov', monto: 1_180 },
  { dia: '13 Nov', monto: 980 },
  { dia: '14 Nov', monto: 1_260 },
  { dia: '15 Nov', monto: 1_340 },
  { dia: '16 Nov', monto: 1_190 },
  { dia: '17 Nov', monto: 1_420 },
  { dia: '18 Nov', monto: 1_150 },
  { dia: '19 Nov', monto: 1_380 },
  { dia: '20 Nov', monto: 1_560 },
];

export const categoriasMasVendidas = [
  { tipo: 'Tortas personalizadas', ventas: 4_850, pedidos: 118 },
  { tipo: 'Panadería artesanal', ventas: 3_420, pedidos: 156 },
  { tipo: 'Pasteles individuales', ventas: 2_960, pedidos: 142 },
  { tipo: 'Cafetería y bebidas', ventas: 2_540, pedidos: 185 },
];

export const pedidosRecientes = [
  { id: 'PED-1045', cliente: 'María Torres', total: 'S/ 185.00', estado: 'Pendiente' },
  { id: 'PED-1044', cliente: 'Carlos Díaz', total: 'S/ 256.00', estado: 'Entregado' },
  { id: 'PED-1043', cliente: 'Sandra Quispe', total: 'S/ 98.00', estado: 'Entregado' },
  { id: 'PED-1042', cliente: 'Luis Ramos', total: 'S/ 310.00', estado: 'Pendiente' },
  { id: 'PED-1041', cliente: 'Fiorella Gómez', total: 'S/ 142.00', estado: 'Entregado' },
];

export const productosBajoStock = [
  { sku: 'SKU-001', nombre: 'Pan baguette', stock: 4, ubicacion: 'Sede Miraflores' },
  { sku: 'SKU-018', nombre: 'Torta selva negra', stock: 2, ubicacion: 'Sede San Isidro' },
  { sku: 'SKU-033', nombre: 'Croissant mantequilla', stock: 6, ubicacion: 'Sede Barranco' },
];

export const mejoresClientes = [
  { nombre: 'María Torres', compras: 12, ticket: 'S/ 220.00' },
  { nombre: 'Carlos Díaz', compras: 10, ticket: 'S/ 195.00' },
  { nombre: 'Fiorella Gómez', compras: 9, ticket: 'S/ 180.00' },
];
