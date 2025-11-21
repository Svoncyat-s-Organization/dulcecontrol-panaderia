import { Alert, Card, Col, Empty, Flex, Row, Space, Statistic, Table, Tag, Typography } from 'antd';
import { Area, Pie } from '@ant-design/plots';
import {
  IconAlertTriangle,
  IconBuildingStore,
  IconCash,
  IconRocket,
} from '@tabler/icons-react';
import {
  actividadSeguridad,
  distribucionPlanes,
  facturacionMensual,
  renovacionesProximas,
  resumenMetrics,
  ticketsCriticos,
} from '../constants/dashboardMocks.js';

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
  const tieneFacturacion = facturacionMensual.length > 0;
  const tienePlanes = distribucionPlanes.length > 0;
  const totalTiendasConPlan = distribucionPlanes.reduce((acc, item) => acc + item.tiendas, 0);

  const areaConfig = {
    data: facturacionMensual,
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

  const pieConfig = {
    data: distribucionPlanes,
    appendPadding: 12,
    angleField: 'tiendas',
    colorField: 'plan',
    radius: 0.85,
    innerRadius: 0.6,
    label: {
      type: 'inner',
      offset: '-30%',
      formatter: (datum) =>
        totalTiendasConPlan
          ? `${((datum.tiendas / totalTiendasConPlan) * 100).toFixed(1)}%`
          : '0%',
    },
    legend: { position: 'bottom' },
    statistic: {
      title: { formatter: () => 'Tiendas' },
      content: {
        formatter: () => (totalTiendasConPlan ? `${totalTiendasConPlan}` : 'Sin datos'),
      },
    },
    tooltip: {
      formatter: (datum) => ({
        name: datum.plan,
        value: `${datum.tiendas} tiendas · Ticket ${datum.ticket}`,
      }),
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

      <Alert
        type="info"
        showIcon
        title="Datos de referencia"
        description="Estos insights utilizan datos simulados basados en las migraciones V2-V6 mientras se conectan los endpoints del core superadmin."
      />

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
        <Col xs={24} lg={16}>
          <Card title="Facturación mensual confirmada" styles={{ body: { height: 360 } }}>
            {tieneFacturacion ? (
              <Area {...areaConfig} style={{ height: '100%' }} />
            ) : (
              <Empty description="Sin datos de facturación" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Distribución por planes" styles={{ body: { height: 360 } }}>
            {tienePlanes ? (
              <Pie {...pieConfig} />
            ) : (
              <Empty description="Sin datos de planes" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Tickets críticos en soporte">
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
        <Col xs={24} lg={12}>
          <Card title="Actividad sensible de seguridad">
            {actividadSeguridad.length ? (
              <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
                {actividadSeguridad.map((evento, index) => (
                  <Flex
                    key={`${evento.evento}-${index}`}
                    align="flex-start"
                    justify="space-between"
                    style={{ width: '100%' }}
                  >
                    <div>
                      <Text strong>{evento.evento}</Text>
                      <div>
                        <Text type="secondary">{evento.detalle}</Text>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <Text>{evento.fecha}</Text>
                      <div>
                        <Tag color={evento.impacto === 'Alto' ? 'red' : evento.impacto === 'Medio' ? 'orange' : 'blue'}>
                          {evento.impacto}
                        </Tag>
                      </div>
                    </div>
                  </Flex>
                ))}
              </Space>
            ) : (
              <Empty description="Sin actividad reciente" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Card>
        </Col>
      </Row>

      <Card title="Renovaciones de suscripción (próximos 30 días)">
        <Table
          rowKey={(record) => `${record.tienda}-${record.fechaRenovacion}`}
          dataSource={renovacionesProximas}
          columns={renovacionesColumns}
          pagination={false}
        />
      </Card>

      {/* Para cambiar a datos reales, reemplaza los mocks importados desde dashboardMocks con hooks useQuery que apunten a los endpoints de superadmin (tiendas, planes, comprobantes y soporte). */}
    </Space>
  );
};

export default VerTableroPage;
