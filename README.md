# Sakuga VFX — Svelte 5 Dashboard Template

Template dashboard modern berbasis **Svelte 5** dan **Vite** yang memadukan seluruh komponen interaktif bergaya anime (*sakuga*) dari **Sakuga VFX** dengan sistem chart SVG reusable, Command Palette, Notification Center, Toast System, Advanced Data Table, dan Theme Customizer.

## Kredit & Sumber Komponen

Seluruh elemen custom (`<sakuga-button>`, `<sakuga-toggle>`, `<sakuga-slider>`, `<sakuga-checkbox>`, `<sakuga-radio>`, `<sakuga-input>`, `<sakuga-tabs>`, `<sakuga-progress>`, `<sakuga-rating>`, `<sakuga-toast>`, dan `<sakuga-tooltip>`) berasal dari repositori open-source:

- **Author:** Justin Finkelman ([`@finktheartist`](https://github.com/finktheartist))
- **Repositori GitHub:** [finktheartist/sakuga-vfx](https://github.com/finktheartist/sakuga-vfx)
- **Demo Resmi:** [https://sakuga-vfx.vercel.app](https://sakuga-vfx.vercel.app)
- **Lisensi Komponen:** MIT License

Skrip komponen dimuat langsung dari `public/sakuga-vfx/` melalui tag `<script>` standar di `index.html` sehingga seluruh efek *spring*, *impact burst*, kepulan asap, *43-frame toggle sprite*, serta huruf efek suara manga (`ドン!`, `カチッ`, `ズザッ`, `ポン`, `ゴゴゴゴ`) berbagi satu canvas `window.SakugaFX`.

## Tech Stack

- **Framework:** [Svelte 5](https://svelte.dev/) (`^5.57.3`) dengan Svelte 5 Runes (`$state`, `$derived`, `$effect`)
- **Build Tool:** [Vite](https://vite.dev/) (`^8.3.6`) + `@sveltejs/vite-plugin-svelte` (`^7.3.1`)
- **Web Components:** Sakuga VFX (11 Custom Elements tanpa dependensi runtime)
- **Data Visualization:** Komponen SVG native theme-aware (`Sparkline`, `AreaLineChart`, `DonutChart`, `GroupedBarChart`, `RadarChart`, `ActivityHeatmap`)
- **Styling:** Vanilla CSS + CSS Custom Properties (`--sk-*`)
- **Tipografi:** Google Fonts (`Plus Jakarta Sans` & `JetBrains Mono`)

## Features

- **Collapsible Sidebar Navigation:** Kategori dapat di-expand/collapse, auto-expand sesuai route aktif, active state pada parent & child, serta tooltip hover saat mode collapsed.
- **Command Palette (`Ctrl/Cmd + K`):** Pencarian cepat halaman, kategori, dan aksi dengan navigasi keyboard (`↑`/`↓`, `Enter`, `Escape`).
- **Keyboard Shortcuts:** `Ctrl/Cmd + K` (Command Palette), `Ctrl/Cmd + B` (Toggle Sidebar), `Shift + ?` (Shortcut Reference), dan `Escape` (Tutup modal/dropdown).
- **Notification Center & Toast Stack:** Mark as read per item, Mark all read, Clear & Restore demo, serta multi-toast (`success`, `error`, `warning`, `info`) dengan auto-dismiss dan manual dismiss.
- **Advanced Data Table:** Add/Edit/Delete dengan modal konfirmasi, column visibility, column sorting, filter status & client, row density (*Normal* / *Compact*), pagination (`5`/`10`/`25`/`50`), empty state, dan export CSV (`Blob`).
- **Component & Pattern Catalog:** Galeri seluruh 12 kontrol `sakuga-vfx` plus UI patterns (*Badges*, *Metric Card*, *Modal*, *Toast Stack*, *Dropdown*, *Empty State*, *Loading Skeleton*) lengkap dengan tombol **Copy Code**.
- **Theme & Layout Customizer:** 4 preset tema (`Paper`, `Sakura`, `Cyber`, `Midnight`), custom Accent Color, Border Radius (`10px`/`18px`/`24px`), Card Density, Sidebar Style, dan Demo Data Reset dengan konfirmasi modal.
- **Auth UI Templates:** `Login`, `Register`, `Forgot Password`, `Reset Password`, dan halaman `404 Not Found`.

## Installation, Development & Build

```bash
# 1. Clone atau masuk ke folder project
cd sakuga-dashboard

# 2. Instal dependensi
npm install

# 3. Jalankan server development
npm run dev

# 4. Build untuk produksi (output di folder dist/)
npm run build

# 5. Preview hasil build produksi
npm run preview
```

## Project Structure

```text
sakuga-dashboard/
├── public/
│   ├── favicon.png            # Favicon 64x64
│   ├── sakuga-icon.png        # App logo 512x512
│   └── sakuga-vfx/            # 11 skrip Web Components Sakuga VFX
├── src/
│   ├── lib/
│   │   ├── app.config.js      # Konfigurasi terpusat (nama, logo, navigasi, defaults)
│   │   ├── store.svelte.js    # State global, hash routing, localStorage & theme helpers
│   │   ├── charts/            # Sparkline, AreaLineChart, DonutChart, GroupedBarChart, RadarChart, ActivityHeatmap
│   │   ├── views/             # Overview, Analytics, Tables, Tasks, Components, StudioForm, Profile, Settings, Auth, NotFound
│   │   ├── CommandPalette.svelte
│   │   ├── Header.svelte
│   │   ├── Icon.svelte
│   │   ├── Modal.svelte
│   │   ├── Sidebar.svelte
│   │   ├── SplashLoader.svelte
│   │   └── ToastStack.svelte
│   ├── app.css                # Global styles & design tokens
│   ├── App.svelte             # Shell utama & global keyboard listeners
│   └── main.js                # Entry point (initDashboard sebelum mount)
└── index.html
```

## Routing

Dashboard menggunakan **Hash Routing** di `src/lib/store.svelte.js` (`PAGE_TO_HASH` & `resolveHash`):
- `#/overview`, `#/analytics`, `#/tables`, `#/tasks`, `#/kanban`, `#/calendar`, `#/components`, `#/studio-form`, `#/profile`, `#/billing`, `#/settings`, `#/help`
- `#/login`, `#/register`, `#/forgot-password`, `#/reset-password`, `#/403`, `#/500`, `#/maintenance`
- Route yang tidak terdaftar otomatis diarahkan ke `NotFoundView.svelte` (`404`).

## Theme & App Customization

1. **Konfigurasi Aplikasi (`src/lib/app.config.js`):** Ubah `name`, `subtitle`, `breadcrumbRoot`, `logo`, `defaultTheme`, `defaultUser`, `navGroups`, dan `navItems` dari satu file.
2. **CSS Variables (`--sk-*`):** Setiap kontrol Sakuga dan komponen dashboard membaca variabel `--sk-card`, `--sk-ink`, `--sk-dim`, `--sk-soft`, `--sk-pri`, `--sk-acc`, dan `--sk-track`. Preset tema didefinisikan di `THEME_PRESETS` pada `src/lib/store.svelte.js`.

## Adding a New Page

1. Buat file view baru di `src/lib/views/MyNewView.svelte`.
2. Tambahkan item menu di `APP_CONFIG.navItems` (`src/lib/app.config.js`).
3. Daftarkan route hash di `PAGE_TO_HASH` (`src/lib/store.svelte.js`).
4. Impor dan render view tersebut di blok `{#if dashboard.page === ...}` pada `src/App.svelte`.

## Adding a Chart

Impor komponen dari `src/lib/charts/` dan operasikan dengan prop standar Svelte 5:

```svelte
<script>
  import AreaLineChart from '../charts/AreaLineChart.svelte';
  const labels = ['Mon', 'Tue', 'Wed'];
  const series = [{ name: 'Output', color: 'var(--sk-pri)', data: [40, 65, 82] }];
</script>

<AreaLineChart {labels} {series} unit="k" height={220} />
```

## Using Reusable Components

- **Modal:** `<Modal bind:open={isOpen} title="Edit Data">...</Modal>`
- **Toast System:** `import { showToast } from '../store.svelte.js'; showToast('Data saved!', 'success');` (mendukung `'success' | 'error' | 'warning' | 'info'`).
- **Icons:** `<Icon name="search" size={18} />` dari `src/lib/Icon.svelte`.

## LocalStorage Preferences

Preferensi disimpan secara aman ke `localStorage` di bawah key `APP_CONFIG.storageKey` (`sakuga_dashboard_prefs_v1`):
- `theme`, `lastLightTheme`, `sidebarCollapsed`, `accentColor`, `borderRadius`, `density`, `sidebarStyle`, dan profil `user` (nama, role, email, initials).
- Data sensitif seperti password **tidak pernah** disimpan ke `localStorage`.

## Demo Data Limitations

Template ini bersifat **frontend-only** tanpa backend API:
- Data tabel, antrean render, metrik analytics, notifikasi, dan form autentikasi (`Login`, `Register`, `Forgot Password`, `Reset Password`) menggunakan state lokal/simulasi UI.
- Perubahan data di `TablesView` dan `TasksView` berlaku selama sesi aktif dan dapat direset melalui **Settings → Demo Data & State Management**.
