import { useEffect, useState } from 'react';
import { Button, Card, Flex, Form, Input, Typography, message } from 'antd';
import { IconLock, IconMail } from '@tabler/icons-react';
import { useLocation, useNavigate, Navigate, Link } from 'react-router-dom';
import { loginSuperadmin } from '../api/auth.api.js';
import { useTokenStore } from '../../../shared/store/tokenStore.js';

const { Title, Text } = Typography;

const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1f2937 0%, #111827 45%, #0f172a 100%)',
    padding: '2rem',
};

const cardStyle = {
    maxWidth: 420,
    width: '100%',
    borderRadius: 16,
    boxShadow: '0 25px 80px rgba(15, 23, 42, 0.35)',
};

const LoginPage = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const login = useTokenStore((state) => state.login);
    const hasValidSession = useTokenStore((state) => state.hasValidSession);
    const token = useTokenStore((state) => state.token);
    const logout = useTokenStore((state) => state.logout);
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    const sessionActive = hasValidSession();

    useEffect(() => {
        if (token && !sessionActive) {
            logout();
        }
    }, [token, sessionActive, logout]);

    if (sessionActive) {
        return <Navigate to={from} replace/>;
    }

    const handleSubmit = async (values) => {
        setIsSubmitting(true);
        try {
            const data = await loginSuperadmin(values);
            login({
                token: data.token,
                userType: data.userType,
                tiendaId: data.tiendaId,
                expiresIn: data.expiresIn,
            });
            message.success('Sesión iniciada correctamente');
            navigate(from, { replace: true });
        } catch (error) {
            const detail = error?.response?.data?.message || 'No se pudo iniciar sesión';
            message.error(detail);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Flex align="center" justify="center" style={containerStyle}>
            <Card style={cardStyle} bordered={false}>
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

                <Form layout="vertical" onFinish={handleSubmit} size="large" requiredMark={false}>
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
                        <Button type="primary" htmlType="submit" block loading={isSubmitting}>
                            Ingresar
                        </Button>
                    </Form.Item>
                </Form>

                <Flex justify="space-between" align="center">
                    <Text type="secondary">¿Necesitas tokens para pruebas?</Text>
                    <Link to="/token">Ir al generador</Link>
                </Flex>
            </Card>
        </Flex>
    );
};

export default LoginPage;
