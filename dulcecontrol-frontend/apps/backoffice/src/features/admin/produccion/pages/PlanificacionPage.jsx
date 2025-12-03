import { Space, Typography } from 'antd';
import PlanProduccionTable from '../components/PlanProduccionTable/index.jsx';

const { Title, Paragraph } = Typography;

const PlanificacionPage = () => {
  return (
    <Space orientation="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Title level={2}>Planificación de Producción</Title>
        <Paragraph type="secondary">
          Gestiona los planes de producción diarios. El sistema calcula automáticamente qué y cuánto producir
          basándose en el stock ideal, inventario actual y pedidos especiales.
        </Paragraph>
      </div>

      <PlanProduccionTable />
    </Space>
  );
};

export default PlanificacionPage;
