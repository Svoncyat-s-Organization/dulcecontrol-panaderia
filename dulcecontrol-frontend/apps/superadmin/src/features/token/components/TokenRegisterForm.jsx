import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { Card, Form, Input, Button, Alert, Space, Typography, Select } from 'antd';
import {
    IconUserPlus,
    IconMail,
    IconLock,
    IconUser,
    IconPhone,
    IconId,
    IconTrash,
    IconEye,
    IconEyeOff,
    IconX,
} from '@tabler/icons-react';
import styles from './TokenRegisterForm.module.css';

const { Title } = Typography;
const { Option } = Select;

/**
 * Componente de UI para el formulario de registro de usuario superadmin.
 *
 * @param {object} props
 * @param {object} props.control - El 'control' de react-hook-form.
 * @param {Function} props.onSubmit - La función a ejecutar en el submit del form.
 * @param {Function} props.handleClearForm - Función para limpiar el formulario.
 * @param {boolean} props.isLoading - Estado de carga de la mutación.
 * @param {Error | null} props.error - El objeto de error de la mutación.
 * @param {boolean} props.isSuccess - Si el registro fue exitoso.
 * @param {object | null} props.registeredCredentials - Credenciales del usuario registrado.
 * @param {Function} props.handleCloseSuccess - Función para cerrar el mensaje de éxito.
 */
export const TokenRegisterForm = ({
    control,
    onSubmit,
    handleClearForm,
    isLoading,
    error,
    isSuccess,
    registeredCredentials,
    handleCloseSuccess,
}) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    return (
    <div className={styles.wrapper}>
        <Card className={styles.card} bordered={false}>
            <div className={styles.header}>
                <IconUserPlus size={24} className={styles.headerIcon} />
                <Title level={3} className={styles.title}>
                    Registrar Usuario
                </Title>
            </div>

            {error && (
                <Alert
                    type="error"
                    showIcon
                    message={error?.response?.data?.message || error?.message || 'Error al registrar usuario'}
                    className={styles.alert}
                />
            )}

            {registeredCredentials && (
                <Alert
                    type="success"
                    message="¡Usuario registrado exitosamente! ✅"
                    description={
                        <div className={styles.credentials}>
                            <div className={styles.credentialItem}>
                                <strong>Correo:</strong> {registeredCredentials.correo}
                            </div>
                            <div className={styles.credentialItem}>
                                <strong>Contraseña:</strong>
                                <span className={styles.passwordGroup}>
                                    {isPasswordVisible ? registeredCredentials.contrasena : '•'.repeat(registeredCredentials.contrasena.length)}
                                    <Button
                                        type="text"
                                        size="small"
                                        icon={isPasswordVisible ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                                        onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                                        className={styles.eyeButton}
                                    />
                                </span>
                            </div>
                        </div>
                    }
                    closable
                    onClose={handleCloseSuccess}
                    className={styles.alert}
                />
            )}

            <Form
                layout="vertical"
                onFinish={onSubmit}
                className={styles.form}
            >
                <Controller
                    name="nombres"
                    control={control}
                    rules={{
                        required: 'El nombre es requerido',
                    }}
                    render={({ field, fieldState }) => (
                        <Form.Item
                            label={<span className={styles.label}>Nombres Completos</span>}
                            validateStatus={fieldState.error ? 'error' : undefined}
                            help={fieldState.error?.message}
                            className={styles.formItem}
                        >
                            <Input
                                {...field}
                                placeholder="Nombre completo"
                                prefix={<IconUser size={18} />}
                                size="large"
                                disabled={isLoading}
                            />
                        </Form.Item>
                    )}
                />

                <Controller
                    name="correo"
                    control={control}
                    rules={{
                        required: 'El correo es requerido',
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Correo electrónico inválido',
                        },
                    }}
                    render={({ field, fieldState }) => (
                        <Form.Item
                            label={<span className={styles.label}>Correo Electrónico</span>}
                            validateStatus={fieldState.error ? 'error' : undefined}
                            help={fieldState.error?.message}
                            className={styles.formItem}
                        >
                            <Input
                                {...field}
                                placeholder="correo@dulcecontrol.pe"
                                prefix={<IconMail size={18} />}
                                size="large"
                                disabled={isLoading}
                            />
                        </Form.Item>
                    )}
                />

                <Controller
                    name="contrasena"
                    control={control}
                    rules={{
                        required: 'La contraseña es requerida',
                        minLength: {
                            value: 8,
                            message: 'La contraseña debe tener al menos 8 caracteres',
                        },
                        maxLength: {
                            value: 64,
                            message: 'La contraseña no puede exceder 64 caracteres',
                        },
                    }}
                    render={({ field, fieldState }) => (
                        <Form.Item
                            label={<span className={styles.label}>Contraseña</span>}
                            validateStatus={fieldState.error ? 'error' : undefined}
                            help={fieldState.error?.message}
                            className={styles.formItem}
                        >
                            <Input.Password
                                {...field}
                                placeholder="Mínimo 8 caracteres"
                                prefix={<IconLock size={18} />}
                                size="large"
                                disabled={isLoading}
                            />
                        </Form.Item>
                    )}
                />

                <div className={styles.documentRow}>
                    <Controller
                        name="tipoDoc"
                        control={control}
                        rules={{
                            required: 'El tipo de documento es requerido',
                        }}
                        render={({ field, fieldState }) => (
                            <Form.Item
                                label={<span className={styles.label}>Tipo de Documento</span>}
                                validateStatus={fieldState.error ? 'error' : undefined}
                                help={fieldState.error?.message}
                                className={styles.formItemSmall}
                            >
                                <Select
                                    {...field}
                                    size="large"
                                    disabled={isLoading}
                                >
                                    <Option value="DNI">DNI</Option>
                                    <Option value="RUC">RUC</Option>
                                </Select>
                            </Form.Item>
                        )}
                    />

                    <Controller
                        name="numeroDoc"
                        control={control}
                        rules={{
                            maxLength: {
                                value: 20,
                                message: 'Máximo 20 caracteres',
                            },
                        }}
                        render={({ field, fieldState }) => (
                            <Form.Item
                                label={<span className={styles.label}>Número de Documento</span>}
                                validateStatus={fieldState.error ? 'error' : undefined}
                                help={fieldState.error?.message}
                                className={styles.formItemLarge}
                            >
                                <Input
                                    {...field}
                                    placeholder="Número de documento"
                                    prefix={<IconId size={18} />}
                                    size="large"
                                    disabled={isLoading}
                                />
                            </Form.Item>
                        )}
                    />
                </div>

                <Space size="middle" className={styles.buttonGroup}>
                    <Button
                        icon={<IconTrash size={18} />}
                        onClick={handleClearForm}
                        disabled={isLoading}
                        size="large"
                    >
                        Limpiar
                    </Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        icon={<IconUserPlus size={18} />}
                        loading={isLoading}
                        size="large"
                        block
                    >
                        Registrar Usuario
                    </Button>
                </Space>
            </Form>
        </Card>
    </div>
    );
};
