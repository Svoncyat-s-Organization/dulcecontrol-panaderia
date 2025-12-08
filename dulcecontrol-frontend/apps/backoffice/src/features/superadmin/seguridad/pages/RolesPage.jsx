import { Divider, Space, Typography } from 'antd';
import RolesManager from '../components/RolesManager/index.jsx';
import PermisosCatalog from '../components/PermisosCatalog/index.jsx';

const { Title, Paragraph, Text } = Typography;

const RolesPage = () => (
  <Space direction="vertical" size={24} style={{ width: '100%' }}>
    <div>
      <Title level={2} style={{ marginBottom: 8 }}>
        Roles y permisos corporativos
      </Title>
      <Paragraph type="secondary" style={{ margin: 0 }}>
        Controla qué superadministradores tienen acceso a cada módulo y consulta el catálogo oficial de permisos.
      </Paragraph>
    </div>

    <RolesManager />

    <Divider style={{ margin: '8px 0' }} />

    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <div>
        <Title level={3} style={{ marginBottom: 4 }}>
          Catálogo de permisos
        </Title>
        <Text type="secondary">
          Estos permisos están disponibles para construir roles personalizados según las operaciones del equipo corporativo.
        </Text>
      </div>
      <PermisosCatalog />
    </Space>
  </Space>
);

export default RolesPage;
