import { Card, Typography, Flex } from 'antd';

const { Title, Text } = Typography;

const DashboardPage = () => {
  return (
    <Flex vertical gap={16}>
      <Title level={3}>Panel de control</Title>
      <Text type="secondary">
        Usa este contenedor como base para integrar los módulos reales del panel administrador.
      </Text>
      <Card>
        <Text>Sin widgets por ahora. Integra tus componentes aquí.</Text>
      </Card>
    </Flex>
  );
};

export default DashboardPage;
