import React, { useEffect } from 'react';
import { Form, Input, Modal, Select } from 'antd';
import { PRIORIDAD_TICKET_OPTIONS } from '../../../superadmin/soporte/constants/index.js';

const TicketRequestModal = ({ open, onCancel, onSubmit, submitting }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (!open) {
      form.resetFields();
    }
  }, [open, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSubmit?.(values);
    } catch {
      // validation handled by antd
    }
  };

  return (
    <Modal
      title="Generar ticket de soporte"
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      okText="Enviar ticket"
      confirmLoading={submitting}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="asunto"
          label="Asunto"
          rules={[
            { required: true, message: 'Ingresa el asunto del ticket' },
            { max: 255, message: 'Máximo 255 caracteres' },
          ]}
        >
          <Input placeholder="Ej. Problema con sincronización de ventas" autoComplete="off" maxLength={255} />
        </Form.Item>

        <Form.Item
          name="mensaje"
          label="Mensaje"
          rules={[
            { required: true, message: 'Describe el detalle del ticket' },
            { min: 20, message: 'Detalla al menos 20 caracteres para dar contexto' },
          ]}
        >
          <Input.TextArea rows={4} showCount maxLength={1000} placeholder="Describe el inconveniente o la solicitud" />
        </Form.Item>

        <Form.Item
          name="prioridad"
          label="Prioridad"
          rules={[{ required: true, message: 'Selecciona la prioridad' }]}
        >
          <Select placeholder="Selecciona" options={PRIORIDAD_TICKET_OPTIONS} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TicketRequestModal;
