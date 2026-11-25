import { APP_CONFIG } from './app.config.js';

export const NAV_ITEMS = APP_CONFIG.navItems;

export const PAGE_TO_HASH = {
  overview: '#/overview',
  analytics: '#/analytics',
  tables: '#/tables',
  tasks: '#/tasks',
  components: '#/components',
  studio: '#/studio-form',
  profile: '#/profile',
  settings: '#/settings',
  login: '#/login',
  register: '#/register',
  'forgot-password': '#/forgot-password',
  'reset-password': '#/reset-password',
};

const HASH_TO_PAGE = Object.fromEntries(
  Object.entries(PAGE_TO_HASH).map(([page, hash]) => [hash.toLowerCase(), page])
);

const STORAGE_KEY = APP_CONFIG.storageKey;

function readPrefs() {
  try {
    if (typeof localStorage === 'undefined') return null;
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writePrefs() {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        theme: dashboard.theme,
        lastLightTheme: dashboard.lastLightTheme,
        sidebarCollapsed: dashboard.sidebarCollapsed,
        accentColor: dashboard.accentColor,
        borderRadius: dashboard.borderRadius,
        density: dashboard.density,
        sidebarStyle: dashboard.sidebarStyle,
        user: {
          name: dashboard.user.name,
          role: dashboard.user.role,
          email: dashboard.user.email,
          initials: dashboard.user.initials,
        },
      })
    );
  } catch {
    // Ignore storage quota or privacy mode errors
  }
}

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
  commandPaletteOpen: false,
  shortcutsOpen: false,
  searchQuery: '',
  fxEnabled: true,
  darkMode: false,
  theme: 'paper',
  lastLightTheme: 'paper',
  accentColor: '',
  borderRadius: '18',
  density: 'comfortable',
  sidebarStyle: 'default',
  toastEl: null,
  user: { ...APP_CONFIG.defaultUser },
  toasts: [],
  notifications: [
    { id: 1, title: 'Shot #042 Render Complete', time: '2m ago', unread: true, type: 'success' },
    { id: 2, title: 'New comment from Yui on Cut 07', time: '18m ago', unread: true, type: 'info' },
    { id: 3, title: 'Cache threshold at 85%', time: '1h ago', unread: false, type: 'warning' },
  ],
  eventLog: [
    { id: 1, time: '13:05', text: 'SakugaFX canvas initialized at 60fps' },
    { id: 2, time: '13:07', text: 'Shot #042 "Impact Frame" render completed' },
  ],
});

export function resolveHash(hashStr) {
  const clean = (hashStr || '').split('?')[0].toLowerCase();
  if (!clean || clean === '#' || clean === '#/') return 'overview';
  return HASH_TO_PAGE[clean] || 'not-found';
}

export function syncFromHash() {
  if (typeof window === 'undefined') return;
  dashboard.page = resolveHash(window.location.hash);
  dashboard.mobileNavOpen = false;
}

export function initDashboard() {
  const saved = readPrefs();
  if (saved) {
    if (saved.lastLightTheme && THEME_PRESETS[saved.lastLightTheme] && !THEME_PRESETS[saved.lastLightTheme].dark) {
      dashboard.lastLightTheme = saved.lastLightTheme;
    }
    if (typeof saved.sidebarCollapsed === 'boolean') {
      dashboard.sidebarCollapsed = saved.sidebarCollapsed;
    }
    if (typeof saved.accentColor === 'string') {
      dashboard.accentColor = saved.accentColor;
    }
    if (['10', '18', '24'].includes(String(saved.borderRadius))) {
      dashboard.borderRadius = String(saved.borderRadius);
    }
    if (saved.density === 'compact' || saved.density === 'comfortable') {
      dashboard.density = saved.density;
    }
    if (saved.sidebarStyle === 'default' || saved.sidebarStyle === 'tinted') {
      dashboard.sidebarStyle = saved.sidebarStyle;
    }
    if (saved.user && typeof saved.user === 'object') {
      dashboard.user = {
        name: saved.user.name || dashboard.user.name,
        role: saved.user.role || dashboard.user.role,
        email: saved.user.email || dashboard.user.email,
        initials: saved.user.initials || dashboard.user.initials,
      };
    }
    if (saved.theme && THEME_PRESETS[saved.theme]) {
      applyTheme(saved.theme, { silent: true });
    } else {
      applyTheme('paper', { silent: true });
    }
  } else {
    applyTheme('paper', { silent: true });
  }

  if (typeof window !== 'undefined') {
    if (!window.location.hash) {
      window.history.replaceState(null, '', PAGE_TO_HASH.overview);
    }
    syncFromHash();
  }
}

export function navigate(pageId) {
  dashboard.page = pageId;
  dashboard.mobileNavOpen = false;
  if (typeof window !== 'undefined' && PAGE_TO_HASH[pageId]) {
    const targetHash = PAGE_TO_HASH[pageId];
    if (window.location.hash !== targetHash) {
      window.location.hash = targetHash;
    }
  }
}

export function setSidebarCollapsed(collapsed) {
  dashboard.sidebarCollapsed = Boolean(collapsed);
  writePrefs();
}

export function updateUser(nextUser) {
  dashboard.user = { ...dashboard.user, ...nextUser };
  writePrefs();
}

export function dismissToast(id) {
  dashboard.toasts = dashboard.toasts.filter((t) => t.id !== id);
}

export function showToast(message, type) {
  const inferred =
    type ||
    (/gagal|error|wajib|invalid/i.test(message)
      ? 'error'
      : /deleted|removed|warning/i.test(message)
        ? 'warning'
        : /added|updated|saved|downloaded|created|completed|welcome|activated/i.test(message)
          ? 'success'
          : 'info');

  const id = Date.now() + Math.random();
  dashboard.toasts = [...dashboard.toasts.slice(-3), { id, message, type: inferred }];
  if (typeof window !== 'undefined') {
    setTimeout(() => dismissToast(id), 3400);
  }
  logEvent(`Toast (${inferred}): "${message}"`);
}

export function logEvent(text) {
  const now = new Date();
  const time = now.toTimeString().slice(0, 5);
  dashboard.eventLog = [
    { id: Date.now() + Math.random(), time, text },
    ...dashboard.eventLog.slice(0, 7),
  ];
}

export function applyTheme(presetKey, { silent = false } = {}) {
  const preset = THEME_PRESETS[presetKey];
  if (!preset) return;
  dashboard.theme = presetKey;
  dashboard.darkMode = Boolean(preset.dark);
  if (!preset.dark) {
    dashboard.lastLightTheme = presetKey;
  }
  if (typeof document !== 'undefined') {
    const root = document.documentElement;
    root.dataset.theme = preset.dark ? 'dark' : 'light';
    for (const [k, v] of Object.entries(preset.vars)) {
      root.style.setProperty(k, v);
    }
  }
  applyCustomVars();
  writePrefs();
  if (!silent) {
    logEvent(`Theme switched to ${preset.name}`);
  }
}

export function applyCustomVars() {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (dashboard.accentColor) {
    root.style.setProperty('--sk-acc', dashboard.accentColor);
  }
  const r = Number(dashboard.borderRadius) || 18;
  root.style.setProperty('--radius-lg', `${r}px`);
  root.style.setProperty('--radius-md', `${Math.max(8, r - 6)}px`);
  root.style.setProperty('--sk-r', `${Math.max(10, r - 3)}px`);

  if (dashboard.density === 'compact') {
    root.style.setProperty('--card-pad', '11px 13px');
    root.style.setProperty('--stack-gap', '10px');
  } else {
    root.style.setProperty('--card-pad', '16px');
    root.style.setProperty('--stack-gap', '14px');
  }

  root.style.setProperty(
    '--sidebar-bg',
    dashboard.sidebarStyle === 'tinted' ? 'var(--surface-alt)' : 'var(--surface)'
  );
}

export function setCustomization(patch) {
  Object.assign(dashboard, patch);
  if (patch.accentColor === '') {
    const preset = THEME_PRESETS[dashboard.theme];
    if (preset && typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--sk-acc', preset.vars['--sk-acc']);
    }
  }
  applyCustomVars();
  writePrefs();
}

export function resetCustomization() {
  dashboard.accentColor = '';
  dashboard.borderRadius = '18';
  dashboard.density = 'comfortable';
  dashboard.sidebarStyle = 'default';
  dashboard.sidebarCollapsed = false;
  applyTheme(APP_CONFIG.defaultTheme || 'paper');
}

export function restoreDefaultDashboard() {
  dashboard.searchQuery = '';
  dashboard.user = { ...APP_CONFIG.defaultUser };
  restoreDemoNotifications();
  dashboard.eventLog = [
    { id: Date.now(), time: new Date().toTimeString().slice(0, 5), text: 'Dashboard state restored to defaults' },
  ];
  resetCustomization();
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

export function markNotificationRead(id) {
  dashboard.notifications = dashboard.notifications.map((n) =>
    n.id === id ? { ...n, unread: false } : n
  );
}

export function markAllNotificationsRead() {
  dashboard.notifications = dashboard.notifications.map((n) => ({ ...n, unread: false }));
}

export function clearNotifications() {
  dashboard.notifications = [];
}

export function restoreDemoNotifications() {
  dashboard.notifications = [
    { id: Date.now() + 1, title: 'Shot #042 Render Complete', time: 'Just now', unread: true, type: 'success' },
    { id: Date.now() + 2, title: 'New comment from Yui on Cut 07', time: '18m ago', unread: true, type: 'info' },
  ];
}
