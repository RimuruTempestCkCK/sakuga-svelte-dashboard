<script>
  import { showToast } from '../store.svelte.js';

  let period = $state('30d');

  const SERIES = {
    '7d': [
      { label: 'Mon', val: 42 },
      { label: 'Tue', val: 68 },
      { label: 'Wed', val: 55 },
      { label: 'Thu', val: 84 },
      { label: 'Fri', val: 92 },
      { label: 'Sat', val: 61 },
      { label: 'Sun', val: 74 },
    ],
    '30d': [
      { label: 'Wk 1', val: 58 },
      { label: 'Wk 2', val: 72 },
      { label: 'Wk 3', val: 89 },
      { label: 'Wk 4', val: 96 },
    ],
    '90d': [
      { label: 'Sep', val: 64 },
      { label: 'Oct', val: 78 },
      { label: 'Nov', val: 95 },
    ],
  };

  let bars = $derived(SERIES[period] || SERIES['30d']);
</script>

<div class="analytics-page">
  <div class="analytics-top card">
    <div class="top-row">
      <div>
        <h2>Studio Performance & Render Output</h2>
        <p class="card-desc">Switch timeframe with &lt;sakuga-tabs&gt; to inspect frame throughput.</p>
      </div>

      <div class="top-actions">
        <sakuga-tabs
          label="Timeframe"
          onchange={(e) => (period = e.detail?.value || '30d')}
        >
          <option value="7d">7 Days</option>
          <option value="30d" selected>30 Days</option>
          <option value="90d">90 Days</option>
        </sakuga-tabs>

        <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
        <sakuga-button variant="secondary" onclick={() => showToast(`Exported ${period} CSV report`)}>
          Export CSV
        </sakuga-button>
      </div>
    </div>
  </div>

  <div class="charts-grid">
    <div class="card chart-card">
      <div class="chart-head">
        <h3>Frames Rendered ({period.toUpperCase()})</h3>
        <span class="badge accent">+24.8%</span>
      </div>

      <div class="bar-chart">
        {#each bars as b}
          <div class="bar-col">
            <span class="bar-val mono">{b.val}k</span>
            <div class="bar-well">
              <div class="bar-stick" style="height: {b.val}%"></div>
            </div>
            <span class="bar-label">{b.label}</span>
          </div>
        {/each}
      </div>
    </div>

    <div class="card breakdown-card">
      <div class="chart-head">
        <h3>VFX Effect Breakdown</h3>
        <sakuga-tooltip text="Share of canvas effects triggered across studio shots." label="Breakdown info"></sakuga-tooltip>
      </div>

      <div class="breakdown-list">
        <div class="bd-item">
          <div class="bd-top"><span>Impact Bursts (ドン!)</span><strong class="mono">42%</strong></div>
          <div class="bd-track"><div class="bd-fill acc" style="width: 42%"></div></div>
        </div>
        <div class="bd-item">
          <div class="bd-top"><span>Smoke & Cumulus Puffs</span><strong class="mono">31%</strong></div>
          <div class="bd-track"><div class="bd-fill pri" style="width: 31%"></div></div>
        </div>
        <div class="bd-item">
          <div class="bd-top"><span>Crescent Slashes & Shards</span><strong class="mono">18%</strong></div>
          <div class="bd-track"><div class="bd-fill pri" style="width: 18%"></div></div>
        </div>
        <div class="bd-item">
          <div class="bd-top"><span>43-Frame Liquid Toggles</span><strong class="mono">9%</strong></div>
          <div class="bd-track"><div class="bd-fill acc" style="width: 9%"></div></div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .analytics-page {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .top-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
  }

  .top-row h2 {
    font-size: 16px;
    font-weight: 700;
  }

  .card-desc {
    font-size: 13px;
    color: var(--mute);
    margin-top: 2px;
  }

  .top-actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
  }

  .charts-grid {
    display: grid;
    grid-template-columns: 1.3fr 1fr;
    gap: 14px;
  }

  .chart-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 12px;
  }

  .chart-head h3 {
    font-size: 15px;
    font-weight: 700;
  }

  .bar-chart {
    display: flex;
    align-items: flex-end;
    justify-content: space-around;
    gap: 12px;
    height: 185px;
    padding-top: 8px;
  }

  .bar-col {
    flex: 1;
    max-width: 56px;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  .bar-val {
    font-size: 12px;
    font-weight: 700;
    color: var(--mute);
  }

  .bar-well {
    flex: 1;
    width: 100%;
    border-radius: 12px;
    background: var(--surface-alt);
    border: 1.5px solid var(--line);
    display: flex;
    align-items: flex-end;
    padding: 4px;
  }

  .bar-stick {
    width: 100%;
    border-radius: 8px;
    background: var(--sk-pri, #8f8df7);
    border: 1.5px solid var(--sk-ink, #1d1a4a);
    transition: height 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  .bar-label {
    font-size: 12.5px;
    font-weight: 700;
  }

  .breakdown-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .bd-top {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    margin-bottom: 6px;
  }

  .bd-track {
    height: 10px;
    border-radius: 999px;
    background: var(--chip);
    border: 1px solid var(--line);
    overflow: hidden;
  }

  .bd-fill {
    height: 100%;
    border-radius: 999px;
  }

  .bd-fill.acc {
    background: var(--sk-acc, #ff5fa8);
  }

  .bd-fill.pri {
    background: var(--sk-pri, #8f8df7);
  }

  @media (max-width: 860px) {
    .charts-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
