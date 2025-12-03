import React from 'react';
import { Modal, Form, Input, Select, Row, Col, Switch } from 'antd';
import { USUARIO_TIPO_DOCUMENTO_OPTIONS } from '../../constants/usuarioOptions';

const UsuarioForm = ({
    visible,
    onCancel,
    onSubmit,
    initialValues,
    form,
    loading,
    roles,
    loadingRoles,
}) => {
    const renderOptions = (options = []) => (
        options.map((option) => (
            <Select.Option key={option.value} value={option.value}>
                {option.label}
            </Select.Option>
        ))
    );

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
                            label="Número de documento"
                            rules={[
                                { required: true, message: 'Ingresa el número de documento' },
                                {
                                    pattern: /^[0-9A-Za-z]{6,20}$/,
                                    message: 'Ingresa entre 6 y 20 caracteres alfanuméricos',
                                },
                            ]}
                        >
                            <Input autoComplete="off" maxLength={20} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="telefono"
                            label="Teléfono"
                            rules={[{ max: 50, message: 'Máximo 50 caracteres' }]}
                        >
                            <Input autoComplete="off" maxLength={50} />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    name="nombres"
                    label="Nombre y apellidos"
                    rules={[
                        { required: true, message: 'Ingresa el nombre completo' },
                        { max: 255, message: 'Máximo 255 caracteres' },
                    ]}
                >
                    <Input placeholder="Nombre del usuario" autoComplete="off" />
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
