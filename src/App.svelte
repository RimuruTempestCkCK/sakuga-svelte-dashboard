<script>
  import { onMount } from 'svelte';
  import SplashLoader from './lib/SplashLoader.svelte';
  import Sidebar from './lib/Sidebar.svelte';
  import Header from './lib/Header.svelte';
  import CommandPalette from './lib/CommandPalette.svelte';
  import Modal from './lib/Modal.svelte';
  import OverviewView from './lib/views/OverviewView.svelte';
  import AnalyticsView from './lib/views/AnalyticsView.svelte';
  import TablesView from './lib/views/TablesView.svelte';
  import ComponentsView from './lib/views/ComponentsView.svelte';
  import StudioFormView from './lib/views/StudioFormView.svelte';
  import TasksView from './lib/views/TasksView.svelte';
  import ProfileView from './lib/views/ProfileView.svelte';
  import SettingsView from './lib/views/SettingsView.svelte';
  import LoginView from './lib/views/LoginView.svelte';
  import RegisterView from './lib/views/RegisterView.svelte';
  import ForgotPasswordView from './lib/views/ForgotPasswordView.svelte';
  import ResetPasswordView from './lib/views/ResetPasswordView.svelte';
  import NotFoundView from './lib/views/NotFoundView.svelte';
  import { dashboard, initDashboard, syncFromHash, setSidebarCollapsed } from './lib/store.svelte.js';

  function isEditableTarget(target) {
    if (!target) return false;
    if (target instanceof HTMLElement) {
      if (target.isContentEditable) return true;
      const tag = target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || tag === 'SAKUGA-INPUT') {
        return true;
      }
    }
    return false;
  }

  onMount(() => {
    initDashboard();
    window.addEventListener('hashchange', syncFromHash);

    function handleGlobalKey(e) {
      const mod = e.ctrlKey || e.metaKey;
      const key = e.key.toLowerCase();

      if (mod && key === 'k') {
        if (isEditableTarget(e.target) && !dashboard.commandPaletteOpen) return;
        e.preventDefault();
        dashboard.commandPaletteOpen = !dashboard.commandPaletteOpen;
        return;
      }

      if (isEditableTarget(e.target)) return;

      if (mod && key === 'b') {
        e.preventDefault();
        setSidebarCollapsed(!dashboard.sidebarCollapsed);
      } else if (e.key === '?' && e.shiftKey) {
        e.preventDefault();
        dashboard.shortcutsOpen = !dashboard.shortcutsOpen;
      } else if (e.key === 'Escape') {
        if (dashboard.commandPaletteOpen) dashboard.commandPaletteOpen = false;
        else if (dashboard.shortcutsOpen) dashboard.shortcutsOpen = false;
      }
    }

    window.addEventListener('keydown', handleGlobalKey);
    return () => {
      window.removeEventListener('hashchange', syncFromHash);
      window.removeEventListener('keydown', handleGlobalKey);
    };
  });

  let isStandalonePage = $derived(
    dashboard.page === 'login' ||
      dashboard.page === 'register' ||
      dashboard.page === 'forgot-password' ||
      dashboard.page === 'reset-password' ||
      dashboard.page === 'not-found'
  );
</script>

<SplashLoader />

{#if isStandalonePage}
  {#if dashboard.page === 'login'}
    <LoginView />
  {:else if dashboard.page === 'register'}
    <RegisterView />
  {:else if dashboard.page === 'forgot-password'}
    <ForgotPasswordView />
  {:else if dashboard.page === 'reset-password'}
    <ResetPasswordView />
  {:else}
    <NotFoundView />
  {/if}
{:else}
  <div class="shell" class:collapsed={dashboard.sidebarCollapsed}>
    <Sidebar />

    <div class="main-area">
      <Header />

      <main class="content">
        {#if dashboard.page === 'overview'}
          <OverviewView />
        {:else if dashboard.page === 'analytics'}
          <AnalyticsView />
        {:else if dashboard.page === 'tables'}
          <TablesView />
        {:else if dashboard.page === 'components'}
          <ComponentsView />
        {:else if dashboard.page === 'studio'}
          <StudioFormView />
        {:else if dashboard.page === 'tasks'}
          <TasksView />
        {:else if dashboard.page === 'profile'}
          <ProfileView />
        {:else if dashboard.page === 'settings'}
          <SettingsView />
        {/if}
      </main>
    </div>
  </div>
{/if}

<div class="global-toast">
  <sakuga-toast bind:this={dashboard.toastEl} duration="2.6"></sakuga-toast>
</div>

<CommandPalette bind:open={dashboard.commandPaletteOpen} />

<Modal
  bind:open={dashboard.shortcutsOpen}
  title="Keyboard Shortcuts"
  subtitle="Global shortcuts available when not typing in an input field."
>
  <div class="shortcuts-list">
    <div class="sc-row"><span>Open Command Palette</span><kbd class="kbd-pill">Ctrl / Cmd + K</kbd></div>
    <div class="sc-row"><span>Toggle Sidebar Collapse</span><kbd class="kbd-pill">Ctrl / Cmd + B</kbd></div>
    <div class="sc-row"><span>Show Keyboard Shortcuts</span><kbd class="kbd-pill">Shift + ?</kbd></div>
    <div class="sc-row"><span>Close Modal / Palette / Dropdown</span><kbd class="kbd-pill">Escape</kbd></div>
  </div>
</Modal>

<style>
  .shell {
    min-height: 100vh;
    display: flex;
  }

  .main-area {
    flex: 1;
    min-width: 0;
    margin-left: var(--sidebar-w);
    display: flex;
    flex-direction: column;
    transition: margin-left 0.22s cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  .shell.collapsed .main-area {
    margin-left: var(--sidebar-collapsed-w);
  }

  .content {
    flex: 1;
    padding: 16px 20px;
    max-width: 1280px;
    width: 100%;
    margin: 0 auto;
  }

  .global-toast {
    position: fixed;
    right: 24px;
    bottom: 24px;
    z-index: 90;
    pointer-events: none;
  }

  .global-toast :global(sakuga-toast) {
    pointer-events: auto;
  }

  .shortcuts-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .sc-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 8px 12px;
    border-radius: 10px;
    background: var(--surface-alt);
    border: 1px solid var(--line);
    font-size: 13.5px;
  }

  .kbd-pill {
    font-family: var(--font-mono);
    font-size: 11.5px;
    font-weight: 700;
    padding: 3px 8px;
    border-radius: 7px;
    background: var(--chip);
    border: 1px solid var(--line);
  }

  @media (max-width: 900px) {
    .main-area,
    .shell.collapsed .main-area {
      margin-left: 0;
    }

    .content {
      padding: 12px;
    }
  }
</style>
