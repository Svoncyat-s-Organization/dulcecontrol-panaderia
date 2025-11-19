import {useState} from 'react';
import {Card, Form, Input, Button, Alert, Space, Typography} from 'antd';
import {
    IconUserPlus, IconMail, IconLock, IconUser, IconTrash, IconEye, IconEyeOff
} from '@tabler/icons-react';
import {nameRules, emailRules, passwordRules} from '../../constants/rules.js';
import styles from './TokenRegisterForm.module.css';

const {Title, Text} = Typography;

export const TokenRegisterForm = ({
                                      onSubmit,
                                      isLoading,
                                      error,
                                      registeredCredentials,
                                      handleCloseSuccess
                                  }) => {
    const [form] = Form.useForm();
    const [showSuccessPassword, setShowSuccessPassword] = useState(false);

    const onFinish = async (values) => {
        try {
            await onSubmit(values);
            form.resetFields();
            setShowSuccessPassword(false); // Reseteamos el ojo también por si acaso
        } catch (error) {
            console.error('Error en submit:', error);
        }
    };

    return (
        <div className={styles.container}>
            <Card className={styles.card}>

                <Space align="center" className={styles.headerSpace}>
                    <IconUserPlus size={28} style={{color: '#1677ff'}}/>
                    <Title level={3} style={{margin: 0}}>Registrar Usuario</Title>
                </Space>

                <Space direction="vertical" className={styles.alertSpace}>
                    {error && (
                        <Alert
                            type="error"
                            showIcon
                            message="Error"
                            description={error?.response?.data?.message || error?.message || 'No se pudo registrar.'}
                        />
                    )}

                    {registeredCredentials && (
                        <Alert
                            type="success"
                            message="¡Usuario registrado!"
                            closable
                            onClose={handleCloseSuccess}
                            description={
                                <div className={styles.successBox}>
                                    <div style={{marginBottom: 4}}>
                                        <Text strong>Correo: </Text>
                                        <Text copyable>{registeredCredentials.correo}</Text>
                                    </div>
                                    <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                                        <Text strong>Contraseña: </Text>
                                        <Text>
                                            {showSuccessPassword
                                                ? registeredCredentials.contrasena
                                                : '••••••••'}
                                        </Text>
                                        <Button
                                            type="text"
                                            size="small"
                                            icon={showSuccessPassword ? <IconEyeOff size={16}/> : <IconEye size={16}/>}
                                            onClick={() => setShowSuccessPassword(!showSuccessPassword)}
                                        />
                                    </div>
                                </div>
                            }
                        />
                    )}
                </Space>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                    requiredMark={false}
                    size="large"
                >
                    <Form.Item
                        name="nombres"
                        label="Nombres Completos"
                        rules={nameRules}
                    >
                        <Input
                            placeholder="Ej. Juan Pérez"
                            prefix={<IconUser size={18} className={styles.inputIcon}/>}
                            disabled={isLoading}
                        />
                    </Form.Item>

                    <Form.Item
                        name="correo"
                        label="Correo Electrónico"
                        rules={emailRules}
                        normalize={(value) => value?.trim()}
                    >
                        <Input
                            placeholder="desarrollador@dev.dulcecontrol.pe"
                            prefix={<IconMail size={18} className={styles.inputIcon}/>}
                            disabled={isLoading}
                        />
                    </Form.Item>

                    <Form.Item
                        name="contrasena"
                        label="Contraseña"
                        rules={passwordRules}
                    >
                        <Input.Password
                            placeholder="Mínimo 8 caracteres"
                            prefix={<IconLock size={18} className={styles.inputIcon}/>}
                            disabled={isLoading}
                        />
                    </Form.Item>

                    <Space style={{width: '100%', marginTop: 12, justifyContent: 'flex-end'}}>
                        <Button
                            type="text"
                            icon={<IconTrash size={18}/>}
                            onClick={() => form.resetFields()}
                            disabled={isLoading}
                            size="large"
                        >
                            Limpiar
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            icon={<IconUserPlus size={18}/>}
                            loading={isLoading}
                            size="large"
                        >
                            Registrar
                        </Button>
                    </Space>
                </Form>
            </Card>
        </div>
    );
};