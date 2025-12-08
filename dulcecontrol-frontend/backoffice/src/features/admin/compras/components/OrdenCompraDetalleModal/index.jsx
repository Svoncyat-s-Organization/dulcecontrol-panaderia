import { Modal, Descriptions, Table, Tag, Typography, Divider } from 'antd';
import { formatCurrency, formatDate } from '../../utils/formatters.js';
import { ESTADO_ORDEN_COMPRA, UNIDADES_MEDIDA, getEstadoColor } from '../../constants/enums.js';

const { Title, Text } = Typography;

const OrdenCompraDetalleModal = ({ open, onClose, orden }) => {
  if (!orden) return null;

  const columns = [
    {
      title: 'Insumo',
      dataIndex: 'nombreInsumo',
      key: 'insumo',
      render: (text) => <Text strong>{text || 'N/D'}</Text>,
    },
    {
      title: 'Cantidad',
      dataIndex: 'cantidadSolicitada',
      key: 'cantidad',
      width: 100,
      align: 'right',
      render: (value) => <Text>{value || 0}</Text>,
    },
    {
      title: 'Unidad',
      dataIndex: 'unidadCompra',
      key: 'unidad',
      width: 100,
      render: (value) => <Text>{UNIDADES_MEDIDA[value] || value || 'N/D'}</Text>,
    },
    {
      title: 'Costo Unit.',
      dataIndex: 'costoUnitarioPactadoCentimos',
      key: 'costo',
      width: 120,
      align: 'right',
      render: (value) => <Text>{formatCurrency(value)}</Text>,
    },
    {
      title: 'Total',
      dataIndex: 'totalLineaCentimos',
      key: 'total',
      width: 120,
      align: 'right',
      render: (value) => <Text strong>{formatCurrency(value)}</Text>,
    },
  ];

  return (
    <Modal
      title={`Detalles de la Orden #${orden.id}`}
      open={open}
      onCancel={onClose}
      width={900}
      footer={null}
    >
      <Descriptions bordered column={2} size="small">
        <Descriptions.Item label="Estado">
          <Tag color={getEstadoColor(orden.estado)}>
            {ESTADO_ORDEN_COMPRA[orden.estado] || orden.estado}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Fecha Emisión">
          {formatDate(orden.fechaEmision)}
        </Descriptions.Item>
        <Descriptions.Item label="Proveedor">
          {orden.nombreProveedor || 'N/D'}
        </Descriptions.Item>
        <Descriptions.Item label="Sede Destino">
          {orden.nombreSede || 'N/D'}
        </Descriptions.Item>
        <Descriptions.Item label="Fecha Recepción Esperada">
          {formatDate(orden.fechaRecepcionEsperada)}
        </Descriptions.Item>
        <Descriptions.Item label="Fecha Recepción Real">
          {orden.fechaRecepcionReal ? formatDate(orden.fechaRecepcionReal) : 'Pendiente'}
        </Descriptions.Item>
        {orden.metodoPago && (
          <Descriptions.Item label="Método de Pago" span={2}>
            {orden.metodoPago}
          </Descriptions.Item>
        )}
        {orden.referenciaPago && (
          <Descriptions.Item label="Referencia de Pago" span={2}>
            {orden.referenciaPago}
          </Descriptions.Item>
        )}
        {orden.tipoComprobanteProveedor && (
          <>
            <Descriptions.Item label="Tipo Comprobante">
              {orden.tipoComprobanteProveedor}
            </Descriptions.Item>
            <Descriptions.Item label="Serie">
              {orden.serieComprobanteProveedor || 'N/D'}
            </Descriptions.Item>
            <Descriptions.Item label="Número Comprobante" span={2}>
              {orden.numeroComprobanteProveedor || 'N/D'}
            </Descriptions.Item>
          </>
        )}
        {orden.observaciones && (
          <Descriptions.Item label="Observaciones" span={2}>
            {orden.observaciones}
          </Descriptions.Item>
        )}
      </Descriptions>

      <Divider />
      
      <Title level={5}>Detalles de Insumos</Title>
      <Table
        columns={columns}
        dataSource={orden.detalles || []}
        rowKey="id"
        pagination={false}
        size="small"
        summary={(pageData) => {
          const total = pageData.reduce((sum, item) => sum + (item.totalLineaCentimos || 0), 0);
          
          return (
            <Table.Summary fixed>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={4} align="right">
                  <Text strong>Total de la Orden:</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1} align="right">
                  <Text strong style={{ fontSize: 16 }}>{formatCurrency(total)}</Text>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          );
        }}
      />
    </Modal>
  );
};

export default OrdenCompraDetalleModal;
