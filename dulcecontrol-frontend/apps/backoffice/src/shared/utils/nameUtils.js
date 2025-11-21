const sanitize = (value) => value?.replace(/\s+/g, ' ').trim() ?? '';

const capitalizeWord = (word) => {
  if (!word) return '';
  const lower = word.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
};

export const buildPreferredName = (fullName) => {
  const normalized = sanitize(fullName);
  if (!normalized) {
    return null;
  }

  const tokens = normalized.split(' ');
  if (tokens.length === 1) {
    return capitalizeWord(tokens[0]);
  }

  const firstName = capitalizeWord(tokens[0]);
  const firstSurname = capitalizeWord(tokens[Math.max(tokens.length - 2, 1)]);
  return `${firstName} ${firstSurname}`.trim();
};

export const buildInitials = (displayName, fallback = 'A') => {
  const normalized = sanitize(displayName) || sanitize(fallback) || 'A';
  const tokens = normalized.split(' ').filter(Boolean);
  if (!tokens.length) {
    return 'A';
  }
  const initials = tokens.slice(0, 2).map((token) => token.charAt(0).toUpperCase()).join('');
  return initials || 'A';
};
