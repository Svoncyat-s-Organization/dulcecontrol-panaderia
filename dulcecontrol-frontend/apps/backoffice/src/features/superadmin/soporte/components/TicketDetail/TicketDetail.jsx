import React, { useEffect } from 'react';
import { Card, Descriptions, Empty, Form, Input, Select, Space, Spin, Switch, Button, Divider, List, Typography, Tag } from 'antd';
import { MessageOutlined, SendOutlined, RedoOutlined } from '@ant-design/icons';
import { ESTADO_TICKET_META, ESTADO_TICKET_OPTIONS, PRIORIDAD_TICKET_META, PRIORIDAD_TICKET_OPTIONS, TIPO_REMITENTE_META } from '../../constants/index.js';
import { formatDateTime } from '../../utils/formatters.js';

const { Title, Text, Paragraph } = Typography;

const TicketDetail = ({
    ticket,
    loadingTicket,
    updatingTicket,
    onUpdateTicket,
    messages,
    loadingMessages,
    creatingMessage,
    onCreateMessage,
    onRefreshMessages,
}) => {
    const [form] = Form.useForm();
    const [messageForm] = Form.useForm();

    useEffect(() => {
        if (ticket) {
            form.setFieldsValue({
                asignadoAId: ticket.asignadoAId ?? '',
                prioridad: ticket.prioridad ?? undefined,
                estado: ticket.estado ?? undefined,
            });
        } else {
            form.resetFields();
        }
    }, [ticket, form]);

    useEffect(() => {
        messageForm.resetFields();
    }, [ticket, messageForm]);

    if (!ticket && !loadingTicket) {
        return (
            <Card style={{ minHeight: 480, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Empty description="Selecciona un ticket para ver los detalles" />
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
                                <Paragraph type="secondary" style={{ marginBottom: 0 }}>Ticket #{ticket?.id}</Paragraph>
                            </div>
                            <Space>
                                {ticket?.estado && (
                                    <Tag color={ESTADO_TICKET_META[ticket.estado]?.color}>{ESTADO_TICKET_META[ticket.estado]?.label ?? ticket.estado}</Tag>
                                )}
                                {ticket?.prioridad && (
                                    <Tag color={PRIORIDAD_TICKET_META[ticket.prioridad]?.color}>{PRIORIDAD_TICKET_META[ticket.prioridad]?.label ?? ticket.prioridad}</Tag>
                                )}
                            </Space>
                        </div>

                        <Descriptions bordered column={1} size="small">
                            <Descriptions.Item label="Asignado a (ID)">
                                {ticket?.asignadoAId ?? 'Sin asignar'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Tienda">
                                {ticket?.tiendaNombre ?? '—'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Creado">
                                {formatDateTime(ticket?.creadoEn)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Última actualización">
                                {formatDateTime(ticket?.actualizadoEn)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Primera respuesta">
                                {formatDateTime(ticket?.primeraRespuestaEn)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Resuelto">
                                {formatDateTime(ticket?.resueltoEn)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Vencimiento SLA">
                                {formatDateTime(ticket?.vencimientoSlaEn)}
                            </Descriptions.Item>
                        </Descriptions>

                        <Divider orientation="left">Actualizar ticket</Divider>
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onUpdateTicket}
                        >
                            <Form.Item
                                name="asignadoAId"
                                label="Asignado a (ID opcional)"
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
                            <Form.Item name="prioridad" label="Prioridad">
                                <Select options={PRIORIDAD_TICKET_OPTIONS} allowClear placeholder="Selecciona" />
                            </Form.Item>
                            <Form.Item name="estado" label="Estado">
                                <Select options={ESTADO_TICKET_OPTIONS} allowClear placeholder="Selecciona" />
                            </Form.Item>
                            <Space>
                                <Button type="primary" htmlType="submit" loading={updatingTicket}>Guardar cambios</Button>
                                <Button
                                    onClick={() => {
                                        if (!ticket) {
                                            form.resetFields();
                                            return;
                                        }
                                        form.setFieldsValue({
                                            asignadoAId: ticket.asignadoAId ?? '',
                                            prioridad: ticket.prioridad ?? undefined,
                                            estado: ticket.estado ?? undefined,
                                        });
                                    }}
                                >
                                    Restablecer
                                </Button>
                            </Space>
                        </Form>
                    </Space>
                )}
            </Card>

            <Card title={(<Space><MessageOutlined /><span>Mensajes</span></Space>)} extra={
                <Button icon={<RedoOutlined />} onClick={onRefreshMessages} disabled={loadingMessages || !ticket}>Actualizar</Button>
            }>
                {loadingMessages && !messages?.length ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 160 }}>
                        <Spin />
                    </div>
                ) : (
                    <Space direction="vertical" size={16} style={{ width: '100%' }}>
                        <List
                            loading={loadingMessages}
                            dataSource={messages}
                            locale={{ emptyText: 'No hay mensajes registrados en este ticket.' }}
                            renderItem={(item) => (
                                <List.Item key={item.id}>
                                    <List.Item.Meta
                                        title={
                                            <Space size={8}>
                                                <Text strong>
                                                    {TIPO_REMITENTE_META[item.tipoRemitente]?.label ?? (item.tipoRemitente ? item.tipoRemitente.toUpperCase() : 'Sin remitente')}
                                                </Text>
                                                {item.esNotaInterna && <Tag color="purple">Nota interna</Tag>}
                                            </Space>
                                        }
                                        description={
                                            <Space direction="vertical" size={4}>
                                                <Text>{item.mensaje}</Text>
                                                <Text type="secondary" style={{ fontSize: 12 }}>
                                                    {formatDateTime(item.creadoEn)}
                                                </Text>
                                            </Space>
                                        }
                                    />
                                </List.Item>
                            )}
                        />

                        <Divider orientation="left">Agregar mensaje</Divider>
                        <Form
                            form={messageForm}
                            layout="vertical"
                            onFinish={async (values) => {
                                if (!onCreateMessage) {
                                    return;
                                }
                                try {
                                    await onCreateMessage(values);
                                    messageForm.resetFields();
                                } catch (error) {
                                    // La capa contenedora ya muestra el mensaje de error.
                                }
                            }}
                        >
                            <Form.Item
                                name="mensaje"
                                label="Mensaje"
                                rules={[{ required: true, message: 'Ingresa el contenido del mensaje' }]}
                            >
                                <Input.TextArea rows={4} placeholder="Describe el avance o la comunicación con la tienda" />
                            </Form.Item>
                            <Form.Item name="esNotaInterna" label="Nota interna" valuePropName="checked" initialValue={false}>
                                <Switch />
                            </Form.Item>
                            <Button type="primary" htmlType="submit" icon={<SendOutlined />} loading={creatingMessage} disabled={!ticket}>
                                Enviar mensaje
                            </Button>
                        </Form>
                    </Space>
                )}
            </Card>
        </Space>
    );
};

export default TicketDetail;
