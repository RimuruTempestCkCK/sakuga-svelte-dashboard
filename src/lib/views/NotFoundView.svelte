<script>
  import Icon from '../Icon.svelte';
  import { navigate } from '../store.svelte.js';
</script>

<div class="notfound-shell">
  <div class="notfound-card card">
    <div class="code-badge sakuga-title">404</div>
    <h1 class="sakuga-title">Page Not Found</h1>
    <p class="notfound-desc">
      Halaman atau rute yang Anda buka tidak ditemukan di workspace Sakuga VFX.
    </p>

    <div class="notfound-actions">
      <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
      <sakuga-button onclick={() => navigate('overview')}>
        Back to Dashboard
      </sakuga-button>
      <button type="button" class="pill" onclick={() => navigate('login')}>
        <Icon name="lock" size={14} />
        <span>Go to Login</span>
      </button>
    </div>
  </div>
</div>

<style>
  .notfound-shell {
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: 24px 16px;
    background: var(--page);
  }

  .notfound-card {
    width: 100%;
    max-width: 440px;
    align-items: center;
    text-align: center;
    padding: 32px 24px;
    gap: 14px;
    border: 2px solid var(--sk-ink, #1d1a4a);
    box-shadow: 7px 8px 0 var(--sk-soft, #b8b3ff);
  }

  .code-badge {
    display: inline-grid;
    place-items: center;
    padding: 8px 20px;
    border-radius: 14px;
    background: var(--sk-acc, #ff5fa8);
    color: #fff;
    border: 2.5px solid var(--sk-ink, #1d1a4a);
    box-shadow: 3px 3px 0 var(--sk-soft, #b8b3ff);
    font-size: 32px;
    line-height: 1;
  }

  h1 {
    font-size: 24px;
    margin-top: 4px;
  }

  .notfound-desc {
    font-size: 13.5px;
    color: var(--mute);
    max-width: 340px;
  }

  .notfound-actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 12px;
    margin-top: 8px;
  }
</style>
