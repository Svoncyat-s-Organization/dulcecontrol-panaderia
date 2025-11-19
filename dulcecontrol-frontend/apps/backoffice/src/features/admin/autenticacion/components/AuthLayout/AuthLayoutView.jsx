import { Flex } from 'antd';

const containerStyle = {
  minHeight: '100vh',
  padding: '2rem',
  background: 'radial-gradient(circle at top, rgba(16,83,64,0.18) 0%, rgba(15,23,42,1) 60%)',
};

const AuthLayoutView = ({ children }) => (
  <Flex align="center" justify="center" style={containerStyle}>
    {children}
  </Flex>
);

export default AuthLayoutView;
