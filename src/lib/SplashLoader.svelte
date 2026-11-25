<script>
  import { onMount } from 'svelte';
  import Icon from './Icon.svelte';

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
  <div class="splash" class:exiting role="status" aria-live="polite" aria-label="Loading Sakuga VFX Dashboard">
    <div class="splash-card">
      <div class="splash-brand">
        <div class="splash-logo" aria-hidden="true">
          <Icon name="zap" size={22} />
        </div>
        <div>
          <div class="sakuga-title splash-title">Sakuga VFX</div>
          <p class="splash-sub">Preparing studio workspace...</p>
        </div>
      </div>

      <div class="splash-progress">
        <sakuga-progress
          bind:this={progressEl}
          label="Loading Sakuga VFX Dashboard"
          use:onSakugaDone={finish}
        ></sakuga-progress>
      </div>
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

  .splash-card {
    width: 100%;
    max-width: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    text-align: center;
  }

  .splash-brand {
    display: flex;
    align-items: center;
    gap: 14px;
    text-align: left;
  }

  .splash-logo {
    width: 48px;
    height: 48px;
    border-radius: 15px;
    background: var(--sk-pri, #8f8df7);
    color: var(--sk-on-pri, #fff);
    border: 2.5px solid var(--sk-ink, #1d1a4a);
    box-shadow: 4px 4px 0 var(--sk-soft, #b8b3ff);
    display: grid;
    place-items: center;
    flex-shrink: 0;
  }

  .splash-title {
    font-size: 24px;
    line-height: 1.1;
  }

  .splash-sub {
    font-size: 13px;
    color: var(--mute);
    margin-top: 2px;
  }

  .splash-progress {
    padding-top: 28px;
    padding-bottom: 16px;
    display: grid;
    place-items: center;
  }
</style>
