<script>
  import Icon from './Icon.svelte';
  import { NAV_ITEMS, dashboard, navigate, toggleDarkMode, setSidebarCollapsed } from './store.svelte.js';

  let { open = $bindable(false) } = $props();
  let query = $state('');
  let activeIdx = $state(0);
  let inputEl = $state();

  const ALL_ITEMS = [
    ...NAV_ITEMS.map((item) => ({
      id: item.id,
      label: item.label,
      category: item.group,
      icon: item.icon,
      shortcut: item.id === 'overview' ? 'G O' : item.id === 'analytics' ? 'G A' : '',
      action: () => navigate(item.id),
    })),
    {
      id: 'forgot-password',
      label: 'Forgot Password',
      category: 'Auth Templates',
      icon: 'lock',
      shortcut: '',
      action: () => navigate('forgot-password'),
    },
    {
      id: 'reset-password',
      label: 'Reset Password',
      category: 'Auth Templates',
      icon: 'lock',
      shortcut: '',
      action: () => navigate('reset-password'),
    },
    {
      id: 'act-theme',
      label: 'Toggle Dark / Light Mode',
      category: 'Quick Actions',
      icon: 'moon',
      shortcut: '',
      action: () => toggleDarkMode(),
    },
    {
      id: 'act-sidebar',
      label: 'Toggle Sidebar Collapse',
      category: 'Quick Actions',
      icon: 'sliders',
      shortcut: 'Ctrl+B',
      action: () => setSidebarCollapsed(!dashboard.sidebarCollapsed),
    },
    {
      id: 'act-shortcuts',
      label: 'View Keyboard Shortcuts',
      category: 'Quick Actions',
      icon: 'sparkles',
      shortcut: 'Shift+?',
      action: () => (dashboard.shortcutsOpen = true),
    },
  ];

  let results = $derived.by(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ALL_ITEMS;
    return ALL_ITEMS.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  });

  $effect(() => {
    if (open) {
      query = '';
      activeIdx = 0;
      setTimeout(() => inputEl?.focus(), 20);
    }
  });

  $effect(() => {
    if (activeIdx >= results.length) {
      activeIdx = Math.max(0, results.length - 1);
    }
  });

  function runItem(item) {
    open = false;
    item.action();
  }

  function handleKeyDown(e) {
    if (!open) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (results.length) activeIdx = (activeIdx + 1) % results.length;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (results.length) activeIdx = (activeIdx - 1 + results.length) % results.length;
    } else if (e.key === 'Enter') {
      if (results[activeIdx]) {
        e.preventDefault();
        runItem(results[activeIdx]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      open = false;
    }
  }

  function splitHighlight(text, q) {
    const clean = q.trim();
    if (!clean) return [{ text, match: false }];
    const idx = text.toLowerCase().indexOf(clean.toLowerCase());
    if (idx === -1) return [{ text, match: false }];
    return [
      { text: text.slice(0, idx), match: false },
      { text: text.slice(idx, idx + clean.length), match: true },
      { text: text.slice(idx + clean.length), match: false },
    ].filter((part) => part.text);
  }
</script>

{#if open}
  <div
    class="palette-backdrop"
    role="presentation"
    onclick={(e) => {
      if (e.target === e.currentTarget) open = false;
    }}
  >
    <div
      class="palette-box"
      role="dialog"
      aria-modal="true"
      aria-label="Command Palette"
      onkeydown={handleKeyDown}
    >
      <div class="palette-input-row">
        <span class="search-ic" aria-hidden="true">
          <Icon name="search" size={17} />
        </span>
        <input
          bind:this={inputEl}
          type="text"
          class="palette-input"
          placeholder="Search pages, categories, or actions..."
          aria-label="Command palette search"
          bind:value={query}
        />
        <kbd class="kbd-hint">Esc</kbd>
      </div>

      <div class="palette-list" role="listbox" aria-label="Search results">
        {#if results.length === 0}
          <div class="palette-empty">
            <Icon name="search" size={20} />
            <span>No matching pages or commands for "{query}"</span>
          </div>
        {:else}
          {#each results as item, i (item.id)}
            <button
              type="button"
              role="option"
              aria-selected={activeIdx === i}
              class="palette-item"
              class:selected={activeIdx === i}
              onmouseenter={() => (activeIdx = i)}
              onclick={() => runItem(item)}
            >
              <span class="item-ic" aria-hidden="true">
                <Icon name={item.icon} size={16} />
              </span>
              <span class="item-main">
                <span class="item-label">
                  {#each splitHighlight(item.label, query) as part}
                    {#if part.match}
                      <mark class="hl">{part.text}</mark>
                    {:else}
                      {part.text}
                    {/if}
                  {/each}
                </span>
                <span class="item-cat">{item.category}</span>
              </span>
              {#if item.shortcut}
                <kbd class="kbd-hint">{item.shortcut}</kbd>
              {/if}
            </button>
          {/each}
        {/if}
      </div>

      <div class="palette-footer">
        <span><kbd class="kbd-hint">↑↓</kbd> Navigate</span>
        <span><kbd class="kbd-hint">↵</kbd> Open</span>
        <span><kbd class="kbd-hint">Esc</kbd> Close</span>
      </div>
    </div>
  </div>
{/if}

<style>
  .palette-backdrop {
    position: fixed;
    inset: 0;
    z-index: 120;
    background: rgba(15, 14, 30, 0.52);
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 84px 16px 24px;
  }

  .palette-box {
    width: 100%;
    max-width: 540px;
    background: var(--surface);
    border: 2px solid var(--sk-ink, #1d1a4a);
    border-radius: 18px;
    box-shadow: 7px 8px 0 var(--sk-soft, #b8b3ff);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .palette-input-row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 14px;
    border-bottom: 1.5px solid var(--line);
  }

  .search-ic {
    color: var(--mute);
    display: grid;
    place-items: center;
  }

  .palette-input {
    flex: 1;
    min-width: 0;
    border: none;
    background: transparent;
    color: var(--text);
    font: inherit;
    font-size: 14.5px;
    outline: none;
  }

  .palette-list {
    max-height: 320px;
    overflow-y: auto;
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .palette-item {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 10px;
    border-radius: 11px;
    border: 1.5px solid transparent;
    background: transparent;
    color: var(--text);
    cursor: pointer;
    text-align: left;
  }

  .palette-item.selected {
    background: var(--surface-alt);
    border-color: var(--sk-soft, #b8b3ff);
  }

  .item-ic {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    background: var(--chip);
    border: 1px solid var(--line);
    display: grid;
    place-items: center;
    color: var(--text);
    flex-shrink: 0;
  }

  .item-main {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .item-label {
    font-size: 13.5px;
    font-weight: 600;
  }

  .item-cat {
    font-size: 11.5px;
    color: var(--mute);
    font-weight: 600;
  }

  .hl {
    background: color-mix(in srgb, var(--sk-acc, #ff5fa8) 25%, transparent);
    color: var(--text);
    border-radius: 4px;
    padding: 0 2px;
  }

  .kbd-hint {
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 700;
    padding: 2px 6px;
    border-radius: 6px;
    background: var(--chip);
    border: 1px solid var(--line);
    color: var(--mute);
    white-space: nowrap;
  }

  .palette-empty {
    padding: 28px 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    color: var(--mute);
    font-size: 13px;
    text-align: center;
  }

  .palette-footer {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    padding: 9px 14px;
    border-top: 1.5px solid var(--line);
    background: var(--surface-alt);
    font-size: 11.5px;
    color: var(--mute);
  }
</style>
