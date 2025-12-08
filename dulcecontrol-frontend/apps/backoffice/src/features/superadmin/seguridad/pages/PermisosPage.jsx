import { Space, Typography } from 'antd';
import PermisosCatalog from '../components/PermisosCatalog/index.jsx';

const { Title, Paragraph } = Typography;

const PermisosPage = () => (
  <Space direction="vertical" size={24} style={{ width: '100%' }}>
    <div>
      <Title level={2} style={{ marginBottom: 8 }}>
        Catálogo de permisos
      </Title>
      <Paragraph type="secondary" style={{ margin: 0 }}>
        Consulta los permisos corporativos disponibles y cómo están agrupados por módulo.
      </Paragraph>
    </div>

    <PermisosCatalog />
  </Space>
);

export default PermisosPage;
