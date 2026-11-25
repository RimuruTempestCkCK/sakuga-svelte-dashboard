<script>
  let { items = [], centerLabel = 'Total' } = $props();

  let activeIndex = $state(null);

  const R = 48;
  const C = 2 * Math.PI * R;

  let total = $derived(items.reduce((sum, item) => sum + item.value, 0) || 1);

  let segments = $derived.by(() => {
    let offset = 0;
    return items.map((item, idx) => {
      const pct = item.value / total;
      const len = pct * C;
      const seg = { ...item, idx, pct: Math.round(pct * 100), len, offset };
      offset += len;
      return seg;
    });
  });

  let activeItem = $derived(activeIndex !== null ? segments[activeIndex] : null);
</script>

<div class="donut-layout">
  <div class="donut-box">
    <svg viewBox="0 0 130 130" class="donut-svg" role="img" aria-label={centerLabel}>
      <circle cx="65" cy="65" r={R} fill="none" stroke="var(--chip)" stroke-width="16" />
      {#each segments as seg}
        <circle
          cx="65"
          cy="65"
          r={R}
          fill="none"
          stroke={seg.color}
          stroke-width={activeIndex === seg.idx ? 19 : 16}
          stroke-dasharray={`${seg.len} ${C}`}
          stroke-dashoffset={-seg.offset}
          transform="rotate(-90 65 65)"
          class="donut-seg"
          onmouseenter={() => (activeIndex = seg.idx)}
          onmouseleave={() => (activeIndex = null)}
        />
      {/each}
    </svg>
    <div class="donut-center">
      <strong class="sakuga-title center-val">
        {activeItem ? `${activeItem.pct}%` : total}
      </strong>
      <span class="center-lbl">{activeItem ? activeItem.label : centerLabel}</span>
    </div>
  </div>

  <ul class="donut-legend">
    {#each segments as seg}
      <li>
        <button
          type="button"
          class="legend-item"
          class:active={activeIndex === seg.idx}
          onmouseenter={() => (activeIndex = seg.idx)}
          onmouseleave={() => (activeIndex = null)}
        >
          <span class="dot" style="background: {seg.color}"></span>
          <span class="lbl">{seg.label}</span>
          <strong class="mono">{seg.pct}%</strong>
        </button>
      </li>
    {/each}
  </ul>
</div>

<style>
  .donut-layout {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 18px;
  }

  .donut-box {
    position: relative;
    width: 148px;
    height: 148px;
    flex-shrink: 0;
  }

  .donut-svg {
    width: 100%;
    height: 100%;
    display: block;
  }

  .donut-seg {
    cursor: pointer;
    transition: stroke-width 0.15s ease;
  }

  .donut-center {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    text-align: center;
    padding: 0 18px;
  }

  .center-val {
    font-size: 20px;
    line-height: 1.1;
  }

  .center-lbl {
    font-size: 11px;
    color: var(--mute);
    font-weight: 600;
    max-width: 82px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .donut-legend {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
    flex: 1;
    min-width: 150px;
  }

  .legend-item {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 8px;
    border-radius: 9px;
    border: 1px solid transparent;
    background: transparent;
    cursor: pointer;
    font-size: 12.5px;
    color: var(--text);
    text-align: left;
  }

  .legend-item:hover,
  .legend-item.active {
    background: var(--surface-alt);
    border-color: var(--line);
  }

  .dot {
    width: 9px;
    height: 9px;
    border-radius: 999px;
    flex-shrink: 0;
  }

  .lbl {
    flex: 1;
    font-weight: 600;
  }
</style>
