<script>
  let { axes = [], values = [] } = $props();

  let hoverIdx = $state(null);

  const CX = 130;
  const CY = 115;
  const R = 74;

  function pointAt(i, ratio) {
    const angle = (Math.PI * 2 * i) / Math.max(1, axes.length) - Math.PI / 2;
    return {
      x: CX + Math.cos(angle) * R * ratio,
      y: CY + Math.sin(angle) * R * ratio,
    };
  }

  function ringPoints(ratio) {
    return axes.map((_, i) => {
      const p = pointAt(i, ratio);
      return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    }).join(' ');
  }

  let polygonPoints = $derived(
    values.map((v, i) => {
      const p = pointAt(i, Math.min(1, Math.max(0, v / 100)));
      return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    }).join(' ')
  );
</script>

<div class="radar-wrap">
  <svg viewBox="0 0 260 230" class="radar-svg" role="img" aria-label="Pipeline capability radar chart">
    {#each [0.33, 0.66, 1] as r}
      <polygon points={ringPoints(r)} fill="none" stroke="var(--line)" stroke-width="1.1" />
    {/each}

    {#each axes as axis, i}
      {@const outer = pointAt(i, 1)}
      {@const lbl = pointAt(i, 1.24)}
      <line x1={CX} y1={CY} x2={outer.x} y2={outer.y} stroke="var(--line)" stroke-width="1" />
      <text x={lbl.x} y={lbl.y + 4} class="axis-lbl">{axis}</text>
    {/each}

    <polygon
      points={polygonPoints}
      fill="var(--sk-pri, #8f8df7)"
      fill-opacity="0.28"
      stroke="var(--sk-pri, #8f8df7)"
      stroke-width="2.4"
      stroke-linejoin="round"
    />

    {#each values as v, i}
      {@const p = pointAt(i, Math.min(1, Math.max(0, v / 100)))}
      <circle
        cx={p.x}
        cy={p.y}
        r={hoverIdx === i ? 6 : 4}
        fill="var(--sk-acc, #ff5fa8)"
        stroke="var(--surface)"
        stroke-width="2"
        onmouseenter={() => (hoverIdx = i)}
        onmouseleave={() => (hoverIdx = null)}
      />
    {/each}
  </svg>

  {#if hoverIdx !== null}
    <div class="radar-tip">
      <span>{axes[hoverIdx]}:</span>
      <strong class="mono">{values[hoverIdx]} / 100</strong>
    </div>
  {/if}
</div>

<style>
  .radar-wrap {
    position: relative;
    display: grid;
    place-items: center;
  }

  .radar-svg {
    width: 100%;
    max-width: 260px;
    height: auto;
    display: block;
  }

  .axis-lbl {
    fill: var(--mute);
    font-size: 10.5px;
    font-weight: 700;
    text-anchor: middle;
    font-family: var(--font-sans);
  }

  .radar-tip {
    position: absolute;
    bottom: 4px;
    right: 8px;
    background: var(--surface);
    border: 1.5px solid var(--sk-ink, #1d1a4a);
    box-shadow: 3px 3px 0 var(--sk-soft, #b8b3ff);
    border-radius: 9px;
    padding: 4px 9px;
    font-size: 12px;
  }
</style>
