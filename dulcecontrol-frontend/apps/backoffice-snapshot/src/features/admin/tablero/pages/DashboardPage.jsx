import { Typography, Card, Space } from 'antd';

const { Title, Text } = Typography;

const DashboardPage = () => {
  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Title level={2} style={{ marginBottom: 0 }}>
          Panel general
        </Title>
        <Text type="secondary">Pronto verás indicadores clave de tu tienda.</Text>
      </div>
      <Card>
        <Text type="secondary">Aún no hay widgets configurados para este módulo.</Text>
      </Card>
    </Space>
  );
};

export default DashboardPage;
