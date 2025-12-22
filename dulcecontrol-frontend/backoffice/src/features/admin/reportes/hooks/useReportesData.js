import { useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear.js';
import { REPORTES_KEYS } from '../constants/queryKeys.js';
import { getPedidos } from '../../ventas-pedidos/api/pedidos.api.js';
import { getProductos } from '../../catalogo/api/productos.api.js';
import { getCategorias } from '../../catalogo/api/categorias.api.js';
import { getClientes } from '../../ventas-pedidos/api/clientes.api.js';
import { mapProductosResponse } from '../../catalogo/utils/productoMappers.js';

dayjs.extend(weekOfYear);

const toNumber = (value) => {
  const numeric = Number(value ?? 0);
  if (Number.isNaN(numeric)) {
    return 0;
  }
  return numeric;
};

const centimosToSoles = (centimos) => toNumber(centimos) / 100;

const extractCollection = (payload) => {
  if (!payload) {
    return [];
  }
  if (Array.isArray(payload)) {
    return payload;
  }
  if (Array.isArray(payload?.content)) {
    return payload.content;
  }
  if (Array.isArray(payload?.items)) {
    return payload.items;
  }
  return [];
};

const buildPedidosParams = (filters) => {
  if (!filters) {
    return { size: 500, page: 0 };
  }
  const params = { size: 500, page: 0 };
  if (filters.startDate) {
    params.fechaDesde = dayjs(filters.startDate).format('YYYY-MM-DDTHH:mm:ss');
  }
  if (filters.endDate) {
    params.fechaHasta = dayjs(filters.endDate).format('YYYY-MM-DDTHH:mm:ss');
  }
  if (filters.sedeId && filters.sedeId !== 'all') {
    params.sedeId = filters.sedeId;
  }
  if (filters.canal && filters.canal !== 'all') {
    params.origen = filters.canal;
  }
  return params;
};

const getPedidoCollection = (data) => {
  if (!data) {
    return [];
  }
  if (Array.isArray(data)) {
    return data;
  }
  if (Array.isArray(data?.content)) {
    return data.content;
  }
  return [];
};

const buildClienteLabel = (cliente) => {
  if (!cliente) {
    return 'Cliente sin identificar';
  }
  return (
    cliente.nombreDoc
    || cliente.nombre
    || `${cliente.nombres || ''} ${cliente.apellidos || ''}`.trim()
    || cliente.razonSocial
    || cliente.correo
    || `Cliente ${cliente.id}`
  );
};

const resolvePeriodMeta = (value, grouping) => {
  const date = dayjs(value);
  if (!date.isValid()) {
    return {
      key: 'sin-fecha',
      label: 'Sin fecha',
      order: Number.MIN_SAFE_INTEGER,
    };
  }

  if (grouping === 'month') {
    const start = date.startOf('month');
    return {
      key: start.toISOString(),
      label: start.format('MMMM YYYY'),
      order: start.valueOf(),
    };
  }

  if (grouping === 'week') {
    const start = date.startOf('week');
    const end = date.endOf('week');
    return {
      key: start.toISOString(),
      label: `Semana ${String(date.week()).padStart(2, '0')} (${start.format('DD/MM')} - ${end.format('DD/MM')})`,
      order: start.valueOf(),
    };
  }

  const start = date.startOf('day');
  return {
    key: start.toISOString(),
    label: start.format('DD/MM/YYYY'),
    order: start.valueOf(),
  };
};

const normalizeEstado = (estado, fallback = 'sin_registro') => {
  if (!estado) {
    return fallback;
  }
  return estado.toString().toLowerCase();
};

export const useReportesData = ({ tiendaId, filters }) => {
  const pedidosQuery = useQuery({
    queryKey: REPORTES_KEYS.pedidos(tiendaId, filters),
    queryFn: () => getPedidos(tiendaId, buildPedidosParams(filters)),
    enabled: Boolean(tiendaId),
    select: getPedidoCollection,
    staleTime: 60 * 1000,
  });

  const productosQuery = useQuery({
    queryKey: REPORTES_KEYS.productos(tiendaId),
    queryFn: () => getProductos(tiendaId),
    enabled: Boolean(tiendaId),
    select: (data) => mapProductosResponse(extractCollection(data)),
    staleTime: 5 * 60 * 1000,
  });

  const categoriasQuery = useQuery({
    queryKey: REPORTES_KEYS.categorias(tiendaId),
    queryFn: () => getCategorias(tiendaId),
    enabled: Boolean(tiendaId),
    select: (data) => extractCollection(data),
    staleTime: 10 * 60 * 1000,
  });

  const clientesQuery = useQuery({
    queryKey: REPORTES_KEYS.clientes(tiendaId),
    queryFn: () => getClientes(tiendaId),
    enabled: Boolean(tiendaId),
    select: (data) => extractCollection(data),
    staleTime: 10 * 60 * 1000,
  });

  const startDate = filters?.startDate ? dayjs(filters.startDate) : null;
  const endDate = filters?.endDate ? dayjs(filters.endDate) : null;
  const targetSede = filters?.sedeId && filters.sedeId !== 'all' ? String(filters.sedeId) : null;
  const targetChannel = filters?.canal && filters.canal !== 'all' ? filters.canal.toString().toLowerCase() : null;
  const grouping = filters?.grouping || 'day';

  const productosData = productosQuery.data ?? [];
  const categoriasData = categoriasQuery.data ?? [];
  const clientesData = clientesQuery.data ?? [];

  const clientesMap = useMemo(() => {
    const map = new Map();
    clientesData.forEach((cliente) => {
      map.set(String(cliente.id), cliente);
    });
    return map;
  }, [clientesData]);

  const pedidos = useMemo(() => {
    const collection = pedidosQuery.data || [];
    return collection
      .filter((pedido) => {
        const fecha = dayjs(pedido.creadoEn || pedido.fechaRegistro || pedido.fechaEntregaPactada || null);
        if (fecha.isValid()) {
          if (startDate && fecha.isBefore(startDate)) {
            return false;
          }
          if (endDate && fecha.isAfter(endDate)) {
            return false;
          }
        } else if (startDate || endDate) {
          return false;
        }
        if (targetSede && String(pedido.sedeOrigenId ?? pedido.sedeId ?? '') !== targetSede) {
          return false;
        }
        if (targetChannel) {
          const origen = pedido.origen ? pedido.origen.toString().toLowerCase() : '';
          if (origen !== targetChannel) {
            return false;
          }
        }
        return true;
      })
      .map((pedido) => {
        const cliente = clientesMap.get(String(pedido.clienteId)) || null;
        const totalCentimos = toNumber(pedido.totalFinalCentimos);
        const pagadoCentimos = toNumber(pedido.montoPagadoCentimos);
        const pendienteCentimos = Math.max(totalCentimos - pagadoCentimos, 0);
        const fechaCreacion = dayjs(pedido.creadoEn || pedido.fechaRegistro || null);

        return {
          id: pedido.id,
          codigo: pedido.codigoPedido,
          clienteId: pedido.clienteId,
          clienteNombre: buildClienteLabel(cliente),
          estadoPedido: normalizeEstado(pedido.estadoPedido, 'sin_estado'),
          estadoPago: normalizeEstado(pedido.estadoPago, 'sin_estado'),
          totalCentimos,
          pagadoCentimos,
          pendienteCentimos,
          total: centimosToSoles(totalCentimos),
          pagado: centimosToSoles(pagadoCentimos),
          pendiente: centimosToSoles(pendienteCentimos),
          moneda: pedido.moneda || 'PEN',
          origen: pedido.origen || 'SIN_ORIGEN',
          sedeId: pedido.sedeOrigenId || pedido.sedeId || null,
          tipoEntrega: pedido.tipoEntrega || 'sin_tipo',
          creadoEn: pedido.creadoEn || pedido.fechaRegistro || null,
          creadoEnLabel: fechaCreacion.isValid() ? fechaCreacion.format('DD/MM/YYYY HH:mm') : 'Sin fecha',
          raw: pedido,
        };
      });
  }, [pedidosQuery.data, clientesMap, startDate, endDate, targetSede, targetChannel]);

  const categoriaMap = useMemo(() => {
    const map = new Map();
    categoriasData.forEach((categoria) => {
      map.set(String(categoria.id), categoria.nombre || categoria.descripcion || `Categoría ${categoria.id}`);
    });
    return map;
  }, [categoriasData]);

  const catalogo = useMemo(() => {
    return productosData.map((producto) => ({
      id: producto.id,
      nombre: producto.nombre,
      sku: producto.sku || '',
      categoriaId: producto.categoriaId || null,
      categoriaNombre: categoriaMap.get(String(producto.categoriaId)) || 'Sin categoría',
      precioBase: producto.precioBase ?? centimosToSoles(producto.precioBaseCentimos),
      precioOferta: producto.precioOferta ?? (producto.precioOfertaCentimos ? centimosToSoles(producto.precioOfertaCentimos) : null),
      visibleEnPos: Boolean(producto.visibleEnPos),
      visibleEnStorefront: Boolean(producto.visibleEnStorefront),
      activo: producto.activo !== false,
    }));
  }, [productosData, categoriaMap]);

  const aggregations = useMemo(() => {
    const resumen = {
      totalVentas: 0,
      totalPagado: 0,
      totalPendiente: 0,
      pedidosTotales: pedidos.length,
      pedidosPagados: 0,
    };

    const porEstadoMap = new Map();
    const porPagoMap = new Map();
    const porCanalMap = new Map();
    const tendenciaMap = new Map();

    pedidos.forEach((pedido) => {
      resumen.totalVentas += pedido.total;
      resumen.totalPagado += pedido.pagado;
      resumen.totalPendiente += pedido.pendiente;
      if (pedido.estadoPago === 'pagado_total') {
        resumen.pedidosPagados += 1;
      }

      const estadoKey = pedido.estadoPedido;
      const estadoEntry = porEstadoMap.get(estadoKey) ?? { estado: estadoKey, pedidos: 0, ventas: 0 };
      estadoEntry.pedidos += 1;
      estadoEntry.ventas += pedido.total;
      porEstadoMap.set(estadoKey, estadoEntry);

      const pagoKey = pedido.estadoPago;
      const pagoEntry = porPagoMap.get(pagoKey) ?? { estadoPago: pagoKey, pedidos: 0, ventas: 0 };
      pagoEntry.pedidos += 1;
      pagoEntry.ventas += pedido.total;
      porPagoMap.set(pagoKey, pagoEntry);

      const canalKey = (pedido.origen || 'SIN_ORIGEN').toString().toUpperCase();
      const canalEntry = porCanalMap.get(canalKey) ?? { canal: canalKey, pedidos: 0, ventas: 0 };
      canalEntry.pedidos += 1;
      canalEntry.ventas += pedido.total;
      porCanalMap.set(canalKey, canalEntry);

      const periodMeta = resolvePeriodMeta(pedido.creadoEn, grouping);
      const trendEntry = tendenciaMap.get(periodMeta.key) ?? {
        key: periodMeta.key,
        periodo: periodMeta.label,
        order: periodMeta.order,
        ventas: 0,
        pedidos: 0,
      };
      trendEntry.ventas += pedido.total;
      trendEntry.pedidos += 1;
      tendenciaMap.set(periodMeta.key, trendEntry);
    });

    return {
      resumen: {
        ...resumen,
        ticketPromedio: resumen.pedidosPagados > 0 ? resumen.totalPagado / resumen.pedidosPagados : 0,
      },
      porEstado: Array.from(porEstadoMap.values()).sort((a, b) => b.ventas - a.ventas),
      porPago: Array.from(porPagoMap.values()).sort((a, b) => b.ventas - a.ventas),
      porCanal: Array.from(porCanalMap.values()).sort((a, b) => b.ventas - a.ventas),
      tendencia: Array.from(tendenciaMap.values()).sort((a, b) => a.order - b.order),
    };
  }, [pedidos, grouping]);

  const refetchAll = useCallback(async () => {
    await Promise.all([
      pedidosQuery.refetch(),
      productosQuery.refetch(),
      categoriasQuery.refetch(),
      clientesQuery.refetch(),
    ]);
  }, [pedidosQuery, productosQuery, categoriasQuery, clientesQuery]);

  const isLoading = pedidosQuery.isLoading || productosQuery.isLoading || categoriasQuery.isLoading || clientesQuery.isLoading;
  const isError = pedidosQuery.isError;
  const error = pedidosQuery.error || null;

  const warnings = useMemo(() => {
    const list = [];
    if (clientesQuery.isError) {
      list.push('No se pudieron cargar los datos de clientes. Se mostrarán identificadores genéricos.');
    }
    if (productosQuery.isError || categoriasQuery.isError) {
      list.push('Catálogo parcial: productos o categorías no disponibles por permisos o conexión.');
    }
    return list;
  }, [clientesQuery.isError, productosQuery.isError, categoriasQuery.isError]);

  return {
    pedidos,
    catalogo,
    resumen: aggregations.resumen,
    porEstado: aggregations.porEstado,
    porPago: aggregations.porPago,
    porCanal: aggregations.porCanal,
    tendencia: aggregations.tendencia,
    isLoading,
    isError,
    error,
    refetch: refetchAll,
    warnings,
  };
};

export default useReportesData;
