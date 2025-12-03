import { Space, Typography } from 'antd';
import UsuariosTable from '../components/UsuariosTable/index.jsx';

const { Title, Paragraph } = Typography;

const EquipoPage = () => (
  <Space direction="vertical" size={24} style={{ width: '100%' }}>
    <div>
      <Title level={2} style={{ marginBottom: 8 }}>
        Equipo corporativo
      </Title>
      <Paragraph type="secondary" style={{ margin: 0 }}>
        Administra las credenciales de los superadministradores con acceso a todo el ecosistema DulceControl.
      </Paragraph>
    </div>

    <UsuariosTable />
  </Space>
);

export default EquipoPage;
