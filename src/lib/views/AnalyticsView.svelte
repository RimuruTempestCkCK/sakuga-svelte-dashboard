<script>
  import Sparkline from '../charts/Sparkline.svelte';
  import AreaLineChart from '../charts/AreaLineChart.svelte';
  import GroupedBarChart from '../charts/GroupedBarChart.svelte';
  import DonutChart from '../charts/DonutChart.svelte';
  import RadarChart from '../charts/RadarChart.svelte';
  import ActivityHeatmap from '../charts/ActivityHeatmap.svelte';
  import { logEvent, showToast } from '../store.svelte.js';

  let period = $state('30d');
  let category = $state('all');

  const DATASETS = {
    '7d': {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      all: [42, 68, 55, 84, 92, 61, 74],
      fx: [24, 41, 33, 52, 58, 36, 44],
      comp: [18, 27, 22, 32, 34, 25, 30],
      prev: [38, 54, 49, 71, 78, 55, 63],
      target: [50, 55, 60, 68, 75, 70, 72],
      growth: '+16.4%',
      avgTime: '1.8s',
      completion: '94%',
    },
    '30d': {
      labels: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4'],
      all: [210, 268, 312, 348],
      fx: [128, 162, 190, 214],
      comp: [82, 106, 122, 134],
      prev: [185, 224, 265, 290],
      target: [200, 240, 280, 320],
      growth: '+24.8%',
      avgTime: '1.6s',
      completion: '96%',
    },
    '90d': {
      labels: ['Sep', 'Oct', 'Nov'],
      all: [680, 840, 1020],
      fx: [410, 515, 630],
      comp: [270, 325, 390],
      prev: [590, 720, 860],
      target: [650, 800, 950],
      growth: '+31.2%',
      avgTime: '1.5s',
      completion: '98%',
    },
  };

  const VFX_DISTRIBUTION = [
    { label: 'Impact Bursts', value: 42, color: 'var(--sk-acc, #ff5fa8)' },
    { label: 'Smoke & Clouds', value: 31, color: 'var(--sk-pri, #8f8df7)' },
    { label: 'Slashes & Shards', value: 18, color: 'var(--sk-soft, #b8b3ff)' },
    { label: 'Liquid Toggles', value: 9, color: 'var(--sk-ink, #1d1a4a)' },
  ];

  const RADAR_AXES = ['Speed', 'Quality', 'Cache Hit', 'Consistency', 'Compositing'];
  const RADAR_VALUES = {
    '7d': [86, 92, 78, 88, 84],
    '30d': [91, 95, 84, 90, 89],
    '90d': [94, 96, 88, 93, 92],
  };

  const HEATMAP_WEEKS = [
    { label: 'W1', values: [35, 52, 48, 65, 72, 28, 18] },
    { label: 'W2', values: [44, 62, 58, 74, 85, 36, 24] },
    { label: 'W3', values: [51, 68, 63, 81, 88, 42, 30] },
    { label: 'W4', values: [48, 72, 70, 84, 92, 45, 32] },
    { label: 'W5', values: [58, 78, 74, 88, 95, 52, 38] },
    { label: 'W6', values: [62, 82, 79, 91, 96, 55, 41] },
    { label: 'W7', values: [65, 85, 82, 93, 98, 60, 44] },
    { label: 'W8', values: [70, 88, 86, 95, 99, 64, 48] },
  ];

  let activeDataset = $derived(DATASETS[period] || DATASETS['30d']);
  let activeValues = $derived(activeDataset[category] || activeDataset.all);
  let totalFrames = $derived(activeValues.reduce((s, n) => s + n, 0));

  let mainSeries = $derived([
    {
      name: category === 'fx' ? '2D FX Output' : category === 'comp' ? 'Compositing Output' : 'Total Output',
      color: 'var(--sk-pri, #8f8df7)',
      data: activeValues,
    },
    {
      name: 'Target Quota',
      color: 'var(--sk-acc, #ff5fa8)',
      data: category === 'all' ? activeDataset.target : activeDataset.target.map((v) => Math.round(v * 0.58)),
    },
    {
      name: 'Previous Period',
      color: 'var(--sk-soft, #b8b3ff)',
      data: category === 'all' ? activeDataset.prev : activeDataset.prev.map((v) => Math.round(v * 0.55)),
    },
  ]);

  let comparisonSeries = $derived([
    { name: 'Current', color: 'var(--sk-pri, #8f8df7)', data: activeValues },
    { name: 'Previous', color: 'var(--sk-soft, #b8b3ff)', data: activeDataset.prev },
  ]);

  let peakEntry = $derived.by(() => {
    let bestIdx = 0;
    activeValues.forEach((v, i) => {
      if (v > activeValues[bestIdx]) bestIdx = i;
    });
    return { label: activeDataset.labels[bestIdx], val: activeValues[bestIdx] };
  });

  function csvCell(value) {
    const s = String(value ?? '');
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  }

  function exportCsv() {
    if (!activeDataset.labels.length) {
      showToast('Tidak ada data untuk diexport');
      return;
    }
    try {
      const header = 'Period,Category,Label,Frames_Rendered_K,Previous_Period_K';
      const rows = activeDataset.labels.map((lbl, i) =>
        [period, category, lbl, activeValues[i], activeDataset.prev[i]].map(csvCell).join(',')
      );
      const csv = [header, ...rows].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sakuga-analytics-${period}-${category}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      logEvent(`Exported sakuga-analytics-${period}-${category}.csv (${rows.length} rows)`);
      showToast(`Downloaded sakuga-analytics-${period}-${category}.csv`);
    } catch {
      showToast('Gagal mengexport CSV');
    }
  }
</script>

<div class="analytics-page">
  <!-- Section 1: Page Header -->
  <section class="card">
    <div class="header-bar">
      <div>
        <h2 class="card-title">Studio Performance & VFX Analytics</h2>
        <p class="card-desc">Track render throughput, period-over-period growth, and effect distribution.</p>
      </div>

      <div class="filter-bar">
        <sakuga-tabs
          label="Timeframe"
          onchange={(e) => (period = e.detail?.value || '30d')}
        >
          <option value="7d" selected={period === '7d'}>7 Days</option>
          <option value="30d" selected={period === '30d'}>30 Days</option>
          <option value="90d" selected={period === '90d'}>90 Days</option>
        </sakuga-tabs>

        <sakuga-tabs
          label="Category filter"
          onchange={(e) => (category = e.detail?.value || 'all')}
        >
          <option value="all" selected={category === 'all'}>All</option>
          <option value="fx" selected={category === 'fx'}>2D FX</option>
          <option value="comp" selected={category === 'comp'}>Compositing</option>
        </sakuga-tabs>

        <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
        <sakuga-button variant="secondary" onclick={exportCsv}>
          Export CSV
        </sakuga-button>
      </div>
    </div>
  </section>

  <!-- Section 2: Summary Metrics -->
  <section class="metrics-grid">
    <div class="card metric-card">
      <div class="metric-top">
        <span class="metric-label">Total Frames</span>
        <span class="badge accent">{period.toUpperCase()}</span>
      </div>
      <div class="metric-val sakuga-title">{totalFrames}k</div>
      <Sparkline data={activeValues} color="var(--sk-pri, #8f8df7)" />
      <span class="metric-sub">Selected category output</span>
    </div>

    <div class="card metric-card">
      <div class="metric-top">
        <span class="metric-label">Growth Rate</span>
        <span class="badge success">{activeDataset.growth}</span>
      </div>
      <div class="metric-val sakuga-title">{activeDataset.growth}</div>
      <Sparkline data={activeDataset.prev} color="var(--sk-acc, #ff5fa8)" />
      <span class="metric-sub">vs previous {period} period</span>
    </div>

    <div class="card metric-card">
      <div class="metric-top">
        <span class="metric-label">Avg Frame Time</span>
        <span class="badge">60 FPS</span>
      </div>
      <div class="metric-val sakuga-title">{activeDataset.avgTime}</div>
      <Sparkline data={[2.1, 1.9, 1.8, 1.7, 1.6, 1.5]} color="var(--sk-pri, #8f8df7)" />
      <span class="metric-sub">Per-shot render average</span>
    </div>

    <div class="card metric-card">
      <div class="metric-top">
        <span class="metric-label">Completion Rate</span>
        <span class="badge success">On Track</span>
      </div>
      <div class="metric-val sakuga-title">{activeDataset.completion}</div>
      <Sparkline data={[88, 91, 93, 95, 96, 98]} color="var(--sk-acc, #ff5fa8)" />
      <span class="metric-sub">Shots delivered before deadline</span>
    </div>
  </section>

  <!-- Section 3: Main Analytics -->
  <section class="card">
    <div class="card-head">
      <div>
        <h3 class="card-title">Render Output & Target Trend ({period.toUpperCase()})</h3>
        <p class="card-desc">Click legend pills to toggle series visibility; hover points for exact values.</p>
      </div>
      <span class="badge accent">Peak: {peakEntry.label} ({peakEntry.val}k)</span>
    </div>
    <AreaLineChart labels={activeDataset.labels} series={mainSeries} unit="k" height={250} />
  </section>

  <!-- Section 4: Secondary Analytics -->
  <section class="two-col-grid">
    <div class="card">
      <div class="card-head">
        <div>
          <h3 class="card-title">Period-over-Period Comparison</h3>
          <p class="card-desc">Current throughput compared with previous {period} baseline.</p>
        </div>
      </div>
      <GroupedBarChart labels={activeDataset.labels} series={comparisonSeries} unit="k" />
    </div>

    <div class="card">
      <div class="card-head">
        <div>
          <h3 class="card-title">VFX Category Distribution</h3>
          <p class="card-desc">Hover slices or legend items to inspect share.</p>
        </div>
        <sakuga-tooltip text="Distribution across canvas effects triggered in studio shots." label="Distribution info"></sakuga-tooltip>
      </div>
      <div class="donut-wrap">
        <DonutChart items={VFX_DISTRIBUTION} centerLabel="Total VFX" />
      </div>
    </div>
  </section>

  <!-- Section 5: Advanced Visualization -->
  <section class="adv-grid">
    <div class="card">
      <div class="card-head">
        <div>
          <h3 class="card-title">Pipeline Capability Radar</h3>
          <p class="card-desc">Multi-axis studio score ({period.toUpperCase()}).</p>
        </div>
      </div>
      <RadarChart axes={RADAR_AXES} values={RADAR_VALUES[period] || RADAR_VALUES['30d']} />
    </div>

    <div class="card">
      <div class="card-head">
        <div>
          <h3 class="card-title">8-Week Studio Activity Heatmap</h3>
          <p class="card-desc">Daily render intensity across Monday–Sunday.</p>
        </div>
      </div>
      <ActivityHeatmap weeks={HEATMAP_WEEKS} />
    </div>
  </section>

  <!-- Section 6: Simulated Period Insights -->
  <section class="card">
    <div class="card-head">
      <div>
        <h3 class="card-title">Period Summary & Insights</h3>
        <p class="card-desc">Calculated directly from the active demo dataset (simulated studio metrics).</p>
      </div>
      <span class="badge">Demo Insight</span>
    </div>

    <div class="insights-grid">
      <div class="insight-box">
        <span class="insight-kicker">Highest Output</span>
        <strong>{peakEntry.label} — {peakEntry.val}k frames</strong>
        <p>Peak throughput achieved in the {period.toUpperCase()} window.</p>
      </div>
      <div class="insight-box">
        <span class="insight-kicker">Dominant VFX</span>
        <strong>Impact Bursts (42%)</strong>
        <p>Primary driver of canvas burst & lettering triggers.</p>
      </div>
      <div class="insight-box">
        <span class="insight-kicker">Period Growth</span>
        <strong>{activeDataset.growth} vs prior cycle</strong>
        <p>Completion rate steady at {activeDataset.completion} with {activeDataset.avgTime} avg time.</p>
      </div>
    </div>
  </section>
</div>

<style>
  .analytics-page {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .header-bar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .filter-bar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
  }

  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 200px), 1fr));
    gap: 12px;
  }

  .metric-card {
    gap: 6px;
  }

  .metric-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .metric-label {
    font-size: 12.5px;
    font-weight: 700;
    color: var(--mute);
  }

  .metric-val {
    font-size: 26px;
    line-height: 1.1;
  }

  .metric-sub {
    font-size: 12px;
    color: var(--mute);
  }

  .two-col-grid {
    display: grid;
    grid-template-columns: 1.2fr 1fr;
    gap: 14px;
  }

  .adv-grid {
    display: grid;
    grid-template-columns: 1fr 1.35fr;
    gap: 14px;
  }

  .donut-wrap {
    flex: 1;
    display: grid;
    place-items: center;
  }

  .insights-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr));
    gap: 12px;
  }

  .insight-box {
    padding: 12px 14px;
    border-radius: 12px;
    background: var(--surface-alt);
    border: 1px solid var(--line);
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .insight-kicker {
    font-size: 11px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--sk-acc, #ff5fa8);
  }

  .insight-box strong {
    font-size: 15px;
  }

  .insight-box p {
    font-size: 12.5px;
    color: var(--mute);
  }

  @media (max-width: 960px) {
    .two-col-grid,
    .adv-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
