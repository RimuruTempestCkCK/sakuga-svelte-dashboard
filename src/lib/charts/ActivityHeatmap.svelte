<script>
  let { weeks = [] } = $props();

  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  let hovered = $state(null);

  function level(val) {
    if (val >= 80) return 4;
    if (val >= 60) return 3;
    if (val >= 40) return 2;
    if (val > 0) return 1;
    return 0;
  }
</script>

<div class="heatmap-wrap">
  <div class="heatmap-grid">
    <div class="day-col">
      {#each DAYS as d}
        <span class="day-lbl">{d}</span>
      {/each}
    </div>

    <div class="weeks-row">
      {#each weeks as wk, wi}
        <div class="week-col">
          {#each wk.values as val, di}
            <button
              type="button"
              class={`cell lv-${level(val)}`}
              aria-label={`${wk.label} ${DAYS[di]}: ${val} frames`}
              onmouseenter={() => (hovered = { week: wk.label, day: DAYS[di], val })}
              onmouseleave={() => (hovered = null)}
            ></button>
          {/each}
          <span class="wk-lbl">{wk.label}</span>
        </div>
      {/each}
    </div>
  </div>

  <div class="heatmap-footer">
    <span class="hover-readout">
      {#if hovered}
        <strong>{hovered.week} • {hovered.day}:</strong> <span class="mono">{hovered.val}k frames</span>
      {:else}
        Hover a cell to inspect daily throughput
      {/if}
    </span>

    <div class="scale-legend" aria-hidden="true">
      <span>Less</span>
      <span class="cell lv-1"></span>
      <span class="cell lv-2"></span>
      <span class="cell lv-3"></span>
      <span class="cell lv-4"></span>
      <span>More</span>
    </div>
  </div>
</div>

<style>
  .heatmap-wrap {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .heatmap-grid {
    display: flex;
    gap: 8px;
    align-items: flex-start;
    overflow-x: auto;
    padding-bottom: 4px;
  }

  .day-col {
    display: grid;
    grid-template-rows: repeat(7, 20px);
    gap: 5px;
  }

  .day-lbl {
    font-size: 10.5px;
    font-weight: 600;
    color: var(--mute);
    display: flex;
    align-items: center;
  }

  .weeks-row {
    display: flex;
    gap: 6px;
    flex: 1;
    justify-content: space-between;
  }

  .week-col {
    display: flex;
    flex-direction: column;
    gap: 5px;
    align-items: center;
  }

  .cell {
    width: 20px;
    height: 20px;
    border-radius: 5px;
    border: 1px solid var(--line);
    padding: 0;
    cursor: pointer;
    transition: transform 0.12s ease;
  }

  .cell:hover {
    transform: scale(1.12);
    border-color: var(--sk-ink, #1d1a4a);
  }

  .lv-0 { background: var(--surface-alt); }
  .lv-1 { background: color-mix(in srgb, var(--sk-pri, #8f8df7) 25%, var(--surface)); }
  .lv-2 { background: color-mix(in srgb, var(--sk-pri, #8f8df7) 50%, var(--surface)); }
  .lv-3 { background: color-mix(in srgb, var(--sk-pri, #8f8df7) 80%, var(--surface)); }
  .lv-4 { background: var(--sk-acc, #ff5fa8); }

  .wk-lbl {
    font-size: 10px;
    color: var(--mute);
    font-family: var(--font-mono);
    margin-top: 2px;
  }

  .heatmap-footer {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    font-size: 12px;
    color: var(--mute);
  }

  .scale-legend {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
  }

  .scale-legend .cell {
    width: 12px;
    height: 12px;
    cursor: default;
  }
</style>
