import { useState, useMemo } from 'react';
import { Button, Card, Empty, Result, Space, Table, Tag, Typography, Input, Select, Badge } from 'antd';
import { IconEdit, IconSearch } from '@tabler/icons-react';

const { Text, Title } = Typography;
const DECIMAL_UNITS = ['KG', 'KILOGRAMOS', 'KILOGRAMO', 'L', 'LT', 'LTS', 'LITROS'];

const needsDecimals = (unidadMedida) => DECIMAL_UNITS.includes((unidadMedida ?? '').toUpperCase());

const formatCantidad = (cantidad, unidadMedida) => {
  const rawValue = Number(cantidad ?? 0);
  const precision = needsDecimals(unidadMedida) ? 3 : 0;
  const formatted = Number.isFinite(rawValue)
    ? rawValue.toLocaleString('es-PE', {
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
      })
    : '0';
  return `${formatted} ${unidadMedida ?? ''}`.trim();
};

const getBadgeStatus = (estadoStock) => {
  switch (estadoStock) {
    case 'OK': return 'success';
    case 'BAJO_STOCK': return 'warning';
    case 'CRITICO': return 'error';
    default: return 'default';
  }
};

const getEstadoLabel = (estadoStock) => {
  switch (estadoStock) {
    case 'OK': return 'OK';
    case 'BAJO_STOCK': return 'Bajo Stock';
    case 'CRITICO': return 'Crítico';
    case 'SIN_CONFIGURAR': return 'Sin Config';
    default: return '-';
  }
};

const InventarioInsumosTableView = ({ insumos, loading, isError, onRetry, onAdjust, sedeId }) => {
  const [searchText, setSearchText] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState(null);

  const insumosFiltrados = useMemo(() => {
    let resultado = [...insumos];

    // Filtro por búsqueda
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      resultado = resultado.filter(
        (item) =>
          item.nombreInsumo?.toLowerCase().includes(searchLower) ||
          item.codigoInterno?.toLowerCase().includes(searchLower)
      );
    }

    // Filtro por estado de stock
    if (estadoFiltro) {
      resultado = resultado.filter((item) => item.estadoStock === estadoFiltro);
    }

    return resultado;
  }, [insumos, searchText, estadoFiltro]);

  if (!sedeId) {
    return (
      <Card styles={{ body: { padding: 24 } }}>
        <Title level={4} style={{ marginBottom: 8 }}>
          Inventario de insumos
        </Title>
        <Text type="secondary">Selecciona una sede para consultar existencias de materia prima.</Text>
        <div style={{ marginTop: 40 }}>
          <Empty description="Selecciona una sede arriba" />
        </div>
      </Card>
    );
  }

  if (isError) {
    return (
      <Result
        status="error"
        title="No se pudo cargar el inventario"
        subTitle="Intenta refrescar o cambia de sede"
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
      title: 'Insumo',
      dataIndex: 'nombreInsumo',
      key: 'insumo',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{record.nombreInsumo}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Código: {record.codigoInterno ?? 'N/D'}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Unidad',
      dataIndex: 'unidadMedida',
      key: 'unidad',
      width: 100,
      render: (unidad) => (
        <Tag color="blue" style={{ marginRight: 0 }}>
          {unidad ?? 'N/D'}
        </Tag>
      ),
    },
    {
      title: 'Stock',
      dataIndex: 'cantidadActual',
      key: 'stock',
      width: 200,
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Space size={8}>
            <Badge status={getBadgeStatus(record.estadoStock)} />
            <Text strong style={{ fontSize: 15 }}>
              {formatCantidad(record.cantidadActual, record.unidadMedida)}
            </Text>
          </Space>
          {record.stockMinimo > 0 && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              Mínimo: {formatCantidad(record.stockMinimo, record.unidadMedida)}
            </Text>
          )}
        </Space>
      ),
    },
    {
      title: 'Estado',
      dataIndex: 'estadoStock',
      key: 'estado',
      width: 120,
      render: (estado) => (
        <Tag color={
          estado === 'OK' ? 'success' :
          estado === 'BAJO_STOCK' ? 'warning' :
          estado === 'CRITICO' ? 'error' : 'default'
        }>
          {getEstadoLabel(estado)}
        </Tag>
      ),
    },
    {
      title: 'Ubicación',
      dataIndex: 'ubicacionFisica',
      key: 'ubicacion',
      render: (ubicacion) => ubicacion || 'Sin ubicación',
    },
    {
      title: 'Acciones',
      key: 'acciones',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Button type="link" icon={<IconEdit size={16} />} onClick={() => onAdjust(record)}>
          Ajustar
        </Button>
      ),
    },
  ];

  return (
    <Card styles={{ body: { padding: 24 } }}>
      <div style={{ marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0, marginBottom: 8 }}>
          Inventario de insumos
        </Title>
        <Text type="secondary">
          Ajusta cantidades en kilos, litros o unidades con precisión de tres decimales.
        </Text>
      </div>

      <Space 
        style={{ 
          marginBottom: 16, 
          width: '100%',
          flexWrap: 'wrap'
        }} 
        size={12}
      >
        <Input
          placeholder="Buscar por nombre o código"
          prefix={<IconSearch size={16} />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 280 }}
          allowClear
        />
        <Select
          placeholder="Filtrar por estado"
          value={estadoFiltro}
          onChange={setEstadoFiltro}
          style={{ width: 160 }}
          allowClear
          options={[
            { label: '✓ OK', value: 'OK' },
            { label: '⚠ Bajo Stock', value: 'BAJO_STOCK' },
            { label: '⚠ Crítico', value: 'CRITICO' },
            { label: 'Sin Configurar', value: 'SIN_CONFIGURAR' },
          ]}
        />
        <Text type="secondary" style={{ marginLeft: 'auto' }}>
          {insumosFiltrados.length} de {insumos.length} insumos
        </Text>
      </Space>

      <Table
        rowKey="id"
        dataSource={insumosFiltrados}
        columns={columns}
        loading={loading}
        pagination={{ 
          pageSize: 10, 
          showSizeChanger: true,
          showTotal: (total) => `Total: ${total} insumos`
        }}
        locale={{ emptyText: 'No hay insumos que coincidan con los filtros' }}
        scroll={{ x: 1000 }}
      />
    </Card>
  );
};

export default InventarioInsumosTableView;
