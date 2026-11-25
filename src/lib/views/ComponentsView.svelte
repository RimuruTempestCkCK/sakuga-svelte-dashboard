<script>
  import { dashboard, logEvent } from '../store.svelte.js';

  let primaryBtn = $state();
  let localToast = $state();
  let said = $state({});

  function say(key, text) {
    said = { ...said, [key]: text };
    logEvent(`[Gallery] ${key}: ${text}`);
  }

  function onSakugaDone(node, fn) {
    node.addEventListener('sakuga:done', fn);
    return {
      destroy() {
        node.removeEventListener('sakuga:done', fn);
      },
    };
  }

  const CARDS = [
    { id: 'primary', name: 'Primary button', tag: '<sakuga-button>', how: 'Click it. Fires burst + clouds + ドン! and lands a check.' },
    { id: 'secondary', name: 'Secondary button', tag: '<sakuga-button variant="secondary">', how: 'Click it. Quiet squash and three wedges.' },
    { id: 'toggle', name: 'Toggle', tag: '<sakuga-toggle>', how: 'Flip it, then flip it back. 43 painted frames.' },
    { id: 'slider', name: 'Slider', tag: '<sakuga-slider>', how: 'Drag it fast, and let go while it is moving.' },
    { id: 'checkbox', name: 'Checkbox', tag: '<sakuga-checkbox>', how: 'Tick it. Crescents, crystals & ズザッ.' },
    { id: 'radio', name: 'Radio', tag: '<sakuga-radio>', how: 'Pick the other one. Wedges, puffs & ポン.' },
    { id: 'input', name: 'Text input', tag: '<sakuga-input>', how: 'Click it and type. Kicks up dust at the caret.' },
    { id: 'tabs', name: 'Tabs', tag: '<sakuga-tabs>', how: 'Pick another tab, or use the arrow keys.' },
    { id: 'progress', name: 'Progress', tag: '<sakuga-progress demo>', how: 'Plays a load in surges. Click it to start again.', wide: true },
    { id: 'rating', name: 'Rating', tag: '<sakuga-rating>', how: 'Give it five for an impact burst.' },
    { id: 'toast', name: 'Toast', tag: '<sakuga-toast>', how: 'Press Save. Streaks in as a smear with ズザッ.' },
    { id: 'tooltip', name: 'Tooltip', tag: '<sakuga-tooltip>', how: 'Hover, focus or tap the button for カチッ.' },
  ];

  let visibleCards = $derived.by(() => {
    const q = dashboard.searchQuery.trim().toLowerCase();
    if (!q) return CARDS;
    return CARDS.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.tag.toLowerCase().includes(q) ||
        c.how.toLowerCase().includes(q)
    );
  });
</script>

<div class="gallery-wrap">
  <div class="gallery-intro">
    <p>Every single control from <strong>sakuga-vfx</strong> running live inside Svelte 5. Nothing is mocked or rewritten — all 12 items use the authentic Web Components.</p>
    {#if dashboard.searchQuery.trim()}
      <span class="badge accent">Filtered: {visibleCards.length} / {CARDS.length}</span>
    {/if}
  </div>

  <div class="grid">
    {#each visibleCards as item (item.id)}
      <section class="card gallery-card" class:wide={item.wide}>
        <h2>{item.name} <span>{item.tag}</span></h2>
        <p class="how">{item.how}</p>

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
            <sakuga-button
              variant="secondary"
              onclick={() => say('secondary', 'Clicked')}
            >
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
            <sakuga-checkbox
              onchange={(e) => say('checkbox', `change: ${e.target.checked ? 'on' : 'off'}`)}
            >
              Remember me
            </sakuga-checkbox>
          {:else if item.id === 'radio'}
            <sakuga-radio
              label="Plan"
              onchange={(e) => say('radio', `change: ${e.target.value}`)}
            >
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
            <sakuga-tabs
              label="Sections"
              onchange={(e) => say('tabs', `Tab: ${e.detail?.label}`)}
            >
              <option>Home</option>
              <option>Profile</option>
              <option>Settings</option>
            </sakuga-tabs>
          {:else if item.id === 'progress'}
            <sakuga-progress
              demo
              label="Loading"
              use:onSakugaDone={() => say('progress', 'sakuga:done')}
            ></sakuga-progress>
          {:else if item.id === 'rating'}
            <sakuga-rating
              label="Rating"
              onchange={(e) => say('rating', `change: ${e.target.value}`)}
            ></sakuga-rating>
          {:else if item.id === 'toast'}
            <div class="toastwrap">
              <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
              <sakuga-button
                variant="secondary"
                onclick={() => localToast?.show?.('Saved successfully!')}
              >
                Save
              </sakuga-button>
              <sakuga-toast bind:this={localToast}></sakuga-toast>
            </div>
          {:else if item.id === 'tooltip'}
            <sakuga-tooltip text="Helpful hint!"></sakuga-tooltip>
          {/if}
        </div>

        <p class="said" aria-live="polite">{said[item.id] || ''}</p>
      </section>
    {/each}
  </div>
</div>

<style>
  .gallery-wrap {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .gallery-intro {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    color: var(--mute);
    font-size: 13.5px;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
    gap: 14px;
    grid-auto-flow: dense;
  }

  .gallery-card {
    padding: 0;
  }

  .gallery-card.wide {
    grid-column: span 2;
  }

  .gallery-card h2 {
    margin: 0;
    padding: 14px 16px 0;
    font-size: 15px;
    font-weight: 700;
  }

  .gallery-card h2 span {
    margin-left: 6px;
    color: var(--mute);
    font-weight: 500;
    font-size: 12.5px;
  }

  .gallery-card .how {
    margin: 2px 0 0;
    padding: 0 16px;
    color: var(--mute);
    font-size: 12.5px;
  }

  .stage {
    flex: 1;
    display: grid;
    place-items: center;
    min-height: 135px;
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
    gap: 20px;
  }

  @media (max-width: 720px) {
    .gallery-card.wide {
      grid-column: auto;
    }
  }
</style>
