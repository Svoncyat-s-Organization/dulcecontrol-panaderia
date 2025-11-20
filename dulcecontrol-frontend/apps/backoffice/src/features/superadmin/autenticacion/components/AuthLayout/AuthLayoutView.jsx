import { Flex } from 'antd';

const containerStyle = {
    minHeight: '100vh',
    padding: '2rem',
    backgroundColor: '#0f172a',
};

const AuthLayoutView = ({ children }) => (
    <Flex align="center" justify="center" style={containerStyle}>
        {children}
    </Flex>
);

export default AuthLayoutView;
