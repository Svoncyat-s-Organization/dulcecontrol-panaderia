import {Controller} from 'react-hook-form';
import {Card, Form, Input, Button, Alert, Space, Typography} from 'antd';
import {
    IconKey,
    IconMail,
    IconLock,
    IconEye,
    IconEyeOff,
    IconCopy,
    IconTrash,
    IconCheck
} from '@tabler/icons-react';
import styles from './TokenGetForm.module.css';

const {Title} = Typography;

/**
 * Componente de UI para el formulario de autenticación y
 * visualización del token generado con diseño mejorado.
 *
 * @param {object} props
 * @param {object} props.control - El 'control' de react-hook-form.
 * @param {Function} props.onSubmit - La función a ejecutar en el submit del form.
 * @param {Function} props.handleClearForm - Función para limpiar el formulario.
 * @param {boolean} props.isLoading - Estado de carga de la mutación.
 * @param {string | null} props.generatedToken - El token JWT generado.
 * @param {boolean} props.isTokenVisible - Si el token está visible u oculto.
 * @param {Function} props.toggleTokenVisibility - Función para alternar visibilidad del token.
 * @param {Function} props.handleCopyToken - Función para copiar el token al portapapeles.
 * @param {Error | null} props.error - El objeto de error de la mutación.
 */
export const TokenGetForm = ({
                                  control,
                                  onSubmit,
                                  handleClearForm,
                                  isLoading,
                                  generatedToken,
                                  isTokenVisible,
                                  toggleTokenVisibility,
                                  handleCopyToken,
                                  error,
                              }) => (


    <div className={styles.wrapper}>
        <Card className={styles.card} bordered={false}>
            <div className={styles.header}>
                <IconKey size={24} className={styles.headerIcon}/>
                <Title level={3} className={styles.title}>
                    Obtener Token
                </Title>
            </div>

            {error && (
                    <Alert
                        type="error"
                        showIcon
                        message={error?.message || 'Error al generar el token'}
                        className={styles.alert}
                    />
            )}

            {generatedToken && (
                <Alert
                    type="success"
                    message="Token generado exitosamente ✅"
                    description={
                        <div className={styles.tokenContainer}>
                            <code className={styles.tokenValue}>
                                {isTokenVisible ? generatedToken : '•'.repeat(100)}
                            </code>
                            <Space size="small" className={styles.tokenActions}>
                                <Button
                                    size="small"
                                    icon={isTokenVisible ? <IconEyeOff size={16}/> : <IconEye size={16}/>}
                                    onClick={toggleTokenVisibility}
                                >
                                    {isTokenVisible ? 'Ocultar' : 'Mostrar'}
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
                    }
                    closable
                    className={styles.tokenAlert}
                />
            )}

            {/* Formulario */}
            <Form
                layout="vertical"
                onFinish={onSubmit}
                className={styles.form}
            >

                <Controller
                    name="correo"
                    control={control}
                    render={({field, fieldState}) => (
                        <Form.Item
                            label={<span className={styles.label}>Correo Electrónico</span>}
                            validateStatus={fieldState.error ? 'error' : undefined}
                            help={fieldState.error?.message}
                            className={styles.formItem}
                        >
                            <Input
                                {...field}
                                placeholder="correo@dulcecontrol.pe"
                                prefix={<IconMail size={18}/>}
                                size="large"
                                disabled={isLoading}
                            />
                        </Form.Item>
                    )}
                />

                <Controller
                    name="contrasena"
                    control={control}
                    render={({field, fieldState}) => (
                        <Form.Item
                            label={<span className={styles.label}>Contraseña</span>}
                            validateStatus={fieldState.error ? 'error' : undefined}
                            help={fieldState.error?.message}
                            className={styles.formItem}
                        >
                            <Input.Password
                                {...field}
                                placeholder="••••••••"
                                prefix={<IconLock size={18}/>}
                                size="large"
                                disabled={isLoading}
                            />
                        </Form.Item>
                    )}
                />

                <Space size="middle" className={styles.buttonGroup}>
                    <Button
                        icon={<IconTrash size={18}/>}
                        onClick={handleClearForm}
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
                        block
                    >
                        Generar Token
                    </Button>
                </Space>
            </Form>
        </Card>


    </div>
);
