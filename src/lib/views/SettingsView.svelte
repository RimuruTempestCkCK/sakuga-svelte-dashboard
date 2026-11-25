<script>
  import { THEME_PRESETS, dashboard, applyTheme, showToast, logEvent } from '../store.svelte.js';

  let saveBtn = $state();
  let particleDensity = $state(85);
  let sfxLabels = $state(true);

  function handleSave() {
    logEvent('Settings saved');
    showToast('Theme & FX preferences saved!');
    setTimeout(() => saveBtn?.done?.(), 700);
  }
</script>

<div class="settings-grid">
  <div class="card">
    <div class="card-head">
      <div>
        <h2>Theme Presets (--sk-* Variables)</h2>
        <p class="card-desc">Overrides <code>:root</code> CSS variables — every Sakuga control adapts immediately.</p>
      </div>
      <sakuga-tooltip text="Sakuga VFX uses :where(:root) so your own :root CSS variables win." label="Theme info"></sakuga-tooltip>
    </div>

    <div class="theme-radio">
      <sakuga-radio
        label="Color Theme"
        value={dashboard.theme}
        onchange={(e) => applyTheme(e.target.value)}
      >
        <option value="paper" selected={dashboard.theme === 'paper'}>{THEME_PRESETS.paper.name}</option>
        <option value="sakura" selected={dashboard.theme === 'sakura'}>{THEME_PRESETS.sakura.name}</option>
        <option value="cyber" selected={dashboard.theme === 'cyber'}>{THEME_PRESETS.cyber.name}</option>
        <option value="midnight" selected={dashboard.theme === 'midnight'}>{THEME_PRESETS.midnight.name}</option>
      </sakuga-radio>
    </div>
  </div>

  <div class="card">
    <div class="card-head">
      <div>
        <h2>FX & Motion Preferences</h2>
        <p class="card-desc">Configure canvas particle density and manga lettering display.</p>
      </div>
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
      <sakuga-button
        variant="secondary"
        onclick={() => {
          applyTheme('paper');
          showToast('Reset to Classic Sakuga Paper');
        }}
      >
        Reset Default
      </sakuga-button>
    </div>
  </div>
</div>

<style>
  .settings-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
    gap: 14px;
    align-items: start;
  }

  .card-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 12px;
  }

  .card-head h2 {
    font-size: 16px;
    font-weight: 700;
  }

  .card-desc {
    font-size: 13px;
    color: var(--mute);
    margin-top: 2px;
  }

  .card-desc code {
    background: var(--chip);
    padding: 1px 5px;
    border-radius: 5px;
    font-size: 12px;
  }

  .theme-radio {
    padding: 8px 0;
  }

  .pref-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
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

  .pref-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 14px;
    padding-top: 12px;
    border-top: 1.5px solid var(--line);
  }
</style>
