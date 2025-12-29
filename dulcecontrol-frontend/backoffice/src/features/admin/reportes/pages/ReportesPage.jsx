import { useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Alert, Button, Card, Col, DatePicker, Empty, Result, Row, Select, Space, Spin, Statistic, Table, Typography, message } from 'antd';
import dayjs from 'dayjs';
import { IconDownload, IconRefresh } from '@tabler/icons-react';
import { useTokenStore } from '../../../../shared/store/tokenStore.js';
import { useSedeStore } from '../../../../shared/store/sedeStore.js';
import { getSedesAsignadas } from '../../configuracion/api/sedes.api.js';
import useReportesData from '../hooks/useReportesData.js';
import exportToXlsx from '../../../../shared/utils/exportUtils.js';

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

const prettify = (value) => {
  if (!value) {
    return 'No definido';
  }
  return value
    .toString()
    .split(/[_\s]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const formatCurrency = (amount) => new Intl.NumberFormat('es-PE', {
  style: 'currency',
  currency: 'PEN',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
}).format(Number(amount ?? 0));

const toDecimal = (value) => Number(Number(value ?? 0).toFixed(2));

const buildDefaultFilters = () => {
  const end = dayjs().endOf('day');
  const start = end.clone().subtract(13, 'day').startOf('day');
  return {
    startDate: start.toISOString(),
    endDate: end.toISOString(),
    sedeId: 'all',
    canal: 'all',
    cajaId: 'all',
    grouping: 'day',
  };
};

const buildChannelValues = (pedidos) => {
  const set = new Set(['all']);
  pedidos.forEach((pedido) => {
    const channel = pedido.origen ? pedido.origen.toString().toLowerCase() : '';
    if (channel) {
      set.add(channel);
    }
  });
  return Array.from(set.values());
};

const useReportesSharedState = () => {
  const tiendaId = useTokenStore((state) => state.tiendaId);
  const selectedSedeId = useSedeStore((state) => state.selectedSedeId);
  const selectedSedeNombre = useSedeStore((state) => state.selectedSedeNombre);

  const [filters, setFilters] = useState(buildDefaultFilters);

  const { data: sedes = [], isLoading: sedesLoading } = useQuery({
    queryKey: ['admin', 'reportes', 'sedes', tiendaId],
    queryFn: () => getSedesAsignadas(tiendaId),
    enabled: Boolean(tiendaId),
    staleTime: 5 * 60 * 1000,
  });

  const sedeOptions = useMemo(() => {
    const options = (sedes || []).map((sede) => ({
      label: sede.nombre,
      value: String(sede.id),
    }));

    if (
      selectedSedeId &&
      !options.some((option) => option.value === String(selectedSedeId))
    ) {
      options.unshift({
        label: selectedSedeNombre || `Sede ${selectedSedeId}`,
        value: String(selectedSedeId),
      });
    }

    return [
      { label: 'Todas las sedes', value: 'all' },
      ...options,
    ];
  }, [sedes, selectedSedeId, selectedSedeNombre]);

  const reportesQuery = useReportesData({ tiendaId, filters });

  const resolvedChannelValues = useMemo(
    () => buildChannelValues(reportesQuery.pedidos),
    [reportesQuery.pedidos]
  );

  const cajaOptions = reportesQuery.cajaOptions || [{ value: 'all', label: 'Todas las cajas' }];

  useEffect(() => {
    if (filters.canal === 'all') {
      return;
    }
    if (!resolvedChannelValues.includes(filters.canal)) {
      setFilters((prev) => ({ ...prev, canal: 'all' }));
    }
  }, [resolvedChannelValues, filters.canal]);

  useEffect(() => {
    if (filters.sedeId === 'all') {
      return;
    }
    if (!sedeOptions.some((option) => option.value === filters.sedeId)) {
      setFilters((prev) => ({ ...prev, sedeId: 'all' }));
    }
  }, [sedeOptions, filters.sedeId]);

  useEffect(() => {
    if (filters.cajaId === 'all') {
      return;
    }
    if (!cajaOptions.some((option) => option.value === filters.cajaId)) {
      setFilters((prev) => ({ ...prev, cajaId: 'all' }));
    }
  }, [cajaOptions, filters.cajaId]);

  const rangeValue = useMemo(() => {
    if (!filters.startDate || !filters.endDate) {
      return null;
    }
    return [dayjs(filters.startDate), dayjs(filters.endDate)];
  }, [filters.startDate, filters.endDate]);

  const scopeLabel = useMemo(() => {
    if (filters.sedeId === 'all') {
      return 'multisede';
    }
    const match = sedeOptions.find((option) => option.value === filters.sedeId);
    return match ? `para ${match.label}` : `para sede ${filters.sedeId}`;
  }, [filters.sedeId, sedeOptions]);

  const channelOptions = useMemo(
    () =>
      resolvedChannelValues.map((value) => ({
        value,
        label: value === 'all' ? 'Todos los canales' : prettify(value),
      })),
    [resolvedChannelValues]
  );

  const groupingOptions = useMemo(
    () => [
      { value: 'day', label: 'Diario' },
      { value: 'week', label: 'Semanal' },
      { value: 'month', label: 'Mensual' },
    ],
    []
  );

  const handleRangeChange = (dates) => {
    if (!dates || dates.length !== 2) {
      return;
    }
    setFilters((prev) => ({
      ...prev,
      startDate: dates[0].startOf('day').toISOString(),
      endDate: dates[1].endOf('day').toISOString(),
    }));
  };

  const handleSedeChange = (value) => {
    setFilters((prev) => ({ ...prev, sedeId: value }));
  };

  const handleChannelChange = (value) => {
    setFilters((prev) => ({ ...prev, canal: value }));
  };

  const handleCajaChange = (value) => {
    setFilters((prev) => ({ ...prev, cajaId: value }));
  };

  const handleGroupingChange = (value) => {
    setFilters((prev) => ({ ...prev, grouping: value }));
  };

  const handleReset = () => {
    setFilters(buildDefaultFilters());
  };

  const handleRefresh = () => {
    reportesQuery.refetch();
  };

  return {
    tiendaId,
    filters,
    rangeValue,
    scopeLabel,
    sedeOptions,
    channelOptions,
    cajaOptions,
    groupingOptions,
    handleRangeChange,
    handleSedeChange,
    handleChannelChange,
    handleCajaChange,
    handleGroupingChange,
    handleReset,
    handleRefresh,
    sedesLoading,
    ...reportesQuery,
  };
};

const FiltersBar = ({
  title,
  subtitle,
  scopeLabel,
  filters,
  rangeValue,
  sedeOptions,
  channelOptions,
  cajaOptions,
  groupingOptions,
  handleRangeChange,
  handleSedeChange,
  handleChannelChange,
  handleCajaChange,
  handleGroupingChange,
  handleReset,
  handleRefresh,
  exportConfig,
  sedesLoading,
  showCajaFilter = false,
  showChannelFilter = true,
  showGroupingFilter = true,
}) => (
  <Card>
    <Row gutter={[16, 16]} align="middle" justify="space-between">
      <Col xs={24} md={12} lg={10}>
        <Space direction="vertical" size={4}>
          <Title level={4} style={{ margin: 0 }}>
            {title}
          </Title>
          <Text type="secondary">
            {subtitle} {scopeLabel}.
          </Text>
        </Space>
      </Col>
      <Col xs={24} md={12} lg={14}>
        <Space size={12} wrap style={{ justifyContent: 'flex-end', width: '100%' }}>
          <RangePicker
            value={rangeValue}
            onChange={handleRangeChange}
            allowClear={false}
            format="DD/MM/YYYY"
            disabledDate={(current) => current && current > dayjs().endOf('day')}
          />
          <Select
            style={{ width: 200 }}
            value={filters.sedeId}
            options={sedeOptions}
            loading={sedesLoading}
            onChange={handleSedeChange}
          />
          {showCajaFilter && Array.isArray(cajaOptions) && cajaOptions.length > 0 && (
            <Select
              style={{ width: 200 }}
              value={filters.cajaId ?? 'all'}
              options={cajaOptions}
              onChange={handleCajaChange}
            />
          )}
          {showChannelFilter && (
            <Select
              style={{ width: 200 }}
              value={filters.canal}
              options={channelOptions}
              onChange={handleChannelChange}
            />
          )}
          {showGroupingFilter && (
            <Select
              style={{ width: 160 }}
              value={filters.grouping}
              options={groupingOptions}
              onChange={handleGroupingChange}
            />
          )}
          <Button onClick={handleReset} icon={<IconRefresh size={16} />}>Limpiar</Button>
          <Button onClick={handleRefresh}>Actualizar</Button>
          <Button type="primary" icon={<IconDownload size={16} />} onClick={exportConfig.onExport}>
            {exportConfig.label}
          </Button>
        </Space>
      </Col>
    </Row>
  </Card>
);

const SummaryCards = ({ resumen }) => (
  <Row gutter={[16, 16]}>
    <Col xs={24} md={12} xl={8}>
      <Card>
        <Statistic title="Ventas cobradas" value={resumen.totalPagado} precision={2} prefix="S/" />
        <Text type="secondary">Total vendido: {formatCurrency(resumen.totalVentas)}</Text>
      </Card>
    </Col>
    <Col xs={24} md={12} xl={8}>
      <Card>
        <Statistic title="Ticket promedio" value={resumen.ticketPromedio} precision={2} prefix="S/" />
        <Text type="secondary">Pedidos pagados: {resumen.pedidosPagados}</Text>
      </Card>
    </Col>
    <Col xs={24} md={12} xl={8}>
      <Card>
        <Statistic title="Pedidos totales" value={resumen.pedidosTotales} />
        <Text type="secondary">Periodo seleccionado</Text>
      </Card>
    </Col>
    <Col xs={24} md={12} xl={8}>
      <Card>
        <Statistic title="Pendiente de cobro" value={resumen.totalPendiente} precision={2} prefix="S/" />
        <Text type="secondary">Saldo por cobrar del período</Text>
      </Card>
    </Col>
    <Col xs={24} md={12} xl={8}>
      <Card>
        <Statistic title="Retiros registrados" value={resumen.retirosTotales ?? 0} precision={2} prefix="S/" />
        <Text type="secondary">Retiros contabilizados: {resumen.cantidadRetiros ?? 0}</Text>
      </Card>
    </Col>
    <Col xs={24} md={12} xl={8}>
      <Card>
        <Statistic title="Saldo neto caja" value={resumen.saldoNeto ?? 0} precision={2} prefix="S/" />
        <Text type="secondary">Ventas cobradas menos retiros</Text>
      </Card>
    </Col>
  </Row>
);

const useVentasExport = ({ resumen, tendencia, porCanal }) => {
  return useCallback(() => {
    const hasData = tendencia.length > 0 || resumen.totalPagado > 0;
    if (!hasData) {
      message.warning('No hay datos de ventas para exportar');
      return;
    }

    try {
      const resumenRows = [
        { metrica: 'Ventas cobradas (S/)', valor: toDecimal(resumen.totalPagado) },
        { metrica: 'Pedidos pagados', valor: resumen.pedidosPagados },
        { metrica: 'Pedidos totales', valor: resumen.pedidosTotales },
        { metrica: 'Ticket promedio (S/)', valor: toDecimal(resumen.ticketPromedio) },
        { metrica: 'Pendiente de cobro (S/)', valor: toDecimal(resumen.totalPendiente) },
      ];

      const tendenciaRows = tendencia.map((item) => ({
        periodo: item.periodo,
        ventas: toDecimal(item.ventas),
        pedidos: item.pedidos,
      }));

      const canalRows = porCanal.map((item) => ({
        canal: prettify(item.canal),
        pedidos: item.pedidos,
        ventas: toDecimal(item.ventas),
      }));

      exportToXlsx({
        fileName: `ventas-${dayjs().format('YYYYMMDD-HHmm')}`,
        sheets: [
          {
            name: 'Resumen',
            columns: [
              { label: 'Métrica', dataIndex: 'metrica' },
              { label: 'Valor', dataIndex: 'valor' },
            ],
            data: resumenRows,
            columnWidths: [40, 18],
          },
          {
            name: 'Tendencia',
            columns: [
              { label: 'Periodo', dataIndex: 'periodo' },
              { label: 'Ventas (S/)', dataIndex: 'ventas' },
              { label: 'Pedidos', dataIndex: 'pedidos' },
            ],
            data: tendenciaRows,
            columnWidths: [32, 18, 18],
          },
          {
            name: 'Canales',
            columns: [
              { label: 'Canal', dataIndex: 'canal' },
              { label: 'Pedidos', dataIndex: 'pedidos' },
              { label: 'Ventas (S/)', dataIndex: 'ventas' },
            ],
            data: canalRows,
            columnWidths: [26, 16, 18],
          },
        ],
      });
      message.success('Reporte de ventas exportado');
    } catch (err) {
      message.error('No se pudo exportar el reporte de ventas');
    }
  }, [resumen, tendencia, porCanal]);
};

const usePedidosExport = ({ pedidos }) => {
  return useCallback(() => {
    if (!pedidos.length) {
      message.warning('No hay pedidos para exportar');
      return;
    }

    try {
      const sheetData = pedidos.map((pedido) => ({
        codigo: pedido.codigo,
        cliente: pedido.clienteNombre,
        fecha: pedido.creadoEnLabel,
        estado: prettify(pedido.estadoPedido),
        estadoPago: prettify(pedido.estadoPago),
        total: toDecimal(pedido.total),
        pagado: toDecimal(pedido.pagado),
        pendiente: toDecimal(pedido.pendiente),
        canal: prettify(pedido.origen),
        caja: pedido.cajaNombre,
        sede: pedido.sedeId ? String(pedido.sedeId) : 'Sin sede',
      }));

      exportToXlsx({
        fileName: `pedidos-${dayjs().format('YYYYMMDD-HHmm')}`,
        sheets: [
          {
            name: 'Pedidos',
            columns: [
              { label: 'Código', dataIndex: 'codigo' },
              { label: 'Cliente', dataIndex: 'cliente' },
              { label: 'Fecha', dataIndex: 'fecha' },
              { label: 'Estado pedido', dataIndex: 'estado' },
              { label: 'Estado pago', dataIndex: 'estadoPago' },
              { label: 'Total (S/)', dataIndex: 'total' },
              { label: 'Pagado (S/)', dataIndex: 'pagado' },
              { label: 'Pendiente (S/)', dataIndex: 'pendiente' },
              { label: 'Canal', dataIndex: 'canal' },
              { label: 'Caja', dataIndex: 'caja' },
              { label: 'Sede', dataIndex: 'sede' },
            ],
            data: sheetData,
            columnWidths: [16, 28, 24, 20, 20, 16, 16, 18, 18, 18, 16],
          },
        ],
      });
      message.success('Reporte de pedidos exportado');
    } catch (err) {
      message.error('No se pudo exportar el reporte de pedidos');
    }
  }, [pedidos]);
};

const useVentasTables = ({ tendencia, porCanal }) => {
  const tendenciaRows = useMemo(
    () =>
      tendencia.map((item) => ({
        key: item.key || item.periodo,
        periodo: item.periodo,
        ventas: toDecimal(item.ventas),
        pedidos: item.pedidos,
      })),
    [tendencia]
  );

  const canalRows = useMemo(
    () =>
      porCanal.map((item) => ({
        key: item.canal,
        canal: prettify(item.canal),
        pedidos: item.pedidos,
        ventas: toDecimal(item.ventas),
      })),
    [porCanal]
  );

  return { tendenciaRows, canalRows };
};

const usePedidosTable = ({ pedidos }) => {
  return useMemo(
    () =>
      pedidos.map((pedido) => ({
        key: pedido.id,
        codigo: pedido.codigo,
        cliente: pedido.clienteNombre,
        fecha: pedido.creadoEnLabel,
        estado: prettify(pedido.estadoPedido),
        estadoPago: prettify(pedido.estadoPago),
        total: toDecimal(pedido.total),
        pagado: toDecimal(pedido.pagado),
        pendiente: toDecimal(pedido.pendiente),
        canal: prettify(pedido.origen),
        caja: pedido.cajaNombre,
        sede: pedido.sedeId ? String(pedido.sedeId) : 'Sin sede',
      })),
    [pedidos]
  );
};

const useRetirosExport = ({ retiros }) => {
  return useCallback(() => {
    if (!retiros.length) {
      message.warning('No hay retiros registrados para exportar');
      return;
    }

    try {
      const sheetData = retiros.map((retiro) => ({
        fecha: retiro.creadoEnLabel,
        caja: retiro.cajaNombre,
        monto: toDecimal(retiro.monto),
        metodoPago: prettify(retiro.metodoPago),
        concepto: retiro.concepto || 'Sin detalle',
        comprobante: retiro.comprobante || 'Sin comprobante',
      }));

      exportToXlsx({
        fileName: `retiros-${dayjs().format('YYYYMMDD-HHmm')}`,
        sheets: [
          {
            name: 'Retiros',
            columns: [
              { label: 'Fecha', dataIndex: 'fecha' },
              { label: 'Caja', dataIndex: 'caja' },
              { label: 'Monto (S/)', dataIndex: 'monto' },
              { label: 'Método de pago', dataIndex: 'metodoPago' },
              { label: 'Concepto', dataIndex: 'concepto' },
              { label: 'Comprobante', dataIndex: 'comprobante' },
            ],
            data: sheetData,
            columnWidths: [24, 24, 18, 22, 40, 26],
          },
        ],
      });
      message.success('Reporte de retiros exportado');
    } catch (err) {
      message.error('No se pudo exportar el reporte de retiros');
    }
  }, [retiros]);
};

const useRetirosTable = ({ retiros }) => {
  return useMemo(
    () =>
      retiros.map((retiro) => ({
        key: retiro.id,
        fecha: retiro.creadoEnLabel,
        caja: retiro.cajaNombre,
        monto: toDecimal(retiro.monto),
        metodoPago: prettify(retiro.metodoPago),
        concepto: retiro.concepto || 'Sin detalle',
        comprobante: retiro.comprobante || 'Sin comprobante',
      })),
    [retiros]
  );
};

const useRetirosPorCajaTable = ({ retirosPorCaja }) => {
  return useMemo(
    () =>
      (retirosPorCaja || []).map((entry) => ({
        key: entry.cajaId,
        caja: entry.cajaNombre,
        cantidad: entry.cantidad,
        monto: toDecimal(entry.monto),
      })),
    [retirosPorCaja]
  );
};

const ReportesVentasPage = () => {
  const state = useReportesSharedState();
  const exportVentas = useVentasExport({
    resumen: state.resumen,
    tendencia: state.tendencia,
    porCanal: state.porCanal,
  });

  const { tendenciaRows, canalRows } = useVentasTables({
    tendencia: state.tendencia,
    porCanal: state.porCanal,
  });

  const isBusy = state.isLoading || state.sedesLoading;

  if (!state.tiendaId) {
    return (
      <Result
        status="warning"
        title="No se pudo identificar la tienda"
        subTitle="Inicia sesión nuevamente o selecciona una tienda para continuar"
      />
    );
  }

  if (state.isError) {
    const detail = state.error?.response?.data?.message || state.error?.message || 'No se pudieron cargar los reportes';
    return (
      <Result
        status="error"
        title="No se pudieron cargar los reportes"
        subTitle={detail}
        extra={(
          <Button icon={<IconRefresh size={16} />} onClick={state.refetch}>
            Reintentar
          </Button>
        )}
      />
    );
  }

  return (
    <Spin spinning={isBusy} tip="Cargando reportes...">
      <Space direction="vertical" size={24} style={{ width: '100%' }}>
        {state.warnings.length > 0 && (
          <Alert
            type="warning"
            showIcon
            message="Algunos datos no pudieron cargarse"
            description={state.warnings.map((warning) => (
              <div key={warning}>{warning}</div>
            ))}
          />
        )}

        <FiltersBar
          title="Reporte de ventas"
          subtitle="Montos cobrados, pendientes y tendencia"
          scopeLabel={state.scopeLabel}
          filters={state.filters}
          rangeValue={state.rangeValue}
          sedeOptions={state.sedeOptions}
          channelOptions={state.channelOptions}
          cajaOptions={state.cajaOptions}
          groupingOptions={state.groupingOptions}
          handleRangeChange={state.handleRangeChange}
          handleSedeChange={state.handleSedeChange}
          handleChannelChange={state.handleChannelChange}
          handleCajaChange={state.handleCajaChange}
          handleGroupingChange={state.handleGroupingChange}
          handleReset={state.handleReset}
          handleRefresh={state.handleRefresh}
          exportConfig={{ label: 'Exportar ventas', onExport: exportVentas }}
          sedesLoading={state.sedesLoading}
          showCajaFilter={false}
        />

        <SummaryCards resumen={state.resumen} />

        <Card title="Ventas por período">
          {tendenciaRows.length ? (
            <Table
              dataSource={tendenciaRows}
              pagination={{ pageSize: 10, showSizeChanger: false }}
              columns={[
                { title: 'Período', dataIndex: 'periodo' },
                {
                  title: 'Ventas (S/)',
                  dataIndex: 'ventas',
                  align: 'right',
                  render: (value) => formatCurrency(value),
                },
                { title: 'Pedidos', dataIndex: 'pedidos', align: 'right' },
              ]}
            />
          ) : (
            <Empty description="No encontramos ventas con los filtros actuales." />
          )}
        </Card>

        <Card title="Ventas por canal">
          {canalRows.length ? (
            <Table
              dataSource={canalRows}
              pagination={false}
              size="small"
              columns={[
                { title: 'Canal', dataIndex: 'canal' },
                { title: 'Pedidos', dataIndex: 'pedidos', align: 'right' },
                {
                  title: 'Ventas (S/)',
                  dataIndex: 'ventas',
                  align: 'right',
                  render: (value) => formatCurrency(value),
                },
              ]}
            />
          ) : (
            <Empty description="Sin información por canal." />
          )}
        </Card>
      </Space>
    </Spin>
  );
};

const ReportesPedidosPage = () => {
  const state = useReportesSharedState();
  const exportPedidos = usePedidosExport({ pedidos: state.pedidos });
  const pedidosRows = usePedidosTable({ pedidos: state.pedidos });
  const isBusy = state.isLoading || state.sedesLoading;

  if (!state.tiendaId) {
    return (
      <Result
        status="warning"
        title="No se pudo identificar la tienda"
        subTitle="Inicia sesión nuevamente o selecciona una tienda para continuar"
      />
    );
  }

  if (state.isError) {
    const detail = state.error?.response?.data?.message || state.error?.message || 'No se pudieron cargar los reportes';
    return (
      <Result
        status="error"
        title="No se pudieron cargar los reportes"
        subTitle={detail}
        extra={(
          <Button icon={<IconRefresh size={16} />} onClick={state.refetch}>
            Reintentar
          </Button>
        )}
      />
    );
  }

  return (
    <Spin spinning={isBusy} tip="Cargando reportes...">
      <Space direction="vertical" size={24} style={{ width: '100%' }}>
        {state.warnings.length > 0 && (
          <Alert
            type="warning"
            showIcon
            message="Algunos datos no pudieron cargarse"
            description={state.warnings.map((warning) => (
              <div key={warning}>{warning}</div>
            ))}
          />
        )}

        <FiltersBar
          title="Reporte de pedidos"
          subtitle="Estados de pedidos y pagos registrados"
          scopeLabel={state.scopeLabel}
          filters={state.filters}
          rangeValue={state.rangeValue}
          sedeOptions={state.sedeOptions}
          channelOptions={state.channelOptions}
          cajaOptions={state.cajaOptions}
          groupingOptions={state.groupingOptions}
          handleRangeChange={state.handleRangeChange}
          handleSedeChange={state.handleSedeChange}
          handleChannelChange={state.handleChannelChange}
          handleCajaChange={state.handleCajaChange}
          handleGroupingChange={state.handleGroupingChange}
          handleReset={state.handleReset}
          handleRefresh={state.handleRefresh}
          exportConfig={{ label: 'Exportar pedidos', onExport: exportPedidos }}
          sedesLoading={state.sedesLoading}
          showCajaFilter
        />

        <SummaryCards resumen={state.resumen} />

        <Card title="Pedidos registrados">
          {pedidosRows.length ? (
            <Table
              dataSource={pedidosRows}
              pagination={{ pageSize: 10, showSizeChanger: false }}
              columns={[
                { title: 'Código', dataIndex: 'codigo' },
                { title: 'Cliente', dataIndex: 'cliente' },
                { title: 'Fecha', dataIndex: 'fecha' },
                { title: 'Estado pedido', dataIndex: 'estado' },
                { title: 'Estado pago', dataIndex: 'estadoPago' },
                {
                  title: 'Total (S/)',
                  dataIndex: 'total',
                  align: 'right',
                  render: (value) => formatCurrency(value),
                },
                {
                  title: 'Pagado (S/)',
                  dataIndex: 'pagado',
                  align: 'right',
                  render: (value) => formatCurrency(value),
                },
                {
                  title: 'Pendiente (S/)',
                  dataIndex: 'pendiente',
                  align: 'right',
                  render: (value) => formatCurrency(value),
                },
                { title: 'Canal', dataIndex: 'canal' },
                { title: 'Caja', dataIndex: 'caja' },
                { title: 'Sede', dataIndex: 'sede' },
              ]}
            />
          ) : (
            <Empty description="No encontramos pedidos con los filtros actuales." />
          )}
        </Card>
      </Space>
    </Spin>
  );
};

const ReportesRetirosPage = () => {
  const state = useReportesSharedState();
  const exportRetiros = useRetirosExport({ retiros: state.retiros });
  const retirosRows = useRetirosTable({ retiros: state.retiros });
  const retirosPorCajaRows = useRetirosPorCajaTable({ retirosPorCaja: state.retirosPorCaja });
  const isBusy = state.isLoading || state.sedesLoading;

  if (!state.tiendaId) {
    return (
      <Result
        status="warning"
        title="No se pudo identificar la tienda"
        subTitle="Inicia sesión nuevamente o selecciona una tienda para continuar"
      />
    );
  }

  if (state.isError) {
    const detail = state.error?.response?.data?.message || state.error?.message || 'No se pudieron cargar los reportes';
    return (
      <Result
        status="error"
        title="No se pudieron cargar los reportes"
        subTitle={detail}
        extra={(
          <Button icon={<IconRefresh size={16} />} onClick={state.refetch}>
            Reintentar
          </Button>
        )}
      />
    );
  }

  return (
    <Spin spinning={isBusy} tip="Cargando reportes...">
      <Space direction="vertical" size={24} style={{ width: '100%' }}>
        {state.warnings.length > 0 && (
          <Alert
            type="warning"
            showIcon
            message="Algunos datos no pudieron cargarse"
            description={state.warnings.map((warning) => (
              <div key={warning}>{warning}</div>
            ))}
          />
        )}

        <FiltersBar
          title="Reporte de retiros"
          subtitle="Movimientos de efectivo extraído de caja"
          scopeLabel={state.scopeLabel}
          filters={state.filters}
          rangeValue={state.rangeValue}
          sedeOptions={state.sedeOptions}
          channelOptions={state.channelOptions}
          cajaOptions={state.cajaOptions}
          groupingOptions={state.groupingOptions}
          handleRangeChange={state.handleRangeChange}
          handleSedeChange={state.handleSedeChange}
          handleChannelChange={state.handleChannelChange}
          handleCajaChange={state.handleCajaChange}
          handleGroupingChange={state.handleGroupingChange}
          handleReset={state.handleReset}
          handleRefresh={state.handleRefresh}
          exportConfig={{ label: 'Exportar retiros', onExport: exportRetiros }}
          sedesLoading={state.sedesLoading}
          showCajaFilter
          showChannelFilter={false}
          showGroupingFilter={false}
        />

        <SummaryCards resumen={state.resumen} />

        <Card title="Retiros registrados">
          {retirosRows.length ? (
            <Table
              dataSource={retirosRows}
              pagination={{ pageSize: 10, showSizeChanger: false }}
              columns={[
                { title: 'Fecha', dataIndex: 'fecha' },
                { title: 'Caja', dataIndex: 'caja' },
                {
                  title: 'Monto (S/)',
                  dataIndex: 'monto',
                  align: 'right',
                  render: (value) => formatCurrency(value),
                },
                { title: 'Método de pago', dataIndex: 'metodoPago' },
                { title: 'Concepto', dataIndex: 'concepto' },
                { title: 'Comprobante', dataIndex: 'comprobante' },
              ]}
            />
          ) : (
            <Empty description="No encontramos retiros con los filtros actuales." />
          )}
        </Card>

        <Card title="Retiros por caja">
          {retirosPorCajaRows.length ? (
            <Table
              dataSource={retirosPorCajaRows}
              pagination={false}
              size="small"
              columns={[
                { title: 'Caja', dataIndex: 'caja' },
                { title: 'Retiros', dataIndex: 'cantidad', align: 'right' },
                {
                  title: 'Monto total (S/)',
                  dataIndex: 'monto',
                  align: 'right',
                  render: (value) => formatCurrency(value),
                },
              ]}
            />
          ) : (
            <Empty description="Sin retiros agrupados." />
          )}
        </Card>
      </Space>
    </Spin>
  );
};

export { ReportesVentasPage, ReportesPedidosPage, ReportesRetirosPage };

export default ReportesVentasPage;
