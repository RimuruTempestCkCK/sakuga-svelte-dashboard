<script>
  import { onMount } from 'svelte';
  import Icon from './Icon.svelte';
  import {
    NAV_ITEMS,
    dashboard,
    navigate,
    showToast,
    toggleDarkMode,
    markAllNotificationsRead,
    setSidebarCollapsed,
  } from './store.svelte.js';

  let notifOpen = $state(false);
  let profileOpen = $state(false);
  let mobileSearchOpen = $state(false);

  let notifAnchor = $state();
  let profileAnchor = $state();
  let notifBtn = $state();
  let profileBtn = $state();
  let mobileSearchBar = $state();

  let currentNav = $derived(NAV_ITEMS.find((n) => n.id === dashboard.page) || NAV_ITEMS[0]);
  let unreadCount = $derived(dashboard.notifications.filter((n) => n.unread).length);

  function handleSearchInput(e) {
    dashboard.searchQuery = e.target.value ?? '';
  }

  function toggleNotif() {
    notifOpen = !notifOpen;
    if (notifOpen) {
      profileOpen = false;
      mobileSearchOpen = false;
    }
  }

  function toggleProfile() {
    profileOpen = !profileOpen;
    if (profileOpen) {
      notifOpen = false;
      mobileSearchOpen = false;
    }
  }

  function toggleMobileSearch() {
    mobileSearchOpen = !mobileSearchOpen;
    if (mobileSearchOpen) {
      notifOpen = false;
      profileOpen = false;
    }
  }

  function goFromMenu(pageId) {
    profileOpen = false;
    notifOpen = false;
    navigate(pageId);
  }

  onMount(() => {
    function handlePointerDown(e) {
      const target = e.target;
      if (notifOpen && notifAnchor && !notifAnchor.contains(target)) {
        notifOpen = false;
      }
      if (profileOpen && profileAnchor && !profileAnchor.contains(target)) {
        profileOpen = false;
      }
      if (
        mobileSearchOpen &&
        mobileSearchBar &&
        !mobileSearchBar.contains(target) &&
        !(target instanceof Element && target.closest('.mobile-search-toggle'))
      ) {
        mobileSearchOpen = false;
      }
    }

    function handleKeyDown(e) {
      if (e.key !== 'Escape') return;
      if (notifOpen) {
        notifOpen = false;
        notifBtn?.focus();
      }
      if (profileOpen) {
        profileOpen = false;
        profileBtn?.focus();
      }
      if (mobileSearchOpen) {
        mobileSearchOpen = false;
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  });
</script>

<header class="header">
  <div class="header-left">
    <button
      type="button"
      class="icon-btn mobile-only"
      aria-label="Open menu"
      onclick={() => (dashboard.mobileNavOpen = !dashboard.mobileNavOpen)}
    >
      <Icon name="menu" size={19} />
    </button>

    <button
      type="button"
      class="icon-btn desktop-only"
      aria-label={dashboard.sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      onclick={() => setSidebarCollapsed(!dashboard.sidebarCollapsed)}
    >
      <Icon name={dashboard.sidebarCollapsed ? 'chevron-right' : 'chevron-left'} size={18} />
    </button>

    <div class="title-group">
      <div class="breadcrumb">
        <span>Studio</span>
        <span aria-hidden="true">/</span>
        <span>{currentNav.group}</span>
      </div>
      <div class="title-row">
        <h1 class="page-title sakuga-title">{currentNav.label}</h1>
      </div>
    </div>
  </div>

  <div class="header-right">
    <div class="header-search">
      <sakuga-input
        label="Search"
        placeholder="Search..."
        value={dashboard.searchQuery}
        oninput={handleSearchInput}
      ></sakuga-input>
    </div>

    <div class="header-actions">
      <button
        type="button"
        class="pill cmd-trigger"
        aria-label="Open Command Palette"
        onclick={() => (dashboard.commandPaletteOpen = true)}
      >
        <Icon name="search" size={14} />
        <span>Cmd</span>
        <kbd class="cmd-kbd">Ctrl+K</kbd>
      </button>

      <button
        type="button"
        class="icon-btn mobile-search-toggle"
        aria-label={mobileSearchOpen ? 'Close search' : 'Open search'}
        aria-expanded={mobileSearchOpen}
        onclick={toggleMobileSearch}
      >
        <Icon name={mobileSearchOpen ? 'x' : 'search'} size={18} />
      </button>

      <button
        type="button"
        class="icon-btn theme-btn"
        aria-label={dashboard.darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        title={dashboard.darkMode ? 'Light Mode' : 'Dark Mode'}
        onclick={toggleDarkMode}
      >
        <Icon name={dashboard.darkMode ? 'sun' : 'moon'} size={18} />
      </button>

      <div class="menu-anchor" bind:this={notifAnchor}>
        <button
          bind:this={notifBtn}
          type="button"
          class="icon-btn"
          aria-label="Notifications"
          aria-haspopup="dialog"
          aria-expanded={notifOpen}
          onclick={toggleNotif}
        >
          <Icon name="bell" size={18} />
          {#if unreadCount > 0}
            <span class="notif-dot">{unreadCount}</span>
          {/if}
        </button>

        {#if notifOpen}
          <div class="dropdown notif-dropdown" role="dialog" aria-label="Notifications">
            <div class="dropdown-head">
              <strong>Notifications</strong>
              <button type="button" class="text-link" onclick={markAllNotificationsRead}>Mark all read</button>
            </div>
            <ul class="notif-list">
              {#each dashboard.notifications as n (n.id)}
                <li class="notif-item" class:unread={n.unread}>
                  <div class="notif-title">{n.title}</div>
                  <span class="notif-time">{n.time}</span>
                </li>
              {/each}
            </ul>
            <button
              type="button"
              class="dropdown-cta"
              onclick={() => {
                notifOpen = false;
                showToast('All caught up!');
              }}
            >
              Test Sakuga Toast
            </button>
          </div>
        {/if}
      </div>

      <div class="menu-anchor" bind:this={profileAnchor}>
        <button
          bind:this={profileBtn}
          type="button"
          class="profile-pill"
          aria-haspopup="menu"
          aria-expanded={profileOpen}
          onclick={toggleProfile}
        >
          <span class="avatar">{dashboard.user.initials}</span>
          <span class="user-meta">
            <span class="user-name">{dashboard.user.name}</span>
            <span class="user-role">{dashboard.user.role}</span>
          </span>
          <Icon name="chevron-down" size={14} />
        </button>

        {#if profileOpen}
          <div class="dropdown profile-dropdown" role="menu">
            <div class="profile-summary">
              <strong>{dashboard.user.name}</strong>
              <span>{dashboard.user.email}</span>
            </div>
            <button type="button" role="menuitem" class="menu-item" onclick={() => goFromMenu('profile')}>My Profile</button>
            <button type="button" role="menuitem" class="menu-item" onclick={() => goFromMenu('settings')}>Theme & FX Settings</button>
            <button
              type="button"
              role="menuitem"
              class="menu-item"
              onclick={() => {
                profileOpen = false;
                dashboard.shortcutsOpen = true;
              }}
            >
              Keyboard Shortcuts
            </button>
            <div class="menu-divider"></div>
            <button type="button" role="menuitem" class="menu-item" onclick={() => goFromMenu('login')}>Login Page</button>
            <button type="button" role="menuitem" class="menu-item accent-text" onclick={() => goFromMenu('register')}>Register Page</button>
          </div>
        {/if}
      </div>
    </div>
  </div>
</header>

{#if mobileSearchOpen}
  <div class="mobile-search-bar" bind:this={mobileSearchBar} role="search" aria-label="Mobile Search">
    <div class="mobile-search-input">
      <sakuga-input
        label="Search controls or tables"
        placeholder="Search controls, tables..."
        value={dashboard.searchQuery}
        oninput={handleSearchInput}
      ></sakuga-input>
    </div>
    {#if dashboard.searchQuery}
      <button type="button" class="pill" onclick={() => (dashboard.searchQuery = '')}>Clear</button>
    {/if}
    <button type="button" class="icon-btn" aria-label="Close search" onclick={() => (mobileSearchOpen = false)}>
      <Icon name="x" size={17} />
    </button>
  </div>
{/if}

<style>
  .header {
    position: sticky;
    top: 0;
    z-index: 35;
    height: var(--header-h);
    background: var(--surface);
    border-bottom: 1.5px solid var(--line);
    padding: 0 24px;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
    flex: 1 1 auto;
  }

  .icon-btn {
    position: relative;
    width: 38px;
    height: 38px;
    border-radius: 12px;
    border: 1.5px solid var(--line);
    background: var(--surface);
    display: grid;
    place-items: center;
    cursor: pointer;
    color: var(--text);
    flex-shrink: 0;
    transition: border-color 0.15s ease, background 0.15s ease, transform 0.12s ease;
  }

  .icon-btn:hover {
    border-color: var(--sk-soft, #b8b3ff);
    background: var(--chip);
  }

  .icon-btn:active {
    transform: scale(0.95);
  }

  .theme-btn {
    box-shadow: 2px 2px 0 var(--sk-soft, #b8b3ff);
  }

  .mobile-only,
  .mobile-search-toggle {
    display: none;
  }

  .title-group {
    display: flex;
    flex-direction: column;
    gap: 1px;
    min-width: 0;
  }

  .breadcrumb {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    font-weight: 700;
    color: var(--mute);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    white-space: nowrap;
  }

  .title-row {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
  }

  .page-title {
    font-size: 19px;
    line-height: 1.15;
    color: var(--text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .header-right {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    gap: 12px;
    flex-shrink: 0;
  }

  .header-search {
    --sk-input-width: 180px;
    display: flex;
    align-items: center;
  }

  .header-actions {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    gap: 10px;
  }

  .menu-anchor {
    position: relative;
    flex-shrink: 0;
  }

  .notif-dot {
    position: absolute;
    top: -5px;
    right: -5px;
    min-width: 18px;
    height: 18px;
    padding: 0 5px;
    border-radius: 999px;
    background: var(--sk-acc, #ff5fa8);
    color: #fff;
    font-size: 10.5px;
    font-weight: 800;
    display: grid;
    place-items: center;
    border: 2px solid var(--surface);
  }

  .profile-pill {
    display: flex;
    align-items: center;
    gap: 9px;
    height: 40px;
    padding: 0 10px 0 5px;
    border-radius: 999px;
    border: 1.5px solid var(--line);
    background: var(--surface);
    cursor: pointer;
    transition: border-color 0.15s ease, background 0.15s ease;
  }

  .profile-pill:hover {
    border-color: var(--sk-soft, #b8b3ff);
    background: var(--surface-alt);
  }

  .avatar {
    width: 30px;
    height: 30px;
    border-radius: 999px;
    background: var(--sk-pri, #8f8df7);
    color: var(--sk-on-pri, #fff);
    font-size: 12px;
    font-weight: 800;
    display: grid;
    place-items: center;
    border: 1.5px solid var(--sk-ink, #1d1a4a);
    flex-shrink: 0;
  }

  .user-meta {
    display: flex;
    flex-direction: column;
    text-align: left;
    line-height: 1.15;
    white-space: nowrap;
  }

  .user-name {
    font-size: 12.5px;
    font-weight: 700;
    color: var(--text);
  }

  .user-role {
    font-size: 10.5px;
    color: var(--mute);
  }

  .dropdown {
    position: absolute;
    right: 0;
    top: calc(100% + 10px);
    width: min(260px, calc(100vw - 24px));
    background: var(--surface);
    border: 1.5px solid var(--line);
    border-radius: 16px;
    box-shadow: 5px 6px 0 var(--sk-soft, #b8b3ff);
    padding: 12px;
    z-index: 80;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .dropdown-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--line);
    font-size: 13px;
  }

  .text-link {
    background: none;
    border: none;
    color: var(--sk-acc, #ff5fa8);
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
  }

  .notif-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .notif-item {
    padding: 8px 10px;
    border-radius: 10px;
    background: var(--surface-alt);
    border: 1px solid transparent;
  }

  .notif-item.unread {
    border-color: var(--sk-soft, #b8b3ff);
  }

  .notif-title {
    font-size: 12.5px;
    font-weight: 600;
  }

  .notif-time {
    font-size: 11px;
    color: var(--mute);
  }

  .dropdown-cta {
    margin-top: 4px;
    padding: 8px;
    border-radius: 10px;
    border: 1.5px solid var(--line);
    background: var(--chip);
    font-size: 12.5px;
    font-weight: 700;
    cursor: pointer;
  }

  .dropdown-cta:hover {
    border-color: var(--text);
  }

  .profile-summary {
    display: flex;
    flex-direction: column;
    padding: 4px 8px 10px;
    border-bottom: 1px solid var(--line);
    font-size: 12.5px;
  }

  .profile-summary span {
    color: var(--mute);
    font-size: 11.5px;
  }

  .menu-item {
    background: none;
    border: none;
    text-align: left;
    padding: 8px 10px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    color: var(--text);
  }

  .menu-item:hover {
    background: var(--chip);
  }

  .menu-item.accent-text {
    color: var(--sk-acc, #ff5fa8);
  }

  .menu-divider {
    height: 1px;
    background: var(--line);
    margin: 2px 0;
  }

  .mobile-search-bar {
    position: sticky;
    top: var(--header-h);
    z-index: 34;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 14px;
    background: var(--surface);
    border-bottom: 1.5px solid var(--line);
    box-shadow: 0 4px 12px rgba(15, 14, 30, 0.08);
  }

  .mobile-search-input {
    flex: 1;
    min-width: 0;
    --sk-input-width: 100%;
  }

  .mobile-search-input :global(sakuga-input) {
    display: block;
    width: 100%;
  }

  .cmd-trigger {
    height: 36px;
    padding: 0 10px;
    font-size: 12.5px;
    border-radius: 11px;
  }

  .cmd-kbd {
    font-family: var(--font-mono);
    font-size: 10.5px;
    padding: 1px 5px;
    border-radius: 5px;
    background: var(--chip);
    border: 1px solid var(--line);
    color: var(--mute);
  }

  @media (max-width: 1120px) {
    .cmd-trigger {
      display: none;
    }
    .user-meta {
      display: none;
    }

    .profile-pill {
      padding: 0 8px 0 4px;
      gap: 6px;
    }

    .header-search {
      --sk-input-width: 150px;
    }
  }

  @media (max-width: 900px) {
    .header {
      padding: 0 14px;
    }

    .mobile-only,
    .mobile-search-toggle {
      display: grid;
    }

    .desktop-only {
      display: none;
    }

    .header-search {
      display: none;
    }
  }
</style>
