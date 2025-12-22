import dayjs from 'dayjs';

export const parseApiDateTime = (value) => {
    if (!value) {
        return null;
    }

    const raw = String(value);

    // Backend uses LocalDateTime (no timezone). Treat values without timezone as *local time*.
    // If timezone info exists (Z or +/-HH:mm), respect it.
    const parsed = dayjs(raw);

    return parsed.isValid() ? parsed : null;
};

export const nowLocalApiDateTime = () => dayjs().format('YYYY-MM-DDTHH:mm:ss');

export const formatApiDateTime = (value, format) => {
    const parsed = parseApiDateTime(value);
    return parsed ? parsed.format(format || 'DD/MM/YYYY HH:mm') : '-';
};

export const toLocaleStringApiDateTime = (value) => {
    const parsed = parseApiDateTime(value);
    return parsed ? parsed.toDate().toLocaleString() : '';
};
