import { Badge, Button, Card, Empty, Result, Select, Skeleton, Space, Timeline, Typography } from 'antd';
import { IconRefresh } from '@tabler/icons-react';
import { formatDateTime } from '../../utils/dateFormatters.js';

const { Text, Title, Paragraph } = Typography;

const limitOptions = [
  { label: '20 eventos', value: 20 },
  { label: '50 eventos', value: 50 },
  { label: '100 eventos', value: 100 },
];

const ActividadTimelineView = ({
  actividades,
  usuarios,
  selectedUsuarioId,
  onSelectUsuario,
  limit,
  onChangeLimit,
  loading,
  isError,
  onRetry,
}) => {
  if (isError) {
    return (
      <Result
        status="error"
        title="No se pudo obtener la bitácora"
        subTitle="Intenta recargar o verifica tu conexión"
        extra={
          <Button icon={<IconRefresh size={16} />} onClick={onRetry}>
            Reintentar
          </Button>
        }
      />
    );
  }

  const timelineItems = actividades.map((actividad) => ({
    key: actividad.id,
    color: 'blue',
    children: (
      <Space direction="vertical" size={4} style={{ width: '100%' }}>
        <Space
          style={{ display: 'flex', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: 8 }}
        >
          <Badge status="processing" text={actividad.tipoEvento} />
          <Text type="secondary">{formatDateTime(actividad.creadoEn)}</Text>
        </Space>
        {actividad.ipOrigen && (
          <Text type="secondary">IP origen: {actividad.ipOrigen}</Text>
        )}
        {actividad.detalles && (
          <Paragraph
            code
            style={{ marginBottom: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
          >
            {typeof actividad.detalles === 'string'
              ? actividad.detalles
              : JSON.stringify(actividad.detalles, null, 2)}
          </Paragraph>
        )}
      </Space>
    ),
  }));

  return (
    <Card styles={{ body: { padding: 24 } }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
          marginBottom: 16,
        }}
      >
        <div>
          <Title level={4} style={{ margin: 0 }}>
            Bitácora de auditoría
          </Title>
          <Text type="secondary">
            Revisa los eventos más recientes registrados en el panel corporativo.
          </Text>
        </div>
        <Button icon={<IconRefresh size={16} />} onClick={onRetry}>
          Actualizar
        </Button>
      </div>

      <Space style={{ marginBottom: 20, width: '100%', flexWrap: 'wrap', gap: 12 }}>
        <Select
          style={{ minWidth: 220 }}
          placeholder="Filtrar por superadmin"
          value={selectedUsuarioId ?? null}
          allowClear
          onChange={onSelectUsuario}
          options={usuarios.map((usuario) => ({ label: usuario.nombres, value: usuario.id }))}
        />
        <Select style={{ width: 160 }} value={limit} onChange={onChangeLimit} options={limitOptions} />
      </Space>

      {loading ? (
        <Skeleton active paragraph={{ rows: 6 }} />
      ) : actividades.length === 0 ? (
        <Empty description="Sin actividades registradas" />
      ) : (
        <Timeline items={timelineItems} style={{ marginTop: 8 }} />
      )}
    </Card>
  );
};

export default ActividadTimelineView;
