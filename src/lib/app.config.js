/**
 * Centralized Sakuga Dashboard Configuration
 * Edit this file to customize branding, navigation, and theme defaults.
 */
export const APP_CONFIG = {
  name: 'Sakuga VFX',
  subtitle: 'Dashboard Template',
  breadcrumbRoot: 'Studio',
  logo: '/sakuga-icon.png',
  defaultTheme: 'paper',
  storageKey: 'sakuga_dashboard_prefs_v1',
  defaultUser: {
    name: 'Akira Takahashi',
    role: 'Lead Animator',
    email: 'akira@sakuga.studio',
    initials: 'AT',
  },
  navGroups: ['Main', 'Data & Pages', 'Account', 'Auth Templates'],
  navItems: [
    { id: 'overview', label: 'Overview', group: 'Main', icon: 'grid' },
    { id: 'analytics', label: 'Analytics', group: 'Main', icon: 'chart' },
    { id: 'tables', label: 'Data Tables', group: 'Data & Pages', icon: 'table' },
    { id: 'tasks', label: 'Render Queue', group: 'Data & Pages', icon: 'layers' },
    { id: 'kanban', label: 'Kanban Board', group: 'Data & Pages', icon: 'kanban' },
    { id: 'calendar', label: 'Calendar', group: 'Data & Pages', icon: 'calendar' },
    { id: 'components', label: 'All 12 Controls', group: 'Data & Pages', icon: 'sparkles' },
    { id: 'studio', label: 'Studio Form', group: 'Data & Pages', icon: 'sliders' },
    { id: 'profile', label: 'Profile', group: 'Account', icon: 'user' },
    { id: 'settings', label: 'Theme & FX', group: 'Account', icon: 'palette' },
    { id: 'login', label: 'Login Page', group: 'Auth Templates', icon: 'lock' },
    { id: 'register', label: 'Register Page', group: 'Auth Templates', icon: 'userplus' },
  ],
};
