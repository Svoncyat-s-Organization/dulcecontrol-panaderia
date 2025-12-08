import { useQuery } from '@tanstack/react-query';
import { Modal, Descriptions, Tag, List, Typography, Divider, Space, Spin } from 'antd';
import { getCliente } from '../../api/clientes.api.js';
import { getDireccionesCliente } from '../../api/direcciones-cliente.api.js';
import { CLIENTE_KEYS, DIRECCION_CLIENTE_KEYS } from '../../constants/queryKeys.js';
import { mapClienteResponse, mapDireccionesClienteResponse } from '../../utils/clienteMappers.js';

const { Text, Title } = Typography;

const ClienteViewModal = ({ open, onClose, tiendaId, cliente }) => {
  const { data: clienteData, isLoading: clienteLoading } = useQuery({
    queryKey: CLIENTE_KEYS.detail(tiendaId, cliente?.id),
    queryFn: () => getCliente(tiendaId, cliente?.id),
    enabled: open && Boolean(tiendaId) && Boolean(cliente?.id),
    select: mapClienteResponse,
  });

  const { data: direccionesData = [], isLoading: direccionesLoading } = useQuery({
    queryKey: DIRECCION_CLIENTE_KEYS.lists(tiendaId, cliente?.id),
    queryFn: () => getDireccionesCliente(tiendaId, cliente?.id),
    enabled: open && Boolean(tiendaId) && Boolean(cliente?.id),
    select: mapDireccionesClienteResponse,
  });

  const loading = clienteLoading || direccionesLoading;

  return (
    <Modal
      title="Detalles del Cliente"
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
      destroyOnHidden
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Spin size="large" />
        </div>
      ) : clienteData ? (
        <div>
          <Title level={5} style={{ marginBottom: 16 }}>
            Información General
          </Title>

          <Descriptions bordered column={2} size="small">
            <Descriptions.Item label="Nombre">{clienteData.nombreDoc}</Descriptions.Item>
            <Descriptions.Item label="Tipo Documento">
              <Tag color="blue">{clienteData.tipoDoc}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Número Documento">{clienteData.numeroDoc}</Descriptions.Item>
            <Descriptions.Item label="Email">{clienteData.email || 'No especificado'}</Descriptions.Item>
            <Descriptions.Item label="Teléfono">{clienteData.telefono || 'No especificado'}</Descriptions.Item>
            <Descriptions.Item label="Tipo Cliente">
              <Tag color={clienteData.esUsuarioVirtual ? 'geekblue' : 'orange'}>
                {clienteData.esUsuarioVirtual ? 'Usuario Virtual' : 'Cliente Físico'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Estado">
              <Tag color={clienteData.activo ? 'green' : 'red'}>
                {clienteData.activo ? 'Activo' : 'Inactivo'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Fecha Creación" span={2}>
              {new Date(clienteData.creadoEn).toLocaleString('es-PE')}
            </Descriptions.Item>
            <Descriptions.Item label="Última Actualización" span={2}>
              {new Date(clienteData.actualizadoEn).toLocaleString('es-PE')}
            </Descriptions.Item>
            {clienteData.notas && (
              <Descriptions.Item label="Notas" span={2}>
                {clienteData.notas}
              </Descriptions.Item>
            )}
          </Descriptions>

          <Divider />

          <Title level={5} style={{ marginBottom: 16 }}>
            Direcciones ({direccionesData.length})
          </Title>

          {direccionesData.length === 0 ? (
            <Text type="secondary">No hay direcciones registradas</Text>
          ) : (
            <List
              dataSource={direccionesData}
              renderItem={(direccion) => (
                <List.Item>
                  <div style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <Space>
                        {direccion.etiqueta && <Text strong>{direccion.etiqueta}</Text>}
                        <Tag color={direccion.esFiscal ? 'gold' : 'default'}>
                          {direccion.esFiscal ? 'Fiscal' : 'Entrega'}
                        </Tag>
                        {direccion.esEntrega && (
                          <Tag color="green">Entrega</Tag>
                        )}
                      </Space>
                    </div>

                    <div style={{ marginBottom: 8 }}>
                      <Text>{direccion.direccionCompleta}</Text>
                    </div>

                    {direccion.referencia && (
                      <div style={{ marginBottom: 8 }}>
                        <Text type="secondary">Referencia: {direccion.referencia}</Text>
                      </div>
                    )}

                    <Space>
                      {direccion.codigoPostal && (
                        <Text type="secondary">CP: {direccion.codigoPostal}</Text>
                      )}
                      <Text type="secondary">
                        Registrada: {new Date(direccion.creadoEn).toLocaleDateString('es-PE')}
                      </Text>
                    </Space>
                  </div>
                </List.Item>
              )}
            />
          )}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Text type="secondary">No se pudo cargar la información del cliente</Text>
        </div>
      )}
    </Modal>
  );
};

export default ClienteViewModal;