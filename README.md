# Sakuga VFX — Svelte 5 Dashboard Template

Template dashboard modern berbasis **Svelte 5** yang memadukan seluruh komponen UI reaktif bergaya animasi anime (*sakuga*) dari **Sakuga VFX**.

## Kredit & Sumber Komponen

Seluruh komponen interaktif (`<sakuga-button>`, `<sakuga-toggle>`, `<sakuga-slider>`, `<sakuga-checkbox>`, `<sakuga-radio>`, `<sakuga-input>`, `<sakuga-tabs>`, `<sakuga-progress>`, `<sakuga-rating>`, `<sakuga-toast>`, dan `<sakuga-tooltip>`) berasal dari repositori open-source:

- **Pembuat / Author:** Justin Finkelman ([`@finktheartist`](https://github.com/finktheartist))
- **Repositori GitHub:** [finktheartist/sakuga-vfx](https://github.com/finktheartist/sakuga-vfx)
- **Demo Resmi:** [https://sakuga-vfx.vercel.app](https://sakuga-vfx.vercel.app)
- **Lisensi Komponen:** MIT License

Setiap komponen dimuat langsung dari `public/sakuga-vfx/` menggunakan tag `<script>` standar sehingga seluruh efek *spring*, *impact burst*, kepulan asap, *43-frame toggle sprite*, serta huruf efek suara manga (`ドン!`, `カチッ`, `ズザッ`, `ポン`, `ゴゴゴゴ`) berbagi satu canvas `window.SakugaFX`.

## Tech Stack

- **Framework UI:** [Svelte 5](https://svelte.dev/) (`^5.57.3`) dengan Svelte 5 Runes (`$state`, `$derived`)
- **Build Tool & Dev Server:** [Vite](https://vite.dev/) (`^8.3.6`) + `@sveltejs/vite-plugin-svelte` (`^7.3.1`)
- **Komponen Interaktif:** Sakuga VFX Web Components (11 Custom Elements tanpa dependensi eksternal)
- **Styling & Tema:** Vanilla CSS dengan CSS Custom Properties (`--sk-*` tokens) yang mendukung **Light Mode** (*Classic Sakuga Paper*, *Sakura Pop*, *Cyber Shonen*) dan **Dark Mode** (*Midnight Sakuga*)
- **Tipografi:** Google Fonts (`Plus Jakarta Sans` & `JetBrains Mono`)
- **Ikon:** Komponen SVG terpusat (`src/lib/Icon.svelte`) + custom icon & favicon (`public/sakuga-icon.png`)

## Fitur & Halaman Template

- **Initial Splash Loader:** Layar loading awal menggunakan `<sakuga-progress>` yang otomatis menutup saat `sakuga:done`.
- **Header & Sidebar Responsif:**
  - Sidebar dapat di-collapse di desktop (dengan tooltip nama menu bergaya anime saat di-hover) dan berubah menjadi drawer di mobile.
  - Header sticky satu baris dengan pencarian real-time, toggle Dark/Light Mode, dropdown notifikasi, dan menu profil user.
- **10 Halaman Lengkap:**
  1. **Overview** — KPI cards, Render Pipeline `<sakuga-progress>`, Quick Studio Controls, Feed aktivitas, dan Quick Shot Modal.
  2. **Analytics** — Grafik batang interaktif dengan filter periode `<sakuga-tabs>` dan breakdown efek VFX.
  3. **Data Tables** — Tabel *Projects & Invoices* serta *Studio Team & Roles* lengkap dengan modal pop-up **Tambah & Edit Data**.
  4. **Render Queue** — Antrean render dengan filter `<sakuga-tabs>`, progress bar, dan modal **Add / Edit Shot**.
  5. **All 12 Controls** — Galeri interaktif seluruh 12 kontrol `sakuga-vfx` beserta readout event langsung.
  6. **Studio Form** — Contoh form terintegrasi penuh dengan `new FormData(form)`.
  7. **Profile** — Kartu identitas dan form edit profil yang tersinkronisasi dengan Header.
  8. **Theme & FX** — Pengaturan tema preset `--sk-*` dan preferensi efek.
  9. **Login Page** — Template halaman Sign In full-screen.
  10. **Register Page** — Template halaman Create Account full-screen.

## Cara Menjalankan

```bash
# Masuk ke folder project
cd sakuga-dashboard

# Instal dependensi
npm install

# Jalankan server development
npm run dev

# Build untuk produksi
npm run build
```
