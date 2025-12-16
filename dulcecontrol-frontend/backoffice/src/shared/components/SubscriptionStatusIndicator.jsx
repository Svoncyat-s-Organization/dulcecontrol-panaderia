import { useMemo } from 'react';
import { Space, Tag, Typography } from 'antd';
import { useTokenStore } from '../store/tokenStore.js';

const STATUS_LABEL = {
  EN_PRUEBA: 'En prueba',
  ACTIVA: 'Activa',
  VENCIDA: 'Vencida',
  CANCELADA: 'Cancelada',
};

const STATUS_COLORS = {
  EN_PRUEBA: 'blue',
  ACTIVA: 'green',
  VENCIDA: 'orange',
  CANCELADA: 'red',
};

const formatDate = (isoString) => {
  if (!isoString) {
    return null;
  }
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

const formatDuration = (seconds) => {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return 'menos de un minuto';
  }

  const totalMinutes = Math.floor(seconds / 60);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  const parts = [];
  if (days > 0) {
    parts.push(`${days} dia${days === 1 ? '' : 's'}`);
  }
  if (days < 2 && hours > 0) {
    parts.push(`${hours} h`);
  }
  if (!days && hours < 2 && minutes > 0) {
    parts.push(`${minutes} min`);
  }

  return parts.length ? parts.join(' ') : 'menos de un minuto';
};

const useSubscriptionCopy = (subscription) =>
  useMemo(() => {
    if (!subscription) {
      return { planLabel: null, statusLabel: null, secondaryText: null, tagColor: 'default' };
    }

    const estado = subscription.estado ?? 'ACTIVA';
    const tagColor = STATUS_COLORS[estado] ?? 'default';
    const statusLabel = STATUS_LABEL[estado] ?? estado;
    const planLabel = subscription.planNombre ?? 'Plan no disponible';

    if (estado === 'EN_PRUEBA') {
      const remaining = typeof subscription.remainingSeconds === 'number'
        ? subscription.remainingSeconds
        : null;
      const secondaryText = remaining === null
        ? 'Prueba activa'
        : remaining > 0
          ? `Prueba disponible por ${formatDuration(remaining)}`
          : 'El periodo de prueba finalizo';
      return { planLabel, statusLabel, secondaryText, tagColor };
    }

    const fechaFin = formatDate(subscription.fechaFin);
    const secondaryText = fechaFin ? `Vence el ${fechaFin}` : null;
    return { planLabel, statusLabel, secondaryText, tagColor };
  }, [subscription]);

const SubscriptionStatusIndicator = () => {
  const subscription = useTokenStore((state) => state.subscription);
  const { planLabel, statusLabel, secondaryText, tagColor } = useSubscriptionCopy(subscription);

  if (!subscription || !statusLabel) {
    return null;
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        justifyContent: 'center',
        minWidth: 220,
        lineHeight: 1.2,
      }}
    >
      <Space size={6} align="center">
        <Typography.Text strong style={{ margin: 0 }}>
          {planLabel}
        </Typography.Text>
        <Tag color={tagColor} style={{ marginInlineStart: 0 }}>
          {statusLabel}
        </Tag>
      </Space>
      {secondaryText && (
        <Typography.Text type="secondary" style={{ fontSize: 12, margin: 0 }}>
          {secondaryText}
        </Typography.Text>
      )}
    </div>
  );
};

export default SubscriptionStatusIndicator;
