import { Alert, Card, Col, Empty, Flex, Row, Space, Statistic, Table, Tag, Typography } from 'antd';
import { Area, Pie } from '@ant-design/plots';
import { useQuery } from '@tanstack/react-query';
import {
  IconAlertTriangle,
  IconBuildingStore,
  IconCash,
  IconRocket,
} from '@tabler/icons-react';
import { getEstadisticasTableroSuperadmin } from '../api/tablero.api.js';
import { TABLERO_SUPERADMIN_KEYS } from '../constants/queryKeys.js';

const { Title, Text } = Typography;

const metricIconMap = {
  store: <IconBuildingStore size={32} color="#1677ff" />,
  rocket: <IconRocket size={32} color="#13c2c2" />,
  cash: <IconCash size={32} color="#52c41a" />,
  alert: <IconAlertTriangle size={32} color="#fa541c" />,
};

const formatCurrency = (value) =>
  `S/ ${value.toLocaleString('es-PE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;

const estadoTagMap = {
  ACTIVA: 'green',
  EN_PRUEBA: 'blue',
  VENCIDA: 'volcano',
  CANCELADA: 'red',
};

const VerTableroPage = () => {
  const { data: estadisticas, isLoading, isError } = useQuery({
    queryKey: TABLERO_SUPERADMIN_KEYS.estadisticas(),
    queryFn: getEstadisticasTableroSuperadmin,
  });

  const resumenMetrics = estadisticas?.resumenMetrics || [];
  const facturacionMensual = estadisticas?.facturacionMensual || [];
  const distribucionPlanes = estadisticas?.distribucionPlanes || [];
  const ticketsCriticos = estadisticas?.ticketsCriticos || [];
  const renovacionesProximas = estadisticas?.renovacionesProximas || [];
  const actividadSeguridad = estadisticas?.actividadSeguridad || [];

  const tieneFacturacion = facturacionMensual.length > 0;
  const tienePlanes = distribucionPlanes.length > 0;
  const totalTiendasConPlan = distribucionPlanes.reduce((acc, item) => acc + (Number(item?.tiendas) || 0), 0);

  const areaConfig = {
    data: facturacionMensual.map(f => ({ ...f, total: Number(f.total) })),
    height: 280,
    autoFit: true,
    appendPadding: 16,
    padding: [12, 16, 24, 8],
    xField: 'mes',
    yField: 'total',
    smooth: true,
    color: '#1677ff',
    point: {
      size: 4,
      shape: 'circle',
      style: { fill: '#1677ff', stroke: '#fff', lineWidth: 2 },
    },
    areaStyle: {
      fill: 'l(270) 0:#e6f4ff 0.5:#bae0ff 1:#69b1ff',
      fillOpacity: 0.8,
    },
    meta: {
      mes: { alias: 'Mes' },
      total: { alias: 'Facturación (S/)' },
    },
    xAxis: {
      tickCount: 6,
      label: { autoHide: true },
    },
    yAxis: {
      label: {
        formatter: (value) => `S/ ${Number(value).toLocaleString('es-PE')}`,
      },
    },
    tooltip: {
      formatter: (datum) => ({
        name: 'Facturación',
        value: formatCurrency(datum.total),
      }),
    },
  };

  const pieData = distribucionPlanes.map(p => ({ 
    plan: p.plan || 'Sin plan', 
    tiendas: Number(p.tiendas) || 0,
    ticket: p.ticket || 'S/ 0'
  }));

  const pieConfig = {
    data: pieData,
    appendPadding: 12,
    angleField: 'tiendas',
    colorField: 'plan',
    radius: 0.85,
    innerRadius: 0.6,
    label: false,
    legend: { position: 'bottom' },
    statistic: {
      title: false,
      content: {
        style: { fontSize: '16px', fontWeight: '600' },
        content: totalTiendasConPlan ? `${totalTiendasConPlan}` : '0',
      },
    },
    tooltip: {
      formatter: (datum) => {
        if (!datum) return { name: 'Plan', value: 'Sin datos' };
        return {
          name: datum.plan || 'Sin plan',
          value: `${datum.tiendas || 0} tiendas · Ticket ${datum.ticket || 'S/ 0'}`,
        };
      },
    },
    interactions: [
      { type: 'element-active' },
      { type: 'pie-legend-active' },
    ],
  };

  const renovacionesColumns = [
    { title: 'Tienda', dataIndex: 'tienda', key: 'tienda' },
    { title: 'Plan', dataIndex: 'plan', key: 'plan' },
    { title: 'Renovación', dataIndex: 'fechaRenovacion', key: 'fechaRenovacion' },
    {
      title: 'Días restantes',
      dataIndex: 'diasRestantes',
      key: 'diasRestantes',
      render: (valor) => `${valor} días`,
    },
    {
      title: 'Estado actual',
      dataIndex: 'estado',
      key: 'estado',
      render: (estado) => <Tag color={estadoTagMap[estado] || 'default'}>{estado}</Tag>,
    },
  ];

  if (isLoading) {
    return <div style={{ padding: '24px', textAlign: 'center' }}>Cargando estadísticas...</div>;
  }

  if (isError) {
    return (
      <Alert
        type="error"
        showIcon
        title="Error al cargar estadísticas"
        description="No se pudieron obtener los datos del tablero. Por favor, intenta nuevamente."
      />
    );
  }

  return (
    <Space orientation="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Title level={2} style={{ marginBottom: 0 }}>
          Tablero corporativo
        </Title>
        <Text type="secondary">
          Supervisa la salud del ecosistema: seguridad, tiendas, suscripciones y soporte.
        </Text>
      </div>

      <Row gutter={[16, 16]}>
        {resumenMetrics.map((metric) => (
          <Col key={metric.key} xs={24} sm={12} lg={6}>
            <Card>
              <Space align="center" size={16}>
                {metricIconMap[metric.icon]}
                <div>
                  <Text type="secondary">{metric.title}</Text>
                  <Statistic value={metric.value} styles={{ content: { fontSize: 24 } }} />
                  <Text type={metric.trendColor ?? 'secondary'}>
                    {metric.trend}
                    <Text type="secondary" style={{ marginLeft: 4 }}>
                      {metric.description}
                    </Text>
                  </Text>
                </div>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Distribución por planes" styles={{ body: { height: 400 } }}>
            {tienePlanes ? (
              <Pie {...pieConfig} />
            ) : (
              <Empty description="Sin datos de planes" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Tickets críticos en soporte" styles={{ body: { height: 400, overflowY: 'auto' } }}>
            {ticketsCriticos.length ? (
              <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
                {ticketsCriticos.map((ticket) => (
                  <Flex
                    key={ticket.id}
                    align="center"
                    justify="space-between"
                    style={{ width: '100%' }}
                  >
                    <div>
                      <Text strong>{`${ticket.id} · ${ticket.tienda}`}</Text>
                      <div>
                        <Text type="secondary">{` vence: ${ticket.vencimiento}`}</Text>
                      </div>
                    </div>
                    <div>
                      <Tag color={ticket.prioridad === 'CRITICA' ? 'red' : 'orange'}>
                        {ticket.prioridad}
                      </Tag>
                      <Tag style={{ marginLeft: 8 }}>{ticket.estado}</Tag>
                    </div>
                  </Flex>
                ))}
              </Space>
            ) : (
              <Empty description="Sin tickets" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Card>
        </Col>
      </Row>
    </Space>
  );
};

export default VerTableroPage;
