<script>
  import Icon from '../Icon.svelte';
  import Modal from '../Modal.svelte';
  import { dashboard, showToast, logEvent } from '../store.svelte.js';

  const COLUMNS = [
    { id: 'backlog', label: 'Backlog' },
    { id: 'progress', label: 'In Progress' },
    { id: 'review', label: 'In Review' },
    { id: 'done', label: 'Done' },
  ];

  let cards = $state([
    { id: 1, title: 'Cut 03 — Dust Cloud Intro', tag: '2D FX', priority: 'Normal', col: 'backlog', assignee: 'AT' },
    { id: 2, title: 'Cut 08 — Katana Impact Flash', tag: 'Sakuga', priority: 'Urgent', col: 'progress', assignee: 'YS' },
    { id: 3, title: 'Cut 11 — Character Hair Smear', tag: 'Keyframes', priority: 'High', col: 'progress', assignee: 'KM' },
    { id: 4, title: 'Cut 15 — Boss Aura Composite', tag: 'Compositing', priority: 'High', col: 'review', assignee: 'HK' },
    { id: 5, title: 'Cut 01 — Opening ドン! Title', tag: 'Lettering', priority: 'Normal', col: 'done', assignee: 'AT' },
  ]);

  let modalOpen = $state(false);
  let editingId = $state(null);
  let cTitle = $state('');
  let cTag = $state('2D FX');
  let cPriority = $state('Normal');
  let cCol = $state('backlog');
  let cError = $state('');

  let filteredCards = $derived.by(() => {
    const q = dashboard.searchQuery.trim().toLowerCase();
    if (!q) return cards;
    return cards.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.tag.toLowerCase().includes(q) ||
        c.priority.toLowerCase().includes(q)
    );
  });

  function moveCard(id, dir) {
    cards = cards.map((c) => {
      if (c.id !== id) return c;
      const idx = COLUMNS.findIndex((col) => col.id === c.col);
      const nextIdx = Math.min(COLUMNS.length - 1, Math.max(0, idx + dir));
      if (nextIdx === idx) return c;
      const nextCol = COLUMNS[nextIdx];
      showToast(`Moved to ${nextCol.label}`, 'info');
      logEvent(`[Kanban] "${c.title}" → ${nextCol.label}`);
      return { ...c, col: nextCol.id };
    });
  }

  function openAdd(colId = 'backlog') {
    editingId = null;
    cTitle = '';
    cTag = '2D FX';
    cPriority = 'Normal';
    cCol = colId;
    cError = '';
    modalOpen = true;
  }

  function openEdit(c) {
    editingId = c.id;
    cTitle = c.title;
    cTag = c.tag;
    cPriority = c.priority;
    cCol = c.col;
    cError = '';
    modalOpen = true;
  }

  function saveCard(e) {
    e.preventDefault();
    if (!cTitle.trim()) {
      cError = 'Judul kartu wajib diisi.';
      return;
    }
    const cleanTitle = cTitle.trim();
    const cleanTag = cTag.trim() || 'VFX';
    if (editingId !== null) {
      cards = cards.map((c) =>
        c.id === editingId ? { ...c, title: cleanTitle, tag: cleanTag, priority: cPriority, col: cCol } : c
      );
      showToast('Kanban card updated!', 'success');
    } else {
      cards = [
        { id: Date.now(), title: cleanTitle, tag: cleanTag, priority: cPriority, col: cCol, assignee: dashboard.user.initials },
        ...cards,
      ];
      showToast('Kanban card added!', 'success');
    }
    modalOpen = false;
  }

  function deleteCard(id) {
    cards = cards.filter((c) => c.id !== id);
    showToast('Card removed', 'warning');
  }
</script>

<div class="page-stack">
  <div class="card">
    <div class="kanban-toolbar">
      <div>
        <h2 class="card-title">Studio Kanban Board</h2>
        <p class="card-desc">Organize animation cuts across stages. Move cards left/right or add/edit via modal.</p>
      </div>
      <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
      <sakuga-button onclick={() => openAdd('backlog')}>+ New Card</sakuga-button>
    </div>
  </div>

  <div class="board-grid">
    {#each COLUMNS as col}
      {@const colCards = filteredCards.filter((c) => c.col === col.id)}
      <section class="card board-col">
        <div class="col-head">
          <div class="col-title-row">
            <h3 class="col-title">{col.label}</h3>
            <span class="badge mono">{colCards.length}</span>
          </div>
          <button
            type="button"
            class="pill sm-add"
            aria-label={`Add card to ${col.label}`}
            onclick={() => openAdd(col.id)}
          >
            <Icon name="plus" size={14} />
          </button>
        </div>

        <div class="col-cards">
          {#if colCards.length === 0}
            <div class="col-empty">No cards in {col.label}</div>
          {:else}
            {#each colCards as card (card.id)}
              <article class="k-card">
                <div class="k-top">
                  <span
                    class="badge"
                    class:accent={card.priority === 'Urgent'}
                    class:warn={card.priority === 'High'}
                  >
                    {card.priority}
                  </span>
                  <span class="badge mono">{card.tag}</span>
                </div>

                <h4 class="k-title">{card.title}</h4>

                <div class="k-footer">
                  <span class="mini-av">{card.assignee}</span>
                  <div class="k-acts">
                    <button
                      type="button"
                      class="k-btn"
                      aria-label="Move left"
                      disabled={col.id === 'backlog'}
                      onclick={() => moveCard(card.id, -1)}
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      class="k-btn"
                      aria-label="Move right"
                      disabled={col.id === 'done'}
                      onclick={() => moveCard(card.id, 1)}
                    >
                      →
                    </button>
                    <button type="button" class="k-btn" aria-label="Edit card" onclick={() => openEdit(card)}>
                      <Icon name="edit" size={13} />
                    </button>
                    <button type="button" class="k-btn danger-ic" aria-label="Delete card" onclick={() => deleteCard(card.id)}>
                      <Icon name="trash" size={13} />
                    </button>
                  </div>
                </div>
              </article>
            {/each}
          {/if}
        </div>
      </section>
    {/each}
  </div>
</div>

<Modal
  bind:open={modalOpen}
  title={editingId !== null ? 'Edit Kanban Card' : 'New Kanban Card'}
  subtitle="Manage shot card title, category tag, priority, and column."
>
  <form class="modal-form" onsubmit={saveCard}>
    <div class="field-group">
      <span class="field-label">Card Title *</span>
      <div class="input-full">
        <sakuga-input
          label="Card Title"
          value={cTitle}
          placeholder="e.g. Cut 22 — Lightning Arc"
          oninput={(e) => {
            cTitle = e.target.value;
            if (cError) cError = '';
          }}
        ></sakuga-input>
      </div>
      {#if cError}
        <span class="field-error">{cError}</span>
      {/if}
    </div>

    <div class="field-group">
      <span class="field-label">Tag</span>
      <div class="input-full">
        <sakuga-input
          label="Tag"
          value={cTag}
          placeholder="2D FX"
          oninput={(e) => (cTag = e.target.value)}
        ></sakuga-input>
      </div>
    </div>

    <div class="field-group">
      <span class="field-label">Priority</span>
      <sakuga-radio label="Priority" value={cPriority} onchange={(e) => (cPriority = e.target.value)}>
        <option value="Normal" selected={cPriority === 'Normal'}>Normal</option>
        <option value="High" selected={cPriority === 'High'}>High</option>
        <option value="Urgent" selected={cPriority === 'Urgent'}>Urgent</option>
      </sakuga-radio>
    </div>

    <div class="field-group">
      <span class="field-label">Column</span>
      <sakuga-radio label="Column" value={cCol} onchange={(e) => (cCol = e.target.value)}>
        {#each COLUMNS as col}
          <option value={col.id} selected={cCol === col.id}>{col.label}</option>
        {/each}
      </sakuga-radio>
    </div>

    <div class="card-footer">
      <sakuga-button type="submit">{editingId !== null ? 'Save Card' : 'Add Card'}</sakuga-button>
      <button type="button" class="pill" onclick={() => (modalOpen = false)}>Cancel</button>
    </div>
  </form>
</Modal>

<style>
  .kanban-toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .board-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px;
    align-items: start;
  }

  .board-col {
    gap: 12px;
    background: var(--surface-alt);
  }

  .col-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .col-title-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .col-title {
    font-size: 14.5px;
    font-weight: 700;
  }

  .sm-add {
    width: 28px;
    height: 28px;
    padding: 0;
  }

  .col-cards {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .col-empty {
    padding: 18px 10px;
    text-align: center;
    font-size: 12.5px;
    color: var(--mute);
    border: 1.5px dashed var(--line);
    border-radius: 12px;
  }

  .k-card {
    background: var(--surface);
    border: 1.5px solid var(--line);
    border-radius: 14px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    transition: border-color 0.15s ease;
  }

  .k-card:hover {
    border-color: var(--sk-soft, #b8b3ff);
  }

  .k-top {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .k-title {
    font-size: 13.5px;
    font-weight: 700;
    line-height: 1.35;
  }

  .k-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding-top: 6px;
    border-top: 1px solid var(--line);
  }

  .mini-av {
    width: 26px;
    height: 26px;
    border-radius: 999px;
    background: var(--chip);
    border: 1px solid var(--line);
    display: grid;
    place-items: center;
    font-size: 10.5px;
    font-weight: 800;
  }

  .k-acts {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .k-btn {
    width: 26px;
    height: 26px;
    border-radius: 8px;
    border: 1px solid var(--line);
    background: var(--surface-alt);
    color: var(--text);
    display: grid;
    place-items: center;
    cursor: pointer;
    font-size: 12px;
  }

  .k-btn:hover:not(:disabled) {
    border-color: var(--text);
  }

  .k-btn:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  .k-btn.danger-ic:hover {
    color: #e11d48;
    border-color: #e11d48;
  }

  @media (max-width: 1120px) {
    .board-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 640px) {
    .board-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
