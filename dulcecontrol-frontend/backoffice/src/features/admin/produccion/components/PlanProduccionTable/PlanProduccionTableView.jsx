import { Alert, Button, Card, Col, DatePicker, Dropdown, Input, Progress, Result, Row, Select, Space, Table, Tag, Typography } from 'antd';
import {
  IconRefresh,
  IconEye,
  IconCheck,
  IconPlayerPlay,
  IconPlayerStop,
  IconX,
  IconDotsVertical,
  IconAlertTriangle,
  IconSearch,
  IconFilter,
  IconFilterOff,
} from '@tabler/icons-react';
import dayjs from 'dayjs';
import {
  ESTADO_PLAN_CONFIG,
  ORIGEN_ITEM_CONFIG,
} from '../../constants/planProduccionConstants.js';
import {
  getFechaLabel,
  calcularProgresoPlan,
  calcularTotalesPlan,
} from '../../utils/planProduccionMappers.js';

const { Text } = Typography;

const PlanProduccionTableView = ({
  planes,
  loading,
  isError,
  onRetry,
  onVerDetalle,
  onConfirmar,
  onIniciar,
  onFinalizar,
  onCancelar,
  sedeId,
  updating,
  filtroEstado,
  setFiltroEstado,
  filtroFecha,
  setFiltroFecha,
  filtroBusqueda,
  setFiltroBusqueda,
  onLimpiarFiltros,
  totalPlanes,
}) => {
  const hayFiltrosActivos = filtroEstado || filtroFecha || filtroBusqueda.trim();
  if (!sedeId) {
    return (
      <Alert
        type="warning"
        message="Selecciona una sede"
        description="Para ver los planes de producción, primero selecciona una sede desde el menú superior."
        showIcon
        icon={<IconAlertTriangle size={20} />}
      />
    );
  }

  if (isError) {
    return (
      <Result
        status="error"
        title="No se pudieron cargar los planes"
        subTitle="Intenta nuevamente más tarde"
        extra={
          <Button icon={<IconRefresh size={16} />} onClick={onRetry}>
            Reintentar
          </Button>
        }
      />
    );
  }

  const getActionMenu = (plan) => {
    const items = [];

    if (plan.estado === 'BORRADOR') {
      items.push({
        key: 'confirmar',
        label: 'Confirmar Plan',
        icon: <IconCheck size={16} />,
        onClick: () => onConfirmar(plan),
      });
      items.push({
        key: 'cancelar',
        label: 'Cancelar',
        icon: <IconX size={16} />,
        danger: true,
        onClick: () => onCancelar(plan),
      });
    }

    if (plan.estado === 'CONFIRMADO') {
      items.push({
        key: 'iniciar',
        label: 'Iniciar Producción',
        icon: <IconPlayerPlay size={16} />,
        onClick: () => onIniciar(plan),
      });
    }

    if (plan.estado === 'EN_PROCESO') {
      items.push({
        key: 'finalizar',
        label: 'Finalizar',
        icon: <IconPlayerStop size={16} />,
        onClick: () => onFinalizar(plan),
      });
    }

    return { items };
  };

  const columns = [
    {
      title: 'Fecha',
      dataIndex: 'fechaProduccion',
      key: 'fechaProduccion',
      width: 140,
      render: (fecha) => (
        <Space direction="vertical" size={0}>
          <Text strong>{getFechaLabel(fecha)}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {fecha}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
      width: 140,
      render: (estado) => {
        const config = ESTADO_PLAN_CONFIG[estado] || {};
        return (
          <Tag color={config.color} style={{ margin: 0 }}>
            {config.label || estado}
          </Tag>
        );
      },
    },
    {
      title: 'Items',
      key: 'items',
      width: 200,
      render: (_, plan) => {
        const detalles = plan.detalles || [];
        const stock = detalles.filter(d => d.origen === 'STOCK_DIARIO').length;
        const pedidos = detalles.filter(d => d.origen === 'PEDIDO_CLIENTE').length;
        
        return (
          <Space size={8}>
            {stock > 0 && (
              <Tag color={ORIGEN_ITEM_CONFIG.STOCK_DIARIO.color} style={{ margin: 0 }}>
                {ORIGEN_ITEM_CONFIG.STOCK_DIARIO.icon} {stock}
              </Tag>
            )}
            {pedidos > 0 && (
              <Tag color={ORIGEN_ITEM_CONFIG.PEDIDO_CLIENTE.color} style={{ margin: 0 }}>
                {ORIGEN_ITEM_CONFIG.PEDIDO_CLIENTE.icon} {pedidos}
              </Tag>
            )}
          </Space>
        );
      },
    },
    {
      title: 'Progreso',
      key: 'progreso',
      width: 180,
      render: (_, plan) => {
        const detalles = plan.detalles || [];
        if (!detalles.length) return <Text type="secondary">Sin items</Text>;
        
        const progreso = calcularProgresoPlan(detalles);
        return (
          <Progress
            percent={progreso}
            size="small"
            status={progreso === 100 ? 'success' : 'active'}
          />
        );
      },
    },
    {
      title: 'Totales',
      key: 'totales',
      width: 200,
      render: (_, plan) => {
        const totales = calcularTotalesPlan(plan.detalles || []);
        
        return (
          <Space direction="vertical" size={2}>
            <Text style={{ fontSize: 12 }}>
              Planificado: <Text strong>{totales.planificado}</Text>
            </Text>
            <Text style={{ fontSize: 12 }}>
              Producido: <Text strong type="success">{totales.producido}</Text>
            </Text>
          </Space>
        );
      },
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: 150,
      fixed: 'right',
      render: (_, plan) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<IconEye size={16} />}
            onClick={() => onVerDetalle(plan)}
          >
            Ver Detalle
          </Button>
          <Dropdown menu={getActionMenu(plan)} trigger={['click']} disabled={updating}>
            <Button type="text" size="small" icon={<IconDotsVertical size={16} />} />
          </Dropdown>
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Alert
          type="info"
          message="Planes de Producción"
          description="Gestiona los planes diarios. Los planes en BORRADOR requieren confirmación. Solo los planes CONFIRMADOS pueden iniciarse."
          showIcon
        />

        {/* Filtros de búsqueda */}
        <Card size="small" title={<Space><IconFilter size={16} /> Filtros de Búsqueda</Space>}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={6}>
              <Input
                placeholder="Buscar por producto..."
                prefix={<IconSearch size={16} />}
                value={filtroBusqueda}
                onChange={(e) => setFiltroBusqueda(e.target.value)}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={5}>
              <Select
                placeholder="Estado"
                value={filtroEstado}
                onChange={setFiltroEstado}
                allowClear
                style={{ width: '100%' }}
              >
                {Object.entries(ESTADO_PLAN_CONFIG).map(([key, config]) => (
                  <Select.Option key={key} value={key}>
                    <Tag color={config.color} style={{ margin: 0 }}>{config.label}</Tag>
                  </Select.Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={5}>
              <DatePicker
                placeholder="Fecha de producción"
                value={filtroFecha ? dayjs(filtroFecha) : null}
                onChange={(date) => setFiltroFecha(date ? date.format('YYYY-MM-DD') : null)}
                style={{ width: '100%' }}
                format="DD/MM/YYYY"
              />
            </Col>
            <Col xs={24} sm={12} md={4}>
              {hayFiltrosActivos && (
                <Button
                  icon={<IconFilterOff size={16} />}
                  onClick={onLimpiarFiltros}
                >
                  Limpiar
                </Button>
              )}
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Mostrando {planes.length} de {totalPlanes} planes
              </Text>
            </Col>
          </Row>
        </Card>

        <Table
          dataSource={planes}
          columns={columns}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Total: ${total} planes`,
          }}
          size="small"
        />
      </Space>
    </Card>
  );
};

export default PlanProduccionTableView;
