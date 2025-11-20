import { useCallback, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const flattenKeys = (items = []) =>
  items.flatMap((item) =>
    item.children?.length ? [item.key, ...flattenKeys(item.children)] : [item.key]
  );

const buildBreadcrumbLookup = (items = [], trail = []) =>
  items.reduce((acc, item) => {
    const currentTrail = [...trail, { path: item.key, label: item.label }];
    acc[item.key] = currentTrail;

    if (item.children?.length) {
      Object.assign(acc, buildBreadcrumbLookup(item.children, currentTrail));
    }

    return acc;
  }, {});

export const useMenuLogic = (menuItems = [], basePath = '/') => {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const flatKeys = useMemo(() => flattenKeys(menuItems), [menuItems]);
  const breadcrumbLookup = useMemo(() => buildBreadcrumbLookup(menuItems), [menuItems]);

  const selectedKey = useMemo(() => {
    const current = location.pathname;
    const exactMatch = flatKeys.find((key) => current === key);

    if (exactMatch) return exactMatch;

    const partialMatch = flatKeys
      .slice()
      .sort((a, b) => b.length - a.length)
      .find((key) => current.startsWith(key));

    return partialMatch ?? basePath;
  }, [basePath, flatKeys, location.pathname]);

  const derivedOpenKeys = useMemo(() => {
    const currentPath = location.pathname;

    return menuItems
      .filter((item) => item.children?.some((child) => currentPath.startsWith(child.key)))
      .map((item) => item.key);
  }, [location.pathname, menuItems]);

  const handleMenuClick = useCallback(
    ({ key }) => {
      navigate(key);
    },
    [navigate]
  );

  const breadcrumbItems = useMemo(() => {
    const current = location.pathname;
    const matchKey = Object.keys(breadcrumbLookup)
      .filter((key) => current.startsWith(key))
      .sort((a, b) => b.length - a.length)[0];

    const trail = breadcrumbLookup[matchKey] ?? breadcrumbLookup[basePath] ?? [];

    return trail.map(({ path, label }) => ({
      title: path === current ? <span>{label}</span> : <Link to={path}>{label}</Link>,
      key: path,
    }));
  }, [basePath, breadcrumbLookup, location.pathname]);

  const menuInstanceKey = useMemo(
    () => `${basePath}-${selectedKey}-${derivedOpenKeys.join('|')}`,
    [basePath, selectedKey, derivedOpenKeys]
  );

  return {
    collapsed,
    setCollapsed,
    menuKey: menuInstanceKey,
    menuProps: {
      items: menuItems,
      selectedKeys: [selectedKey],
      defaultOpenKeys: derivedOpenKeys,
      onClick: handleMenuClick,
    },
    breadcrumbItems,
  };
};
