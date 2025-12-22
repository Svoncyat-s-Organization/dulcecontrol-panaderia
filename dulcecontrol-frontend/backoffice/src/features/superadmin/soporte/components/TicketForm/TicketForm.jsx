import React, { useEffect } from 'react';
import { Form, Input, Modal, Select } from 'antd';
import { PRIORIDAD_TICKET_OPTIONS } from '../../constants/index.js';

const TicketForm = ({ open, onCancel, onSubmit, submitting, tiendaOptions }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (!open) {
            form.resetFields();
        }
    }, [open, form]);

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            onSubmit(values);
        } catch {
            // La validación de Ant Design mostrará los errores en el formulario.
        }
    };

    return (
        <Modal
            title="Nuevo ticket de soporte"
            open={open}
            onCancel={onCancel}
            onOk={handleOk}
            confirmLoading={submitting}
            okText="Crear ticket"
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="tiendaId"
                    label="Tienda"
                    rules={[{ required: true, message: 'Selecciona la tienda asociada al ticket.' }]}
                >
                    <Select
                        placeholder="Selecciona la tienda"
                        options={tiendaOptions}
                        showSearch
                        optionFilterProp="label"
                    />
                </Form.Item>

                <Form.Item
                    name="asunto"
                    label="Asunto"
                    rules={[{ required: true, message: 'Ingresa un asunto para el ticket.' }]}
                >
                    <Input placeholder="Ej. Ajuste de credenciales en API de Sunat" maxLength={255} />
                </Form.Item>

                <Form.Item
                    name="prioridad"
                    label="Prioridad"
                    rules={[{ required: true, message: 'Selecciona la prioridad.' }]}
                >
                    <Select placeholder="Selecciona" options={PRIORIDAD_TICKET_OPTIONS} />
                </Form.Item>

                <Form.Item
                    name="mensaje"
                    label="Mensaje"
                    rules={[
                        { required: true, message: 'Describe el detalle del ticket.' },
                        { min: 20, message: 'Detalla al menos 20 caracteres para dar contexto.' },
                    ]}
                >
                    <Input.TextArea rows={4} showCount maxLength={1000} placeholder="Describe el incidente o solicitud" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default TicketForm;
