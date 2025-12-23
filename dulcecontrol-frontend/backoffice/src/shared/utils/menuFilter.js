const isStringKey = (value) => typeof value === 'string' && value.length > 0;

const isPathRelated = (key, path) => {
  if (!isStringKey(key) || !isStringKey(path)) {
    return false;
  }
  if (key === path) {
    return true;
  }
  // Keep parents of allowed paths and children under allowed bases.
  return key.startsWith(`${path}/`) || path.startsWith(`${key}/`);
};

export const filterMenuItemsByAllowedPaths = (items, allowedPaths) => {
  if (!Array.isArray(items)) {
    return [];
  }
  if (!Array.isArray(allowedPaths) || allowedPaths.length === 0) {
    return items;
  }

  const visit = (nodes) =>
    (nodes ?? [])
      .map((node) => {
        const children = Array.isArray(node?.children) ? visit(node.children) : undefined;
        const keyAllowed = isStringKey(node?.key)
          ? allowedPaths.some((path) => isPathRelated(node.key, path))
          : false;

        if (!keyAllowed && (!children || children.length === 0)) {
          return null;
        }

        if (children && children.length > 0) {
          return { ...node, children };
        }

        const { children: _ignored, ...rest } = node ?? {};
        return rest;
      })
      .filter(Boolean);

  return visit(items);
};
