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
import styles from './TokenFormCard.module.css';

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
export const TokenFormCard = ({
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

                {error && (
                    <Alert
                        type="error"
                        showIcon
                        message={error?.message || 'Error al generar el token'}
                        className={styles.alert}
                    />
                )}

                <Space size="middle" className={styles.buttonGroup}>
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
                    <Button
                        icon={<IconTrash size={18}/>}
                        onClick={handleClearForm}
                        disabled={isLoading}
                        size="large"
                    >
                        Limpiar
                    </Button>
                </Space>
            </Form>
        </Card>

        {generatedToken && (
            <Card className={styles.tokenCard} bordered={false}>
                <div className={styles.tokenHeader}>
                    <IconCheck size={20} className={styles.successIcon}/>
                    <Title level={4} className={styles.tokenTitle}>Token Generado</Title>
                </div>

                <div className={styles.tokenContent}>
                    <code className={styles.tokenValue}>
                        {isTokenVisible ? generatedToken : '•'.repeat(100)}
                    </code>
                </div>

                <Space size="small" className={styles.tokenActions}>
                    <Button
                        icon={isTokenVisible ? <IconEyeOff size={18}/> : <IconEye size={18}/>}
                        onClick={toggleTokenVisibility}
                    >
                        {isTokenVisible ? 'Ocultar' : 'Mostrar'}
                    </Button>
                    <Button
                        type="primary"
                        icon={<IconCopy size={18}/>}
                        onClick={handleCopyToken}
                    >
                        Copiar
                    </Button>
                </Space>
            </Card>
        )}
    </div>
);
