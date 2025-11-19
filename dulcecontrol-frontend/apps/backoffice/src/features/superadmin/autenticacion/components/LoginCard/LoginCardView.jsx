import { Alert, Button, Card, Flex, Form, Input, Typography } from 'antd';
import { IconLock, IconMail } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { LOGIN_INITIAL_VALUES } from '../../utils/formDefaults.js';

const { Title, Text } = Typography;

const cardStyle = {
    maxWidth: 420,
    width: '100%',
    borderRadius: 16,
    boxShadow: '0 25px 80px rgba(15, 23, 42, 0.35)'
};

const LoginCardView = ({ loading, onSubmit, errorMessage }) => (
    <Card style={cardStyle} variant="borderless">
        <Flex vertical gap="small" style={{ marginBottom: 24 }}>
            <Text type="secondary" strong>
                Acceso Superadmin
            </Text>
            <Title level={2} style={{ margin: 0 }}>
                Bienvenido a Dulce Control
            </Title>
            <Text type="secondary">
                Inicia sesión con tu correo corporativo para administrar el ecosistema SaaS.
            </Text>
        </Flex>

        {errorMessage && (
            <Alert
                type="error"
                message={errorMessage}
                showIcon
                style={{ marginBottom: 16 }}
            />
        )}

        <Form
            layout="vertical"
            onFinish={onSubmit}
            size="large"
            requiredMark={false}
            initialValues={LOGIN_INITIAL_VALUES}
        >
            <Form.Item
                label="Correo electrónico"
                name="email"
                rules={[
                    { required: true, message: 'Ingresa tu correo corporativo' },
                    { type: 'email', message: 'Correo inválido' }
                ]}
            >
                <Input prefix={<IconMail size={16} />} placeholder="superadmin@dulcecontrol.com" />
            </Form.Item>

            <Form.Item
                label="Contraseña"
                name="password"
                rules={[{ required: true, message: 'Ingresa tu contraseña' }]}
            >
                <Input.Password prefix={<IconLock size={16} />} placeholder="••••••••" />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" block loading={loading}>
                    Ingresar
                </Button>
            </Form.Item>
        </Form>

        <Flex justify="space-between" align="center">
            <Text type="secondary">¿Necesitas tokens para pruebas?</Text>
            <Link to="/token">Ir al generador</Link>
        </Flex>
    </Card>
);

export default LoginCardView;
