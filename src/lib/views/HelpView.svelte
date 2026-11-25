<script>
  import Icon from '../Icon.svelte';
  import { dashboard, navigate, showToast, logEvent } from '../store.svelte.js';

  let openFaq = $state(0);
  let subject = $state('');
  let email = $state(dashboard.user.email);
  let error = $state('');
  let sendBtn = $state();

  const FAQS = [
    {
      q: 'How do I customize the brand name, logo, and sidebar menu?',
      a: 'Edit src/lib/app.config.js. You can change APP_CONFIG.name, logo, defaultTheme, navGroups, and navItems from one centralized file.',
    },
    {
      q: 'How do the Sakuga VFX Web Components share animations?',
      a: 'All 11 scripts in public/sakuga-vfx/ register custom elements and share a single window.SakugaFX canvas and animation loop that stops automatically at idle.',
    },
    {
      q: 'How do I add a new page or chart to this template?',
      a: 'Create a Svelte 5 view in src/lib/views/, add it to APP_CONFIG.navItems and PAGE_TO_HASH, and render it in src/App.svelte. Reusable SVG charts live in src/lib/charts/.',
    },
    {
      q: 'Where are user preferences and themes stored?',
      a: 'Theme preset, accent color, border radius, card density, sidebar collapse state, and profile info are saved safely in localStorage under APP_CONFIG.storageKey.',
    },
  ];

  let filteredFaqs = $derived.by(() => {
    const q = dashboard.searchQuery.trim().toLowerCase();
    if (!q) return FAQS;
    return FAQS.filter((f) => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q));
  });

  function handleSupportSubmit(e) {
    e.preventDefault();
    if (!subject.trim()) {
      error = 'Subjek pertanyaan wajib diisi.';
      return;
    }
    error = '';
    logEvent(`[Help] Support inquiry logged: ${subject.trim()}`);
    showToast('Support message logged (UI demo)', 'success');
    subject = '';
    setTimeout(() => sendBtn?.done?.(), 650);
  }
</script>

<div class="help-grid">
  <section class="card faq-card">
    <div class="card-head">
      <div>
        <h2 class="card-title">Frequently Asked Questions</h2>
        <p class="card-desc">Click a question to expand or collapse the answer.</p>
      </div>
      <span class="badge">{filteredFaqs.length} Topics</span>
    </div>

    <div class="faq-list">
      {#each filteredFaqs as item, i}
        {@const isOpen = openFaq === i}
        <div class="faq-item" class:open={isOpen}>
          <button
            type="button"
            class="faq-trigger"
            aria-expanded={isOpen}
            onclick={() => (openFaq = isOpen ? -1 : i)}
          >
            <span>{item.q}</span>
            <span class="faq-chev" class:rotated={isOpen} aria-hidden="true">
              <Icon name="chevron-right" size={15} />
            </span>
          </button>
          {#if isOpen}
            <div class="faq-body">{item.a}</div>
          {/if}
        </div>
      {/each}
    </div>

    <div class="card-footer">
      <span class="muted-lbl">Preview Status Pages:</span>
      <button type="button" class="pill" onclick={() => navigate('403')}>403 Forbidden</button>
      <button type="button" class="pill" onclick={() => navigate('500')}>500 Error</button>
      <button type="button" class="pill" onclick={() => navigate('maintenance')}>Maintenance</button>
    </div>
  </section>

  <form class="card support-card" onsubmit={handleSupportSubmit} novalidate>
    <div class="card-head">
      <div>
        <h2 class="card-title">Contact Support</h2>
        <p class="card-desc">Frontend UI demo form for support inquiries.</p>
      </div>
    </div>

    <div class="modal-form">
      <div class="field-group">
        <span class="field-label">Your Email</span>
        <div class="input-full">
          <sakuga-input
            type="email"
            label="Your Email"
            value={email}
            oninput={(e) => (email = e.target.value)}
          ></sakuga-input>
        </div>
      </div>

      <div class="field-group">
        <span class="field-label">Subject *</span>
        <div class="input-full">
          <sakuga-input
            label="Subject"
            value={subject}
            placeholder="How can we help?"
            oninput={(e) => {
              subject = e.target.value;
              if (error) error = '';
            }}
          ></sakuga-input>
        </div>
        {#if error}
          <span class="field-error">{error}</span>
        {/if}
      </div>
    </div>

    <div class="card-footer">
      <sakuga-button bind:this={sendBtn} type="submit">Send Inquiry</sakuga-button>
    </div>
  </form>
</div>

<style>
  .help-grid {
    display: grid;
    grid-template-columns: 1.4fr 1fr;
    gap: 14px;
    align-items: start;
  }

  .faq-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .faq-item {
    border: 1.5px solid var(--line);
    border-radius: 12px;
    background: var(--surface-alt);
    overflow: hidden;
  }

  .faq-item.open {
    border-color: var(--sk-soft, #b8b3ff);
  }

  .faq-trigger {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 12px 14px;
    background: transparent;
    border: none;
    color: var(--text);
    font-size: 13.5px;
    font-weight: 700;
    text-align: left;
    cursor: pointer;
  }

  .faq-chev {
    display: grid;
    place-items: center;
    transition: transform 0.16s ease;
    flex-shrink: 0;
  }

  .faq-chev.rotated {
    transform: rotate(90deg);
  }

  .faq-body {
    padding: 0 14px 12px;
    font-size: 13px;
    color: var(--mute);
    line-height: 1.5;
  }

  .muted-lbl {
    font-size: 12.5px;
    font-weight: 600;
    color: var(--mute);
  }

  @media (max-width: 960px) {
    .help-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
