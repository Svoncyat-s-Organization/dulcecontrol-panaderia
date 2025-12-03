import dayjs from 'dayjs';

export const formatDateTime = (value, format = 'DD/MM/YYYY HH:mm') => {
    if (!value) {
        return '—';
    }

    const date = dayjs(value);
    if (!date.isValid()) {
        return '—';
    }

    return date.format(format);
};

export const normalizeOption = (id, label) => ({
    value: id,
    label,
});
