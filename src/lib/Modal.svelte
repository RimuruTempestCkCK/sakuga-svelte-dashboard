<script>
  import Icon from './Icon.svelte';

  let { open = $bindable(false), title = '', subtitle = '', children } = $props();

  function close() {
    open = false;
  }

  function handleKeydown(e) {
    if (open && e.key === 'Escape') {
      close();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
  <div class="modal-backdrop" role="presentation" onclick={(e) => { if (e.target === e.currentTarget) close(); }}>
    <div class="modal-box card" role="dialog" aria-modal="true" aria-label={title}>
      <div class="modal-head">
        <div>
          <h2 class="sakuga-title modal-title">{title}</h2>
          {#if subtitle}
            <p class="card-desc">{subtitle}</p>
          {/if}
        </div>
        <button type="button" class="close-btn" aria-label="Close modal" onclick={close}>
          <Icon name="x" size={18} />
        </button>
      </div>

      <div class="modal-body">
        {@render children?.()}
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    inset: 0;
    z-index: 100;
    background: rgba(15, 14, 30, 0.52);
    display: grid;
    place-items: center;
    padding: 20px 16px;
    overflow-y: auto;
    animation: fadeIn 0.14s ease-out;
  }

  .modal-box {
    width: 100%;
    max-width: 520px;
    background: var(--surface);
    border: 2px solid var(--sk-ink, #1d1a4a);
    border-radius: 20px;
    box-shadow: 7px 8px 0 var(--sk-soft, #b8b3ff);
    padding: 24px;
    gap: 18px;
    animation: popIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .modal-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    padding-bottom: 14px;
    border-bottom: 1.5px solid var(--line);
  }

  .modal-title {
    font-size: 20px;
    line-height: 1.15;
  }

  .close-btn {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    border: 1.5px solid var(--line);
    background: var(--surface-alt);
    color: var(--text);
    display: grid;
    place-items: center;
    cursor: pointer;
    flex-shrink: 0;
    transition: border-color 0.15s ease, background 0.15s ease;
  }

  .close-btn:hover {
    border-color: var(--sk-acc, #ff5fa8);
    color: var(--sk-acc, #ff5fa8);
  }

  .modal-body {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes popIn {
    from { opacity: 0; transform: scale(0.93) translateY(8px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }

  @media (max-width: 480px) {
    .modal-box {
      padding: 18px;
    }
  }
</style>
