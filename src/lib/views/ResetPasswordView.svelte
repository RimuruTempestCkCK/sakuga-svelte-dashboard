<script>
  import Icon from '../Icon.svelte';
  import { dashboard, navigate, showToast, toggleDarkMode } from '../store.svelte.js';

  let submitBtn = $state();
  let password = $state('');
  let confirmPassword = $state('');
  let showPassword = $state(false);
  let submitting = $state(false);
  let done = $state(false);
  let errors = $state({ password: '', confirm: '' });

  function validate() {
    const next = { password: '', confirm: '' };
    if (!password) {
      next.password = 'Password baru wajib diisi.';
    } else if (password.length < 6) {
      next.password = 'Password minimal 6 karakter.';
    }
    if (confirmPassword !== password) {
      next.confirm = 'Konfirmasi password tidak cocok.';
    }
    errors = next;
    return !next.password && !next.confirm;
  }

  function handleReset(e) {
    e.preventDefault();
    if (submitting || !validate()) return;
    submitting = true;
    setTimeout(() => {
      submitBtn?.done?.();
      submitting = false;
      done = true;
      showToast('Password updated (UI simulation)');
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
          <span class="badge accent">Security</span>
          <h1 class="sakuga-title">Reset Password</h1>
          <p class="auth-sub">Set a new password (UI simulation only)</p>
        </div>
      </div>

      {#if done}
        <div class="success-box">
          <strong>Password Berhasil Diperbarui (Simulasi UI)</strong>
          <p>Silakan kembali ke halaman Sign In untuk melanjutkan.</p>
          <div class="success-actions">
            <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
            <sakuga-button onclick={() => navigate('login')}>Go to Sign In</sakuga-button>
          </div>
        </div>
      {:else}
        <form class="auth-form" onsubmit={handleReset} novalidate>
          <div class="field-group">
            <span class="field-label">New Password</span>
            <div class="password-wrap">
              <div class="input-full">
                <sakuga-input
                  name="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  label="New Password"
                  value={password}
                  placeholder="Minimal 6 karakter"
                  oninput={(e) => {
                    password = e.target.value;
                    if (errors.password) errors = { ...errors, password: '' };
                  }}
                ></sakuga-input>
              </div>
              <button
                type="button"
                class="eye-btn"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onclick={() => (showPassword = !showPassword)}
              >
                <Icon name={showPassword ? 'eye-off' : 'eye'} size={16} />
              </button>
            </div>
            {#if errors.password}
              <span class="field-error">{errors.password}</span>
            {/if}
          </div>

          <div class="field-group">
            <span class="field-label">Confirm New Password</span>
            <div class="input-full">
              <sakuga-input
                name="confirmNewPassword"
                type={showPassword ? 'text' : 'password'}
                label="Confirm New Password"
                value={confirmPassword}
                placeholder="Ulangi password baru"
                oninput={(e) => {
                  confirmPassword = e.target.value;
                  if (errors.confirm) errors = { ...errors, confirm: '' };
                }}
              ></sakuga-input>
            </div>
            {#if errors.confirm}
              <span class="field-error">{errors.confirm}</span>
            {/if}
          </div>

          <div class="auth-submit">
            <sakuga-button bind:this={submitBtn} type="submit" disabled={submitting}>
              {submitting ? 'Updating...' : 'Save New Password'}
            </sakuga-button>
          </div>
        </form>
      {/if}
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
    background: var(--sk-acc, #ff5fa8);
    color: #fff;
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

  .password-wrap {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .password-wrap .input-full {
    flex: 1;
    min-width: 0;
  }

  .eye-btn {
    width: 38px;
    height: 38px;
    border-radius: 11px;
    border: 1.5px solid var(--line);
    background: var(--surface-alt);
    color: var(--text);
    display: grid;
    place-items: center;
    cursor: pointer;
    flex-shrink: 0;
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
</style>
