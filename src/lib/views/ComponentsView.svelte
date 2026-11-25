<script>
  import Icon from '../Icon.svelte';
  import Modal from '../Modal.svelte';
  import Sparkline from '../charts/Sparkline.svelte';
  import { dashboard, logEvent, showToast } from '../store.svelte.js';

  let primaryBtn = $state();
  let localToast = $state();
  let said = $state({});
  let category = $state('all');
  let demoModalOpen = $state(false);
  let demoDropdownOpen = $state(false);
  let copiedId = $state('');

  function say(key, text) {
    said = { ...said, [key]: text };
    logEvent(`[Catalog] ${key}: ${text}`);
  }

  function onSakugaDone(node, fn) {
    node.addEventListener('sakuga:done', fn);
    return {
      destroy() {
        node.removeEventListener('sakuga:done', fn);
      },
    };
  }

  async function copySnippet(id, code) {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const t = Object.assign(document.createElement('textarea'), { value: code });
      t.style.cssText = 'position:fixed;opacity:0';
      document.body.append(t);
      t.select();
      try { document.execCommand('copy'); } catch {}
      t.remove();
    }
    copiedId = id;
    showToast(`Copied ${id} snippet!`, 'success');
    setTimeout(() => {
      if (copiedId === id) copiedId = '';
    }, 1800);
  }

  const CARDS = [
    {
      id: 'primary',
      cat: 'controls',
      name: 'Primary Button',
      tag: '<sakuga-button>',
      how: 'Fires burst + clouds + ドン! and lands a check with done().',
      code: '<sakuga-button onclick={handleAction}>Confirm</sakuga-button>',
    },
    {
      id: 'secondary',
      cat: 'controls',
      name: 'Secondary Button',
      tag: '<sakuga-button variant="secondary">',
      how: 'Quiet squash and three accent wedges.',
      code: '<sakuga-button variant="secondary">Cancel</sakuga-button>',
    },
    {
      id: 'toggle',
      cat: 'forms',
      name: 'Toggle',
      tag: '<sakuga-toggle>',
      how: '43-frame painted liquid animation on flip.',
      code: '<sakuga-toggle label="Notifications" checked={val} onchange={onChange}></sakuga-toggle>',
    },
    {
      id: 'slider',
      cat: 'forms',
      name: 'Slider',
      tag: '<sakuga-slider>',
      how: 'Spring-lagging thumb with cumulus smoke on fast drag.',
      code: '<sakuga-slider value="30" label="Volume" onchange={onChange}></sakuga-slider>',
    },
    {
      id: 'checkbox',
      cat: 'forms',
      name: 'Checkbox',
      tag: '<sakuga-checkbox>',
      how: 'Crescents, crystal shards & ズザッ lettering.',
      code: '<sakuga-checkbox checked={ok}>Remember me</sakuga-checkbox>',
    },
    {
      id: 'radio',
      cat: 'forms',
      name: 'Radio Group',
      tag: '<sakuga-radio>',
      how: 'Picked dot springs in with wedges, puffs & ポン.',
      code: '<sakuga-radio label="Plan"><option value="a" selected>A</option><option value="b">B</option></sakuga-radio>',
    },
    {
      id: 'input',
      cat: 'forms',
      name: 'Text Input',
      tag: '<sakuga-input>',
      how: 'Kicks up dust puffs from the caret on every key.',
      code: '<sakuga-input label="Name" placeholder="Type something"></sakuga-input>',
    },
    {
      id: 'tabs',
      cat: 'controls',
      name: 'Tabs',
      tag: '<sakuga-tabs>',
      how: 'Sliding raised tab with wedges and puff.',
      code: '<sakuga-tabs label="Sections"><option value="a" selected>Home</option><option value="b">Settings</option></sakuga-tabs>',
    },
    {
      id: 'progress',
      cat: 'feedback',
      name: 'Progress',
      tag: '<sakuga-progress demo>',
      how: 'Storm cloud + pebbles + ゴゴゴゴ + ドン! on completion.',
      wide: true,
      code: '<sakuga-progress label="Loading"></sakuga-progress>',
    },
    {
      id: 'rating',
      cat: 'forms',
      name: 'Rating',
      tag: '<sakuga-rating>',
      how: 'Stars pop in; five triggers an impact burst.',
      code: '<sakuga-rating label="Rating" value="5"></sakuga-rating>',
    },
    {
      id: 'toast',
      cat: 'feedback',
      name: 'Sakuga Toast',
      tag: '<sakuga-toast>',
      how: 'Streaks in as a smear and lands in dust with ズザッ.',
      code: '<sakuga-toast bind:this={toastEl}></sakuga-toast>',
    },
    {
      id: 'tooltip',
      cat: 'feedback',
      name: 'Tooltip',
      tag: '<sakuga-tooltip>',
      how: 'Speech bubble with puffs and カチッ on hover/focus/tap.',
      code: '<sakuga-tooltip text="Helpful hint!"></sakuga-tooltip>',
    },
    {
      id: 'badges',
      cat: 'patterns',
      name: 'Badges & Pills',
      tag: '.badge / .pill',
      how: 'Status indicators for tables, KPIs, and filters.',
      code: '<span class="badge accent">Active</span>\n<span class="badge success">Completed</span>',
    },
    {
      id: 'metric',
      cat: 'patterns',
      name: 'Metric Card + Sparkline',
      tag: '<Sparkline />',
      how: 'Theme-aware KPI summary card with inline SVG sparkline.',
      code: '<Sparkline data={[42, 54, 49, 68, 82, 91]} color="var(--sk-pri)" />',
    },
    {
      id: 'modal',
      cat: 'patterns',
      name: 'Modal Dialog',
      tag: '<Modal />',
      how: 'Accessible dialog with Escape & backdrop close.',
      code: '<Modal bind:open={open} title="Title">...</Modal>',
    },
    {
      id: 'toast-stack',
      cat: 'feedback',
      name: 'Toast Notification System',
      tag: 'showToast(msg, type)',
      how: 'Stacked multi-toast with success, error, warning & info.',
      code: "showToast('Saved!', 'success');",
    },
    {
      id: 'dropdown',
      cat: 'patterns',
      name: 'Dropdown Menu',
      tag: '.dropdown',
      how: 'Sakuga-bordered floating menu with keyboard focus.',
      code: '<div class="dropdown" role="menu">...</div>',
    },
    {
      id: 'empty-state',
      cat: 'patterns',
      name: 'Empty State',
      tag: '.empty-state',
      how: 'Consistent zero-results placeholder with reset action.',
      code: '<div class="empty-state"><div class="empty-title">Tidak ada data</div></div>',
    },
    {
      id: 'skeleton',
      cat: 'patterns',
      name: 'Loading Skeleton',
      tag: '.skeleton-line',
      how: 'Lightweight theme-aware loading placeholder.',
      code: '<div class="skeleton-line"></div>',
    },
  ];

  let visibleCards = $derived.by(() => {
    const q = dashboard.searchQuery.trim().toLowerCase();
    return CARDS.filter((c) => {
      if (category !== 'all' && c.cat !== category) return false;
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        c.tag.toLowerCase().includes(q) ||
        c.how.toLowerCase().includes(q)
      );
    });
  });
</script>

<div class="gallery-wrap">
  <div class="card catalog-header">
    <div class="catalog-top">
      <div>
        <h2 class="card-title">Component & Pattern Catalog</h2>
        <p class="card-desc">All 12 Sakuga VFX controls plus reusable dashboard UI patterns with copyable snippets.</p>
      </div>

      <sakuga-tabs
        label="Component category"
        onchange={(e) => (category = e.detail?.value || 'all')}
      >
        <option value="all" selected={category === 'all'}>All ({CARDS.length})</option>
        <option value="controls" selected={category === 'controls'}>Controls</option>
        <option value="forms" selected={category === 'forms'}>Forms</option>
        <option value="feedback" selected={category === 'feedback'}>Feedback</option>
        <option value="patterns" selected={category === 'patterns'}>Patterns</option>
      </sakuga-tabs>
    </div>
  </div>

  <div class="grid">
    {#if visibleCards.length === 0}
      <div class="card empty-span">
        <div class="empty-state">
          <div class="empty-icon"><Icon name="search" size={20} /></div>
          <div class="empty-title">Tidak ada data yang ditemukan</div>
          <p class="empty-desc">Tidak ada komponen yang cocok dengan pencarian atau kategori saat ini.</p>
          <button
            type="button"
            class="pill"
            onclick={() => {
              category = 'all';
              dashboard.searchQuery = '';
            }}
          >
            Reset Filter
          </button>
        </div>
      </div>
    {/if}

    {#each visibleCards as item (item.id)}
      <section class="card gallery-card" class:wide={item.wide}>
        <div class="card-head-row">
          <div>
            <h2>{item.name} <span>{item.tag}</span></h2>
            <p class="how">{item.how}</p>
          </div>
          <button
            type="button"
            class="pill copy-btn"
            onclick={() => copySnippet(item.id, item.code)}
          >
            {copiedId === item.id ? 'Copied!' : 'Copy Code'}
          </button>
        </div>

        <div class="stage">
          {#if item.id === 'primary'}
            <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
            <sakuga-button
              bind:this={primaryBtn}
              onclick={() => {
                say('primary', 'Clicked');
                setTimeout(() => primaryBtn?.done?.(), 760);
              }}
            >
              Confirm
            </sakuga-button>
          {:else if item.id === 'secondary'}
            <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
            <sakuga-button variant="secondary" onclick={() => say('secondary', 'Clicked')}>
              Cancel
            </sakuga-button>
          {:else if item.id === 'toggle'}
            <sakuga-toggle
              label="Notifications"
              onchange={(e) => say('toggle', `change: ${e.target.checked ? 'on' : 'off'}`)}
            ></sakuga-toggle>
          {:else if item.id === 'slider'}
            <sakuga-slider
              value="30"
              label="Volume"
              onchange={(e) => say('slider', `change: ${e.target.value}`)}
            ></sakuga-slider>
          {:else if item.id === 'checkbox'}
            <sakuga-checkbox onchange={(e) => say('checkbox', `change: ${e.target.checked ? 'on' : 'off'}`)}>
              Remember me
            </sakuga-checkbox>
          {:else if item.id === 'radio'}
            <sakuga-radio label="Plan" onchange={(e) => say('radio', `change: ${e.target.value}`)}>
              <option value="a" selected>Option A</option>
              <option value="b">Option B</option>
            </sakuga-radio>
          {:else if item.id === 'input'}
            <sakuga-input
              label="Text"
              placeholder="Type something"
              onchange={(e) => say('input', `change: ${e.target.value}`)}
            ></sakuga-input>
          {:else if item.id === 'tabs'}
            <sakuga-tabs label="Sections" onchange={(e) => say('tabs', `Tab: ${e.detail?.label}`)}>
              <option>Home</option>
              <option>Profile</option>
              <option>Settings</option>
            </sakuga-tabs>
          {:else if item.id === 'progress'}
            <sakuga-progress demo label="Loading" use:onSakugaDone={() => say('progress', 'sakuga:done')}></sakuga-progress>
          {:else if item.id === 'rating'}
            <sakuga-rating label="Rating" onchange={(e) => say('rating', `change: ${e.target.value}`)}></sakuga-rating>
          {:else if item.id === 'toast'}
            <div class="toastwrap">
              <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
              <sakuga-button variant="secondary" onclick={() => localToast?.show?.('Saved successfully!')}>
                Save
              </sakuga-button>
              <sakuga-toast bind:this={localToast}></sakuga-toast>
            </div>
          {:else if item.id === 'tooltip'}
            <sakuga-tooltip text="Helpful hint!"></sakuga-tooltip>
          {:else if item.id === 'badges'}
            <div class="demo-row">
              <span class="badge">Default</span>
              <span class="badge accent">Accent</span>
              <span class="badge success">Success</span>
              <span class="badge warn">Warning</span>
            </div>
          {:else if item.id === 'metric'}
            <div class="mini-metric-preview">
              <div class="metric-head-mini">
                <span>Weekly Output</span>
                <span class="badge success">+18%</span>
              </div>
              <strong class="sakuga-title">460k</strong>
              <Sparkline data={[42, 54, 49, 68, 82, 91]} color="var(--sk-pri, #8f8df7)" />
            </div>
          {:else if item.id === 'modal'}
            <button type="button" class="pill" onclick={() => (demoModalOpen = true)}>Open Modal Preview</button>
          {:else if item.id === 'toast-stack'}
            <div class="demo-row">
              <button type="button" class="pill" onclick={() => showToast('Success toast!', 'success')}>Success</button>
              <button type="button" class="pill" onclick={() => showToast('Info message', 'info')}>Info</button>
              <button type="button" class="pill" onclick={() => showToast('Warning alert', 'warning')}>Warning</button>
              <button type="button" class="pill danger" onclick={() => showToast('Error notice', 'error')}>Error</button>
            </div>
          {:else if item.id === 'dropdown'}
            <div class="demo-dd-anchor">
              <button type="button" class="pill" onclick={() => (demoDropdownOpen = !demoDropdownOpen)}>
                Toggle Menu
              </button>
              {#if demoDropdownOpen}
                <div class="demo-dd" role="menu">
                  <button type="button" class="demo-dd-item" onclick={() => { demoDropdownOpen = false; say('dropdown', 'Option 1'); }}>Option 1</button>
                  <button type="button" class="demo-dd-item" onclick={() => { demoDropdownOpen = false; say('dropdown', 'Option 2'); }}>Option 2</button>
                </div>
              {/if}
            </div>
          {:else if item.id === 'empty-state'}
            <div class="empty-state compact-empty">
              <div class="empty-icon"><Icon name="search" size={16} /></div>
              <div class="empty-title">No items found</div>
            </div>
          {:else if item.id === 'skeleton'}
            <div class="skeleton-box" aria-label="Loading skeleton preview">
              <div class="skeleton-line w-60"></div>
              <div class="skeleton-line w-100"></div>
              <div class="skeleton-line w-80"></div>
            </div>
          {/if}
        </div>

        <p class="said" aria-live="polite">{said[item.id] || ''}</p>
      </section>
    {/each}
  </div>
</div>

<Modal bind:open={demoModalOpen} title="Sample Modal Dialog" subtitle="Reusable Sakuga modal preview.">
  <p style="font-size: 13.5px; color: var(--mute);">
    Modals support Escape key, backdrop click, and Dark Mode automatically.
  </p>
  <div class="card-footer">
    <button type="button" class="pill" onclick={() => (demoModalOpen = false)}>Close</button>
  </div>
</Modal>

<style>
  .gallery-wrap {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .catalog-top {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
    gap: 14px;
    grid-auto-flow: dense;
  }

  .empty-span {
    grid-column: 1 / -1;
  }

  .gallery-card {
    padding: 0;
  }

  .gallery-card.wide {
    grid-column: span 2;
  }

  .card-head-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 10px;
    padding: 14px 16px 0;
  }

  .gallery-card h2 {
    margin: 0;
    font-size: 14.5px;
    font-weight: 700;
  }

  .gallery-card h2 span {
    margin-left: 5px;
    color: var(--mute);
    font-weight: 500;
    font-size: 12px;
  }

  .gallery-card .how {
    margin: 2px 0 0;
    color: var(--mute);
    font-size: 12.5px;
  }

  .copy-btn {
    height: 28px;
    padding: 0 10px;
    font-size: 11.5px;
    flex-shrink: 0;
  }

  .stage {
    flex: 1;
    display: grid;
    place-items: center;
    min-height: 130px;
    padding: 14px 12px;
  }

  .said {
    min-height: 1.4em;
    margin: 0;
    padding: 0 14px 12px;
    color: var(--mute);
    font-size: 12.5px;
    text-align: center;
  }

  .toastwrap {
    position: relative;
    display: grid;
    justify-items: center;
    gap: 16px;
  }

  .demo-row {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
  }

  .mini-metric-preview {
    width: 100%;
    max-width: 220px;
    padding: 12px;
    border-radius: 12px;
    background: var(--surface-alt);
    border: 1px solid var(--line);
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .metric-head-mini {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    color: var(--mute);
  }

  .mini-metric-preview strong {
    font-size: 22px;
  }

  .demo-dd-anchor {
    position: relative;
  }

  .demo-dd {
    position: absolute;
    top: calc(100% + 6px);
    left: 50%;
    transform: translateX(-50%);
    width: 140px;
    background: var(--surface);
    border: 1.5px solid var(--line);
    border-radius: 12px;
    box-shadow: 4px 4px 0 var(--sk-soft, #b8b3ff);
    padding: 6px;
    z-index: 20;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .demo-dd-item {
    border: none;
    background: transparent;
    padding: 6px 8px;
    border-radius: 8px;
    font-size: 12.5px;
    font-weight: 600;
    text-align: left;
    cursor: pointer;
  }

  .demo-dd-item:hover {
    background: var(--chip);
  }

  .compact-empty {
    width: 100%;
    padding: 14px;
  }

  .skeleton-box {
    width: 100%;
    max-width: 240px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .skeleton-line {
    height: 12px;
    border-radius: 999px;
    background: var(--chip);
    border: 1px solid var(--line);
    animation: pulseSk 1.4s ease-in-out infinite;
  }

  .w-60 { width: 60%; }
  .w-80 { width: 80%; }
  .w-100 { width: 100%; }

  @keyframes pulseSk {
    0%, 100% { opacity: 0.55; }
    50% { opacity: 1; }
  }

  @media (max-width: 720px) {
    .gallery-card.wide {
      grid-column: auto;
    }
  }
</style>
