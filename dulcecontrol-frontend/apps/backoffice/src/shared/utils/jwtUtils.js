const padBase64 = (value = '') => {
  const padding = (4 - (value.length % 4)) % 4;
  return value + '='.repeat(padding);
};

const decodeBase64 = (value) => {
  if (typeof atob === 'function') {
    return atob(value);
  }
  if (typeof globalThis !== 'undefined' && typeof globalThis.Buffer !== 'undefined') {
    return globalThis.Buffer.from(value, 'base64').toString('binary');
  }
  throw new Error('Base64 decoding is not supported in this environment');
};

export const parseJwt = (token) => {
  if (!token || typeof token !== 'string') {
    return null;
  }

  const segments = token.split('.');
  if (segments.length < 2) {
    return null;
  }

  const base64UrlPayload = segments[1];
  const base64Payload = padBase64(base64UrlPayload.replace(/-/g, '+').replace(/_/g, '/'));

  try {
    const jsonPayload = decodeBase64(base64Payload)
      .split('')
      .map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join('');
    return JSON.parse(decodeURIComponent(jsonPayload));
  } catch (error) {
    console.warn('parseJwt: Error decoding token payload', error);
    return null;
  }
};
