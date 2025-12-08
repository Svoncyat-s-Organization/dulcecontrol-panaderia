import { Flex } from 'antd';

const containerStyle = {
  minHeight: '100vh',
  padding: '2rem',
  backgroundColor: '#2a4bcfff',
};

const AuthLayoutView = ({ children }) => (
  <Flex align="center" justify="center" style={containerStyle}>
    {children}
  </Flex>
);

export default AuthLayoutView;
