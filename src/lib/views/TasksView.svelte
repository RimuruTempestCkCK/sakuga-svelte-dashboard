<script>
  import Icon from '../Icon.svelte';
  import Modal from '../Modal.svelte';
  import { dashboard, logEvent, showToast } from '../store.svelte.js';

  let filter = $state('all');
  let tasks = $state([
    { id: 1, title: 'Cut 01 — Impact Frame & Dust Burst', frames: '48f', status: 'rendering', progress: 0.65, done: false },
    { id: 2, title: 'Cut 07 — Katana Crescent Slash', frames: '32f', status: 'rendering', progress: 0.3, done: false },
    { id: 3, title: 'Cut 12 — Cumulus Smoke Trail', frames: '64f', status: 'completed', progress: 1, done: true },
    { id: 4, title: 'Cut 19 — Title Card ドン! Stamp', frames: '24f', status: 'completed', progress: 1, done: true },
  ]);

  // Add / Edit Shot Modal state
  let shotModalOpen = $state(false);
  let editingShotId = $state(null);
  let shotTitle = $state('');
  let shotFrames = $state('36f');
  let shotProgress = $state(20);
  let shotDone = $state(false);
  let shotError = $state('');

  // Delete Confirmation Modal state
  let deleteModalOpen = $state(false);
  let deleteShot = $state(null);

  let filteredTasks = $derived.by(() => {
    const q = dashboard.searchQuery.trim().toLowerCase();
    return tasks.filter((t) => {
      if (filter === 'rendering' && t.done) return false;
      if (filter === 'completed' && !t.done) return false;
      if (q && !t.title.toLowerCase().includes(q)) return false;
      return true;
    });
  });

  function resetFilters() {
    filter = 'all';
    dashboard.searchQuery = '';
  }

  function toggleTask(id, checked) {
    tasks = tasks.map((t) =>
      t.id === id ? { ...t, done: checked, status: checked ? 'completed' : 'rendering', progress: checked ? 1 : 0.5 } : t
    );
    logEvent(`Task #${id} marked ${checked ? 'completed' : 'rendering'}`);
  }

  function boostTask(id) {
    tasks = tasks.map((t) => {
      if (t.id !== id) return t;
      const next = Math.min(1, +(t.progress + 0.35).toFixed(2));
      const done = next >= 1;
      if (done) showToast(`Completed: ${t.title}`);
      return { ...t, progress: next, done, status: done ? 'completed' : 'rendering' };
    });
  }

  function openAddShot() {
    editingShotId = null;
    shotTitle = '';
    shotFrames = '36f';
    shotProgress = 15;
    shotDone = false;
    shotError = '';
    shotModalOpen = true;
  }

  function openEditShot(t) {
    editingShotId = t.id;
    shotTitle = t.title;
    shotFrames = t.frames;
    shotProgress = Math.round(t.progress * 100);
    shotDone = t.done;
    shotError = '';
    shotModalOpen = true;
  }

  function saveShot(e) {
    e.preventDefault();
    if (!shotTitle.trim()) {
      shotError = 'Shot title wajib diisi.';
      return;
    }
    const cleanTitle = shotTitle.trim();
    const cleanFrames = shotFrames.trim() || '24f';
    const prog = shotDone ? 1 : Math.min(1, Math.max(0, Number(shotProgress) / 100));

    if (editingShotId !== null) {
      tasks = tasks.map((t) =>
        t.id === editingShotId
          ? { ...t, title: cleanTitle, frames: cleanFrames, progress: prog, done: shotDone || prog >= 1, status: shotDone || prog >= 1 ? 'completed' : 'rendering' }
          : t
      );
      logEvent(`Updated shot #${editingShotId}: ${cleanTitle}`);
      showToast('Shot updated!');
    } else {
      const newId = Date.now();
      tasks = [
        { id: newId, title: cleanTitle, frames: cleanFrames, progress: prog, done: shotDone || prog >= 1, status: shotDone || prog >= 1 ? 'completed' : 'rendering' },
        ...tasks,
      ];
      logEvent(`Added shot: ${cleanTitle}`);
      showToast('ドン! Shot added to queue!');
    }
    shotModalOpen = false;
  }

  function askDeleteShot(t) {
    deleteShot = t;
    deleteModalOpen = true;
  }

  function confirmDeleteShot() {
    if (!deleteShot) return;
    tasks = tasks.filter((t) => t.id !== deleteShot.id);
    logEvent(`Deleted shot: ${deleteShot.title}`);
    showToast('Shot removed from queue');
    deleteModalOpen = false;
    deleteShot = null;
  }
</script>

<div class="page-stack">
  <div class="card">
    <div class="toolbar-row">
      <div>
        <h2 class="card-title">Animation Render Queue</h2>
        <p class="card-desc">Add, edit, or delete shots in a modal pop-up, filter with tabs, or boost render progress.</p>
      </div>

      <div class="toolbar-actions">
        <sakuga-tabs
          label="Filter queue"
          onchange={(e) => (filter = e.detail?.value || 'all')}
        >
          <option value="all" selected={filter === 'all'}>All ({tasks.length})</option>
          <option value="rendering" selected={filter === 'rendering'}>Rendering</option>
          <option value="completed" selected={filter === 'completed'}>Completed</option>
        </sakuga-tabs>

        <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
        <sakuga-button onclick={openAddShot}>+ Add Shot</sakuga-button>
      </div>
    </div>
  </div>

  {#if filteredTasks.length === 0}
    <div class="card">
      <div class="empty-state">
        <div class="empty-icon"><Icon name="search" size={20} /></div>
        <div class="empty-title">Tidak ada data yang ditemukan</div>
        <p class="empty-desc">Tidak ada shot di antrean yang cocok dengan filter atau pencarian Anda.</p>
        <button type="button" class="pill" onclick={resetFilters}>Reset Filter</button>
      </div>
    </div>
  {:else}
    <div class="task-list">
      {#each filteredTasks as task (task.id)}
        <div class="card task-card">
          <div class="task-main">
            <sakuga-checkbox
              checked={task.done}
              onchange={(e) => toggleTask(task.id, e.target.checked)}
            >
              {task.title}
            </sakuga-checkbox>

            <div class="task-meta">
              <span class="badge mono">{task.frames}</span>
              <span class="badge" class:accent={!task.done} class:success={task.done}>
                {task.done ? 'Done' : `${Math.round(task.progress * 100)}%`}
              </span>
              <button type="button" class="pill" onclick={() => openEditShot(task)}>
                <Icon name="edit" size={14} />
                <span>Edit</span>
              </button>
              <button
                type="button"
                class="pill danger"
                aria-label={`Delete ${task.title}`}
                onclick={() => askDeleteShot(task)}
              >
                <Icon name="trash" size={14} />
              </button>
            </div>
          </div>

          <div class="task-footer">
            <div class="bar-track" aria-hidden="true">
              <div class="bar-fill" style="width: {task.progress * 100}%"></div>
            </div>
            {#if !task.done}
              <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
              <sakuga-button variant="secondary" onclick={() => boostTask(task.id)}>
                Boost +35%
              </sakuga-button>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<Modal
  bind:open={shotModalOpen}
  title={editingShotId !== null ? 'Edit Animation Shot' : 'Add Animation Shot'}
  subtitle="Configure shot name, frame count, and current progress."
>
  <form class="modal-form" onsubmit={saveShot}>
    <div class="field-group">
      <span class="field-label">Shot Title *</span>
      <div class="input-full">
        <sakuga-input
          label="Shot Title"
          value={shotTitle}
          placeholder="e.g. Cut 24 — Energy Charge"
          oninput={(e) => {
            shotTitle = e.target.value;
            if (shotError) shotError = '';
          }}
        ></sakuga-input>
      </div>
      {#if shotError}
        <span class="field-error">{shotError}</span>
      {/if}
    </div>

    <div class="field-group">
      <span class="field-label">Frame Count</span>
      <div class="input-full">
        <sakuga-input
          label="Frame Count"
          value={shotFrames}
          placeholder="36f"
          oninput={(e) => (shotFrames = e.target.value)}
        ></sakuga-input>
      </div>
    </div>

    <div class="field-group slider-field">
      <span class="field-label">Render Progress ({shotProgress}%)</span>
      <sakuga-slider
        label="Render Progress"
        value={shotProgress}
        oninput={(e) => (shotProgress = Number(e.target.value))}
      ></sakuga-slider>
    </div>

    <sakuga-checkbox
      checked={shotDone}
      onchange={(e) => (shotDone = e.target.checked)}
    >
      Mark shot as completed
    </sakuga-checkbox>

    <div class="card-footer">
      <sakuga-button type="submit">{editingShotId !== null ? 'Save Shot' : 'Add to Queue'}</sakuga-button>
      <button type="button" class="pill" onclick={() => (shotModalOpen = false)}>Cancel</button>
    </div>
  </form>
</Modal>

<Modal
  bind:open={deleteModalOpen}
  title="Confirm Delete Shot"
  subtitle="This action removes the shot from the render queue."
>
  <p class="confirm-text">
    Apakah Anda yakin ingin menghapus <strong>{deleteShot?.title}</strong>?
  </p>
  <div class="card-footer">
    <button type="button" class="pill danger-solid" onclick={confirmDeleteShot}>Delete</button>
    <button type="button" class="pill" onclick={() => (deleteModalOpen = false)}>Cancel</button>
  </div>
</Modal>

<style>
  .toolbar-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .toolbar-actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
  }

  .task-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .task-card {
    gap: 12px;
  }

  .task-main {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }

  .task-meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
  }

  .task-footer {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 14px;
  }

  .bar-track {
    flex: 1;
    min-width: 180px;
    height: 10px;
    border-radius: 999px;
    background: var(--chip);
    border: 1.5px solid var(--line);
    overflow: hidden;
  }

  .bar-fill {
    height: 100%;
    background: var(--sk-acc, #ff5fa8);
    transition: width 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  .slider-field {
    --sk-slider-width: 100%;
    padding-top: 8px;
  }

  .confirm-text {
    font-size: 14px;
    line-height: 1.5;
  }
</style>
