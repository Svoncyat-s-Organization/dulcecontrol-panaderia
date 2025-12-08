const parseBoolean = (value) => {
  if (typeof value !== 'string') {
    return false;
  }

  const normalized = value.trim().toLowerCase();
  return normalized === 'true' || normalized === '1' || normalized === 'yes';
};

export const featureFlags = {
  devLoginEnabled: parseBoolean(import.meta.env.VITE_ENABLE_DEV_LOGIN ?? ''),
};
