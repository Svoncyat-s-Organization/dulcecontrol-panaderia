import { useMemo, useCallback } from 'react';
import { useAuthorizationStore } from '../store/authorizationStore.js';
import { createPermissionSet, hasAnyPermission } from '../utils/permissionUtils.js';

const normalizeRequirements = (requirements) => {
  if (!requirements) {
    return [];
  }
  if (typeof requirements === 'string') {
    return [requirements];
  }
  if (requirements instanceof Set) {
    return Array.from(requirements).filter((item) => typeof item === 'string' && item.trim().length > 0);
  }
  if (Array.isArray(requirements)) {
    return requirements.filter((item) => typeof item === 'string' && item.trim().length > 0);
  }
  return [];
};

export const usePermissions = () => {
  const permissions = useAuthorizationStore((state) => state.permissions);

  const permissionSet = useMemo(() => createPermissionSet(permissions), [permissions]);

  const can = useCallback(
    (requirements, { defaultGrant = true } = {}) => {
      const normalized = normalizeRequirements(requirements);
      if (!normalized.length) {
        return defaultGrant;
      }
      return hasAnyPermission(permissionSet, normalized);
    },
    [permissionSet]
  );

  return {
    can,
    permissionSet,
  };
};
