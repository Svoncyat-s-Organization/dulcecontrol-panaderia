import React from 'react';
import { Modal, Form, Input, Checkbox, Row, Col, Select } from 'antd';

const SedeForm = ({ visible, onCancel, onSubmit, initialValues, form, loading }) => {
    return (
        <Modal
            title={initialValues ? 'Editar sede' : 'Registrar sede'}
            open={visible}
            onCancel={onCancel}
            onOk={() => form.submit()}
            confirmLoading={loading}
            width={640}
        >
            <Form form={form} layout="vertical" onFinish={onSubmit}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="nombre"
                            label="Nombre de la sede"
                            rules={[
                                { required: true, message: 'Ingresa el nombre de la sede' },
                                { max: 100, message: 'Máximo 100 caracteres' },
                            ]}
                        >
                            <Input placeholder="Ej. Sede central" autoComplete="off" maxLength={100} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="codigoInterno"
                            label="Código interno"
                            rules={[{ max: 50, message: 'Máximo 50 caracteres' }]}
                        >
                            <Input placeholder="Ej. SED-001" autoComplete="off" maxLength={50} />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    name="direccion"
                    label="Dirección"
                    rules={[
                        { required: true, message: 'Ingresa la dirección' },
                        { max: 500, message: 'Máximo 500 caracteres' },
                    ]}
                >
                    <Input.TextArea rows={2} autoComplete="off" maxLength={500} showCount />
                </Form.Item>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="telefono"
                            label="Teléfono de contacto"
                            rules={[{ max: 50, message: 'Máximo 50 caracteres' }]}
                        >
                            <Input autoComplete="off" maxLength={50} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="distritoId" label="Distrito (opcional)">
                            <Select
                                showSearch
                                allowClear
                                placeholder="Selecciona o escribe"
                                optionFilterProp="label"
                                options={[]}
                                disabled
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item name="esPrincipal" valuePropName="checked">
                    <Checkbox>Es sede principal</Checkbox>
                </Form.Item>

                {initialValues && (
                    <Form.Item name="activo" valuePropName="checked">
                        <Checkbox>Sede activa</Checkbox>
                    </Form.Item>
                )}
            </Form>
        </Modal>
    );
};

export default SedeForm;
