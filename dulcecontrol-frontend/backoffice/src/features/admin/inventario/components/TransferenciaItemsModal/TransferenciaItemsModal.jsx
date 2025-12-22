import { useMemo } from 'react';
import { Modal, Table, Typography } from 'antd';

const { Text } = Typography;

const normalizeId = (value) => {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : null;
};

const buildNombreItem = (item, productos, insumos) => {
  if (item?.productoId) {
    const pid = normalizeId(item.productoId);
    const p = (productos ?? []).find((x) => normalizeId(x.id) === pid);
    return p ? `${p.nombre ?? 'Producto'} (${p.sku ?? 'N/D'})` : `Producto #${item.productoId}`;
  }

  const iid = normalizeId(item?.insumoId);
  const i = (insumos ?? []).find((x) => normalizeId(x.id) === iid);
  return i ? `${i.nombre ?? i.nombreInsumo ?? 'Insumo'} (${i.codigoInterno ?? 'N/D'})` : `Insumo #${item?.insumoId}`;
};

const TransferenciaItemsModal = ({ open, onClose, transferencia, productos, insumos }) => {
  const items = useMemo(() => transferencia?.items ?? [], [transferencia]);

  const data = useMemo(() => {
    return (items ?? []).map((it) => ({
      key: it.id ?? `${it.productoId ? 'p' : 'i'}-${it.productoId ?? it.insumoId}`,
      tipo: it.productoId ? 'Producto' : 'Insumo',
      nombre: buildNombreItem(it, productos, insumos),
      enviado: it.cantidadEnviada,
      recibido: it.cantidadRecibida,
    }));
  }, [items, productos, insumos]);

  return (
    <Modal
      title={transferencia?.id ? `Items de transferencia #${transferencia.id}` : 'Items de transferencia'}
      open={open}
      onCancel={onClose}
      footer={null}
      width={820}
    >
      <Table
        rowKey="key"
        dataSource={data}
        pagination={false}
        columns={[
          { title: 'Tipo', dataIndex: 'tipo', key: 'tipo', width: 120 },
          {
            title: 'Item',
            dataIndex: 'nombre',
            key: 'nombre',
            render: (value) => <Text>{value}</Text>,
          },
          {
            title: 'Enviado',
            dataIndex: 'enviado',
            key: 'enviado',
            width: 140,
            render: (v) => <Text strong>{String(v ?? '—')}</Text>,
          },
          {
            title: 'Recibido',
            dataIndex: 'recibido',
            key: 'recibido',
            width: 140,
            render: (v) => <Text>{String(v ?? '—')}</Text>,
          },
        ]}
      />
    </Modal>
  );
};

export default TransferenciaItemsModal;
