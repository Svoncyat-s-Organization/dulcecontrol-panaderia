import { Alert, Card, Col, Empty, Flex, Row, Space, Statistic, Table, Tag, Typography } from 'antd';
import { Area, Pie } from '@ant-design/plots';
import { useQuery } from '@tanstack/react-query';
import {
  IconCash,
  IconShoppingCart,
  IconAlertTriangle,
  IconUsers,
} from '@tabler/icons-react';
import { getEstadisticasTablero } from '../api/tablero.api.js';
import { TABLERO_KEYS } from '../constants/queryKeys.js';
import { useTokenStore } from '../../../../shared/store/tokenStore.js';
import { useSedeStore } from '../../../../shared/store/sedeStore.js';

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
  const tiendaId = useTokenStore((state) => state.tiendaId);
  const selectedSedeId = useSedeStore((state) => state.selectedSedeId);

  const { data: estadisticas, isLoading, isError } = useQuery({
    queryKey: TABLERO_KEYS.estadisticas(tiendaId, selectedSedeId),
    queryFn: () => getEstadisticasTablero(tiendaId, selectedSedeId),
    enabled: !!tiendaId,
  });

  const resumenMetrics = estadisticas?.resumenMetrics || [];
  const ventasHistoricas = estadisticas?.ventasHistoricas || [];
  const categoriasMasVendidas = estadisticas?.categoriasMasVendidas || [];
  const pedidosRecientes = estadisticas?.pedidosRecientes || [];
  const productosBajoStock = estadisticas?.productosBajoStock || [];
  const mejoresClientes = estadisticas?.mejoresClientes || [];

  const tieneVentas = ventasHistoricas.length > 0;
  const tieneCategorias = categoriasMasVendidas.length > 0;
  const sumaVentas = tieneVentas
    ? ventasHistoricas.reduce((acum, item) => acum + Number(item.monto), 0)
    : 0;
  const promedioDiario = tieneVentas ? sumaVentas / ventasHistoricas.length : 0;
  const mejorDia = tieneVentas
    ? ventasHistoricas.reduce((prev, curr) => (Number(curr.monto) > Number(prev.monto) ? curr : prev))
    : null;

  const areaData = ventasHistoricas.map(v => ({ 
    dia: v.dia, 
    monto: Number(v.monto) || 0 
  }));

  const areaConfig = {
    data: areaData,
    height: 280,
    autoFit: true,
    xField: 'dia',
    yField: 'monto',
    smooth: true,
    color: '#1890ff',
    point: {
      size: 5,
      shape: 'circle',
      style: { 
        fill: '#1890ff', 
        stroke: '#fff', 
        lineWidth: 2,
        cursor: 'pointer',
      },
    },
    areaStyle: {
      fill: 'l(270) 0:#e6f4ff 0.5:#91caff 1:#1890ff',
      fillOpacity: 0.6,
    },
    xAxis: {
      label: { 
        style: { fontSize: 11 },
        autoRotate: false,
        autoHide: true,
      },
    },
    yAxis: {
      label: {
        style: { fontSize: 11 },
        formatter: (value) => `S/ ${Number(value).toFixed(0)}`,
      },
    },
    tooltip: {
      title: (title, datum) => datum.dia,
      customContent: (title, items) => {
        if (!items || !items.length) return null;
        const value = items[0]?.value || 0;
        return `
          <div style="padding: 10px;">
            <div style="margin-bottom: 8px; font-weight: 600;">${title}</div>
            <div style="color: #1890ff; font-size: 16px; font-weight: 600;">
              ${formatCurrency(value)}
            </div>
          </div>
        `;
      },
    },
    interactions: [{ type: 'tooltip' }],
  };

  const ventasCategoriasTotales = categoriasMasVendidas.reduce(
    (acc, categoria) => acc + Number(categoria.ventas),
    0,
  );

  const pieData = categoriasMasVendidas.map(c => ({ 
    type: String(c.nombre || c.tipo || 'Sin categoría'), 
    value: Number(c.ventas) || 0,
    pedidos: Number(c.pedidos) || 0
  }));

  const pieConfig = {
    data: pieData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.9,
    innerRadius: 0.6,
    label: false,
    legend: { 
      position: 'bottom',
    },
    statistic: {
      title: false,
      content: {
        style: { fontSize: '18px', fontWeight: '600' },
        content: formatCurrency(ventasCategoriasTotales),
      },
    },
    tooltip: {
      formatter: (datum) => ({
        name: datum.type,
        value: `${formatCurrency(datum.value)} (${((datum.value / ventasCategoriasTotales) * 100).toFixed(1)}%)`,
      }),
    },
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
          Tablero general
        </Title>
        <Text type="secondary">Monitorea el pulso diario de tu panadería.</Text>
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
                      {mejorDia?.dia ?? '—'} · {mejorDia ? formatCurrency(Number(mejorDia.monto)) : 'S/ 0.00'}
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
    </Space>
  );
};

export default DashboardPage;
