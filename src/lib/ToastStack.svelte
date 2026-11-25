<script>
  import Icon from './Icon.svelte';
  import { dashboard, dismissToast } from './store.svelte.js';

  function iconFor(type) {
    if (type === 'success') return 'zap';
    if (type === 'error' || type === 'warning') return 'alert-circle';
    return 'bell';
  }
</script>

{#if dashboard.toasts.length > 0}
  <div class="toast-stack" role="region" aria-label="Notifications" aria-live="polite">
    {#each dashboard.toasts as t (t.id)}
      <div class={`toast-item t-${t.type}`} role="status">
        <span class="toast-ic" aria-hidden="true">
          <Icon name={iconFor(t.type)} size={16} />
        </span>
        <span class="toast-msg">{t.message}</span>
        <button
          type="button"
          class="toast-close"
          aria-label="Dismiss notification"
          onclick={() => dismissToast(t.id)}
        >
          <Icon name="x" size={14} />
        </button>
      </div>
    {/each}
  </div>
{/if}

<style>
  .toast-stack {
    position: fixed;
    right: 20px;
    bottom: 20px;
    z-index: 130;
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-width: min(340px, calc(100vw - 32px));
    pointer-events: none;
  }

  .toast-item {
    pointer-events: auto;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 13px;
    background: var(--surface);
    color: var(--text);
    border: 2px solid var(--sk-ink, #1d1a4a);
    box-shadow: 4px 4px 0 var(--sk-soft, #b8b3ff);
    font-size: 13px;
    font-weight: 600;
    animation: toastIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .toast-ic {
    width: 26px;
    height: 26px;
    border-radius: 8px;
    display: grid;
    place-items: center;
    flex-shrink: 0;
  }

  .t-success .toast-ic {
    background: color-mix(in srgb, #10b981 18%, var(--surface));
    color: var(--success-ink, #059669);
  }

  .t-error .toast-ic {
    background: color-mix(in srgb, #e11d48 18%, var(--surface));
    color: #e11d48;
  }

  .t-warning .toast-ic {
    background: color-mix(in srgb, #f59e0b 18%, var(--surface));
    color: var(--warn-ink, #b45309);
  }

  .t-info .toast-ic {
    background: var(--chip);
    color: var(--sk-pri, #8f8df7);
  }

  .toast-msg {
    flex: 1;
    line-height: 1.35;
  }

  .toast-close {
    width: 24px;
    height: 24px;
    border-radius: 7px;
    border: none;
    background: transparent;
    color: var(--mute);
    display: grid;
    place-items: center;
    cursor: pointer;
    flex-shrink: 0;
  }

  .toast-close:hover {
    background: var(--chip);
    color: var(--text);
  }

  @keyframes toastIn {
    from { opacity: 0; transform: translateY(10px) scale(0.95); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  @media (prefers-reduced-motion: reduce) {
    .toast-item {
      animation: none;
    }
  }
</style>
