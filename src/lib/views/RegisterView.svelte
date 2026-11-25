<script>
  import Icon from '../Icon.svelte';
  import { dashboard, navigate, showToast, toggleDarkMode, logEvent, updateUser } from '../store.svelte.js';

  let submitBtn = $state();
  let fullName = $state('Yui Sato');
  let email = $state('yui@sakuga.studio');
  let role = $state('animator');
  let agreed = $state(true);

  function handleRegister(e) {
    e.preventDefault();
    updateUser({
      name: fullName || 'New Animator',
      role: role === 'director' ? 'Art Director' : 'Key Animator',
      email: email || 'user@sakuga.studio',
      initials: (fullName || 'NA')
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
    });
    logEvent(`Registered account for ${dashboard.user.name}`);
    showToast('ズザッ! Account created!');
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
          <span class="badge accent">New Workspace</span>
          <h1 class="sakuga-title">Create Account</h1>
          <p class="auth-sub">Join the Sakuga VFX Studio template</p>
        </div>
      </div>

      <form class="auth-form" onsubmit={handleRegister}>
        <div class="field-group">
          <span class="field-label">Full Name</span>
          <div class="input-full">
            <sakuga-input
              name="name"
              label="Full Name"
              value={fullName}
              placeholder="Your name"
              oninput={(e) => (fullName = e.target.value)}
            ></sakuga-input>
          </div>
        </div>

        <div class="field-group">
          <span class="field-label">Work Email</span>
          <div class="input-full">
            <sakuga-input
              name="email"
              type="email"
              label="Work Email"
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
              value="sakuga-pass-2026"
              placeholder="Create password"
            ></sakuga-input>
          </div>
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
            onchange={(e) => (agreed = e.target.checked)}
          >
            I agree to the Studio Terms & VFX License
          </sakuga-checkbox>
        </div>

        <div class="auth-submit">
          <sakuga-button bind:this={submitBtn} type="submit">Create Workspace</sakuga-button>
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
    padding: 28px;
    box-shadow: 7px 8px 0 var(--sk-soft, #b8b3ff);
    gap: 20px;
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
    gap: 15px;
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

  .agree-row {
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
