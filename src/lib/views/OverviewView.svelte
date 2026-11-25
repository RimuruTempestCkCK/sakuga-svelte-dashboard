<script>
  import Modal from '../Modal.svelte';
  import { dashboard, logEvent, showToast, navigate } from '../store.svelte.js';

  let progressEl = $state();
  let deployBtn = $state();
  let progressVal = $state(0.35);
  let activeTab = $state('activity');
  let volume = $state(75);
  let qualityRating = $state(5);
  let autoCache = $state(true);
  let smearFx = $state(true);

  let quickModalOpen = $state(false);
  let quickNoteTitle = $state('');
  let quickNotePriority = $state('High');

  function submitQuickNote(e) {
    e.preventDefault();
    const title = quickNoteTitle.trim() || 'New Studio Cut';
    logEvent(`[${quickNotePriority}] Added quick shot: ${title}`);
    showToast(`Added "${title}"!`);
    quickNoteTitle = '';
    quickModalOpen = false;
  }

  function bumpProgress(amount) {
    progressVal = Math.min(1, +(progressVal + amount).toFixed(2));
    progressEl?.set?.(progressVal);
    logEvent(`Render pipeline advanced to ${Math.round(progressVal * 100)}%`);
  }

  function resetProgress() {
    progressVal = 0;
    progressEl?.reset?.();
    logEvent('Render pipeline reset to 0%');
  }

  function handleProgressDone() {
    logEvent('Render pipeline completed (sakuga:done)');
    showToast('ドン! Render pipeline complete!');
  }

  function onSakugaDone(node, fn) {
    node.addEventListener('sakuga:done', fn);
    return {
      destroy() {
        node.removeEventListener('sakuga:done', fn);
      },
    };
  }

  function handleDeploy() {
    logEvent('Triggered production deploy');
    showToast('Deploying Sakuga build...');
    setTimeout(() => {
      deployBtn?.done?.();
    }, 700);
  }

  function handleTabChange(e) {
    activeTab = e.detail?.value || 'activity';
  }
</script>

<div class="overview">
  <section class="kpi-grid">
    <div class="card kpi-card">
      <div class="kpi-top">
        <span class="kpi-label">Active Controls</span>
        <span class="badge accent">12 / 12</span>
      </div>
      <div class="kpi-val sakuga-title">100%</div>
      <p class="kpi-sub">All Sakuga VFX elements loaded</p>
    </div>

    <div class="card kpi-card">
      <div class="kpi-top">
        <span class="kpi-label">Canvas Loop</span>
        <span class="badge">60 FPS</span>
      </div>
      <div class="kpi-val sakuga-title">0.4ms</div>
      <p class="kpi-sub">Shared spring & particle clock</p>
    </div>

    <div class="card kpi-card">
      <div class="kpi-top">
        <span class="kpi-label">Render Target</span>
        <sakuga-tooltip text="Adjusts the live preview slider below." label="Render target info"></sakuga-tooltip>
      </div>
      <div class="kpi-val sakuga-title">{volume}%</div>
      <p class="kpi-sub">Current FX intensity level</p>
    </div>

    <div class="card kpi-card">
      <div class="kpi-top">
        <span class="kpi-label">Shot Quality</span>
        <span class="badge">S-Rank</span>
      </div>
      <div class="kpi-val sakuga-title">{qualityRating} / 5 ★</div>
      <p class="kpi-sub">Key animator rating</p>
    </div>
  </section>

  <section class="main-grid">
    <div class="card pipeline-card">
      <div class="card-head">
        <div>
          <h2>Render Pipeline</h2>
          <p class="card-desc">Drive &lt;sakuga-progress&gt; with real surges and watch ゴゴゴゴ + ドン! on finish.</p>
        </div>
        <sakuga-tooltip text="Click +25% or Complete to watch the storm cloud and pebbles ride the bar." label="Pipeline help"></sakuga-tooltip>
      </div>

      <div class="progress-stage">
        <sakuga-progress
          bind:this={progressEl}
          label="Shot #042 Render"
          use:onSakugaDone={handleProgressDone}
        ></sakuga-progress>
      </div>

      <div class="card-actions">
        <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
        <sakuga-button variant="secondary" onclick={() => bumpProgress(0.25)}>+25% Surge</sakuga-button>
        <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
        <sakuga-button bind:this={deployBtn} onclick={() => { bumpProgress(1 - progressVal); handleDeploy(); }}>Complete & Deploy</sakuga-button>
        <button type="button" class="pill" onclick={resetProgress}>Reset 0%</button>
        <button type="button" class="pill" onclick={() => (quickModalOpen = true)}>+ Quick Shot Modal</button>
      </div>
    </div>

    <div class="card quick-card">
      <div class="card-head">
        <div>
          <h2>Quick Studio Controls</h2>
          <p class="card-desc">Interactive anime-spring controls wired to Svelte 5 state.</p>
        </div>
        <button type="button" class="pill" onclick={() => navigate('components')}>View all 12 →</button>
      </div>

      <div class="quick-list">
        <div class="quick-row">
          <div>
            <strong>Smear Frames</strong>
            <p class="muted-sm">43-frame painted sprite toggle</p>
          </div>
          <sakuga-toggle
            label="Smear Frames"
            checked={smearFx}
            onchange={(e) => { smearFx = e.target.checked; logEvent(`Smear Frames: ${smearFx ? 'ON' : 'OFF'}`); }}
          ></sakuga-toggle>
        </div>

        <div class="quick-row">
          <div>
            <strong>FX Intensity</strong>
            <p class="muted-sm">Drag fast for cumulus smoke</p>
          </div>
          <div class="slider-box">
            <sakuga-slider
              label="FX Intensity"
              value={volume}
              oninput={(e) => (volume = Number(e.target.value))}
              onchange={(e) => logEvent(`FX Intensity set to ${e.target.value}%`)}
            ></sakuga-slider>
          </div>
        </div>

        <div class="quick-row">
          <div>
            <strong>Auto-Cache Frames</strong>
            <p class="muted-sm">Slash & crystal burst check</p>
          </div>
          <sakuga-checkbox
            checked={autoCache}
            onchange={(e) => { autoCache = e.target.checked; logEvent(`Auto-Cache: ${autoCache ? 'checked' : 'unchecked'}`); }}
          >
            Enabled
          </sakuga-checkbox>
        </div>

        <div class="quick-row">
          <div>
            <strong>Quality Rating</strong>
            <p class="muted-sm">5 stars triggers impact burst</p>
          </div>
          <sakuga-rating
            label="Quality Rating"
            value={qualityRating}
            onchange={(e) => { qualityRating = Number(e.target.value); logEvent(`Quality rated ${qualityRating}/5`); }}
          ></sakuga-rating>
        </div>
      </div>
    </div>
  </section>

  <section class="card log-card">
    <div class="log-header">
      <h2>Studio Feed</h2>
      <sakuga-tabs label="Feed view" onchange={handleTabChange}>
        <option value="activity" selected>Activity Log</option>
        <option value="architecture">Architecture</option>
      </sakuga-tabs>
    </div>

    {#if activeTab === 'activity'}
      <ul class="log-list">
        {#each dashboard.eventLog as entry (entry.id)}
          <li class="log-item">
            <span class="badge mono">{entry.time}</span>
            <span>{entry.text}</span>
          </li>
        {/each}
      </ul>
    {:else}
      <div class="arch-info">
        <p><strong>Svelte 5 + Sakuga VFX:</strong> Every control is a native Custom Element loaded via plain <code>&lt;script&gt;</code> tags in <code>index.html</code>, sharing one <code>window.SakugaFX</code> fixed canvas and spring animation loop.</p>
        <p><strong>No clipping:</strong> Cards avoid <code>overflow: hidden</code> so back-layer impact bursts, 43-frame toggle splashes, and manga sound effects (ドン!, カチッ, ズザッ, ポン, ゴゴゴゴ) fly freely across the dashboard.</p>
      </div>
    {/if}
  </section>
</div>

<Modal
  bind:open={quickModalOpen}
  title="Quick Shot Entry"
  subtitle="Add a new studio cut note directly from Overview."
>
  <form class="quick-modal-form" onsubmit={submitQuickNote}>
    <div class="qm-field">
      <span class="qm-label">Shot Name</span>
      <div class="qm-input">
        <sakuga-input
          label="Shot Name"
          value={quickNoteTitle}
          placeholder="e.g. Cut 50 — Lightning Impact"
          oninput={(e) => (quickNoteTitle = e.target.value)}
        ></sakuga-input>
      </div>
    </div>

    <div class="qm-field">
      <span class="qm-label">Priority</span>
      <sakuga-radio
        label="Priority"
        value={quickNotePriority}
        onchange={(e) => (quickNotePriority = e.target.value)}
      >
        <option value="Normal">Normal</option>
        <option value="High" selected>High</option>
        <option value="Urgent">Urgent</option>
      </sakuga-radio>
    </div>

    <div class="card-footer">
      <sakuga-button type="submit">Add Shot</sakuga-button>
      <button type="button" class="pill" onclick={() => (quickModalOpen = false)}>Cancel</button>
    </div>
  </form>
</Modal>

<style>
  .overview {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .kpi-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 200px), 1fr));
    gap: 12px;
  }

  .kpi-card {
    gap: 8px;
  }

  .kpi-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .kpi-label {
    font-size: 13px;
    font-weight: 700;
    color: var(--mute);
  }

  .kpi-val {
    font-size: 30px;
    line-height: 1.1;
    color: var(--text);
  }

  .kpi-sub {
    font-size: 12.5px;
    color: var(--mute);
  }

  .main-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr));
    gap: 14px;
  }

  .card-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 10px;
  }

  .card-head h2 {
    font-size: 15.5px;
    font-weight: 700;
  }

  .card-desc {
    font-size: 12.5px;
    color: var(--mute);
    margin-top: 2px;
  }

  .progress-stage {
    flex: 1;
    display: grid;
    place-items: center;
    padding: 20px 10px 12px;
    min-height: 140px;
  }

  .card-actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
    padding-top: 12px;
    border-top: 1.5px solid var(--line);
  }

  .quick-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .quick-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding-bottom: 10px;
    border-bottom: 1px dashed var(--line);
  }

  .quick-row:last-child {
    padding-bottom: 0;
    border-bottom: none;
  }

  .muted-sm {
    font-size: 12.5px;
    color: var(--mute);
  }

  .slider-box {
    --sk-slider-width: 190px;
    padding-top: 14px;
  }

  .log-card {
    gap: 16px;
  }

  .log-header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .log-header h2 {
    font-size: 16px;
    font-weight: 700;
  }

  .log-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .log-item {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13.5px;
    padding: 8px 12px;
    border-radius: 10px;
    background: var(--surface-alt);
    border: 1px solid var(--line);
  }

  .arch-info {
    display: flex;
    flex-direction: column;
    gap: 10px;
    font-size: 13.5px;
    color: var(--text);
    background: var(--surface-alt);
    padding: 14px 16px;
    border-radius: 12px;
    border: 1px solid var(--line);
  }

  .arch-info code {
    padding: 1px 6px;
    border-radius: 5px;
    background: var(--chip);
    font-size: 12.5px;
  }

  .quick-modal-form {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .qm-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .qm-label {
    font-size: 12.5px;
    font-weight: 700;
  }

  .qm-input {
    --sk-input-width: 100%;
    width: 100%;
  }

  .qm-input :global(sakuga-input) {
    display: block;
    width: 100%;
  }
</style>
