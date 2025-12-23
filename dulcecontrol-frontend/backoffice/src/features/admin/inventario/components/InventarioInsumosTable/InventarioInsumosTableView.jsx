import { useState, useMemo } from 'react';
import { Button, Card, Empty, Result, Space, Table, Tag, Typography, Input, Select, Badge, theme, App, Switch } from 'antd';
import { IconEdit, IconSearch, IconPlus, IconMapPin, IconCheck, IconX, IconTrash, IconRefresh } from '@tabler/icons-react';

const { Text, Title } = Typography;
const DECIMAL_UNITS = ['KG', 'KILOGRAMOS', 'KILOGRAMO', 'L', 'LT', 'LTS', 'LITROS'];

const needsDecimals = (unidadMedida) => DECIMAL_UNITS.includes((unidadMedida ?? '').toUpperCase());

const formatCantidad = (cantidad, unidadMedida) => {
  const rawValue = Number(cantidad ?? 0);
  const usesDecimals = needsDecimals(unidadMedida);
  const formatted = Number.isFinite(rawValue)
    ? rawValue.toLocaleString('es-PE', {
        minimumFractionDigits: usesDecimals ? 1 : 0,
        maximumFractionDigits: usesDecimals ? 2 : 0,
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

const InventarioInsumosTableView = ({ insumos, loading, isError, onRetry, onAdjust, onAgregar, onUpdateUbicacion, onDelete, onReactivar, sedeId }) => {
  const { token } = theme.useToken();
  const { message, modal } = App.useApp();
  const [searchText, setSearchText] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState(null);
  const [mostrarInactivos, setMostrarInactivos] = useState(false);
  const [editingUbicacionId, setEditingUbicacionId] = useState(null);
  const [tempUbicacion, setTempUbicacion] = useState('');

  const handleEditUbicacion = (record) => {
    setEditingUbicacionId(record.id);
    setTempUbicacion(record.ubicacionFisica || '');
  };

  const handleSaveUbicacion = async (record) => {
    if (!onUpdateUbicacion) {
      message.error('No se puede actualizar la ubicación');
      return;
    }
    const success = await onUpdateUbicacion(record.id, tempUbicacion.trim() || null);
    if (success) {
      setEditingUbicacionId(null);
      setTempUbicacion('');
    }
  };

  const handleCancelUbicacion = () => {
    setEditingUbicacionId(null);
    setTempUbicacion('');
  };

  const insumosFiltrados = useMemo(() => {
    let resultado = [...insumos];

    // Filtro por activo/inactivo
    if (!mostrarInactivos) {
      resultado = resultado.filter((item) => item.activo !== false);
    }

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
  }, [insumos, searchText, estadoFiltro, mostrarInactivos]);

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
          <Space size={4}>
            <Text strong>{record.nombreInsumo}</Text>
            {record.activo === false && (
              <Tag color="default">Inactivo</Tag>
            )}
          </Space>
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
      width: 200,
      render: (ubicacion, record) => {
        const isEditing = editingUbicacionId === record.id;
        
        if (isEditing) {
          return (
            <Space.Compact style={{ width: '100%' }}>
              <Input
                size="small"
                value={tempUbicacion}
                onChange={(e) => setTempUbicacion(e.target.value)}
                placeholder="Ej: Estante A1"
                autoFocus
                onPressEnter={() => handleSaveUbicacion(record)}
                maxLength={100}
              />
              <Button
                size="small"
                type="primary"
                icon={<IconCheck size={14} />}
                onClick={() => handleSaveUbicacion(record)}
              />
              <Button
                size="small"
                icon={<IconX size={14} />}
                onClick={handleCancelUbicacion}
              />
            </Space.Compact>
          );
        }
        
        return (
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <Space size={4}>
              <IconMapPin size={14} style={{ color: token.colorTextTertiary }} />
              {ubicacion ? (
                <Text>{ubicacion}</Text>
              ) : (
                <Text type="secondary" italic>Sin ubicación</Text>
              )}
            </Space>
            <Button
              type="text"
              size="small"
              icon={<IconEdit size={14} />}
              onClick={() => handleEditUbicacion(record)}
            />
          </Space>
        );
      },
    },
    {
      title: 'Acciones',
      key: 'acciones',
      width: 150,
      fixed: 'right',
      render: (_, record) => {
        // Si está inactivo, solo mostrar botón de reactivar
        if (record.activo === false) {
          return (
            <Button
              type="primary"
              size="small"
              icon={<IconRefresh size={16} />}
              onClick={() => onReactivar(record.insumoId)}
            >
              Reactivar
            </Button>
          );
        }

        // Si está activo, mostrar botones normales
        return (
          <Space size="small">
            <Button type="link" size="small" icon={<IconEdit size={16} />} onClick={() => onAdjust(record)}>
              Ajustar
            </Button>
            {onDelete && (
              <Button
                type="link"
                size="small"
                danger
                icon={<IconTrash size={16} />}
                onClick={() => {
                  modal.confirm({
                    title: '¿Eliminar insumo?',
                    content: `Se eliminará "${record.nombreInsumo}" del catálogo. Solo se permite si no tiene recetas, órdenes de compra o movimientos asociados.`,
                    okText: 'Eliminar',
                    okType: 'danger',
                    cancelText: 'Cancelar',
                    onOk: () => onDelete(record.insumoId),
                  });
                }}
              />
            )}
          </Space>
        );
      },
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
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }} 
        size={12}
      >
        <Space size={12} style={{ flexWrap: 'wrap' }}>
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
            style={{ width: 200 }}
            allowClear
            value={estadoFiltro}
            onChange={setEstadoFiltro}
          >
            <Select.Option value="OK">OK</Select.Option>
            <Select.Option value="BAJO_STOCK">Bajo Stock</Select.Option>
            <Select.Option value="CRITICO">Crítico</Select.Option>
            <Select.Option value="SIN_CONFIGURAR">Sin Configurar</Select.Option>
          </Select>
          <Space size={8} style={{ paddingLeft: 8 }}>
            <Switch
              checked={mostrarInactivos}
              onChange={setMostrarInactivos}
              size="small"
            />
            <Text type="secondary">Mostrar inactivos</Text>
          </Space>
        </Space>
        <Button type="primary" icon={<IconPlus size={16} />} onClick={onAgregar}>
          Agregar insumo
        </Button>
      </Space>

      <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'flex-end' }}>
        <Text type="secondary">
          {insumosFiltrados.length} de {insumos.length} insumos
        </Text>
      </div>

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
