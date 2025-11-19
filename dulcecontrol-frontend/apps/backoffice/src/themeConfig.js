const sharedComponents = {
  Tag: {
    borderRadiusSM: 999,
  },
};

export const ROLE_THEMES = {
  SUPERADMIN: {
    token: {
      colorPrimary: '#105340',
      colorInfo: '#0f172a',
      colorSuccess: '#53db9e',
      colorWarning: '#d3992e',
    },
    components: sharedComponents,
  },
  ADMIN: {
    token: {
      colorPrimary: '#2f54eb',
      colorInfo: '#2f54eb',
    },
    components: sharedComponents,
  },
};