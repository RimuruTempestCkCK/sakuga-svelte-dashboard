<script>
  import Icon from './Icon.svelte';
  import { APP_CONFIG } from './app.config.js';
  import { NAV_ITEMS, dashboard, navigate } from './store.svelte.js';

  const GROUPS = APP_CONFIG.navGroups;

  let openGroups = $state({
    Main: true,
    'Data & Pages': true,
    Account: true,
    'Auth Templates': false,
  });

  // Auto-expand the parent group whenever the active route belongs to it
  $effect(() => {
    const activeItem = NAV_ITEMS.find((i) => i.id === dashboard.page);
    if (activeItem && !openGroups[activeItem.group]) {
      openGroups = { ...openGroups, [activeItem.group]: true };
    }
  });

  function toggleGroup(group) {
    openGroups = { ...openGroups, [group]: !openGroups[group] };
  }

  function isGroupActive(group) {
    return NAV_ITEMS.some((i) => i.group === group && i.id === dashboard.page);
  }

  function groupId(group) {
    return `nav-group-${group.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  }
</script>

{#if dashboard.mobileNavOpen}
  <button
    class="backdrop"
    type="button"
    aria-label="Close navigation menu"
    onclick={() => (dashboard.mobileNavOpen = false)}
  ></button>
{/if}

<aside
  class="sidebar"
  class:collapsed={dashboard.sidebarCollapsed}
  class:mobile-open={dashboard.mobileNavOpen}
  aria-label="Primary Sidebar"
>
  <div class="brand">
    <img src={APP_CONFIG.logo} alt={`${APP_CONFIG.name} Logo`} class="brand-logo" width="38" height="38" />
    {#if !dashboard.sidebarCollapsed}
      <div class="brand-text">
        <span class="sakuga-title brand-name">{APP_CONFIG.name}</span>
        <span class="brand-sub">{APP_CONFIG.subtitle}</span>
      </div>
    {/if}
  </div>

  <nav class="nav" aria-label="Dashboard Navigation">
    {#each GROUPS as group}
      {@const items = NAV_ITEMS.filter((i) => i.group === group)}
      {@const isOpen = !!openGroups[group]}
      {@const hasActive = isGroupActive(group)}

      <div class="nav-group" class:collapsed-group={dashboard.sidebarCollapsed}>
        {#if !dashboard.sidebarCollapsed}
          <button
            type="button"
            class="group-toggle"
            class:group-active={hasActive}
            aria-expanded={isOpen}
            aria-controls={groupId(group)}
            onclick={() => toggleGroup(group)}
          >
            <span>{group}</span>
            <span class="chevron" class:rotated={isOpen} aria-hidden="true">
              <Icon name="chevron-right" size={14} />
            </span>
          </button>
        {/if}

        {#if dashboard.sidebarCollapsed || isOpen}
          <div class="group-items" id={groupId(group)}>
            {#each items as item}
              <button
                type="button"
                class="nav-item"
                class:active={dashboard.page === item.id}
                aria-current={dashboard.page === item.id ? 'page' : undefined}
                onclick={() => navigate(item.id)}
              >
                <span class="nav-icon" aria-hidden="true">
                  <Icon name={item.icon} size={17} />
                </span>
                {#if !dashboard.sidebarCollapsed}
                  <span class="nav-label">{item.label}</span>
                {:else}
                  <span class="nav-tooltip" role="tooltip">{item.label}</span>
                {/if}
              </button>
            {/each}
          </div>
        {/if}
      </div>
    {/each}
  </nav>

  <div class="sidebar-footer">
    {#if !dashboard.sidebarCollapsed}
      <div class="fx-box">
        <div class="fx-box-top">
          <span class="badge accent">{dashboard.darkMode ? 'Dark Mode' : 'Light Mode'}</span>
          <sakuga-tooltip
            text="All 11 sakuga-vfx files share one fixed canvas & spring clock."
            label="Architecture info"
          ></sakuga-tooltip>
        </div>
        <p class="fx-box-desc">12 Sakuga controls • Svelte 5 SPA template.</p>
      </div>
    {:else}
      <sakuga-tooltip
        text="Sakuga VFX Dashboard Template"
        label="Architecture info"
      ></sakuga-tooltip>
    {/if}
  </div>
</aside>

<style>
  .backdrop {
    display: none;
  }

  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: var(--sidebar-w);
    background: var(--sidebar-bg, var(--surface));
    border-right: 1.5px solid var(--line);
    display: flex;
    flex-direction: column;
    padding: 16px 14px;
    z-index: 40;
    transition: width 0.22s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.22s cubic-bezier(0.2, 0.8, 0.2, 1), background 0.22s ease;
  }

  .sidebar.collapsed {
    width: var(--sidebar-collapsed-w);
    padding: 16px 10px;
    align-items: center;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 4px 6px 14px;
    border-bottom: 1.5px solid var(--line);
    margin-bottom: 10px;
  }

  .brand-logo {
    width: 38px;
    height: 38px;
    border-radius: 11px;
    object-fit: cover;
    border: 2px solid var(--sk-ink, #1d1a4a);
    flex-shrink: 0;
  }

  .brand-text {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .brand-name {
    font-size: 19px;
    line-height: 1.1;
    color: var(--text);
  }

  .brand-sub {
    font-size: 11.5px;
    color: var(--mute);
    font-weight: 600;
  }

  .nav {
    display: flex;
    flex-direction: column;
    gap: 6px;
    flex: 1;
    width: 100%;
    overflow-y: auto;
    padding-right: 2px;
  }

  .sidebar.collapsed .nav {
    overflow: visible;
    padding-right: 0;
    gap: 4px;
  }

  .nav-group {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .group-toggle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 6px 10px;
    border-radius: 9px;
    border: 1px solid transparent;
    background: transparent;
    color: var(--mute);
    font-size: 11px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    cursor: pointer;
    transition: color 0.15s ease, background 0.15s ease;
  }

  .group-toggle:hover {
    color: var(--text);
    background: var(--chip);
  }

  .group-toggle.group-active {
    color: var(--text);
  }

  .chevron {
    display: grid;
    place-items: center;
    transition: transform 0.18s ease;
  }

  .chevron.rotated {
    transform: rotate(90deg);
  }

  .group-items {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .nav-item {
    position: relative;
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 8px 11px;
    border-radius: 11px;
    border: 1.5px solid transparent;
    background: transparent;
    color: var(--mute);
    font-weight: 600;
    font-size: 13.5px;
    cursor: pointer;
    text-align: left;
    transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease, transform 0.12s ease;
  }

  .sidebar.collapsed .nav-item {
    justify-content: center;
    padding: 9px;
  }

  .nav-tooltip {
    position: absolute;
    left: calc(100% + 14px);
    top: 50%;
    transform: translateY(-50%) translateX(-6px) scale(0.92);
    opacity: 0;
    pointer-events: none;
    white-space: nowrap;
    padding: 6px 12px;
    border-radius: 10px;
    background: var(--surface);
    color: var(--text);
    border: 2px solid var(--sk-ink, #1d1a4a);
    box-shadow: 3px 4px 0 var(--sk-soft, #b8b3ff);
    font-size: 12.5px;
    font-weight: 700;
    z-index: 95;
    transition: opacity 0.14s ease, transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .nav-tooltip::before {
    content: "";
    position: absolute;
    left: -7px;
    top: 50%;
    width: 10px;
    height: 10px;
    background: var(--surface);
    border-left: 2px solid var(--sk-ink, #1d1a4a);
    border-bottom: 2px solid var(--sk-ink, #1d1a4a);
    transform: translateY(-50%) rotate(45deg);
  }

  .sidebar.collapsed .nav-item:hover .nav-tooltip,
  .sidebar.collapsed .nav-item:focus-visible .nav-tooltip {
    opacity: 1;
    transform: translateY(-50%) translateX(0) scale(1);
  }

  .nav-item:hover {
    background: var(--chip);
    color: var(--text);
  }

  .nav-item.active {
    background: var(--surface-alt);
    color: var(--text);
    border-color: var(--sk-soft, #b8b3ff);
    box-shadow: 3px 3px 0 var(--sk-soft, #b8b3ff);
  }

  .nav-item:active {
    transform: scale(0.97);
  }

  .nav-icon {
    display: grid;
    place-items: center;
    flex-shrink: 0;
  }

  .nav-label {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .sidebar-footer {
    padding-top: 12px;
    border-top: 1.5px solid var(--line);
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .fx-box {
    background: var(--surface-alt);
    border: 1.5px solid var(--line);
    border-radius: 14px;
    padding: 11px;
    width: 100%;
  }

  .fx-box-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 5px;
  }

  .fx-box-desc {
    font-size: 11.5px;
    color: var(--mute);
    line-height: 1.35;
  }

  @media (prefers-reduced-motion: reduce) {
    .sidebar,
    .chevron,
    .nav-item,
    .nav-tooltip {
      transition: none;
    }
  }

  @media (max-width: 900px) {
    .backdrop {
      display: block;
      position: fixed;
      inset: 0;
      background: rgba(15, 14, 30, 0.5);
      z-index: 39;
      border: none;
    }

    .sidebar {
      transform: translateX(-100%);
      width: var(--sidebar-w) !important;
      align-items: stretch !important;
    }

    .sidebar.mobile-open {
      transform: translateX(0);
    }
  }
</style>
