import React, { useEffect } from 'react';
import { Button, Card, Descriptions, Empty, Form, Input, List, Space, Spin, Tag, Typography } from 'antd';
import { MessageOutlined, SendOutlined, RedoOutlined } from '@ant-design/icons';
import { ESTADO_TICKET_META, PRIORIDAD_TICKET_META, TIPO_REMITENTE_META } from '../../../../superadmin/soporte/constants/index.js';
import { formatDateTime } from '../../../../superadmin/soporte/utils/formatters.js';

const { Title, Text } = Typography;

const TicketDetail = ({
  ticket,
  loadingTicket,
  messages,
  loadingMessages,
  creatingMessage,
  onCreateMessage,
  onRefreshMessages,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
  }, [ticket, form]);

  if (!ticket && !loadingTicket) {
    return (
      <Card style={{ minHeight: 520, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Empty description="Selecciona un ticket para ver el detalle" />
      </Card>
    );
  }

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Card>
        {loadingTicket && !ticket ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
            <Spin />
          </div>
        ) : (
          <Space direction="vertical" size={20} style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Title level={4} style={{ margin: 0 }}>{ticket?.asunto}</Title>
                <Text type="secondary">Ticket #{ticket?.id}</Text>
              </div>
              <Space>
                {ticket?.estado && (
                  <Tag color={ESTADO_TICKET_META[ticket.estado]?.color}>
                    {ESTADO_TICKET_META[ticket.estado]?.label ?? ticket.estado}
                  </Tag>
                )}
                {ticket?.prioridad && (
                  <Tag color={PRIORIDAD_TICKET_META[ticket.prioridad]?.color}>
                    {PRIORIDAD_TICKET_META[ticket.prioridad]?.label ?? ticket.prioridad}
                  </Tag>
                )}
              </Space>
            </div>

            <Descriptions bordered size="small" column={1}>
              <Descriptions.Item label="Estado">{ESTADO_TICKET_META[ticket?.estado]?.label ?? ticket?.estado ?? '—'}</Descriptions.Item>
              <Descriptions.Item label="Prioridad">{PRIORIDAD_TICKET_META[ticket?.prioridad]?.label ?? ticket?.prioridad ?? '—'}</Descriptions.Item>
              <Descriptions.Item label="Creado">{formatDateTime(ticket?.creadoEn)}</Descriptions.Item>
              <Descriptions.Item label="Última actualización">{formatDateTime(ticket?.actualizadoEn)}</Descriptions.Item>
              <Descriptions.Item label="Vencimiento SLA">{formatDateTime(ticket?.vencimientoSlaEn)}</Descriptions.Item>
            </Descriptions>
          </Space>
        )}
      </Card>

      <Card
        title={(<Space><MessageOutlined /><span>Conversación</span></Space>)}
        extra={(
          <Button icon={<RedoOutlined />} onClick={onRefreshMessages} disabled={loadingMessages || !ticket}>
            Actualizar
          </Button>
        )}
      >
        {loadingMessages && !messages?.length ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 160 }}>
            <Spin />
          </div>
        ) : (
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            <List
              dataSource={messages}
              loading={loadingMessages}
              locale={{ emptyText: 'Aún no hay mensajes en este ticket.' }}
              renderItem={(item) => (
                <List.Item key={item.id}>
                  <List.Item.Meta
                    title={(
                      <Space size={8}>
                        <Text strong>{TIPO_REMITENTE_META[item.tipoRemitente]?.label ?? item.tipoRemitente ?? 'Sin remitente'}</Text>
                      </Space>
                    )}
                    description={(
                      <Space direction="vertical" size={4}>
                        <Text>{item.mensaje}</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>{formatDateTime(item.creadoEn)}</Text>
                      </Space>
                    )}
                  />
                </List.Item>
              )}
            />

            <Form
              form={form}
              layout="vertical"
              onFinish={async (values) => {
                if (!values.mensaje?.trim()) {
                  return;
                }
                await onCreateMessage?.({ mensaje: values.mensaje.trim() });
                form.resetFields();
              }}
            >
              <Form.Item
                name="mensaje"
                label="Enviar mensaje"
                rules={[{ required: true, message: 'Escribe un mensaje para enviarlo' }]}
              >
                <Input.TextArea rows={4} placeholder="Describe el avance o agrega más detalles" showCount maxLength={1000} />
              </Form.Item>
              <Button type="primary" htmlType="submit" icon={<SendOutlined />} loading={creatingMessage} disabled={!ticket}>
                Enviar
              </Button>
            </Form>
          </Space>
        )}
      </Card>
    </Space>
  );
};

export default TicketDetail;
