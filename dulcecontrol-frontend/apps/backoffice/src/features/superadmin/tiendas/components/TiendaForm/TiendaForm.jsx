import React from 'react';
import { Modal, Form, Input, Select, Row, Col } from 'antd';
import { TIENDA_ESTADO_OPTIONS, TIENDA_TIPO_DOCUMENTO_OPTIONS } from '../../constants/tiendaOptions';

const TiendaForm = ({ visible, onCancel, onSubmit, initialValues, form, loading }) => {
    const renderSelectOptions = (options) =>
        options.map((option) => (
            <Select.Option key={option.value} value={option.value}>
                {option.label}
            </Select.Option>
        ));

    return (
        <Modal
            title={initialValues ? 'Editar tienda' : 'Registrar tienda'}
            open={visible}
            onCancel={onCancel}
            onOk={() => form.submit()}
            confirmLoading={loading}
            width={800}
        >
            <Form form={form} layout="vertical" onFinish={onSubmit}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="nombreComercial"
                            label="Nombre comercial"
                            rules={[
                                { required: true, message: 'Ingresa el nombre comercial' },
                                { max: 255, message: 'Máximo 255 caracteres' },
                            ]}
                        >
                            <Input placeholder="Ej. Panadería Dulce Sabor" autoComplete="off" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="slug"
                            label="Slug (URL amigable)"
                            normalize={(value) =>
                                value
                                    ? value
                                        .normalize('NFD')
                                        .replace(/[^\p{ASCII}]/gu, '')
                                        .toLowerCase()
                                        .replace(/[^a-z0-9]+/g, '-')
                                        .replace(/^-+|-+$/g, '')
                                    : value
                            }
                            rules={[
                                { required: true, message: 'Ingresa el slug de la tienda' },
                                { max: 100, message: 'Máximo 100 caracteres' },
                                {
                                    pattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                                    message: 'Usa solo minúsculas, números y guiones medios',
                                },
                            ]}
                        >
                            <Input placeholder="Ej. dulce-sabor" autoComplete="off" maxLength={100} />
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
                            <Select placeholder="Selecciona">{renderSelectOptions(TIENDA_TIPO_DOCUMENTO_OPTIONS)}</Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="numeroDoc"
                            label="Número de documento"
                            rules={[
                                { required: true, message: 'Ingresa el número de documento' },
                                {
                                    pattern: /^[0-9]{8,20}$/,
                                    message: 'Solo números (8 a 20 dígitos)',
                                },
                            ]}
                        >
                            <Input maxLength={20} autoComplete="off" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="nombreDoc"
                            label="Razón social / Titular"
                            rules={[
                                { required: true, message: 'Ingresa la razón social o nombre completo' },
                                { max: 255, message: 'Máximo 255 caracteres' },
                            ]}
                        >
                            <Input autoComplete="off" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="correoContacto"
                            label="Correo de contacto"
                            rules={[
                                { required: true, message: 'Ingresa el correo de contacto' },
                                { type: 'email', message: 'El correo ingresado no es válido' },
                                { max: 255, message: 'Máximo 255 caracteres' },
                            ]}
                        >
                            <Input autoComplete="off" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="telefonoContacto"
                            label="Teléfono de contacto"
                            rules={[{ max: 50, message: 'Máximo 50 caracteres' }]}
                        >
                            <Input autoComplete="off" maxLength={50} />
                        </Form.Item>
                    </Col>
                </Row>

                {!initialValues ? (
                    <Form.Item
                        name="contrasena"
                        label="Contraseña provisional"
                        rules={[
                            { required: true, message: 'Ingresa una contraseña provisional' },
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
                        extra="Déjalo vacío si no necesitas modificar la contraseña actual"
                        rules={[
                            { min: 8, message: 'Debe tener al menos 8 caracteres' },
                            { max: 64, message: 'Máximo 64 caracteres' },
                        ]}
                    >
                        <Input.Password autoComplete="new-password" />
                    </Form.Item>
                )}

                <Form.Item
                    name="estado"
                    label="Estado"
                    rules={[{ required: true, message: 'Selecciona el estado' }]}
                >
                    <Select placeholder="Selecciona el estado">{renderSelectOptions(TIENDA_ESTADO_OPTIONS)}</Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default TiendaForm;
