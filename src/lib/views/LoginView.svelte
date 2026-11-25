<script>
  import Icon from '../Icon.svelte';
  import { dashboard, navigate, showToast, toggleDarkMode, logEvent } from '../store.svelte.js';

  let submitBtn = $state();
  let email = $state('akira@sakuga.studio');
  let remember = $state(true);

  function handleLogin(e) {
    e.preventDefault();
    logEvent(`Signed in as ${email}`);
    showToast('ドン! Welcome back to Sakuga Studio');
    setTimeout(() => {
      submitBtn?.done?.();
      setTimeout(() => navigate('overview'), 450);
    }, 550);
  }
</script>

<div class="auth-shell">
  <div class="auth-container">
    <div class="auth-topbar">
      <button type="button" class="pill" onclick={() => navigate('overview')}>
        <Icon name="arrow-left" size={15} />
        <span>Back to Dashboard</span>
      </button>
      <button type="button" class="pill" onclick={toggleDarkMode}>
        <Icon name={dashboard.darkMode ? 'sun' : 'moon'} size={15} />
        <span>{dashboard.darkMode ? 'Light Mode' : 'Dark Mode'}</span>
      </button>
    </div>

    <div class="auth-card card">
      <div class="auth-brand">
        <div class="logo-mark" aria-hidden="true">
          <Icon name="zap" size={20} />
        </div>
        <div>
          <span class="badge accent">Sakuga Studio</span>
          <h1 class="sakuga-title">Sign In</h1>
          <p class="auth-sub">Access your anime VFX workspace</p>
        </div>
      </div>

      <form class="auth-form" onsubmit={handleLogin}>
        <div class="field-group">
          <span class="field-label">Email Address</span>
          <div class="input-full">
            <sakuga-input
              name="email"
              type="email"
              label="Email Address"
              value={email}
              placeholder="you@studio.jp"
              oninput={(e) => (email = e.target.value)}
            ></sakuga-input>
          </div>
        </div>

        <div class="field-group">
          <span class="field-label">Password</span>
          <div class="input-full">
            <sakuga-input
              name="password"
              type="password"
              label="Password"
              value="sakuga-vfx-2026"
              placeholder="••••••••"
            ></sakuga-input>
          </div>
        </div>

        <div class="auth-row">
          <sakuga-checkbox
            checked={remember}
            onchange={(e) => (remember = e.target.checked)}
          >
            Remember me
          </sakuga-checkbox>
        </div>

        <div class="auth-submit">
          <sakuga-button bind:this={submitBtn} type="submit">Sign In to Studio</sakuga-button>
        </div>
      </form>

      <div class="auth-footer">
        <span>New to Sakuga Studio?</span>
        <button type="button" class="link-btn" onclick={() => navigate('register')}>Create an account →</button>
      </div>
    </div>
  </div>
</div>

<style>
  .auth-shell {
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: 24px 16px;
    background: radial-gradient(circle at top right, color-mix(in srgb, var(--sk-soft, #b8b3ff) 22%, transparent), transparent 48%),
      var(--page);
  }

  .auth-container {
    width: 100%;
    max-width: 440px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .auth-topbar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }

  .auth-card {
    width: 100%;
    padding: 28px;
    box-shadow: 7px 8px 0 var(--sk-soft, #b8b3ff);
    gap: 22px;
  }

  .auth-brand {
    display: flex;
    align-items: flex-start;
    gap: 14px;
  }

  .logo-mark {
    width: 46px;
    height: 46px;
    border-radius: 14px;
    background: var(--sk-pri, #8f8df7);
    color: var(--sk-on-pri, #fff);
    border: 2.5px solid var(--sk-ink, #1d1a4a);
    box-shadow: 3px 3px 0 var(--sk-soft, #b8b3ff);
    display: grid;
    place-items: center;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .auth-brand h1 {
    font-size: 24px;
    line-height: 1.15;
    margin-top: 6px;
  }

  .auth-sub {
    font-size: 13px;
    color: var(--mute);
    margin-top: 2px;
  }

  .auth-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .field-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .field-label {
    font-size: 12.5px;
    font-weight: 700;
    color: var(--text);
  }

  .input-full {
    --sk-input-width: 100%;
    width: 100%;
  }

  .input-full :global(sakuga-input) {
    display: block;
    width: 100%;
  }

  .auth-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding-top: 2px;
  }

  .auth-submit {
    display: flex;
    justify-content: flex-start;
    padding-top: 4px;
  }

  .auth-footer {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding-top: 16px;
    border-top: 1.5px solid var(--line);
    font-size: 13.5px;
    color: var(--mute);
  }

  .link-btn {
    background: none;
    border: none;
    color: var(--sk-acc, #ff5fa8);
    font-weight: 700;
    cursor: pointer;
    padding: 0;
  }

  .link-btn:hover {
    text-decoration: underline;
  }

  @media (max-width: 480px) {
    .auth-card {
      padding: 20px;
    }
  }
</style>
