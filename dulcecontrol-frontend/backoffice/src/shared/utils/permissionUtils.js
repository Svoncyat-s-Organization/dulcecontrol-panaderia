export const normalizePermission = (value) =>
  typeof value === 'string' ? value.trim().toLowerCase() : String(value ?? '').trim().toLowerCase();

export const createPermissionSet = (source) => {
  if (source instanceof Set) {
    return source;
  }
  if (!source) {
    return new Set();
  }
  if (Array.isArray(source)) {
    return new Set(source.map((item) => normalizePermission(item)).filter((item) => item.length > 0));
  }
  return new Set();
};

export const permissionMatchesRequirement = (permission, requirement) => {
  if (!permission || !requirement) {
    return false;
  }
  const normalizedPermission = normalizePermission(permission);
  const normalizedRequirement = normalizePermission(requirement);
  if (!normalizedPermission || !normalizedRequirement) {
    return false;
  }
  if (normalizedPermission === normalizedRequirement) {
    return true;
  }
  return normalizedPermission.startsWith(`${normalizedRequirement}.`);
};

export const hasAnyPermission = (permissionsSource, requirements = []) => {
  if (!requirements || requirements.length === 0) {
    return true;
  }
  const permissionSet = createPermissionSet(permissionsSource);
  if (permissionSet.size === 0) {
    return false;
  }
  return requirements.some((requirement) => {
    const normalizedRequirement = normalizePermission(requirement);
    if (!normalizedRequirement) {
      return false;
    }
    for (const permission of permissionSet) {
      if (permissionMatchesRequirement(permission, normalizedRequirement)) {
        return true;
      }
    }
    return false;
  });
};
