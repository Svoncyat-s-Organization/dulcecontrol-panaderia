import React, { useState } from 'react';
import { Button, Card, Col, Row, Space, Typography, message } from 'antd';
import { IconHeartHandshake, IconMessagePlus } from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import TicketRequestModal from '../components/TicketRequestModal.jsx';
import { createTicket } from '../../../../api/admin/soporte/tickets.js';
import { createMessage as createTicketMessage } from '../../../../api/superadmin/soporte/mensajes.js';
import { useTokenStore } from '../../../../shared/store/tokenStore.js';
import TicketListContainer from '../components/TicketList/index.jsx';
import TicketDetailContainer from '../components/TicketDetail/index.jsx';

const { Title, Paragraph, Text } = Typography;

const SoportePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const tiendaId = useTokenStore((state) => state.tiendaId);
  const queryClient = useQueryClient();

  const createTicketMutation = useMutation({
    mutationFn: async ({ asunto, mensaje, prioridad }) => {
      if (!tiendaId) {
        throw new Error('No se encontró la tienda activa para registrar el ticket.');
      }

      const trimmedAsunto = asunto?.trim();
      const trimmedMensaje = mensaje?.trim();

      const ticket = await createTicket(tiendaId, {
        asunto: trimmedAsunto,
        prioridad,
      });

      if (trimmedMensaje) {
        await createTicketMessage({
          ticketId: ticket.id,
          tipoRemitente: 'tienda',
          mensaje: trimmedMensaje,
          esNotaInterna: false,
        });
      }

      return ticket;
    },
    onSuccess: (ticket) => {
      message.success('Ticket enviado correctamente. Nuestro equipo te contactará pronto.');
      setIsModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['admin', 'soporte', 'tickets', tiendaId] });
      setSelectedTicketId(ticket?.id ?? null);
    },
    onError: (error) => {
      const backendMessage = error?.response?.data?.message || error?.message;
      message.error(backendMessage || 'No pudimos registrar el ticket. Intenta nuevamente.');
    },
  });

  const handleSubmit = (values) => {
    createTicketMutation.mutate(values);
  };

  return (
    <Space direction="vertical" size={24} style={{ width: '100%' }}>
      <div>
        <Title level={2} style={{ marginBottom: 8 }}>Centro de soporte</Title>
        <Paragraph type="secondary" style={{ margin: 0 }}>
          Registra incidencias o solicitudes para que el equipo de DulceControl pueda ayudarte.
        </Paragraph>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={14}>
          <Card>
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
              <Space align="center" size={12}>
                <IconHeartHandshake size={28} stroke={1.5} />
                <div>
                  <Title level={4} style={{ margin: 0 }}>¿Necesitas ayuda?</Title>
                  <Text type="secondary">Genera un ticket y nuestro equipo responderá en la bandeja del Superadmin.</Text>
                </div>
              </Space>
              <Paragraph>
                Describe tu solicitud con el mayor detalle posible y adjunta enlaces o referencias relevantes.
                Mientras más contexto compartas, más rápido podremos ayudarte.
              </Paragraph>
              <Button
                type="primary"
                icon={<IconMessagePlus size={16} />}
                onClick={() => setIsModalOpen(true)}
              >
                Generar ticket
              </Button>
            </Space>
          </Card>
        </Col>
        <Col xs={24} md={10}>
          <Card title="Consejos para priorizar">
            <Space direction="vertical" size={12}>
              <Text strong>• Baja:</Text>
              <Paragraph style={{ margin: 0 }}>Consultas informativas o ajustes sin impacto operativo.</Paragraph>
              <Text strong>• Media:</Text>
              <Paragraph style={{ margin: 0 }}>Comportamientos inesperados con soluciones alternativas temporales.</Paragraph>
              <Text strong>• Alta:</Text>
              <Paragraph style={{ margin: 0 }}>Bloqueos para tus ventas o integraciones críticas.</Paragraph>
              <Text strong>• Crítica:</Text>
              <Paragraph style={{ margin: 0 }}>Sistema fuera de servicio o compromiso legal inmediato.</Paragraph>
            </Space>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={10} xl={9}>
          <Card style={{ height: '100%' }}>
            <TicketListContainer
              tiendaId={tiendaId}
              searchTerm={searchTerm}
              onSearchTermChange={setSearchTerm}
              selectedTicketId={selectedTicketId}
              onSelect={setSelectedTicketId}
              onCreate={() => setIsModalOpen(true)}
            />
          </Card>
        </Col>
        <Col xs={24} lg={14} xl={15}>
          <TicketDetailContainer ticketId={selectedTicketId} tiendaId={tiendaId} />
        </Col>
      </Row>

      <TicketRequestModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        submitting={createTicketMutation.isPending}
      />
    </Space>
  );
};

export default SoportePage;
