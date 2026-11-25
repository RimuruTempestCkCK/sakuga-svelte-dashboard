<script>
  import Modal from '../Modal.svelte';
  import {
    THEME_PRESETS,
    dashboard,
    applyTheme,
    setCustomization,
    setSidebarCollapsed,
    resetCustomization,
    restoreDemoNotifications,
    restoreDefaultDashboard,
    showToast,
    logEvent,
  } from '../store.svelte.js';

  let saveBtn = $state();
  let particleDensity = $state(85);
  let sfxLabels = $state(true);
  let confirmModalOpen = $state(false);
  let confirmAction = $state(null); // 'theme' | 'notifications' | 'all'

  const ACCENT_SWATCHES = [
    { label: 'Default', value: '' },
    { label: 'Sakura Pink', value: '#ff5fa8' },
    { label: 'Periwinkle', value: '#7c79f2' },
    { label: 'Emerald', value: '#10b981' },
    { label: 'Amber', value: '#f59e0b' },
    { label: 'Cyan', value: '#06b6d4' },
  ];

  function handleSave() {
    logEvent('Settings & theme customization saved');
    showToast('Theme & layout preferences saved!', 'success');
    setTimeout(() => saveBtn?.done?.(), 700);
  }

  function askReset(action) {
    confirmAction = action;
    confirmModalOpen = true;
  }

  function runConfirmedReset() {
    if (confirmAction === 'theme') {
      resetCustomization();
      showToast('Theme & layout preferences reset', 'info');
    } else if (confirmAction === 'notifications') {
      restoreDemoNotifications();
      showToast('Notification demo restored', 'success');
    } else if (confirmAction === 'all') {
      restoreDefaultDashboard();
      showToast('Default dashboard state restored', 'success');
    }
    confirmModalOpen = false;
    confirmAction = null;
  }
</script>

<div class="settings-grid">
  <div class="card">
    <div class="card-head">
      <div>
        <h2 class="card-title">Theme Presets (--sk-* Variables)</h2>
        <p class="card-desc">Overrides <code>:root</code> CSS variables — saved automatically to localStorage.</p>
      </div>
      <sakuga-tooltip text="Sakuga VFX uses :where(:root) so your own :root CSS variables win." label="Theme info"></sakuga-tooltip>
    </div>

    <div class="theme-radio">
      <sakuga-radio
        label="Color Theme"
        value={dashboard.theme}
        onchange={(e) => {
          applyTheme(e.target.value);
          showToast(`Theme: ${THEME_PRESETS[e.target.value]?.name}`, 'success');
        }}
      >
        <option value="paper" selected={dashboard.theme === 'paper'}>{THEME_PRESETS.paper.name}</option>
        <option value="sakura" selected={dashboard.theme === 'sakura'}>{THEME_PRESETS.sakura.name}</option>
        <option value="cyber" selected={dashboard.theme === 'cyber'}>{THEME_PRESETS.cyber.name}</option>
        <option value="midnight" selected={dashboard.theme === 'midnight'}>{THEME_PRESETS.midnight.name}</option>
      </sakuga-radio>
    </div>

    <div class="sub-section">
      <span class="sub-label">Accent Color</span>
      <div class="swatch-row">
        {#each ACCENT_SWATCHES as sw}
          <button
            type="button"
            class="swatch-btn"
            class:active={dashboard.accentColor === sw.value}
            onclick={() => {
              setCustomization({ accentColor: sw.value });
              showToast(`Accent: ${sw.label}`, 'info');
            }}
          >
            <span
              class="swatch-dot"
              style="background: {sw.value || THEME_PRESETS[dashboard.theme]?.vars['--sk-acc']}"
            ></span>
            <span>{sw.label}</span>
          </button>
        {/each}
        <label class="color-picker-pill" title="Custom accent color">
          <input
            type="color"
            value={dashboard.accentColor || '#ff5fa8'}
            oninput={(e) => setCustomization({ accentColor: e.target.value })}
          />
          <span>Custom</span>
        </label>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-head">
      <div>
        <h2 class="card-title">Layout & Density Customizer</h2>
        <p class="card-desc">Adjust border radius, card density, and sidebar appearance live.</p>
      </div>
    </div>

    <div class="pref-list">
      <div class="pref-col">
        <span class="sub-label">Border Radius</span>
        <sakuga-radio
          label="Border Radius"
          value={dashboard.borderRadius}
          onchange={(e) => {
            setCustomization({ borderRadius: e.target.value });
            showToast(`Radius: ${e.target.value}px`, 'info');
          }}
        >
          <option value="10" selected={dashboard.borderRadius === '10'}>Sharp (10px)</option>
          <option value="18" selected={dashboard.borderRadius === '18'}>Default (18px)</option>
          <option value="24" selected={dashboard.borderRadius === '24'}>Soft (24px)</option>
        </sakuga-radio>
      </div>

      <div class="pref-col">
        <span class="sub-label">Card Density</span>
        <sakuga-radio
          label="Card Density"
          value={dashboard.density}
          onchange={(e) => {
            setCustomization({ density: e.target.value });
            showToast(`Density: ${e.target.value}`, 'info');
          }}
        >
          <option value="comfortable" selected={dashboard.density === 'comfortable'}>Comfortable</option>
          <option value="compact" selected={dashboard.density === 'compact'}>Compact</option>
        </sakuga-radio>
      </div>

      <div class="pref-col">
        <span class="sub-label">Sidebar Style</span>
        <sakuga-radio
          label="Sidebar Style"
          value={dashboard.sidebarStyle}
          onchange={(e) => {
            setCustomization({ sidebarStyle: e.target.value });
            showToast(`Sidebar: ${e.target.value}`, 'info');
          }}
        >
          <option value="default" selected={dashboard.sidebarStyle === 'default'}>Paper Surface</option>
          <option value="tinted" selected={dashboard.sidebarStyle === 'tinted'}>Tinted Alt</option>
        </sakuga-radio>
      </div>

      <div class="pref-row">
        <div>
          <strong>Collapse Sidebar</strong>
          <p class="card-desc">Icon-only desktop rail with hover tooltips</p>
        </div>
        <sakuga-toggle
          label="Collapse Sidebar"
          checked={dashboard.sidebarCollapsed}
          onchange={(e) => setSidebarCollapsed(e.target.checked)}
        ></sakuga-toggle>
      </div>
    </div>
  </div>

  <div class="card full-span">
    <div class="card-head">
      <div>
        <h2 class="card-title">FX & Motion Preferences</h2>
        <p class="card-desc">UI preference simulation controls (logged to Studio Feed; browser <code>prefers-reduced-motion</code> controls engine FX).</p>
      </div>
      <span class="badge">UI Simulation</span>
    </div>

    <div class="pref-list">
      <div class="pref-row">
        <div>
          <strong>Manga Sound Effects</strong>
          <p class="card-desc">Show ドン!, カチッ, ズザッ, ポン, ゴゴゴゴ</p>
        </div>
        <sakuga-toggle
          label="Manga Sound Effects"
          checked={sfxLabels}
          onchange={(e) => { sfxLabels = e.target.checked; logEvent(`SFX Lettering: ${sfxLabels ? 'ON' : 'OFF'}`); }}
        ></sakuga-toggle>
      </div>

      <div class="pref-row">
        <div>
          <strong>Particle Density</strong>
          <p class="card-desc">Scale smoke & crystal bursts</p>
        </div>
        <div class="slider-wrap">
          <sakuga-slider
            label="Particle Density"
            value={particleDensity}
            onchange={(e) => { particleDensity = Number(e.target.value); logEvent(`Particle density: ${particleDensity}%`); }}
          ></sakuga-slider>
        </div>
      </div>
    </div>

    <div class="pref-actions">
      <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
      <sakuga-button bind:this={saveBtn} onclick={handleSave}>Save Preferences</sakuga-button>
      <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
      <sakuga-button variant="secondary" onclick={() => askReset('theme')}>
        Reset Default
      </sakuga-button>
    </div>
  </div>

  <div class="card full-span">
    <div class="card-head">
      <div>
        <h2 class="card-title">Demo Data & State Management</h2>
        <p class="card-desc">Safely reset theme preferences, notification demo, or full dashboard state (requires confirmation).</p>
      </div>
      <span class="badge">Local State</span>
    </div>

    <div class="demo-actions">
      <button type="button" class="pill" onclick={() => askReset('theme')}>
        Reset Theme Preferences
      </button>
      <button type="button" class="pill" onclick={() => askReset('notifications')}>
        Reset Notification Demo
      </button>
      <button type="button" class="pill danger" onclick={() => askReset('all')}>
        Restore Default Dashboard State
      </button>
    </div>
  </div>
</div>

<Modal
  bind:open={confirmModalOpen}
  title="Confirm Reset"
  subtitle="Please confirm before resetting saved preferences or demo data."
>
  <p style="font-size: 14px; line-height: 1.5;">
    {#if confirmAction === 'theme'}
      Reset semua pengaturan tema, accent color, border radius, dan density ke default?
    {:else if confirmAction === 'notifications'}
      Pulihkan daftar notifikasi demo awal?
    {:else}
      Pulihkan seluruh state dashboard (tema, sidebar, profil user, notifikasi, dan log) ke kondisi awal?
    {/if}
  </p>
  <div class="card-footer">
    <button type="button" class="pill danger-solid" onclick={runConfirmedReset}>Confirm Reset</button>
    <button type="button" class="pill" onclick={() => (confirmModalOpen = false)}>Cancel</button>
  </div>
</Modal>

<style>
  .settings-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
    gap: 14px;
    align-items: start;
  }

  .full-span {
    grid-column: 1 / -1;
  }

  .theme-radio {
    padding: 4px 0 12px;
  }

  .sub-section {
    padding-top: 12px;
    border-top: 1px dashed var(--line);
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .sub-label {
    font-size: 12px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--mute);
  }

  .swatch-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .swatch-btn,
  .color-picker-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 32px;
    padding: 0 10px;
    border-radius: 999px;
    border: 1.5px solid var(--line);
    background: var(--surface-alt);
    color: var(--text);
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
  }

  .swatch-btn.active {
    border-color: var(--sk-ink, #1d1a4a);
    box-shadow: 2px 2px 0 var(--sk-soft, #b8b3ff);
  }

  .swatch-dot {
    width: 12px;
    height: 12px;
    border-radius: 999px;
    border: 1px solid var(--sk-ink, #1d1a4a);
  }

  .color-picker-pill input {
    width: 18px;
    height: 18px;
    padding: 0;
    border: none;
    background: none;
    cursor: pointer;
  }

  .pref-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .pref-col {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding-bottom: 10px;
    border-bottom: 1px dashed var(--line);
  }

  .pref-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding-bottom: 10px;
    border-bottom: 1px dashed var(--line);
  }

  .pref-row:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  .slider-wrap {
    padding-top: 14px;
    --sk-slider-width: 190px;
  }

  .pref-actions,
  .demo-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 14px;
    padding-top: 12px;
    border-top: 1.5px solid var(--line);
  }

  .demo-actions {
    margin-top: 0;
    padding-top: 0;
    border-top: none;
  }
</style>
