import { Empty, Typography } from 'antd';

const wrapperStyle = {
  minHeight: 320,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  gap: 16,
};

const PlaceholderPage = ({ title, description }) => (
  <div style={wrapperStyle}>
    <Empty description={null} />
    <div>
      <Typography.Title level={3} style={{ marginBottom: 8 }}>
        {title}
      </Typography.Title>
      {description && (
        <Typography.Text type="secondary" style={{ maxWidth: 420, display: 'inline-block' }}>
          {description}
        </Typography.Text>
      )}
    </div>
  </div>
);

export default PlaceholderPage;
