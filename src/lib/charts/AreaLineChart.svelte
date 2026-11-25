<script>
  let {
    labels = [],
    series = [],
    unit = 'k',
    height = 240,
  } = $props();

  let hiddenSeries = $state({});
  let hoverIndex = $state(null);

  const W = 640;
  let H = $derived(height);
  const PAD = { top: 18, right: 18, bottom: 32, left: 42 };

  let visibleSeries = $derived(series.filter((s) => !hiddenSeries[s.name]));

  let maxVal = $derived.by(() => {
    const all = visibleSeries.flatMap((s) => s.data);
    const m = all.length ? Math.max(...all) : 100;
    return Math.ceil(m / 10) * 10 || 100;
  });

  let plotW = $derived(W - PAD.left - PAD.right);
  let plotH = $derived(H - PAD.top - PAD.bottom);

  function getX(i) {
    if (labels.length <= 1) return PAD.left + plotW / 2;
    return PAD.left + (i / (labels.length - 1)) * plotW;
  }

  function getY(v) {
    return PAD.top + plotH - (v / maxVal) * plotH;
  }

  function buildPaths(data) {
    if (!data.length) return { line: '', area: '' };
    const pts = data.map((v, i) => ({ x: getX(i), y: getY(v) }));
    const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
    const base = PAD.top + plotH;
    const area = `${line} L${pts[pts.length - 1].x.toFixed(1)},${base} L${pts[0].x.toFixed(1)},${base} Z`;
    return { line, area, pts };
  }

  function toggleSeries(name) {
    hiddenSeries = { ...hiddenSeries, [name]: !hiddenSeries[name] };
  }

  let ticks = $derived([0, 0.25, 0.5, 0.75, 1].map((t) => Math.round(maxVal * t)));
</script>

<div class="chart-wrap">
  <div class="legend-row" role="group" aria-label="Chart series legend">
    {#each series as s}
      <button
        type="button"
        class="legend-btn"
        class:off={!!hiddenSeries[s.name]}
        onclick={() => toggleSeries(s.name)}
      >
        <span class="dot" style="background: {s.color}"></span>
        <span>{s.name}</span>
      </button>
    {/each}
  </div>

  {#if !labels.length || !visibleSeries.length}
    <div class="chart-empty">No active series selected. Click a legend item to show data.</div>
  {:else}
    <div class="svg-box" style="--chart-h: {height}px">
      <svg viewBox={`0 0 ${W} ${H}`} class="chart-svg" role="img" aria-label="Area and line trend chart">
        {#each ticks as t}
          {@const y = getY(t)}
          <line x1={PAD.left} y1={y} x2={W - PAD.right} y2={y} class="grid-line" />
          <text x={PAD.left - 8} y={y + 4} class="axis-text y-label">{t}{unit}</text>
        {/each}

        {#each labels as lbl, i}
          <text x={getX(i)} y={H - 8} class="axis-text x-label">{lbl}</text>
        {/each}

        {#each visibleSeries as s}
          {@const paths = buildPaths(s.data)}
          <path d={paths.area} fill={s.color} fill-opacity="0.14" />
          <path d={paths.line} fill="none" stroke={s.color} stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" />
          {#each paths.pts as pt, i}
            <circle
              cx={pt.x}
              cy={pt.y}
              r={hoverIndex === i ? 5.5 : 3.5}
              fill={s.color}
              stroke="var(--surface)"
              stroke-width="2"
            />
          {/each}
        {/each}

        {#if hoverIndex !== null}
          <line
            x1={getX(hoverIndex)}
            y1={PAD.top}
            x2={getX(hoverIndex)}
            y2={PAD.top + plotH}
            class="crosshair"
          />
        {/if}

        {#each labels as _, i}
          {@const colW = labels.length > 1 ? plotW / (labels.length - 1) : plotW}
          <rect
            role="presentation"
            x={getX(i) - colW / 2}
            y={PAD.top}
            width={colW}
            height={plotH}
            fill="transparent"
            onmouseenter={() => (hoverIndex = i)}
            onmouseleave={() => (hoverIndex = null)}
          />
        {/each}
      </svg>

      {#if hoverIndex !== null}
        <div
          class="tooltip-card"
          style="left: {Math.min(78, Math.max(12, (getX(hoverIndex) / W) * 100))}%"
        >
          <div class="tt-title">{labels[hoverIndex]}</div>
          {#each visibleSeries as s}
            <div class="tt-row">
              <span class="dot" style="background: {s.color}"></span>
              <span>{s.name}:</span>
              <strong class="mono">{s.data[hoverIndex]}{unit}</strong>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .chart-wrap {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .legend-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .legend-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    border-radius: 999px;
    border: 1px solid var(--line);
    background: var(--surface-alt);
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    color: var(--text);
    transition: opacity 0.15s ease, border-color 0.15s ease;
  }

  .legend-btn.off {
    opacity: 0.45;
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 999px;
    flex-shrink: 0;
  }

  .svg-box {
    position: relative;
    width: 100%;
  }

  .chart-svg {
    width: 100%;
    height: auto;
    max-height: var(--chart-h);
    display: block;
    overflow: visible;
  }

  .grid-line {
    stroke: var(--line);
    stroke-width: 1;
    stroke-dasharray: 4 4;
  }

  .crosshair {
    stroke: var(--mute);
    stroke-width: 1.2;
    stroke-dasharray: 3 3;
  }

  .axis-text {
    fill: var(--mute);
    font-size: 11px;
    font-weight: 600;
    font-family: var(--font-mono);
  }

  .y-label {
    text-anchor: end;
  }

  .x-label {
    text-anchor: middle;
  }

  .tooltip-card {
    position: absolute;
    top: 6px;
    transform: translateX(-50%);
    background: var(--surface);
    border: 1.5px solid var(--sk-ink, #1d1a4a);
    box-shadow: 3px 3px 0 var(--sk-soft, #b8b3ff);
    border-radius: 10px;
    padding: 8px 10px;
    font-size: 12px;
    pointer-events: none;
    z-index: 10;
    white-space: nowrap;
  }

  .tt-title {
    font-weight: 800;
    margin-bottom: 4px;
  }

  .tt-row {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .chart-empty {
    padding: 28px 16px;
    text-align: center;
    font-size: 13px;
    color: var(--mute);
    background: var(--surface-alt);
    border-radius: 12px;
    border: 1px dashed var(--line);
  }
</style>
