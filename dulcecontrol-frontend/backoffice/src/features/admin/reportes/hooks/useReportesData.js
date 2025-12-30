import { useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear.js';
import { REPORTES_KEYS } from '../constants/queryKeys.js';
import { getPedidos } from '../../ventas-pedidos/api/pedidos.api.js';
import { getProductos } from '../../catalogo/api/productos.api.js';
import { getCategorias } from '../../catalogo/api/categorias.api.js';
import { getClientes } from '../../ventas-pedidos/api/clientes.api.js';
import { getSesionesCaja, getCajas, getMovimientosCaja } from '../../ventas-pedidos/api/cajas.api.js';
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
  const targetCaja = filters?.cajaId && filters.cajaId !== 'all' ? filters.cajaId : null;
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

  const sesionesQuery = useQuery({
    queryKey: REPORTES_KEYS.sesionesCaja(tiendaId),
    queryFn: () => getSesionesCaja(tiendaId),
    enabled: Boolean(tiendaId),
    staleTime: 5 * 60 * 1000,
  });

  const cajasQuery = useQuery({
    queryKey: REPORTES_KEYS.cajas(tiendaId),
    queryFn: () => getCajas(tiendaId),
    enabled: Boolean(tiendaId),
    staleTime: 10 * 60 * 1000,
  });

  const sesionesData = sesionesQuery.data ?? [];
  const cajasData = cajasQuery.data ?? [];

  const sesionCajaMap = useMemo(() => {
    const map = new Map();
    sesionesData.forEach((sesion) => {
      if (!sesion?.id) {
        return;
      }
      map.set(String(sesion.id), sesion.cajaId ?? null);
    });
    return map;
  }, [sesionesData]);

  const { nombreMap: cajaNombreMap, sedeMap: cajaSedeMap } = useMemo(() => {
    const nombreMap = new Map();
    const sedeMap = new Map();
    cajasData.forEach((caja) => {
      if (!caja?.id) {
        return;
      }
      const key = String(caja.id);
      const label = caja.nombre?.trim() || `Caja ${caja.id}`;
      nombreMap.set(key, label);
      sedeMap.set(key, caja.sedeId != null ? String(caja.sedeId) : null);
    });
    return { nombreMap, sedeMap };
  }, [cajasData]);

  const pedidosSinFiltroCaja = useMemo(() => {
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
        const sesionId = pedido.sesionCajaId ? String(pedido.sesionCajaId) : null;
        const cajaId = sesionId ? sesionCajaMap.get(sesionId) : null;
        const cajaNombre = cajaId != null
          ? cajaNombreMap.get(String(cajaId)) || `Caja ${cajaId}`
          : 'Sin caja';

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
          sesionCajaId: sesionId,
          cajaId: cajaId != null ? String(cajaId) : null,
          cajaNombre,
          creadoEn: pedido.creadoEn || pedido.fechaRegistro || null,
          creadoEnLabel: fechaCreacion.isValid() ? fechaCreacion.format('DD/MM/YYYY HH:mm') : 'Sin fecha',
          raw: pedido,
        };
      });
  }, [pedidosQuery.data, clientesMap, startDate, endDate, targetSede, targetChannel, sesionCajaMap, cajaNombreMap]);

  const pedidos = useMemo(() => {
    if (!targetCaja) {
      return pedidosSinFiltroCaja;
    }
    return pedidosSinFiltroCaja.filter((pedido) => {
      if (targetCaja === 'none') {
        return !pedido.cajaId;
      }
      return pedido.cajaId === targetCaja;
    });
  }, [pedidosSinFiltroCaja, targetCaja]);

  const sesionesSeleccionadas = useMemo(() => {
    if (!Array.isArray(sesionesData) || sesionesData.length === 0) {
      return [];
    }
    if (targetCaja === 'none') {
      return [];
    }

    return sesionesData.filter((sesion) => {
      if (!sesion?.id) {
        return false;
      }

      const sesionCajaId = sesion.cajaId != null ? String(sesion.cajaId) : null;
      if (targetCaja && sesionCajaId !== targetCaja) {
        return false;
      }

      if (targetSede) {
        if (!sesionCajaId) {
          return false;
        }
        const sedeId = cajaSedeMap.get(sesionCajaId) || null;
        if (sedeId !== targetSede) {
          return false;
        }
      }

      if (!startDate && !endDate) {
        return true;
      }

      const apertura = sesion.fechaApertura ? dayjs(sesion.fechaApertura) : null;
      const cierre = sesion.fechaCierre ? dayjs(sesion.fechaCierre) : null;
      const sesionStart = apertura && apertura.isValid() ? apertura : null;
      const sesionEnd = cierre && cierre.isValid() ? cierre : (sesionStart || dayjs());

      if (startDate && sesionEnd && sesionEnd.isBefore(startDate)) {
        return false;
      }
      if (endDate && sesionStart && sesionStart.isAfter(endDate)) {
        return false;
      }

      return true;
    });
  }, [sesionesData, targetCaja, targetSede, startDate, endDate, cajaSedeMap]);

  const sesionesSeleccionadasIds = useMemo(() => {
    if (!sesionesSeleccionadas.length) {
      return [];
    }
    return sesionesSeleccionadas
      .map((sesion) => String(sesion.id))
      .sort((a, b) => a.localeCompare(b));
  }, [sesionesSeleccionadas]);

  const movimientosQuery = useQuery({
    queryKey: REPORTES_KEYS.movimientos(tiendaId, sesionesSeleccionadasIds),
    enabled: Boolean(tiendaId) && sesionesSeleccionadasIds.length > 0,
    staleTime: 60 * 1000,
    queryFn: async () => {
      const results = await Promise.all(
        sesionesSeleccionadasIds.map(async (sesionId) => {
          const movimientos = await getMovimientosCaja(tiendaId, sesionId);
          const collection = Array.isArray(movimientos) ? movimientos : [];
          return collection.map((movimiento) => ({
            ...movimiento,
            sesionCajaId: movimiento.sesionCajaId ?? Number(sesionId),
          }));
        })
      );
      return results.flat();
    },
  });

  const retiros = useMemo(() => {
    const collection = movimientosQuery.data || [];
    if (!collection.length) {
      return [];
    }

    return collection
      .filter((movimiento) => {
        const tipo = movimiento?.tipoMovimiento ? movimiento.tipoMovimiento.toString().toLowerCase() : '';
        if (tipo !== 'retiro_efectivo') {
          return false;
        }

        const sesionId = movimiento?.sesionCajaId ? String(movimiento.sesionCajaId) : null;
        const cajaIdRaw = sesionId ? sesionCajaMap.get(sesionId) : null;
        const cajaId = cajaIdRaw != null ? String(cajaIdRaw) : null;

        if (targetCaja) {
          if (targetCaja === 'none') {
            return false;
          }
          if (targetCaja !== 'all' && cajaId !== targetCaja) {
            return false;
          }
        }

        if (targetSede) {
          const sedeId = cajaId ? cajaSedeMap.get(cajaId) || null : null;
          if (sedeId !== targetSede) {
            return false;
          }
        }

        const fecha = movimiento.creadoEn ? dayjs(movimiento.creadoEn) : null;
        if (fecha && fecha.isValid()) {
          if (startDate && fecha.isBefore(startDate)) {
            return false;
          }
          if (endDate && fecha.isAfter(endDate)) {
            return false;
          }
        }

        return true;
      })
      .map((movimiento) => {
        const sesionId = movimiento?.sesionCajaId ? String(movimiento.sesionCajaId) : null;
        const cajaIdRaw = sesionId ? sesionCajaMap.get(sesionId) : null;
        const cajaId = cajaIdRaw != null ? String(cajaIdRaw) : null;
        const cajaNombre = cajaId ? cajaNombreMap.get(cajaId) || `Caja ${cajaId}` : 'Sin caja';
        const sedeId = cajaId ? cajaSedeMap.get(cajaId) || null : null;
        const montoCentimos = toNumber(movimiento.montoCentimos);
        const fecha = movimiento.creadoEn ? dayjs(movimiento.creadoEn) : null;

        return {
          id: movimiento.id,
          sesionCajaId: sesionId,
          cajaId,
          cajaNombre,
          sedeId,
          montoCentimos,
          monto: centimosToSoles(montoCentimos),
          metodoPago: movimiento.metodoPago || 'EFECTIVO',
          concepto: movimiento.concepto || '',
          comprobante: movimiento.comprobanteAsociado || '',
          creadoEn: movimiento.creadoEn || null,
          creadoEnLabel: fecha && fecha.isValid() ? fecha.format('DD/MM/YYYY HH:mm') : 'Sin fecha',
          raw: movimiento,
        };
      })
      .sort((a, b) => {
        const fechaA = a.creadoEn ? dayjs(a.creadoEn) : null;
        const fechaB = b.creadoEn ? dayjs(b.creadoEn) : null;
        const valorA = fechaA && fechaA.isValid() ? fechaA.valueOf() : 0;
        const valorB = fechaB && fechaB.isValid() ? fechaB.valueOf() : 0;
        return valorB - valorA;
      });
  }, [movimientosQuery.data, targetCaja, targetSede, startDate, endDate, sesionCajaMap, cajaNombreMap, cajaSedeMap]);

  const retirosTotalesCentimos = useMemo(
    () => retiros.reduce((acc, retiro) => acc + toNumber(retiro.montoCentimos), 0),
    [retiros]
  );

  const retirosTotales = useMemo(
    () => Number(centimosToSoles(retirosTotalesCentimos).toFixed(2)),
    [retirosTotalesCentimos]
  );

  const montoInicialTotal = useMemo(() => {
    if (!sesionesSeleccionadas.length) {
      return 0;
    }
    const totalCentimos = sesionesSeleccionadas.reduce(
      (acc, sesion) => acc + toNumber(sesion.montoInicialCentimos),
      0
    );
    return Number(centimosToSoles(totalCentimos).toFixed(2));
  }, [sesionesSeleccionadas]);

  const retirosPorCaja = useMemo(() => {
    const map = new Map();
    retiros.forEach((retiro) => {
      if (!retiro.cajaId) {
        return;
      }
      const entry = map.get(retiro.cajaId) ?? {
        cajaId: retiro.cajaId,
        cajaNombre: retiro.cajaNombre,
        cantidad: 0,
        monto: 0,
      };
      entry.cantidad += 1;
      entry.monto += retiro.monto;
      map.set(retiro.cajaId, entry);
    });
    return Array.from(map.values()).sort((a, b) => b.monto - a.monto);
  }, [retiros]);

  const cajaOptions = useMemo(() => {
    const options = new Map();

    const registrarCaja = (cajaId) => {
      if (!cajaId) {
        return;
      }
      if (options.has(cajaId)) {
        return;
      }
      const label = cajaNombreMap.get(cajaId) || `Caja ${cajaId}`;
      options.set(cajaId, { value: cajaId, label });
    };

    pedidosSinFiltroCaja.forEach((pedido) => {
      if (pedido.cajaId) {
        registrarCaja(pedido.cajaId);
      }
    });

    retiros.forEach((retiro) => {
      if (retiro.cajaId) {
        registrarCaja(retiro.cajaId);
      }
    });

    if (pedidosSinFiltroCaja.some((pedido) => pedido.cajaId == null)) {
      options.set('none', { value: 'none', label: 'Sin caja asignada' });
    }

    const sorted = Array.from(options.values()).sort((a, b) => a.label.localeCompare(b.label, 'es', { sensitivity: 'base' }));
    return [{ value: 'all', label: 'Todas las cajas' }, ...sorted];
  }, [pedidosSinFiltroCaja, retiros, cajaNombreMap]);

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

    const saldoNeto = Number((resumen.totalPagado + montoInicialTotal - retirosTotales).toFixed(2));

    return {
      resumen: {
        ...resumen,
        ticketPromedio: resumen.pedidosPagados > 0 ? resumen.totalPagado / resumen.pedidosPagados : 0,
        retirosTotales,
        saldoNeto,
        cantidadRetiros: retiros.length,
        montoInicial: montoInicialTotal,
      },
      porEstado: Array.from(porEstadoMap.values()).sort((a, b) => b.ventas - a.ventas),
      porPago: Array.from(porPagoMap.values()).sort((a, b) => b.ventas - a.ventas),
      porCanal: Array.from(porCanalMap.values()).sort((a, b) => b.ventas - a.ventas),
      tendencia: Array.from(tendenciaMap.values()).sort((a, b) => a.order - b.order),
    };
  }, [pedidos, grouping, retiros, retirosTotales, montoInicialTotal]);

  const refetchAll = useCallback(async () => {
    await Promise.all([
      pedidosQuery.refetch(),
      productosQuery.refetch(),
      categoriasQuery.refetch(),
      clientesQuery.refetch(),
      sesionesQuery.refetch(),
      cajasQuery.refetch(),
      movimientosQuery.refetch(),
    ]);
  }, [pedidosQuery, productosQuery, categoriasQuery, clientesQuery, sesionesQuery, cajasQuery, movimientosQuery]);

  const isLoading =
    pedidosQuery.isLoading
    || productosQuery.isLoading
    || categoriasQuery.isLoading
    || clientesQuery.isLoading
    || sesionesQuery.isLoading
    || cajasQuery.isLoading
    || movimientosQuery.isLoading;
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
    if (sesionesQuery.isError || cajasQuery.isError) {
      list.push('No se pudo resolver el nombre de algunas cajas. Se mostrará el identificador interno.');
    }
    if (movimientosQuery.isError) {
      list.push('No se pudieron cargar los retiros de caja. Los montos netos podrían no cuadrar.');
    }
    return list;
  }, [
    clientesQuery.isError,
    productosQuery.isError,
    categoriasQuery.isError,
    sesionesQuery.isError,
    cajasQuery.isError,
    movimientosQuery.isError,
  ]);

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
    sesionCajaMap,
    cajaNombreMap,
    cajaOptions,
    cajaSedeMap,
    retiros,
    retirosTotales,
    retirosPorCaja,
  };
};

export default useReportesData;
