import React from 'react';
import { Modal, Form, Input, Select, Row, Col, Switch } from 'antd';
import { USUARIO_TIPO_DOCUMENTO_OPTIONS } from '../../constants/usuarioOptions';

const DOCUMENT_LENGTHS = {
    DNI: 8,
    RUC: 11,
};

const TELEFONO_MIN_DIGITS = 9;
const TELEFONO_MAX_DIGITS = 15;

const telefonoValidator = (_, value) => {
    if (!value) {
        return Promise.resolve();
    }

    const digitsOnly = value.replace(/\D/g, '');
    if (
        digitsOnly.length < TELEFONO_MIN_DIGITS ||
        digitsOnly.length > TELEFONO_MAX_DIGITS ||
        !/^\d+$/.test(digitsOnly)
    ) {
        return Promise.reject(new Error(`Ingresa un telefono valido (ej. +51 987 678 456, ${TELEFONO_MIN_DIGITS}-${TELEFONO_MAX_DIGITS} digitos)`));
    }

    return Promise.resolve();
};

const UsuarioForm = ({
    visible,
    onCancel,
    onSubmit,
    initialValues,
    form,
    loading,
    roles,
    loadingRoles,
    sedes,
    loadingSedes,
}) => {
    const tipoDocSeleccionado = Form.useWatch('tipoDoc', form);
    const numeroDocMaxLength = DOCUMENT_LENGTHS[tipoDocSeleccionado] ?? 11;
    const esRuc = tipoDocSeleccionado === 'RUC';

    const renderOptions = (options = []) => (
        options.map((option) => (
            <Select.Option key={option.value} value={option.value}>
                {option.label}
            </Select.Option>
        ))
    );

    const nombreLabel = esRuc ? 'Razón social' : 'Nombre y apellidos';
    const nombrePlaceholder = esRuc ? 'Razón social registrada en SUNAT' : 'Nombre del usuario';
    const nombreRequiredMessage = esRuc
        ? 'Ingresa la razón social'
        : 'Ingresa el nombre completo';
    const numeroDocLabel = esRuc ? 'RUC' : 'Número de documento';
    const numeroDocPlaceholder = esRuc ? '20123456789' : 'Ingresa el número de documento';
    const numeroDocRequiredMessage = esRuc ? 'Ingresa el RUC' : 'Ingresa el número de documento';

    return (
        <Modal
            title={initialValues ? 'Editar usuario' : 'Registrar usuario'}
            open={visible}
            onCancel={onCancel}
            onOk={() => form.submit()}
            confirmLoading={loading}
            width={720}
        >
            <Form form={form} layout="vertical" onFinish={onSubmit}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="rolId"
                            label="Rol asignado"
                            rules={[{ required: true, message: 'Selecciona un rol' }]}
                        >
                            <Select
                                placeholder="Selecciona un rol"
                                loading={loadingRoles}
                                allowClear
                                showSearch
                                optionFilterProp="children"
                            >
                                {renderOptions(roles)}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="sedeIds"
                            label="Sedes asignadas"
                            rules={[{ required: true, message: 'Selecciona al menos una sede' }]}
                        >
                            <Select
                                mode="multiple"
                                placeholder="Selecciona una o varias sedes"
                                loading={loadingSedes}
                                optionFilterProp="children"
                                showSearch
                            >
                                {renderOptions(sedes)}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="correo"
                            label="Correo corporativo"
                            rules={[
                                { required: true, message: 'Ingresa el correo' },
                                { type: 'email', message: 'Formato de correo inválido' },
                                { max: 255, message: 'Máximo 255 caracteres' },
                            ]}
                        >
                            <Input placeholder="usuario@empresa.com" autoComplete="off" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item
                            name="tipoDoc"
                            label="Tipo de documento"
                            rules={[{ required: true, message: 'Selecciona el tipo de documento' }]}
                        >
                            <Select placeholder="Selecciona" allowClear>
                                {renderOptions(USUARIO_TIPO_DOCUMENTO_OPTIONS)}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="numeroDoc"
                            label={numeroDocLabel}
                            dependencies={['tipoDoc']}
                            rules={[
                                { required: true, message: numeroDocRequiredMessage },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value) {
                                            return Promise.resolve();
                                        }

                                        const tipoDocumento = getFieldValue('tipoDoc');
                                        if (!tipoDocumento) {
                                            return Promise.reject(new Error('Selecciona el tipo de documento'));
                                        }

                                        if (!/^\d+$/.test(value)) {
                                            return Promise.reject(new Error('Solo se permiten números'));
                                        }

                                        const expectedLength = DOCUMENT_LENGTHS[tipoDocumento] ?? 0;
                                        if (expectedLength && value.length !== expectedLength) {
                                            return Promise.reject(new Error(`El ${tipoDocumento} debe tener ${expectedLength} dígitos`));
                                        }

                                        return Promise.resolve();
                                    },
                                }),
                            ]}
                        >
                            <Input
                                autoComplete="off"
                                maxLength={numeroDocMaxLength}
                                inputMode="numeric"
                                pattern="[0-9]*"
                                placeholder={numeroDocPlaceholder}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="telefono"
                            label="Teléfono"
                            rules={[
                                { max: 50, message: 'Maximo 50 caracteres' },
                                { validator: telefonoValidator },
                            ]}
                        >
                            <Input autoComplete="off" maxLength={50} />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    name="nombres"
                    label={nombreLabel}
                    rules={[
                        { required: true, message: nombreRequiredMessage },
                        { max: 255, message: 'Máximo 255 caracteres' },
                    ]}
                >
                    <Input placeholder={nombrePlaceholder} autoComplete="off" />
                </Form.Item>

                {!initialValues ? (
                    <Form.Item
                        name="contrasena"
                        label="Contraseña inicial"
                        rules={[
                            { required: true, message: 'Ingresa una contraseña' },
                            { min: 8, message: 'Debe tener al menos 8 caracteres' },
                            { max: 64, message: 'Máximo 64 caracteres' },
                            { whitespace: true, message: 'La contraseña no puede estar vacía' },
                        ]}
                    >
                        <Input.Password autoComplete="new-password" />
                    </Form.Item>
                ) : (
                    <Form.Item
                        name="nuevaContrasena"
                        label="Actualizar contraseña"
                        extra="Déjalo vacío si no deseas modificar la contraseña"
                        rules={[
                            { min: 8, message: 'Debe tener al menos 8 caracteres' },
                            { max: 64, message: 'Máximo 64 caracteres' },
                        ]}
                    >
                        <Input.Password autoComplete="new-password" />
                    </Form.Item>
                )}

                <Form.Item name="activo" label="Estado" valuePropName="checked">
                    <Switch checkedChildren="Activo" unCheckedChildren="Inactivo" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UsuarioForm;
