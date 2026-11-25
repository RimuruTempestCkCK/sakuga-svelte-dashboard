<script>
  import Icon from '../Icon.svelte';
  import { navigate } from '../store.svelte.js';

  let { mode = '403' } = $props();

  const CONFIG = {
    '403': {
      code: '403',
      title: 'Access Forbidden',
      desc: 'Anda tidak memiliki izin untuk membuka halaman atau resource ini.',
      accent: false,
    },
    '500': {
      code: '500',
      title: 'Server Error',
      desc: 'Terjadi kesalahan internal pada server. Silakan coba beberapa saat lagi.',
      accent: true,
    },
    maintenance: {
      code: 'MAINT',
      title: 'Scheduled Maintenance',
      desc: 'Workspace sedang dalam pemeliharaan terjadwal untuk peningkatan performa.',
      accent: false,
    },
  };

  let info = $derived(CONFIG[mode] || CONFIG['403']);
</script>

<div class="status-shell">
  <div class="status-card card">
    <div class="code-badge sakuga-title" class:accent={info.accent}>{info.code}</div>
    <h1 class="sakuga-title">{info.title}</h1>
    <p class="status-desc">{info.desc}</p>

    <div class="status-actions">
      <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
      <sakuga-button onclick={() => navigate('overview')}>Back to Dashboard</sakuga-button>
      <button type="button" class="pill" onclick={() => navigate('help')}>
        <Icon name="help" size={14} />
        <span>Help Center</span>
      </button>
    </div>
  </div>
</div>

<style>
  .status-shell {
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: 24px 16px;
    background: var(--page);
  }

  .status-card {
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
    background: var(--sk-pri, #8f8df7);
    color: #fff;
    border: 2.5px solid var(--sk-ink, #1d1a4a);
    box-shadow: 3px 3px 0 var(--sk-soft, #b8b3ff);
    font-size: 28px;
    line-height: 1;
  }

  .code-badge.accent {
    background: var(--sk-acc, #ff5fa8);
  }

  h1 {
    font-size: 24px;
    margin-top: 4px;
  }

  .status-desc {
    font-size: 13.5px;
    color: var(--mute);
    max-width: 340px;
  }

  .status-actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 12px;
    margin-top: 8px;
  }
</style>
