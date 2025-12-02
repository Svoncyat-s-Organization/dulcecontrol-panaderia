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
                    name="asignadoAId"
                    label="Asignado a (ID opcional)"
                    tooltip="Si ya asignaste este ticket a un superadmin, coloca su ID numérico."
                    rules={[
                        {
                            validator: (_, value) => {
                                if (!value || !value.trim()) {
                                    return Promise.resolve();
                                }

                                const trimmed = value.trim();
                                if (/^\d+$/.test(trimmed)) {
                                    return Promise.resolve();
                                }

                                return Promise.reject(new Error('Ingresa solo números positivos.'));
                            },
                        },
                    ]}
                >
                    <Input placeholder="Ej. 102" inputMode="numeric" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default TicketForm;
