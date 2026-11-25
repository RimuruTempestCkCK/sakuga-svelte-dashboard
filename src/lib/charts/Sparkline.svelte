<script>
  let { data = [], color = 'var(--sk-pri, #8f8df7)', height = 34 } = $props();

  const W = 120;
  let H = $derived(height);

  let points = $derived.by(() => {
    if (!data.length) return [];
    const min = Math.min(...data);
    const max = Math.max(...data);
    const span = max - min || 1;
    const pad = 4;
    return data.map((v, i) => {
      const x = data.length === 1 ? W / 2 : (i / (data.length - 1)) * (W - pad * 2) + pad;
      const y = H - pad - ((v - min) / span) * (H - pad * 2);
      return { x: +x.toFixed(1), y: +y.toFixed(1) };
    });
  });

  let linePath = $derived(
    points.length ? points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') : ''
  );

  let areaPath = $derived(
    points.length
      ? `${linePath} L${points[points.length - 1].x},${H} L${points[0].x},${H} Z`
      : ''
  );

  let last = $derived(points[points.length - 1]);
</script>

<svg
  class="sparkline"
  viewBox={`0 0 ${W} ${H}`}
  preserveAspectRatio="none"
  aria-hidden="true"
>
  {#if points.length > 1}
    <path d={areaPath} fill={color} fill-opacity="0.14" />
    <path d={linePath} fill="none" stroke={color} stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
    {#if last}
      <circle cx={last.x} cy={last.y} r="3" fill={color} />
    {/if}
  {/if}
</svg>

<style>
  .sparkline {
    width: 100%;
    height: 34px;
    display: block;
    overflow: visible;
  }
</style>
