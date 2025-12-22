import React from 'react';
import { Modal, Table, Empty, Tag } from 'antd';
import { formatCurrency, formatDate } from '../../utils/formatters.js';

const HistorialPagosModalView = ({ open, onClose, pagos, loading, ordenCompra }) => {
  const columns = [
    {
      title: 'Fecha',
      dataIndex: 'fechaPago',
      key: 'fecha',
      width: 110,
      render: (fecha) => formatDate(fecha),
    },
    {
      title: 'Monto',
      dataIndex: 'montoPagadoCentimos',
      key: 'monto',
      width: 120,
      render: (monto) => <span style={{ fontWeight: 600, color: '#52c41a' }}>{formatCurrency(monto)}</span>,
    },
    {
      title: 'Tipo de Pago',
      dataIndex: 'metodoPago',
      key: 'metodoPago',
      width: 130,
      render: (tipo) => {
        if (!tipo) return '-';
        return <Tag color="blue">{tipo.charAt(0).toUpperCase() + tipo.slice(1)}</Tag>;
      },
    },
    {
      title: 'Referencia',
      dataIndex: 'referenciaPago',
      key: 'referencia',
      width: 150,
      ellipsis: true,
      render: (ref) => ref || '-',
    },
    {
      title: 'Observaciones',
      dataIndex: 'observaciones',
      key: 'observaciones',
      ellipsis: true,
      render: (obs) => obs || '-',
    },
  ];

  return (
    <Modal
      title="Historial de Pagos"
      open={open}
      onCancel={onClose}
      footer={null}
      width="95%"
      style={{ maxWidth: 900 }}
    >
      {ordenCompra && (
        <div style={{ marginBottom: 16, padding: 12, backgroundColor: '#f5f5f5', borderRadius: 4 }}>
          <div><strong>Proveedor:</strong> {ordenCompra.nombreProveedor}</div>
          <div><strong>Total Orden:</strong> {formatCurrency(ordenCompra.totalCompraCentimos)}</div>
          <div><strong>Monto Pagado:</strong> {formatCurrency(ordenCompra.montoPagadoCentimos || 0)}</div>
          <div>
            <strong>Saldo Pendiente:</strong>{' '}
            <Tag color={(ordenCompra.saldoPendienteCentimos || 0) > 0 ? 'red' : 'green'}>
              {formatCurrency(ordenCompra.saldoPendienteCentimos || 0)}
            </Tag>
          </div>
        </div>
      )}

      <Table
        columns={columns}
        dataSource={pagos}
        loading={loading}
        rowKey="id"
        scroll={{ x: 600 }}
        pagination={{
          pageSize: 10,
          showSizeChanger: false,
          showTotal: (total) => `Total: ${total} pago(s)`,
        }}
        locale={{
          emptyText: <Empty description="No hay pagos registrados" />,
        }}
      />
    </Modal>
  );
};

export default HistorialPagosModalView;
