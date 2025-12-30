import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import {
  Alert,
  Badge,
  Button,
  Card,
  Descriptions,
  Empty,
  Popconfirm,
  Result,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';
import { IconEye, IconPlus, IconRefresh, IconTruckDelivery, IconX } from '@tabler/icons-react';

const { Title, Text } = Typography;

const ESTADO_CONFIG = {
  pendiente: { label: 'Pendiente', color: 'gold', badge: 'warning' },
  en_transito: { label: 'En tránsito', color: 'blue', badge: 'processing' },
  recibido: { label: 'Recibido', color: 'green', badge: 'success' },
  cancelado: { label: 'Cancelado', color: 'default', badge: 'default' },
};

const normalizeEstado = (estado) => {
  if (!estado) return null;
  return String(estado).toLowerCase();
};

const formatFecha = (value) => {
  const fecha = dayjs(value);
  return fecha.isValid() ? fecha.format('DD/MM/YYYY HH:mm') : '—';
};

const TransferenciasTableView = ({
  transferencias,
  loading,
  isError,
  onRetry,
  sedes,
  sedeOrigenId,
  productos,
  insumos,
  onCreate,
  createDisabled,
  createDisabledReason,
  onChangeEstado,
  onOpenRecepcion,
  onOpenItems,
  changingId,
}) => {
  const [estadoFiltro, setEstadoFiltro] = useState(null);

  const isSingleSede = useMemo(() => {
    const total = Array.isArray(sedes) ? sedes.length : 0;
    return total <= 1;
  }, [sedes]);

  const sedesById = useMemo(() => {
    const map = new Map();
    (sedes ?? []).forEach((sede) => map.set(sede.id, sede));
    return map;
  }, [sedes]);

  const productosById = useMemo(() => {
    const map = new Map();
    (productos ?? []).forEach((p) => map.set(Number(p.id), p));
    return map;
  }, [productos]);

  const insumosById = useMemo(() => {
    const map = new Map();
    (insumos ?? []).forEach((i) => map.set(Number(i.id), i));
    return map;
  }, [insumos]);

  const getItemLabel = (item) => {
    if (item?.productoId) {
      const p = productosById.get(Number(item.productoId));
      if (p) {
        const sku = p.sku ? ` (${p.sku})` : '';
        return `${p.nombre ?? 'Producto'}${sku}`;
      }
      return `Producto`;
    }

    if (item?.insumoId) {
      const i = insumosById.get(Number(item.insumoId));
      if (i) {
        const code = i.codigoInterno ? ` (${i.codigoInterno})` : '';
        return `${i.nombre ?? i.nombreInsumo ?? 'Insumo'}${code}`;
      }
      return `Insumo`;
    }

    return 'Item';
  };

  const filtered = useMemo(() => {
    const list = transferencias ?? [];
    if (!estadoFiltro) return list;
    return list.filter((t) => normalizeEstado(t.estado) === estadoFiltro);
  }, [transferencias, estadoFiltro]);

  if (isError) {
    return (
      <Result
        status="error"
        title="No se pudieron cargar las transferencias"
        subTitle="Intenta nuevamente o verifica tu conexión"
        extra={
          <Button icon={<IconRefresh size={16} />} onClick={onRetry}>
            Reintentar
          </Button>
        }
      />
    );
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 90,
      render: (id) => <Text strong>#{id}</Text>,
    },
    {
      title: 'Origen → Destino',
      key: 'sedes',
      render: (_, record) => {
        const origen = sedesById.get(record.sedeOrigenId);
        const destino = sedesById.get(record.sedeDestinoId);
        return (
          <Space direction="vertical" size={0}>
            <Text strong>{origen?.nombre ?? `Sede ${record.sedeOrigenId}`}</Text>
            <Text type="secondary">→ {destino?.nombre ?? `Sede ${record.sedeDestinoId}`}</Text>
          </Space>
        );
      },
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
      width: 140,
      render: (estado) => {
        const normalized = normalizeEstado(estado);
        const config = ESTADO_CONFIG[normalized] ?? { label: String(estado), color: 'default', badge: 'default' };
        return (
          <Space size={8}>
            <Badge status={config.badge} />
            <Tag color={config.color} style={{ margin: 0 }}>
              {config.label}
            </Tag>
          </Space>
        );
      },
    },
    {
      title: 'Solicitado',
      dataIndex: 'fechaSolicitud',
      key: 'fechaSolicitud',
      width: 180,
      render: (value) => formatFecha(value),
    },
    {
      title: 'Items',
      key: 'items',
      width: 90,
      align: 'center',
      render: (_, record) => {
        const count = record.items?.length ?? 0;
        return (
          <Button type="link" size="small" onClick={() => onOpenItems?.(record)} style={{ padding: 0 }}>
            <Space size={6}>
              <Text strong>{count}</Text>
              <IconEye size={16} />
            </Space>
          </Button>
        );
      },
    },
    {
      title: 'Acciones',
      key: 'acciones',
      width: 260,
      render: (_, record) => {
        const estado = normalizeEstado(record.estado);
        const isChanging = changingId === record.id;

        const activeSedeId = Number(sedeOrigenId);
        const canEnviarFromActiveSede = Number(record.sedeOrigenId) === activeSedeId;
        const canRecibirFromActiveSede = Number(record.sedeDestinoId) === activeSedeId;

        const origen = sedesById.get(record.sedeOrigenId);
        const destino = sedesById.get(record.sedeDestinoId);
        const descripcionCorta = `${origen?.nombre ?? 'Sede origen'} → ${destino?.nombre ?? 'Sede destino'}`;

        return (
          <Space wrap>
            {estado === 'pendiente' && (
              <>
                <Popconfirm
                  title="Marcar como En tránsito"
                  description={descripcionCorta}
                  okText="Confirmar"
                  cancelText="Cancelar"
                  onConfirm={() => onChangeEstado(record, 'EN_TRANSITO')}
                  disabled={isChanging || !canEnviarFromActiveSede}
                >
                  <Button
                    size="small"
                    icon={<IconTruckDelivery size={16} />}
                    loading={isChanging}
                    disabled={!canEnviarFromActiveSede}
                  >
                    Enviar
                  </Button>
                </Popconfirm>

                <Popconfirm
                  title="Cancelar transferencia"
                  description={descripcionCorta}
                  okText="Confirmar"
                  cancelText="Volver"
                  onConfirm={() => onChangeEstado(record, 'CANCELADO')}
                  disabled={isChanging}
                >
                  <Button
                    size="small"
                    danger
                    icon={<IconX size={16} />}
                    loading={isChanging}
                    disabled={isChanging}
                  >
                    Cancelar
                  </Button>
                </Popconfirm>
              </>
            )}
            {estado === 'en_transito' && (
              <>
                <Button
                  size="small"
                  type="primary"
                  onClick={() => onOpenRecepcion?.(record)}
                  loading={isChanging}
                  disabled={!canRecibirFromActiveSede || isChanging}
                >
                  Recibir
                </Button>

                <Popconfirm
                  title="Cancelar transferencia"
                  description={descripcionCorta}
                  okText="Confirmar"
                  cancelText="Volver"
                  onConfirm={() => onChangeEstado(record, 'CANCELADO')}
                  disabled={isChanging}
                >
                  <Button
                    size="small"
                    danger
                    icon={<IconX size={16} />}
                    loading={isChanging}
                    disabled={isChanging}
                  >
                    Cancelar
                  </Button>
                </Popconfirm>
              </>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <Card styles={{ body: { padding: 24 } }}>
      <Space style={{ width: '100%', justifyContent: 'space-between' }} align="start">
        <div>
          <Title level={4} style={{ margin: 0 }}>
            Transferencias
          </Title>
          <Text type="secondary">La sede activa ({sedeOrigenId}) se usa como origen.</Text>
        </div>
        <Button
          type="primary"
          icon={<IconPlus size={16} />}
          onClick={onCreate}
          disabled={createDisabled}
          title={createDisabled ? createDisabledReason ?? '' : ''}
        >
          Nueva transferencia
        </Button>
      </Space>

      {isSingleSede && (
        <Alert
          style={{ marginTop: 16 }}
          type="info"
          showIcon
          message="Transferencias deshabilitadas"
          description="No se pueden realizar transferencias porque la tienda tiene una sola sede."
        />
      )}

      <Space wrap style={{ marginTop: 16 }}>
        <Select
          placeholder="Filtrar por estado"
          value={estadoFiltro}
          onChange={setEstadoFiltro}
          allowClear
          style={{ width: 220 }}
          options={[
            { label: 'Pendiente', value: 'pendiente' },
            { label: 'En tránsito', value: 'en_transito' },
            { label: 'Recibido', value: 'recibido' },
            { label: 'Cancelado', value: 'cancelado' },
          ]}
        />
        <Text type="secondary">{filtered.length} transferencias</Text>
      </Space>

      <Table
        style={{ marginTop: 16 }}
        rowKey="id"
        columns={columns}
        dataSource={filtered}
        loading={loading}
        pagination={{ pageSize: 10, showSizeChanger: true }}
        locale={{ emptyText: <Empty description="Sin transferencias" /> }}
        expandable={{
          expandedRowRender: (record) => (
            <Descriptions size="small" column={1} bordered>
              <Descriptions.Item label="Observaciones">
                {record.observaciones || '—'}
              </Descriptions.Item>
              <Descriptions.Item label="Items">
                {(record.items ?? []).length
                  ? (record.items ?? []).map((item) => {
                      const label = getItemLabel(item);
                      const enviado = item.cantidadEnviada;
                      const recibido = item.cantidadRecibida;
                      return (
                        <Tag key={item.id ?? `${label}-${String(enviado ?? '')}`} style={{ marginBottom: 6 }}>
                          {label}: Enviado {String(enviado ?? '')}{recibido != null ? ` / Recibido ${String(recibido)}` : ''}
                        </Tag>
                      );
                    })
                  : '—'}
              </Descriptions.Item>
              <Descriptions.Item label="Ver detalle">
                <Button type="link" size="small" onClick={() => onOpenItems?.(record)} style={{ padding: 0 }}>
                  Ver items
                </Button>
              </Descriptions.Item>
            </Descriptions>
          ),
        }}
      />
    </Card>
  );
};

export default TransferenciasTableView;
