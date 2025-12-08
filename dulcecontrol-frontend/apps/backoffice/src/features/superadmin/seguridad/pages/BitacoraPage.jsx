import { Space, Typography } from 'antd';
import ActividadTimeline from '../components/ActividadTimeline/index.jsx';

const { Title, Paragraph } = Typography;

const BitacoraPage = () => (
  <Space direction="vertical" size={24} style={{ width: '100%' }}>
    <div>
      <Title level={2} style={{ marginBottom: 8 }}>
        Bitácora y auditoría
      </Title>
      <Paragraph type="secondary" style={{ margin: 0 }}>
        Consulta las actividades más recientes registradas por los superadministradores y detecta anomalías rápidamente.
      </Paragraph>
    </div>

    <ActividadTimeline />
  </Space>
);

export default BitacoraPage;
