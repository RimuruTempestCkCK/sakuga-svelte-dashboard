<script>
  import { onMount } from 'svelte';
  import SplashLoader from './lib/SplashLoader.svelte';
  import Sidebar from './lib/Sidebar.svelte';
  import Header from './lib/Header.svelte';
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
  import NotFoundView from './lib/views/NotFoundView.svelte';
  import { dashboard, initDashboard, syncFromHash } from './lib/store.svelte.js';

  onMount(() => {
    initDashboard();
    window.addEventListener('hashchange', syncFromHash);
    return () => {
      window.removeEventListener('hashchange', syncFromHash);
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
