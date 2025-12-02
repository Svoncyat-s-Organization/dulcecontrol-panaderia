import { Space, Typography } from 'antd';
import StockIdealTable from '../components/StockIdealTable/index.jsx';

const { Title, Paragraph } = Typography;

const StockIdealPage = () => {
  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Title level={2}>Stock Ideal</Title>
        <Paragraph type="secondary">
          Configura la cantidad objetivo de cada producto que debe estar disponible diariamente en cada sede.
          Estos valores son la base para calcular la producción automática.
        </Paragraph>
      </div>

      <StockIdealTable />
    </Space>
  );
};

export default StockIdealPage;
