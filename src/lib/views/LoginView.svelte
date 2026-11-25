<script>
  import Icon from '../Icon.svelte';
  import { dashboard, navigate, showToast, toggleDarkMode, logEvent } from '../store.svelte.js';

  let submitBtn = $state();
  let email = $state('akira@sakuga.studio');
  let password = $state('sakuga-vfx-2026');
  let remember = $state(true);
  let showPassword = $state(false);
  let submitting = $state(false);
  let errors = $state({ email: '', password: '' });

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validate() {
    const next = { email: '', password: '' };
    if (!email.trim()) {
      next.email = 'Email wajib diisi.';
    } else if (!EMAIL_RE.test(email.trim())) {
      next.email = 'Format email tidak valid.';
    }
    if (!password) {
      next.password = 'Password wajib diisi.';
    } else if (password.length < 6) {
      next.password = 'Password minimal 6 karakter.';
    }
    errors = next;
    return !next.email && !next.password;
  }

  function handleLogin(e) {
    e.preventDefault();
    if (submitting || !validate()) return;
    submitting = true;
    logEvent(`Signed in as ${email.trim()} (UI demo)`);
    showToast('ドン! Welcome back to Sakuga Studio');
    setTimeout(() => {
      submitBtn?.done?.();
      setTimeout(() => {
        submitting = false;
        navigate('overview');
      }, 450);
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

      <form class="auth-form" onsubmit={handleLogin} novalidate>
        <div class="field-group">
          <span class="field-label">Email Address</span>
          <div class="input-full" class:has-error={!!errors.email}>
            <sakuga-input
              name="email"
              type="email"
              label="Email Address"
              value={email}
              placeholder="you@studio.jp"
              oninput={(e) => {
                email = e.target.value;
                if (errors.email) errors = { ...errors, email: '' };
              }}
            ></sakuga-input>
          </div>
          {#if errors.email}
            <span class="field-error">{errors.email}</span>
          {/if}
        </div>

        <div class="field-group">
          <div class="label-row">
            <span class="field-label">Password</span>
            <button type="button" class="link-btn sm" onclick={() => navigate('forgot-password')}>
              Forgot password?
            </button>
          </div>
          <div class="password-wrap" class:has-error={!!errors.password}>
            <div class="input-full">
              <sakuga-input
                name="password"
                type={showPassword ? 'text' : 'password'}
                label="Password"
                value={password}
                placeholder="••••••••"
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

        <div class="auth-row">
          <sakuga-checkbox
            checked={remember}
            onchange={(e) => (remember = e.target.checked)}
          >
            Remember me
          </sakuga-checkbox>
        </div>

        <div class="auth-submit">
          <sakuga-button bind:this={submitBtn} type="submit" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Sign In to Studio'}
          </sakuga-button>
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

  .label-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
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

  .eye-btn:hover {
    border-color: var(--sk-soft, #b8b3ff);
  }

  .has-error {
    --sk-ink: #e11d48;
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
    justify-content: center;
    padding-top: 4px;
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

  .link-btn.sm {
    font-size: 12px;
  }

  .link-btn:hover {
    text-decoration: underline;
  }

  @media (max-width: 480px) {
    .auth-card {
      padding: 18px;
    }
  }
</style>
