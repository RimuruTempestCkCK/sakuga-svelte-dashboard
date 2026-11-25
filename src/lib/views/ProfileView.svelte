<script>
  import { dashboard, showToast, logEvent, navigate } from '../store.svelte.js';

  let saveBtn = $state();
  let name = $state(dashboard.user.name);
  let email = $state(dashboard.user.email);
  let role = $state(dashboard.user.role);
  let emailDigest = $state(true);

  function handleSaveProfile(e) {
    e.preventDefault();
    dashboard.user = {
      name: name || 'Animator',
      email: email || 'user@sakuga.studio',
      role,
      initials: (name || 'AN')
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
    };
    logEvent(`Updated profile for ${dashboard.user.name}`);
    showToast('Profile updated!');
    setTimeout(() => saveBtn?.done?.(), 650);
  }
</script>

<div class="profile-grid">
  <div class="card identity-card">
    <div class="big-avatar">{dashboard.user.initials}</div>
    <h2 class="sakuga-title">{dashboard.user.name}</h2>
    <p class="role-text">{dashboard.user.role}</p>
    <span class="badge accent">{dashboard.user.email}</span>

    <div class="identity-actions">
      <button type="button" class="pill" onclick={() => navigate('login')}>Switch Account</button>
      <button type="button" class="pill" onclick={() => navigate('settings')}>Theme Settings</button>
    </div>
  </div>

  <form class="card edit-card" onsubmit={handleSaveProfile}>
    <div class="card-head">
      <div>
        <h2>Account Details</h2>
        <p class="card-desc">Update your studio identity — changes reflect in the Header immediately.</p>
      </div>
    </div>

    <div class="fields">
      <div class="field-row">
        <sakuga-input
          label="Display Name"
          value={name}
          oninput={(e) => (name = e.target.value)}
        ></sakuga-input>

        <sakuga-input
          type="email"
          label="Email Address"
          value={email}
          oninput={(e) => (email = e.target.value)}
        ></sakuga-input>
      </div>

      <sakuga-radio
        label="Studio Role"
        value={role}
        onchange={(e) => (role = e.target.value)}
      >
        <option value="Lead Animator" selected={role === 'Lead Animator'}>Lead Animator</option>
        <option value="Art Director" selected={role === 'Art Director'}>Art Director</option>
        <option value="FX Compositor" selected={role === 'FX Compositor'}>FX Compositor</option>
      </sakuga-radio>

      <sakuga-toggle
        label="Weekly Render Digest"
        checked={emailDigest}
        onchange={(e) => (emailDigest = e.target.checked)}
      ></sakuga-toggle>
    </div>

    <div class="form-actions">
      <sakuga-button bind:this={saveBtn} type="submit">Update Profile</sakuga-button>
    </div>
  </form>
</div>

<style>
  .profile-grid {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 14px;
    align-items: start;
  }

  .identity-card {
    align-items: center;
    text-align: center;
    gap: 8px;
    padding: 20px 16px;
  }

  .big-avatar {
    width: 76px;
    height: 76px;
    border-radius: 999px;
    background: var(--sk-pri, #8f8df7);
    color: var(--sk-on-pri, #fff);
    border: 3px solid var(--sk-ink, #1d1a4a);
    box-shadow: 4px 5px 0 var(--sk-soft, #b8b3ff);
    display: grid;
    place-items: center;
    font-size: 26px;
    font-weight: 800;
    margin-bottom: 6px;
  }

  .role-text {
    color: var(--mute);
    font-size: 13.5px;
  }

  .identity-actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
    margin-top: 10px;
  }

  .card-head h2 {
    font-size: 16px;
    font-weight: 700;
  }

  .card-desc {
    font-size: 13px;
    color: var(--mute);
    margin-top: 2px;
  }

  .fields {
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin-top: 12px;
  }

  .field-row {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
  }

  .form-actions {
    margin-top: 16px;
    padding-top: 12px;
    border-top: 1.5px solid var(--line);
  }

  @media (max-width: 820px) {
    .profile-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
