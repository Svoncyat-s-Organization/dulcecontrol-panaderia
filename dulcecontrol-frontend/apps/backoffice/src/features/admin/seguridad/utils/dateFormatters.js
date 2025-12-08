import dayjs from 'dayjs';

const DEFAULT_DATE = 'Sin registro';

export const formatDateTime = (value, fallback = DEFAULT_DATE) => {
  if (!value) return fallback;
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed.format('DD/MM/YYYY HH:mm') : fallback;
};
