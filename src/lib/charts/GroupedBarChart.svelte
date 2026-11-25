<script>
  let { labels = [], series = [], unit = 'k' } = $props();

  let hoverIdx = $state(null);

  const W = 520;
  const H = 210;
  const PAD = { top: 16, right: 14, bottom: 30, left: 38 };

  let maxVal = $derived.by(() => {
    const all = series.flatMap((s) => s.data);
    const m = all.length ? Math.max(...all) : 100;
    return Math.ceil(m / 20) * 20 || 100;
  });

  let plotW = W - PAD.left - PAD.right;
  let plotH = H - PAD.top - PAD.bottom;

  function getY(v) {
    return PAD.top + plotH - (v / maxVal) * plotH;
  }

  let ticks = $derived([0, 0.5, 1].map((t) => Math.round(maxVal * t)));
</script>

<div class="grouped-wrap">
  <div class="legend-row">
    {#each series as s}
      <span class="legend-chip">
        <span class="dot" style="background: {s.color}"></span>
        <span>{s.name}</span>
      </span>
    {/each}
  </div>

  <div class="svg-box">
    <svg viewBox={`0 0 ${W} ${H}`} class="grouped-svg" role="img" aria-label="Period comparison bar chart">
      {#each ticks as t}
        {@const y = getY(t)}
        <line x1={PAD.left} y1={y} x2={W - PAD.right} y2={y} class="grid-line" />
        <text x={PAD.left - 6} y={y + 4} class="axis-text y-label">{t}{unit}</text>
      {/each}

      {#each labels as lbl, i}
        {@const groupW = plotW / Math.max(1, labels.length)}
        {@const groupX = PAD.left + i * groupW}
        {@const barW = Math.min(22, (groupW - 14) / Math.max(1, series.length))}
        {@const totalBarsW = barW * series.length + (series.length - 1) * 4}
        {@const startX = groupX + (groupW - totalBarsW) / 2}

        <g
          role="presentation"
          onmouseenter={() => (hoverIdx = i)}
          onmouseleave={() => (hoverIdx = null)}
        >
          <rect x={groupX} y={PAD.top} width={groupW} height={plotH} fill="transparent" />
          {#each series as s, si}
            {@const val = s.data[i] || 0}
            {@const y = getY(val)}
            {@const bh = Math.max(2, PAD.top + plotH - y)}
            <rect
              x={startX + si * (barW + 4)}
              y={y}
              width={barW}
              height={bh}
              rx="4"
              fill={s.color}
              stroke="var(--sk-ink, #1d1a4a)"
              stroke-width={hoverIdx === i ? 1.8 : 1.2}
            />
          {/each}
          <text x={groupX + groupW / 2} y={H - 8} class="axis-text x-label">{lbl}</text>
        </g>
      {/each}
    </svg>

    {#if hoverIdx !== null}
      <div class="tooltip-card">
        <strong>{labels[hoverIdx]}</strong>
        {#each series as s}
          <div class="tt-row">
            <span class="dot" style="background: {s.color}"></span>
            <span>{s.name}:</span>
            <strong class="mono">{s.data[hoverIdx]}{unit}</strong>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  .grouped-wrap {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .legend-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .legend-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 600;
    color: var(--mute);
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 999px;
  }

  .svg-box {
    position: relative;
  }

  .grouped-svg {
    width: 100%;
    height: auto;
    max-height: 210px;
    display: block;
  }

  .grid-line {
    stroke: var(--line);
    stroke-width: 1;
    stroke-dasharray: 4 4;
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
    right: 8px;
    top: 4px;
    background: var(--surface);
    border: 1.5px solid var(--sk-ink, #1d1a4a);
    box-shadow: 3px 3px 0 var(--sk-soft, #b8b3ff);
    border-radius: 10px;
    padding: 7px 10px;
    font-size: 12px;
    pointer-events: none;
  }

  .tt-row {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 2px;
  }
</style>
