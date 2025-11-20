import {useState} from 'react';
import {Card, Form, Input, Button, Alert, Space, Typography, App} from 'antd';
import {
    IconKey, IconMail, IconLock, IconTrash, IconCopy, IconEye, IconEyeOff
} from '@tabler/icons-react';
import {emailRules, passwordRules} from '../../constants/rules.js';
import styles from './TokenGetForm.module.css';

const {Title} = Typography;

export const TokenGetForm = ({
                                 onSubmit,
                                 isLoading,
                                 error,
                                 tokenSuccessData,
                                 handleCloseSuccess
                             }) => {
    const [form] = Form.useForm();
    const [showSuccessToken, setShowSuccessToken] = useState(false);
    const { message } = App.useApp();

    const onFinish = async (values) => {
        try {
            await onSubmit(values);
            form.resetFields();
            setShowSuccessToken(false);
        } catch (error) {
            console.error('Error en submit:', error);
        }
    };

    const handleCopyToken = () => {
        if (tokenSuccessData?.accessToken) {
            navigator.clipboard.writeText(tokenSuccessData.accessToken);
            message.success('Token copiado al portapapeles');
        }
    }

    return (
        <div className={styles.container}>
            <Card className={styles.card}>

                <Space align="center" className={styles.headerSpace}>
                    <IconKey size={28} style={{color: '#1677ff'}}/>
                    <Title level={3} style={{margin: 0}}>Obtener Token</Title>
                </Space>

                <Space orientation="vertical" className={styles.alertSpace}>
                    {error && (
                        <Alert
                            type="error"
                            showIcon
                            message="Error"
                            description={error?.response?.data?.message || error?.message || 'No se pudieron validar credenciales.'}
                        />
                    )}

                    {tokenSuccessData && (
                        <Alert
                            type="success"
                            message="¡Credenciales validadas!"
                            closable
                            onClose={handleCloseSuccess}
                            description={
                                <div className={styles.successBox}>
                                    <div className={styles.tokenContainer}>
                                        <code className={styles.tokenValue}>
                                            {showSuccessToken ? tokenSuccessData.accessToken : '•'.repeat(50)}
                                        </code>
                                        <Space size="small" className={styles.tokenActions}>
                                            <Button
                                                size="small"
                                                icon={showSuccessToken ? <IconEyeOff size={16}/> : <IconEye size={16}/>}
                                                onClick={() => setShowSuccessToken(!showSuccessToken)}
                                            >
                                                {showSuccessToken ? 'Ocultar' : 'Mostrar'}
                                            </Button>
                                            <Button
                                                type="primary"
                                                size="small"
                                                icon={<IconCopy size={16}/>}
                                                onClick={handleCopyToken}
                                            >
                                                Copiar
                                            </Button>
                                        </Space>
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
                        name="correo"
                        label="Correo Electrónico"
                        normalize={(value) => value?.trim()}
                        rules={emailRules}
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
                            placeholder="Contraseña"
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
                            icon={<IconKey size={18}/>}
                            loading={isLoading}
                            size="large"
                        >
                            Generar Token
                        </Button>
                    </Space>
                </Form>
            </Card>
        </div>
    );
}