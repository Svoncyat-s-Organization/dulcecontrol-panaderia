import dayjs from 'dayjs';
import { useState, useMemo } from 'react';
import { Button, Card, DatePicker, Empty, Input, Result, Select, Space, Table, Tag, Typography, message } from 'antd';
import { IconArrowDownRight, IconArrowUpRight, IconDownload, IconRepeat, IconSearch } from '@tabler/icons-react';

const { Text, Title } = Typography;
const { RangePicker } = DatePicker;

const DECIMAL_UNITS = ['KG', 'KILOGRAMOS', 'KILOGRAMO', 'L', 'LT', 'LTS', 'LITROS'];
const needsDecimals = (unidadMedida) => DECIMAL_UNITS.includes((unidadMedida ?? '').toUpperCase());

const TIPO_CONFIG = {
  ENTRADA: { color: 'green', icon: <IconArrowUpRight size={14} />, label: 'Entrada' },
  SALIDA: { color: 'red', icon: <IconArrowDownRight size={14} />, label: 'Salida' },
  entrada: { color: 'green', icon: <IconArrowUpRight size={14} />, label: 'Entrada' },
  salida: { color: 'red', icon: <IconArrowDownRight size={14} />, label: 'Salida' },
};

// Para insumos motivo es TEXT libre, mostramos colores por palabras clave
const getMotivoColor = (motivo) => {
  if (!motivo) return 'default';
  const text = motivo.toLowerCase();
  if (text.includes('compra') || text.includes('recepción')) return 'green';
  if (text.includes('producción') || text.includes('consumo')) return 'blue';
  if (text.includes('transferencia')) return 'purple';
  if (text.includes('merma') || text.includes('caducidad')) return 'red';
  if (text.includes('ajuste')) return 'orange';
  if (text.includes('devolución') || text.includes('devolucion')) return 'cyan';
  return 'default';
};

const formatFecha = (value) => {
  const fecha = dayjs(value);
  return fecha.isValid() ? fecha.format('DD/MM/YYYY HH:mm') : '—';
};

const formatCantidad = (cantidad, unidad) => {
  const valor = Number(cantidad ?? 0);
  const usesDecimals = needsDecimals(unidad);
  const formatted = Number.isFinite(valor)
    ? valor.toLocaleString('es-PE', { 
        minimumFractionDigits: usesDecimals ? 1 : 0, 
        maximumFractionDigits: usesDecimals ? 2 : 0 
      })
    : usesDecimals ? '0.0' : '0';
  return `${formatted} ${unidad ?? ''}`.trim();
};

const escapeCsvValue = (value) => {
  const raw = value === undefined || value === null ? '' : String(value);
  const escaped = raw.replace(/\r?\n/g, ' ').replace(/"/g, '""');
  return `"${escaped}"`;
};

const downloadCsv = (filename, rows) => {
  const csv = rows.map((row) => row.map(escapeCsvValue).join(',')).join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

const MovimientosInsumosTableView = ({ movimientos, loading, isError, sedeId, onRetry }) => {
  // Filtros avanzados
  const [dateRange, setDateRange] = useState([null, null]);
  const [tipoFiltro, setTipoFiltro] = useState(null);
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

      // Búsqueda por insumo o responsable
      if (busqueda) {
        const search = busqueda.toLowerCase();
        const matchInsumo = mov.nombreInsumo?.toLowerCase().includes(search);
        const matchCodigo = mov.codigoInterno?.toLowerCase().includes(search);
        const matchResponsable = mov.usuarioResponsable?.toLowerCase().includes(search);
        if (!matchInsumo && !matchCodigo && !matchResponsable) return false;
      }

      return true;
    });
  }, [movimientos, dateRange, tipoFiltro, busqueda]);

  if (!sedeId) {
    return (
      <Card styles={{ body: { padding: 24 } }}>
        <Title level={4} style={{ marginBottom: 8 }}>
          Kardex de insumos
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
        title="No se pudo cargar el kardex de insumos"
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
      title: 'Insumo',
      key: 'insumo',
      render: (_, record) => (
        <Space orientation="vertical" size={0}>
          <Text strong>{record.nombreInsumo}</Text>
          <Text type="secondary">Código: {record.codigoInterno ?? 'N/D'}</Text>
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
      width: 200,
      render: (motivo) => (
        <Tag color={getMotivoColor(motivo)}>
          {motivo ?? 'N/D'}
        </Tag>
      ),
    },
    {
      title: 'Saldo Anterior',
      dataIndex: 'cantidadAnterior',
      key: 'saldoAnterior',
      width: 140,
      align: 'right',
      render: (val, record) => (
        <Text type="secondary">{formatCantidad(val, record.unidadMedida)}</Text>
      ),
    },
    {
      title: 'Movimiento',
      key: 'cantidad',
      width: 160,
      align: 'right',
      render: (_, record) => {
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
            {formatCantidad(record.cantidad, record.unidadMedida)}
          </Text>
        );
      },
    },
    {
      title: 'Saldo Posterior',
      dataIndex: 'cantidadPosterior',
      key: 'saldoPosterior',
      width: 140,
      align: 'right',
      render: (val, record) => (
        <Text strong>{formatCantidad(val, record.unidadMedida)}</Text>
      ),
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
          Kardex de insumos
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
        <Input
          placeholder="Buscar por insumo, código o responsable"
          prefix={<IconSearch size={16} />}
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{ width: 280 }}
          allowClear
        />
        <Select
          placeholder="Tipo de movimiento"
          style={{ width: 180 }}
          options={[
            { label: 'Entrada', value: 'ENTRADA' },
            { label: 'Salida', value: 'SALIDA' },
          ]}
          onChange={setTipoFiltro}
          allowClear
        />
        <Button
          icon={<IconDownload size={16} />}
          onClick={() => {
            if (!movimientosFiltrados.length) {
              message.info('No hay movimientos para exportar');
              return;
            }
            const timestamp = dayjs().format('YYYYMMDD_HHmm');
            const filename = `kardex_insumos_sede_${sedeId}_${timestamp}.csv`;
            const rows = [
              ['fecha', 'insumo', 'codigo', 'tipo', 'motivo', 'saldo_anterior', 'movimiento', 'saldo_posterior', 'unidad', 'responsable'],
              ...movimientosFiltrados.map((mov) => [
                formatFecha(mov.creadoEn),
                mov.nombreInsumo ?? '',
                mov.codigoInterno ?? '',
                mov.tipoMovimiento ?? '',
                mov.motivo ?? '',
                mov.cantidadAnterior ?? 0,
                mov.cantidad ?? 0,
                mov.cantidadPosterior ?? 0,
                mov.unidadMedida ?? '',
                mov.usuarioResponsable ?? '',
              ]),
            ];
            downloadCsv(filename, rows);
          }}
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

export default MovimientosInsumosTableView;
