<script>
  import Icon from '../Icon.svelte';
  import { dashboard, navigate, showToast, toggleDarkMode } from '../store.svelte.js';

  let submitBtn = $state();
  let email = $state('');
  let error = $state('');
  let submitting = $state(false);
  let sent = $state(false);

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;
    if (!email.trim()) {
      error = 'Email wajib diisi.';
      return;
    }
    if (!EMAIL_RE.test(email.trim())) {
      error = 'Format email tidak valid.';
      return;
    }
    error = '';
    submitting = true;
    setTimeout(() => {
      submitBtn?.done?.();
      submitting = false;
      sent = true;
      showToast('Simulasi reset password siap');
    }, 550);
  }
</script>

<div class="auth-shell">
  <div class="auth-container">
    <div class="auth-topbar">
      <button type="button" class="pill" onclick={() => navigate('login')}>
        <Icon name="arrow-left" size={15} />
        <span>Back to Login</span>
      </button>
      <button type="button" class="pill" onclick={toggleDarkMode}>
        <Icon name={dashboard.darkMode ? 'sun' : 'moon'} size={15} />
        <span>{dashboard.darkMode ? 'Light Mode' : 'Dark Mode'}</span>
      </button>
    </div>

    <div class="auth-card card">
      <div class="auth-brand">
        <div class="logo-mark" aria-hidden="true">
          <Icon name="lock" size={20} />
        </div>
        <div>
          <span class="badge accent">Account Recovery</span>
          <h1 class="sakuga-title">Forgot Password</h1>
          <p class="auth-sub">Simulasi UI pemulihan akun (tanpa backend email)</p>
        </div>
      </div>

      {#if sent}
        <div class="success-box">
          <strong>Simulasi Terkonfirmasi</strong>
          <p>
            Pada integrasi backend nyata, tautan reset password akan dikirim ke
            <span class="mono">{email}</span>.
          </p>
          <div class="success-actions">
            <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
            <sakuga-button onclick={() => navigate('reset-password')}>
              Open Reset Password Page
            </sakuga-button>
          </div>
        </div>
      {:else}
        <form class="auth-form" onsubmit={handleSubmit} novalidate>
          <div class="field-group">
            <span class="field-label">Registered Email</span>
            <div class="input-full">
              <sakuga-input
                name="email"
                type="email"
                label="Registered Email"
                value={email}
                placeholder="akira@sakuga.studio"
                oninput={(e) => {
                  email = e.target.value;
                  if (error) error = '';
                }}
              ></sakuga-input>
            </div>
            {#if error}
              <span class="field-error">{error}</span>
            {/if}
          </div>

          <div class="auth-submit">
            <sakuga-button bind:this={submitBtn} type="submit" disabled={submitting}>
              {submitting ? 'Processing...' : 'Continue to Reset'}
            </sakuga-button>
          </div>
        </form>
      {/if}

      <div class="auth-footer">
        <span>Remembered your password?</span>
        <button type="button" class="link-btn" onclick={() => navigate('login')}>Sign in →</button>
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
    background: var(--page);
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
    padding: 24px;
    box-shadow: 7px 8px 0 var(--sk-soft, #b8b3ff);
    gap: 18px;
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
    gap: 14px;
  }

  .auth-submit {
    display: flex;
    justify-content: center;
    padding-top: 4px;
  }

  .success-box {
    padding: 14px;
    border-radius: 12px;
    background: var(--surface-alt);
    border: 1.5px solid var(--sk-soft, #b8b3ff);
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-size: 13.5px;
  }

  .success-actions {
    display: flex;
    justify-content: center;
    padding-top: 6px;
  }

  .auth-footer {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding-top: 14px;
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
</style>
