import { Space, Typography } from 'antd';
import UsuariosTable from '../components/UsuariosTable/index.jsx';

const { Title, Paragraph } = Typography;

const UsuariosPage = () => (
  <Space direction="vertical" size={24} style={{ width: '100%' }}>
    <div>
      <Title level={2} style={{ marginBottom: 8 }}>
        Usuarios corporativos
      </Title>
      <Paragraph type="secondary" style={{ margin: 0 }}>
        Gestiona las cuentas superadmin con acceso total al ecosistema y asigna los roles adecuados.
      </Paragraph>
    </div>

    <UsuariosTable />
  </Space>
);

export default UsuariosPage;
