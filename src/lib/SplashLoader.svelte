<script>
  import { onMount } from 'svelte';

  let { ondone } = $props();
  let progressEl = $state();
  let exiting = $state(false);
  let hidden = $state(false);

  function finish() {
    if (exiting || hidden) return;
    exiting = true;
    setTimeout(() => {
      hidden = true;
      ondone?.();
    }, 340);
  }

  function onSakugaDone(node, fn) {
    node.addEventListener('sakuga:done', fn);
    return {
      destroy() {
        node.removeEventListener('sakuga:done', fn);
      },
    };
  }

  onMount(() => {
    const t1 = setTimeout(() => progressEl?.set?.(0.38), 100);
    const t2 = setTimeout(() => progressEl?.set?.(0.76), 420);
    const t3 = setTimeout(() => progressEl?.set?.(1), 780);
    const safety = setTimeout(finish, 2600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(safety);
    };
  });
</script>

{#if !hidden}
  <div class="splash" class:exiting role="status" aria-live="polite" aria-label="Loading">
    <div class="splash-progress">
      <sakuga-progress
        bind:this={progressEl}
        label="Loading"
        use:onSakugaDone={finish}
      ></sakuga-progress>
    </div>
  </div>
{/if}

<style>
  .splash {
    position: fixed;
    inset: 0;
    z-index: 200;
    background: var(--page);
    display: grid;
    place-items: center;
    padding: 24px;
    transition: opacity 0.32s ease, transform 0.32s ease;
  }

  .splash.exiting {
    opacity: 0;
    transform: scale(1.02);
    pointer-events: none;
  }

  .splash-progress {
    display: grid;
    place-items: center;
  }
</style>
