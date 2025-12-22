import React from 'react';
import { Modal, Form, Input, Select, Row, Col } from 'antd';
import { TIENDA_ESTADO_OPTIONS } from '../../constants/tiendaOptions';

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
        return Promise.reject(new Error(`Ingresa un teléfono válido (ej. +51 987 678 456, ${TELEFONO_MIN_DIGITS}-${TELEFONO_MAX_DIGITS} dígitos)`));
    }

    return Promise.resolve();
};

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
                    <Col span={24}>
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
                            rules={[
                                { max: 50, message: 'Máximo 50 caracteres' },
                                { validator: telefonoValidator },
                            ]}
                        >
                            <Input autoComplete="off" maxLength={50} />
                        </Form.Item>
                    </Col>
                </Row>

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
