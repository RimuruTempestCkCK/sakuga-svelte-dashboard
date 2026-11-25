export const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', group: 'Main', icon: 'grid', hint: 'KPIs & live render status' },
  { id: 'analytics', label: 'Analytics', group: 'Main', icon: 'chart', hint: 'Metrics, charts & reports' },
  { id: 'tables', label: 'Data Tables', group: 'Data & Pages', icon: 'table', hint: 'Projects, invoices & team tables' },
  { id: 'tasks', label: 'Render Queue', group: 'Data & Pages', icon: 'layers', hint: 'Tabs, progress & job queue' },
  { id: 'components', label: 'All 12 Controls', group: 'Data & Pages', icon: 'sparkles', hint: 'Every Sakuga VFX control live' },
  { id: 'studio', label: 'Studio Form', group: 'Data & Pages', icon: 'sliders', hint: 'FormData & input controls' },
  { id: 'profile', label: 'Profile', group: 'Account', icon: 'user', hint: 'Account & studio profile' },
  { id: 'settings', label: 'Theme & FX', group: 'Account', icon: 'palette', hint: 'Dark mode, --sk-* & presets' },
  { id: 'login', label: 'Login Page', group: 'Auth Templates', icon: 'lock', hint: 'Full-screen sign in template' },
  { id: 'register', label: 'Register Page', group: 'Auth Templates', icon: 'userplus', hint: 'Full-screen sign up template' },
];

export const THEME_PRESETS = {
  paper: {
    name: 'Classic Sakuga Paper',
    dark: false,
    vars: {
      '--page': '#ffffff',
      '--surface': '#ffffff',
      '--surface-alt': '#f8f7fe',
      '--chip': '#f4f3fc',
      '--text': '#1d1a4a',
      '--mute': '#8580b0',
      '--line': '#dcdaf0',
      '--sk-card': '#fff',
      '--sk-ink': '#1d1a4a',
      '--sk-dim': '#8580b0',
      '--sk-soft': '#b8b3ff',
      '--sk-pri': '#8f8df7',
      '--sk-pri-ink': '#1d1a4a',
      '--sk-acc': '#ff5fa8',
      '--sk-track': '#c9cbe0',
      '--sk-on-pri': '#fff',
    },
  },
  sakura: {
    name: 'Sakura Pop',
    dark: false,
    vars: {
      '--page': '#fff9fc',
      '--surface': '#ffffff',
      '--surface-alt': '#fff2f8',
      '--chip': '#ffeaf4',
      '--text': '#3a1431',
      '--mute': '#9b6b8c',
      '--line': '#f3cde0',
      '--sk-card': '#fff',
      '--sk-ink': '#3a1431',
      '--sk-dim': '#9b6b8c',
      '--sk-soft': '#ffb7d9',
      '--sk-pri': '#ff7cb8',
      '--sk-pri-ink': '#3a1431',
      '--sk-acc': '#ff3b8d',
      '--sk-track': '#ebd0de',
      '--sk-on-pri': '#fff',
    },
  },
  cyber: {
    name: 'Cyber Shonen',
    dark: false,
    vars: {
      '--page': '#f4f8ff',
      '--surface': '#ffffff',
      '--surface-alt': '#eaf2ff',
      '--chip': '#e3edff',
      '--text': '#0f1f4a',
      '--mute': '#6279a8',
      '--line': '#c9daf8',
      '--sk-card': '#fff',
      '--sk-ink': '#0f1f4a',
      '--sk-dim': '#6279a8',
      '--sk-soft': '#97c2ff',
      '--sk-pri': '#5b9cff',
      '--sk-pri-ink': '#0f1f4a',
      '--sk-acc': '#ff5fa8',
      '--sk-track': '#c2d3ef',
      '--sk-on-pri': '#fff',
    },
  },
  midnight: {
    name: 'Midnight Sakuga (Dark)',
    dark: true,
    vars: {
      '--page': '#0f0e1e',
      '--surface': '#17162e',
      '--surface-alt': '#1f1d3d',
      '--chip': '#252348',
      '--text': '#f3f2ff',
      '--mute': '#9e99cc',
      '--line': '#322f5c',
      '--sk-card': '#1d1b38',
      '--sk-ink': '#f3f2ff',
      '--sk-dim': '#9e99cc',
      '--sk-soft': '#4e4696',
      '--sk-pri': '#7c79f2',
      '--sk-pri-ink': '#ffffff',
      '--sk-acc': '#ff5fa8',
      '--sk-track': '#353263',
      '--sk-on-pri': '#ffffff',
    },
  },
};

export const dashboard = $state({
  page: 'overview',
  sidebarCollapsed: false,
  mobileNavOpen: false,
  searchQuery: '',
  fxEnabled: true,
  darkMode: false,
  theme: 'paper',
  lastLightTheme: 'paper',
  toastEl: null,
  user: {
    name: 'Akira Takahashi',
    role: 'Lead Animator',
    email: 'akira@sakuga.studio',
    initials: 'AT',
  },
  notifications: [
    { id: 1, title: 'Shot #042 Render Complete', time: '2m ago', unread: true },
    { id: 2, title: 'New comment from Yui on Cut 07', time: '18m ago', unread: true },
    { id: 3, title: 'Weekly export package ready', time: '1h ago', unread: false },
  ],
  eventLog: [
    { id: 1, time: '13:05', text: 'SakugaFX canvas initialized at 60fps' },
    { id: 2, time: '13:07', text: 'Shot #042 "Impact Frame" render completed' },
  ],
});

export function navigate(pageId) {
  dashboard.page = pageId;
  dashboard.mobileNavOpen = false;
}

export function showToast(message) {
  if (dashboard.toastEl && typeof dashboard.toastEl.show === 'function') {
    dashboard.toastEl.show(message);
  }
  logEvent(`Toast: "${message}"`);
}

export function logEvent(text) {
  const now = new Date();
  const time = now.toTimeString().slice(0, 5);
  dashboard.eventLog = [
    { id: Date.now() + Math.random(), time, text },
    ...dashboard.eventLog.slice(0, 7),
  ];
}

export function applyTheme(presetKey) {
  const preset = THEME_PRESETS[presetKey];
  if (!preset) return;
  dashboard.theme = presetKey;
  dashboard.darkMode = Boolean(preset.dark);
  if (!preset.dark) {
    dashboard.lastLightTheme = presetKey;
  }
  const root = document.documentElement;
  root.dataset.theme = preset.dark ? 'dark' : 'light';
  for (const [k, v] of Object.entries(preset.vars)) {
    root.style.setProperty(k, v);
  }
  logEvent(`Theme switched to ${preset.name}`);
}

export function toggleDarkMode() {
  if (dashboard.darkMode) {
    applyTheme(dashboard.lastLightTheme || 'paper');
    showToast('Light Mode activated');
  } else {
    applyTheme('midnight');
    showToast('Dark Mode activated');
  }
}

export function markAllNotificationsRead() {
  dashboard.notifications = dashboard.notifications.map((n) => ({ ...n, unread: false }));
}
