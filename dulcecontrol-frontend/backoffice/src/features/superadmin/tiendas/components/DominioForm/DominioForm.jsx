import React from 'react';
import { Modal, Form, Input, Select, Row, Col } from 'antd';

const { Option } = Select;

const DominioForm = ({ visible, onCancel, onSubmit, initialValues, form, loading }) => {
    return (
        <Modal
            title={initialValues ? 'Editar Dominio' : 'Nuevo Dominio'}
            open={visible}
            onCancel={onCancel}
            onOk={() => form.submit()}
            confirmLoading={loading}
            width={600}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onSubmit}
            >
                <Form.Item
                    name="tipo"
                    label="Tipo"
                    rules={[{ required: true, message: 'Seleccione el tipo' }]}
                >
                    <Select>
                        <Option value="TIENDA_VIRTUAL">Tienda Virtual</Option>
                        <Option value="ADMINISTRATIVO">Administrativo</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="urlDominio"
                    label="URL Dominio"
                    rules={[
                        { required: true, message: 'Ingrese la URL del dominio' },
                        { max: 255, message: 'Máximo 255 caracteres' },
                        {
                            pattern: /^[a-z0-9.-]+$/,
                            message: 'Usa solo letras, números, puntos y guiones',
                        },
                    ]}
                >
                    <Input placeholder="ejemplo.com" addonBefore="https://" maxLength={255} />
                </Form.Item>

                <Form.Item
                    name="urlLogo"
                    label="URL Logo"
                    rules={[{ type: 'url', message: 'Ingresa una URL válida', warningOnly: true }]}
                >
                    <Input placeholder="https://..." maxLength={500} />
                </Form.Item>

                <Form.Item
                    name="urlFavicon"
                    label="URL Favicon"
                    rules={[{ type: 'url', message: 'Ingresa una URL válida', warningOnly: true }]}
                >
                    <Input placeholder="https://..." maxLength={500} />
                </Form.Item>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="colorPrimario"
                            label="Color Primario"
                        >
                            <Input type="color" style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="colorSecundario"
                            label="Color Secundario"
                        >
                            <Input type="color" style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default DominioForm;
