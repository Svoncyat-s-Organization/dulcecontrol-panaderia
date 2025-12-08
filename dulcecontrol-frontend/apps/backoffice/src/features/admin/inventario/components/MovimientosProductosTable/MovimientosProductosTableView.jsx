import dayjs from 'dayjs';
import { useState, useMemo } from 'react';
import { Button, Card, DatePicker, Empty, Result, Select, Space, Table, Tag, Typography } from 'antd';
import { IconArrowDownRight, IconArrowUpRight, IconDownload, IconRepeat } from '@tabler/icons-react';

const { Text, Title } = Typography;
const { RangePicker } = DatePicker;

const TIPO_CONFIG = {
  ENTRADA: { color: 'green', icon: <IconArrowUpRight size={14} />, label: 'Entrada' },
  SALIDA: { color: 'red', icon: <IconArrowDownRight size={14} />, label: 'Salida' },
  entrada: { color: 'green', icon: <IconArrowUpRight size={14} />, label: 'Entrada' },
  salida: { color: 'red', icon: <IconArrowDownRight size={14} />, label: 'Salida' },
};

const MOTIVO_CONFIG = {
  PRODUCCION: { color: 'cyan' },
  VENTA: { color: 'geekblue' },
  MERMA: { color: 'red' },
  AJUSTE: { color: 'orange', icon: <IconRepeat size={14} /> },
  TRANSFERENCIA: { color: 'purple' },
  DEVOLUCION: { color: 'green' },
};

const formatFecha = (value) => {
  const fecha = dayjs(value);
  return fecha.isValid() ? fecha.format('DD/MM/YYYY HH:mm') : '—';
};

const MovimientosProductosTableView = ({ movimientos, loading, isError, sedeId, onRetry }) => {
  // Filtros avanzados
  const [dateRange, setDateRange] = useState([null, null]);
  const [tipoFiltro, setTipoFiltro] = useState(null);
  const [motivoFiltro, setMotivoFiltro] = useState(null);
  const [busqueda, setBusqueda] = useState('');

  // Aplicar filtros
  const movimientosFiltrados = useMemo(() => {
    if (!movimientos) return [];

    return movimientos.filter((mov) => {
      // Filtro de fecha
      if (dateRange[0] && dateRange[1]) {
        const fecha = dayjs(mov.creadoEn);
        if (!fecha.isBetween(dateRange[0], dateRange[1], 'day', '[]')) return false;
      }

      // Filtro de tipo
      if (tipoFiltro && mov.tipoMovimiento !== tipoFiltro) return false;

      // Filtro de motivo
      if (motivoFiltro && mov.motivo !== motivoFiltro) return false;

      // Búsqueda por producto o responsable
      if (busqueda) {
        const search = busqueda.toLowerCase();
        const matchProducto = mov.nombreProducto?.toLowerCase().includes(search);
        const matchSku = mov.sku?.toLowerCase().includes(search);
        const matchResponsable = mov.usuarioResponsable?.toLowerCase().includes(search);
        if (!matchProducto && !matchSku && !matchResponsable) return false;
      }

      return true;
    });
  }, [movimientos, dateRange, tipoFiltro, motivoFiltro, busqueda]);

  if (!sedeId) {
    return (
      <Card styles={{ body: { padding: 24 } }}>
        <Title level={4} style={{ marginBottom: 8 }}>
          Kardex de productos
        </Title>
        <Text type="secondary">Selecciona una sede para ver el historial.</Text>
        <div style={{ marginTop: 40 }}>
          <Empty description="Selecciona una sede para ver el historial" />
        </div>
      </Card>
    );
  }

  if (isError) {
    return (
      <Result
        status="error"
        title="No se pudo cargar el kardex de productos"
        subTitle="Intenta nuevamente o elige otra sede"
        extra={
          <Button type="primary" onClick={onRetry}>
            Reintentar
          </Button>
        }
      />
    );
  }

  const columns = [
    {
      title: 'Fecha',
      dataIndex: 'creadoEn',
      key: 'fecha',
      width: 180,
      render: (value) => formatFecha(value),
    },
    {
      title: 'Producto',
      key: 'producto',
      render: (_, record) => (
        <Space orientation="vertical" size={0}>
          <Text strong>{record.nombreProducto}</Text>
          <Text type="secondary">SKU: {record.sku ?? 'N/D'}</Text>
        </Space>
      ),
    },
    {
      title: 'Tipo',
      dataIndex: 'tipoMovimiento',
      key: 'tipo',
      width: 120,
      render: (tipo) => {
        const config = TIPO_CONFIG[tipo] ?? { color: 'default', label: tipo };
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.label ?? tipo}
          </Tag>
        );
      },
    },
    {
      title: 'Motivo',
      dataIndex: 'motivo',
      key: 'motivo',
      width: 160,
      render: (motivo) => {
        const config = MOTIVO_CONFIG[motivo] ?? {};
        return (
          <Tag color={config.color} icon={config.icon}>
            {motivo ?? 'N/D'}
          </Tag>
        );
      },
    },
    {
      title: 'Saldo Anterior',
      dataIndex: 'cantidadAnterior',
      key: 'saldoAnterior',
      width: 120,
      align: 'right',
      render: (val) => <Text type="secondary">{val ?? 0}</Text>,
    },
    {
      title: 'Movimiento',
      dataIndex: 'cantidad',
      key: 'cantidad',
      width: 120,
      align: 'right',
      render: (val, record) => {
        const tipo = (record.tipoMovimiento || '').toLowerCase();
        const esEntrada = tipo === 'entrada';
        return (
          <Text
            strong
            style={{
              color: esEntrada ? '#52c41a' : '#ff4d4f',
            }}
          >
            {esEntrada ? '+' : '-'}
            {Number(val ?? 0)}
          </Text>
        );
      },
    },
    {
      title: 'Saldo Posterior',
      dataIndex: 'cantidadPosterior',
      key: 'saldoPosterior',
      width: 120,
      align: 'right',
      render: (val) => <Text strong>{val ?? 0}</Text>,
    },
    {
      title: 'Responsable',
      dataIndex: 'usuarioResponsable',
      key: 'responsable',
      render: (usuario) => usuario ?? '—',
    },
  ];

  return (
    <Card styles={{ body: { padding: 24 } }}>
      <div style={{ marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0, marginBottom: 4 }}>
          Kardex de productos
        </Title>
        <Text type="secondary">Movimientos recientes en la sede {sedeId}</Text>
      </div>

      {/* Filtros avanzados */}
      <Space wrap style={{ marginBottom: 16 }}>
        <RangePicker
          format="DD/MM/YYYY"
          placeholder={['Fecha inicio', 'Fecha fin']}
          onChange={setDateRange}
        />
        <Select
          placeholder="Tipo de movimiento"
          style={{ width: 180 }}
          options={[
            { label: 'Entrada', value: 'entrada' },
            { label: 'Salida', value: 'salida' },
          ]}
          onChange={setTipoFiltro}
          allowClear
        />
        <Select
          placeholder="Motivo"
          style={{ width: 160 }}
          options={[
            { label: 'Producción', value: 'PRODUCCION' },
            { label: 'Venta', value: 'VENTA' },
            { label: 'Merma', value: 'MERMA' },
            { label: 'Ajuste', value: 'AJUSTE' },
            { label: 'Transferencia', value: 'TRANSFERENCIA' },
            { label: 'Devolución', value: 'DEVOLUCION' },
          ]}
          onChange={setMotivoFiltro}
          allowClear
        />
        <Button
          icon={<IconDownload size={16} />}
          onClick={() => alert('Exportación en desarrollo')}
        >
          Exportar
        </Button>
      </Space>

      <Table
        rowKey="id"
        dataSource={movimientosFiltrados}
        columns={columns}
        loading={loading}
        pagination={{ pageSize: 10, showSizeChanger: false }}
        locale={{ emptyText: 'Sin movimientos registrados' }}
      />
    </Card>
  );
};

export default MovimientosProductosTableView;
