import { Alert, Card, Col, Empty, Flex, Row, Space, Statistic, Table, Tag, Typography } from 'antd';
import { Area, Pie } from '@ant-design/plots';
import {
  IconCash,
  IconShoppingCart,
  IconAlertTriangle,
  IconUsers,
} from '@tabler/icons-react';
import {
  categoriasMasVendidas,
  mejoresClientes,
  pedidosRecientes,
  productosBajoStock,
  resumenMetrics,
  ventasHistoricas,
} from '../../tablero/constants/dashboardMocks.js';

const { Title, Text } = Typography;

const metricIconMap = {
  cash: <IconCash size={32} color="#52c41a" />,
  shopping: <IconShoppingCart size={32} color="#1677ff" />,
  alert: <IconAlertTriangle size={32} color="#fa541c" />,
  users: <IconUsers size={32} color="#722ed1" />,
};

const formatCurrency = (value) =>
  `S/ ${value.toLocaleString('es-PE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const DashboardPage = () => {
  const tieneVentas = ventasHistoricas.length > 0;
  const tieneCategorias = categoriasMasVendidas.length > 0;
  const sumaVentas = tieneVentas
    ? ventasHistoricas.reduce((acum, item) => acum + item.monto, 0)
    : 0;
  const promedioDiario = tieneVentas ? sumaVentas / ventasHistoricas.length : 0;
  const mejorDia = tieneVentas
    ? ventasHistoricas.reduce((prev, curr) => (curr.monto > prev.monto ? curr : prev))
    : null;

  const areaConfig = {
    data: ventasHistoricas,
    height: 320,
    autoFit: true,
    appendPadding: 16,
    padding: [12, 16, 24, 8],
    xField: 'dia',
    yField: 'monto',
    smooth: true,
    color: '#fb6f92',
    point: {
      size: 4,
      shape: 'circle',
      style: { fill: '#fb6f92', stroke: '#fff', lineWidth: 2 },
    },
    areaStyle: {
      fill: 'l(270) 0:#ffe5ec 0.5:#ffc2d1 1:#fb6f92',
      fillOpacity: 0.7,
    },
    meta: {
      dia: { alias: 'Día' },
      monto: { alias: 'Ventas (S/)' },
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
        name: 'Ventas',
        value: formatCurrency(datum.monto),
      }),
    },
  };

  const ventasCategoriasTotales = categoriasMasVendidas.reduce(
    (acc, categoria) => acc + categoria.ventas,
    0,
  );

  const pieConfig = {
    appendPadding: 16,
    data: categoriasMasVendidas,
    angleField: 'ventas',
    colorField: 'tipo',
    radius: 0.85,
    innerRadius: 0.6,
    label: {
      type: 'inner',
      offset: '-30%',
      autoRotate: false,
      style: { fontSize: 14 },
      formatter: (datum) => {
        if (!datum || !ventasCategoriasTotales) {
          return '0%';
        }
        return `${((datum.ventas / ventasCategoriasTotales) * 100).toFixed(1)}%`;
      },
    },
    pieStyle: { lineWidth: 0 },
    legend: { position: 'bottom' },
    statistic: {
      title: { formatter: () => 'Ventas' },
      content: {
        style: { fontSize: 16 },
        formatter: () =>
          ventasCategoriasTotales ? formatCurrency(ventasCategoriasTotales) : 'Sin datos',
      },
    },
    tooltip: {
      formatter: (datum) => {
        if (!datum) {
          return { name: 'Categoría', value: 'Sin datos' };
        }
        return {
          name: datum.tipo,
          value: `${formatCurrency(datum.ventas)} · ${datum.pedidos} pedidos`,
        };
      },
    },
    interactions: [
      { type: 'element-active' },
      { type: 'pie-legend-active' },
    ],
  };

  const columns = [
    { title: 'Pedido #', dataIndex: 'id', key: 'id' },
    { title: 'Cliente', dataIndex: 'cliente', key: 'cliente' },
    { title: 'Total', dataIndex: 'total', key: 'total' },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
      render: (estado) => (
        <Tag color={estado === 'Entregado' ? 'green' : 'gold'}>{estado}</Tag>
      ),
    },
  ];

  return (
    <Space orientation="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Title level={2} style={{ marginBottom: 0 }}>
          Tablero general
        </Title>
        <Text type="secondary">Monitorea el pulso diario de tu panadería.</Text>
      </div>

      <Alert
        type="info"
        showIcon
        title="Datos de referencia"
        description="Este tablero utiliza información 100% simulada mientras se integran los endpoints reales del backend."
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
                    {metric.trend && `${metric.trend} `}
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
          <Card title="Evolución de ventas (últimos 14 días)" styles={{ body: { height: 360 } }}>
            {tieneVentas ? (
              <>
                <Area {...areaConfig} style={{ height: 260 }} />
                <Flex justify="space-between" style={{ marginTop: 16 }}>
                  <div>
                    <Text type="secondary">Promedio diario</Text>
                    <div style={{ fontWeight: 600 }}>{formatCurrency(promedioDiario)}</div>
                  </div>
                  <div>
                    <Text type="secondary">Mejor día</Text>
                    <div style={{ fontWeight: 600 }}>
                      {mejorDia?.dia ?? '—'} · {mejorDia ? formatCurrency(mejorDia.monto) : 'S/ 0.00'}
                    </div>
                  </div>
                </Flex>
              </>
            ) : (
              <Empty description="Sin datos de ventas" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Productos más vendidos por categoría" styles={{ body: { height: 360 } }}>
            {tieneCategorias ? (
              <Pie {...pieConfig} />
            ) : (
              <Empty description="Sin datos de categorías" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Alertas de inventario">
            {productosBajoStock.length ? (
              <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
                {productosBajoStock.map((item) => (
                  <Flex
                    key={item.sku}
                    align="center"
                    justify="space-between"
                    style={{ width: '100%' }}
                  >
                    <div>
                      <Text strong>{`${item.nombre} (${item.sku})`}</Text>
                      <div>
                        <Text type="secondary">{`Stock: ${item.stock} · ${item.ubicacion}`}</Text>
                      </div>
                    </div>
                    <Tag color={item.stock <= 3 ? 'red' : 'orange'}>Stock crítico</Tag>
                  </Flex>
                ))}
              </Space>
            ) : (
              <Empty description="Inventario sin alertas" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Clientes más fieles">
            {mejoresClientes.length ? (
              <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
                {mejoresClientes.map((cliente) => (
                  <Flex
                    key={cliente.nombre}
                    align="center"
                    justify="space-between"
                    style={{ width: '100%' }}
                  >
                    <div>
                      <Text strong>{cliente.nombre}</Text>
                      <div>
                        <Text type="secondary">
                          {`${cliente.compras} compras · Ticket promedio ${cliente.ticket}`}
                        </Text>
                      </div>
                    </div>
                    <Tag color="blue">Top</Tag>
                  </Flex>
                ))}
              </Space>
            ) : (
              <Empty description="Sin clientes destacados" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Card>
        </Col>
      </Row>

      <Card title="Pedidos recientes">
        <Table
          rowKey="id"
          dataSource={pedidosRecientes}
          columns={columns}
          pagination={false}
        />
      </Card>

      {/* Para sustituir los mocks, usa useQuery y reemplaza los datos importados desde dashboardMocks por la respuesta real del backend antes de pasarlos a los componentes. */}
    </Space>
  );
};

export default DashboardPage;
