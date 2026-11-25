<script>
  import Icon from '../Icon.svelte';
  import { dashboard, navigate, showToast, toggleDarkMode, logEvent, updateUser } from '../store.svelte.js';

  let submitBtn = $state();
  let fullName = $state('Yui Sato');
  let email = $state('yui@sakuga.studio');
  let password = $state('sakuga-pass-2026');
  let confirmPassword = $state('sakuga-pass-2026');
  let role = $state('animator');
  let agreed = $state(true);
  let showPassword = $state(false);
  let submitting = $state(false);
  let errors = $state({ name: '', email: '', password: '', confirm: '', agreed: '' });

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validate() {
    const next = { name: '', email: '', password: '', confirm: '', agreed: '' };
    if (!fullName.trim()) {
      next.name = 'Nama lengkap wajib diisi.';
    }
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
    if (confirmPassword !== password) {
      next.confirm = 'Konfirmasi password tidak cocok.';
    }
    if (!agreed) {
      next.agreed = 'Anda harus menyetujui Terms & VFX License.';
    }
    errors = next;
    return !next.name && !next.email && !next.password && !next.confirm && !next.agreed;
  }

  function handleRegister(e) {
    e.preventDefault();
    if (submitting || !validate()) return;
    submitting = true;
    const cleanName = fullName.trim();
    updateUser({
      name: cleanName,
      role: role === 'director' ? 'Art Director' : 'Key Animator',
      email: email.trim(),
      initials: cleanName
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
    });
    logEvent(`Registered account for ${cleanName} (UI demo)`);
    showToast('ズザッ! Account created!');
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
          <span class="badge accent">New Workspace</span>
          <h1 class="sakuga-title">Create Account</h1>
          <p class="auth-sub">Join the Sakuga VFX Studio template</p>
        </div>
      </div>

      <form class="auth-form" onsubmit={handleRegister} novalidate>
        <div class="field-group">
          <span class="field-label">Full Name</span>
          <div class="input-full" class:has-error={!!errors.name}>
            <sakuga-input
              name="name"
              label="Full Name"
              value={fullName}
              placeholder="Your name"
              oninput={(e) => {
                fullName = e.target.value;
                if (errors.name) errors = { ...errors, name: '' };
              }}
            ></sakuga-input>
          </div>
          {#if errors.name}
            <span class="field-error">{errors.name}</span>
          {/if}
        </div>

        <div class="field-group">
          <span class="field-label">Work Email</span>
          <div class="input-full" class:has-error={!!errors.email}>
            <sakuga-input
              name="email"
              type="email"
              label="Work Email"
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
          <span class="field-label">Password</span>
          <div class="password-wrap" class:has-error={!!errors.password}>
            <div class="input-full">
              <sakuga-input
                name="password"
                type={showPassword ? 'text' : 'password'}
                label="Password"
                value={password}
                placeholder="Create password"
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
          <span class="field-label">Confirm Password</span>
          <div class="input-full" class:has-error={!!errors.confirm}>
            <sakuga-input
              name="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              label="Confirm Password"
              value={confirmPassword}
              placeholder="Repeat password"
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

        <div class="field-group">
          <span class="field-label">Studio Role</span>
          <sakuga-radio
            name="role"
            label="Studio Role"
            value={role}
            onchange={(e) => (role = e.target.value)}
          >
            <option value="animator" selected>Key Animator</option>
            <option value="director">Art Director</option>
          </sakuga-radio>
        </div>

        <div class="agree-row">
          <sakuga-checkbox
            checked={agreed}
            onchange={(e) => {
              agreed = e.target.checked;
              if (errors.agreed) errors = { ...errors, agreed: '' };
            }}
          >
            I agree to the Studio Terms & VFX License
          </sakuga-checkbox>
          {#if errors.agreed}
            <span class="field-error">{errors.agreed}</span>
          {/if}
        </div>

        <div class="auth-submit">
          <sakuga-button bind:this={submitBtn} type="submit" disabled={submitting}>
            {submitting ? 'Creating...' : 'Create Workspace'}
          </sakuga-button>
        </div>
      </form>

      <div class="auth-footer">
        <span>Already have an account?</span>
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
    background: radial-gradient(circle at bottom left, color-mix(in srgb, var(--sk-acc, #ff5fa8) 14%, transparent), transparent 48%),
      var(--page);
  }

  .auth-container {
    width: 100%;
    max-width: 460px;
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
    gap: 13px;
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

  .agree-row {
    display: flex;
    flex-direction: column;
    gap: 4px;
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

  .link-btn:hover {
    text-decoration: underline;
  }

  @media (max-width: 480px) {
    .auth-card {
      padding: 18px;
    }
  }
</style>
