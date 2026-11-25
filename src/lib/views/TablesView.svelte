<script>
  import Icon from '../Icon.svelte';
  import Modal from '../Modal.svelte';
  import { dashboard, showToast, logEvent } from '../store.svelte.js';

  let statusFilter = $state('all');
  let clientFilter = $state('all');
  let sortBy = $state('id');
  let sortAsc = $state(true);
  let currentPage = $state(1);
  let pageSize = $state(5);
  let rowDensity = $state('comfortable'); // 'comfortable' | 'compact'
  let columnsMenuOpen = $state(false);

  let visibleCols = $state({
    id: true,
    name: true,
    client: true,
    status: true,
    progress: true,
    budget: true,
  });

  const COL_LABELS = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Project' },
    { key: 'client', label: 'Client' },
    { key: 'status', label: 'Status' },
    { key: 'progress', label: 'Progress' },
    { key: 'budget', label: 'Budget' },
  ];

  let projects = $state([
    { id: 'INV-1042', name: 'Mecha Opening Cut 01', client: 'Studio Triggered', status: 'Completed', progress: 100, budget: '$4,200', selected: false },
    { id: 'INV-1043', name: 'Katana Slash VFX Pack', client: 'A-10 Pictures', status: 'In Progress', progress: 68, budget: '$2,850', selected: true },
    { id: 'INV-1044', name: 'Sakura Petal Compositing', client: 'Kyoto Works', status: 'Review', progress: 90, budget: '$3,100', selected: false },
    { id: 'INV-1045', name: 'Boss Impact Frame 4K', client: 'Mappa Lab', status: 'In Progress', progress: 42, budget: '$5,400', selected: false },
    { id: 'INV-1046', name: 'UI Sound Lettering Set', client: 'Indigo Games', status: 'Completed', progress: 100, budget: '$1,950', selected: false },
    { id: 'INV-1047', name: 'Lightning Aura Loop', client: 'Ufotable Digital', status: 'In Progress', progress: 55, budget: '$3,600', selected: false },
    { id: 'INV-1048', name: 'Title Card Smear Pack', client: 'Bones Studio', status: 'Review', progress: 85, budget: '$2,400', selected: false },
    { id: 'INV-1049', name: 'Episode 12 Ending FX', client: 'CloverLab', status: 'Completed', progress: 100, budget: '$4,800', selected: false },
  ]);

  let team = $state([
    { id: 1, name: 'Akira Takahashi', email: 'akira@sakuga.studio', role: 'Lead Animator', active: true, rating: 5 },
    { id: 2, name: 'Yui Sato', email: 'yui@sakuga.studio', role: 'FX Compositor', active: true, rating: 5 },
    { id: 3, name: 'Kenji Mori', email: 'kenji@sakuga.studio', role: 'Keyframer', active: false, rating: 4 },
    { id: 4, name: 'Hana Kobayashi', email: 'hana@sakuga.studio', role: 'Colorist', active: true, rating: 5 },
  ]);

  // Project Add/Edit Modal state
  let projectModalOpen = $state(false);
  let editingProjectId = $state(null);
  let pName = $state('');
  let pClient = $state('');
  let pStatus = $state('In Progress');
  let pProgress = $state(50);
  let pBudget = $state('$3,000');
  let pError = $state('');

  // Member Add/Edit Modal state
  let memberModalOpen = $state(false);
  let editingMemberId = $state(null);
  let mName = $state('');
  let mEmail = $state('');
  let mRole = $state('Keyframer');
  let mActive = $state(true);
  let mRating = $state(5);
  let mError = $state('');

  // Delete Confirmation Modal state
  let deleteModalOpen = $state(false);
  let deleteTarget = $state(null);

  let uniqueClients = $derived([...new Set(projects.map((p) => p.client))].sort());

  function parseBudget(b) {
    return Number(String(b).replace(/[^0-9.-]/g, '')) || 0;
  }

  let filteredProjects = $derived.by(() => {
    const q = dashboard.searchQuery.trim().toLowerCase();
    const list = projects.filter((p) => {
      if (statusFilter !== 'all' && p.status.toLowerCase() !== statusFilter) return false;
      if (clientFilter !== 'all' && p.client !== clientFilter) return false;
      if (q && !p.name.toLowerCase().includes(q) && !p.client.toLowerCase().includes(q) && !p.id.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
    return [...list].sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'progress') cmp = a.progress - b.progress;
      else if (sortBy === 'budget') cmp = parseBudget(a.budget) - parseBudget(b.budget);
      else cmp = String(a[sortBy] ?? '').localeCompare(String(b[sortBy] ?? ''));
      return sortAsc ? cmp : -cmp;
    });
  });

  let totalPages = $derived(Math.max(1, Math.ceil(filteredProjects.length / pageSize)));

  let lastSearch = $state(dashboard.searchQuery);
  $effect(() => {
    if (dashboard.searchQuery !== lastSearch) {
      lastSearch = dashboard.searchQuery;
      currentPage = 1;
    }
    if (currentPage > totalPages) {
      currentPage = totalPages;
    }
  });

  let pagedProjects = $derived.by(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProjects.slice(start, start + pageSize);
  });

  let filteredTeam = $derived.by(() => {
    const q = dashboard.searchQuery.trim().toLowerCase();
    if (!q) return team;
    return team.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q)
    );
  });

  function toggleSort(col) {
    if (sortBy === col) {
      sortAsc = !sortAsc;
    } else {
      sortBy = col;
      sortAsc = true;
    }
  }

  function resetTablePrefs() {
    statusFilter = 'all';
    clientFilter = 'all';
    sortBy = 'id';
    sortAsc = true;
    pageSize = 5;
    currentPage = 1;
    rowDensity = 'comfortable';
    dashboard.searchQuery = '';
    visibleCols = { id: true, name: true, client: true, status: true, progress: true, budget: true };
    showToast('Table preferences reset', 'info');
  }

  function csvCell(value) {
    const s = String(value ?? '');
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  }

  function exportTableCsv() {
    if (!filteredProjects.length) {
      showToast('Tidak ada data untuk diexport', 'warning');
      return;
    }
    try {
      const header = 'ID,Project,Client,Status,Progress,Budget';
      const rows = filteredProjects.map((p) =>
        [p.id, p.name, p.client, p.status, `${p.progress}%`, p.budget].map(csvCell).join(',')
      );
      const csv = [header, ...rows].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sakuga-projects-table.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      logEvent(`Exported sakuga-projects-table.csv (${rows.length} rows)`);
      showToast(`Downloaded sakuga-projects-table.csv`, 'success');
    } catch {
      showToast('Gagal mengexport CSV', 'error');
    }
  }

  function toggleSelect(id, checked) {
    projects = projects.map((p) => (p.id === id ? { ...p, selected: checked } : p));
  }

  function openNewProject() {
    editingProjectId = null;
    pName = '';
    pClient = '';
    pStatus = 'In Progress';
    pProgress = 25;
    pBudget = '$2,500';
    pError = '';
    projectModalOpen = true;
  }

  function openEditProject(p) {
    editingProjectId = p.id;
    pName = p.name;
    pClient = p.client;
    pStatus = p.status;
    pProgress = p.progress;
    pBudget = p.budget;
    pError = '';
    projectModalOpen = true;
  }

  function saveProject(e) {
    e.preventDefault();
    if (!pName.trim()) {
      pError = 'Project name wajib diisi.';
      return;
    }
    const cleanName = pName.trim();
    const cleanClient = pClient.trim() || 'Internal Studio';
    const cleanBudget = pBudget.trim() || '$1,000';
    const finalProgress = pStatus === 'Completed' ? 100 : Number(pProgress);

    if (editingProjectId) {
      projects = projects.map((p) =>
        p.id === editingProjectId
          ? { ...p, name: cleanName, client: cleanClient, status: pStatus, progress: finalProgress, budget: cleanBudget }
          : p
      );
      logEvent(`Updated project ${editingProjectId}`);
      showToast(`Updated ${editingProjectId}!`, 'success');
    } else {
      const maxNum = projects.reduce((m, p) => Math.max(m, Number(p.id.replace('INV-', '')) || 1042), 1042);
      const newId = `INV-${maxNum + 1}`;
      projects = [
        { id: newId, name: cleanName, client: cleanClient, status: pStatus, progress: finalProgress, budget: cleanBudget, selected: false },
        ...projects,
      ];
      currentPage = 1;
      logEvent(`Added project ${newId}: ${cleanName}`);
      showToast(`ドン! Added ${newId}`, 'success');
    }
    projectModalOpen = false;
  }

  function openNewMember() {
    editingMemberId = null;
    mName = '';
    mEmail = '';
    mRole = 'Keyframer';
    mActive = true;
    mRating = 5;
    mError = '';
    memberModalOpen = true;
  }

  function openEditMember(m) {
    editingMemberId = m.id;
    mName = m.name;
    mEmail = m.email;
    mRole = m.role;
    mActive = m.active;
    mRating = m.rating;
    mError = '';
    memberModalOpen = true;
  }

  function saveMember(e) {
    e.preventDefault();
    if (!mName.trim()) {
      mError = 'Nama anggota wajib diisi.';
      return;
    }
    const cleanName = mName.trim();
    const cleanEmail = mEmail.trim() || 'member@sakuga.studio';

    if (editingMemberId !== null) {
      team = team.map((m) =>
        m.id === editingMemberId
          ? { ...m, name: cleanName, email: cleanEmail, role: mRole, active: mActive, rating: Number(mRating) }
          : m
      );
      logEvent(`Updated member ${cleanName}`);
      showToast(`Updated ${cleanName}`, 'success');
    } else {
      const newId = Date.now();
      team = [
        { id: newId, name: cleanName, email: cleanEmail, role: mRole, active: mActive, rating: Number(mRating) },
        ...team,
      ];
      logEvent(`Added team member ${cleanName}`);
      showToast(`ズザッ! Added ${cleanName}`, 'success');
    }
    memberModalOpen = false;
  }

  function askDelete(type, id, label) {
    deleteTarget = { type, id, label };
    deleteModalOpen = true;
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'project') {
      projects = projects.filter((p) => p.id !== deleteTarget.id);
      logEvent(`Deleted project ${deleteTarget.label}`);
      showToast(`Deleted ${deleteTarget.id}`, 'warning');
    } else if (deleteTarget.type === 'member') {
      team = team.filter((m) => m.id !== deleteTarget.id);
      logEvent(`Removed member ${deleteTarget.label}`);
      showToast(`Removed ${deleteTarget.label}`, 'warning');
    }
    deleteModalOpen = false;
    deleteTarget = null;
  }
</script>

<div class="page-stack">
  <section class="card table-card">
    <div class="table-header">
      <div>
        <h2 class="card-title">Projects & Invoices</h2>
        <p class="card-desc">Add, edit, delete, toggle columns, filter by status/client, sort, and export CSV.</p>
      </div>

      <div class="table-controls">
        <sakuga-tabs
          label="Project status filter"
          onchange={(e) => {
            statusFilter = (e.detail?.value || 'all').toLowerCase();
            currentPage = 1;
          }}
        >
          <option value="all" selected={statusFilter === 'all'}>All</option>
          <option value="in progress" selected={statusFilter === 'in progress'}>In Progress</option>
          <option value="review" selected={statusFilter === 'review'}>Review</option>
          <option value="completed" selected={statusFilter === 'completed'}>Completed</option>
        </sakuga-tabs>

        <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
        <sakuga-button onclick={openNewProject}>+ New Project</sakuga-button>
      </div>
    </div>

    <!-- Advanced Table Toolbar -->
    <div class="adv-toolbar">
      <div class="toolbar-group">
        <select
          class="page-select"
          aria-label="Filter by client"
          value={clientFilter}
          onchange={(e) => {
            clientFilter = e.target.value;
            currentPage = 1;
          }}
        >
          <option value="all">All Clients</option>
          {#each uniqueClients as c}
            <option value={c}>{c}</option>
          {/each}
        </select>

        <button
          type="button"
          class="pill"
          onclick={() => (rowDensity = rowDensity === 'comfortable' ? 'compact' : 'comfortable')}
        >
          Density: {rowDensity === 'compact' ? 'Compact' : 'Normal'}
        </button>

        <button
          type="button"
          class="pill"
          aria-expanded={columnsMenuOpen}
          onclick={() => (columnsMenuOpen = !columnsMenuOpen)}
        >
          Columns
        </button>
      </div>

      <div class="toolbar-group">
        <button type="button" class="pill" onclick={exportTableCsv}>Export CSV</button>
        <button type="button" class="pill" onclick={resetTablePrefs}>Reset Prefs</button>
      </div>
    </div>

    {#if columnsMenuOpen}
      <div class="col-picker" role="group" aria-label="Column visibility">
        {#each COL_LABELS as col}
          <button
            type="button"
            class="pill sm-pill"
            class:col-active={visibleCols[col.key]}
            onclick={() => (visibleCols = { ...visibleCols, [col.key]: !visibleCols[col.key] })}
          >
            {visibleCols[col.key] ? '✓' : '+'} {col.label}
          </button>
        {/each}
      </div>
    {/if}

    {#if pagedProjects.length === 0}
      <div class="empty-state">
        <div class="empty-icon"><Icon name="search" size={20} /></div>
        <div class="empty-title">Tidak ada data yang ditemukan</div>
        <p class="empty-desc">Coba ubah kata kunci pencarian atau reset filter tabel.</p>
        <button type="button" class="pill" onclick={resetTablePrefs}>Reset Filter</button>
      </div>
    {:else}
      <div class="table-scroll">
        <table class="data-table" class:dense={rowDensity === 'compact'}>
          <thead>
            <tr>
              <th>Pick</th>
              {#if visibleCols.id}
                <th><button type="button" class="th-sort" onclick={() => toggleSort('id')}>ID {sortBy === 'id' ? (sortAsc ? '↑' : '↓') : ''}</button></th>
              {/if}
              {#if visibleCols.name}
                <th><button type="button" class="th-sort" onclick={() => toggleSort('name')}>Project {sortBy === 'name' ? (sortAsc ? '↑' : '↓') : ''}</button></th>
              {/if}
              {#if visibleCols.client}
                <th><button type="button" class="th-sort" onclick={() => toggleSort('client')}>Client {sortBy === 'client' ? (sortAsc ? '↑' : '↓') : ''}</button></th>
              {/if}
              {#if visibleCols.status}
                <th><button type="button" class="th-sort" onclick={() => toggleSort('status')}>Status {sortBy === 'status' ? (sortAsc ? '↑' : '↓') : ''}</button></th>
              {/if}
              {#if visibleCols.progress}
                <th><button type="button" class="th-sort" onclick={() => toggleSort('progress')}>Progress {sortBy === 'progress' ? (sortAsc ? '↑' : '↓') : ''}</button></th>
              {/if}
              {#if visibleCols.budget}
                <th><button type="button" class="th-sort" onclick={() => toggleSort('budget')}>Budget {sortBy === 'budget' ? (sortAsc ? '↑' : '↓') : ''}</button></th>
              {/if}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {#each pagedProjects as p (p.id)}
              <tr>
                <td>
                  <sakuga-checkbox
                    checked={p.selected}
                    onchange={(e) => toggleSelect(p.id, e.target.checked)}
                  ></sakuga-checkbox>
                </td>
                {#if visibleCols.id}
                  <td class="mono">{p.id}</td>
                {/if}
                {#if visibleCols.name}
                  <td><strong>{p.name}</strong></td>
                {/if}
                {#if visibleCols.client}
                  <td class="muted">{p.client}</td>
                {/if}
                {#if visibleCols.status}
                  <td>
                    <span
                      class="badge"
                      class:success={p.status === 'Completed'}
                      class:accent={p.status === 'In Progress'}
                      class:warn={p.status === 'Review'}
                    >
                      {p.status}
                    </span>
                  </td>
                {/if}
                {#if visibleCols.progress}
                  <td>
                    <div class="mini-progress">
                      <div class="mini-track"><div class="mini-fill" style="width: {p.progress}%"></div></div>
                      <span class="mono">{p.progress}%</span>
                    </div>
                  </td>
                {/if}
                {#if visibleCols.budget}
                  <td class="mono"><strong>{p.budget}</strong></td>
                {/if}
                <td>
                  <div class="row-actions">
                    <button type="button" class="pill" onclick={() => openEditProject(p)}>
                      <Icon name="edit" size={14} />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      class="pill danger"
                      aria-label={`Delete ${p.id}`}
                      onclick={() => askDelete('project', p.id, `${p.id} — ${p.name}`)}
                    >
                      <Icon name="trash" size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>

      <div class="pagination-bar">
        <div class="page-size-wrap">
          <span>Rows:</span>
          <select
            class="page-select"
            aria-label="Rows per page"
            value={pageSize}
            onchange={(e) => {
              pageSize = Number(e.target.value);
              currentPage = 1;
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span class="muted-xs">({filteredProjects.length} total)</span>
        </div>

        <div class="page-nav">
          <button
            type="button"
            class="pill"
            disabled={currentPage <= 1}
            onclick={() => (currentPage = Math.max(1, currentPage - 1))}
          >
            Previous
          </button>
          <span class="badge mono">Page {currentPage} / {totalPages}</span>
          <button
            type="button"
            class="pill"
            disabled={currentPage >= totalPages}
            onclick={() => (currentPage = Math.min(totalPages, currentPage + 1))}
          >
            Next
          </button>
        </div>
      </div>
    {/if}
  </section>

  <section class="card table-card">
    <div class="table-header">
      <div>
        <h2 class="card-title">Studio Team & Roles</h2>
        <p class="card-desc">Add, edit, or remove studio members via modal pop-up, toggle status, and rate.</p>
      </div>
      <div class="table-controls">
        <span class="badge">{team.filter((m) => m.active).length} Active</span>
        <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
        <sakuga-button variant="secondary" onclick={openNewMember}>+ Add Member</sakuga-button>
      </div>
    </div>

    {#if filteredTeam.length === 0}
      <div class="empty-state">
        <div class="empty-icon"><Icon name="search" size={20} /></div>
        <div class="empty-title">Tidak ada data yang ditemukan</div>
        <p class="empty-desc">Tidak ada anggota tim yang cocok dengan pencarian Anda.</p>
        <button type="button" class="pill" onclick={resetTablePrefs}>Reset Filter</button>
      </div>
    {:else}
      <div class="table-scroll">
        <table class="data-table" class:dense={rowDensity === 'compact'}>
          <thead>
            <tr>
              <th>Member</th>
              <th>Role</th>
              <th>Active Status</th>
              <th>Performance</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {#each filteredTeam as member (member.id)}
              <tr>
                <td>
                  <div class="member-cell">
                    <span class="mini-avatar">{member.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}</span>
                    <div>
                      <strong>{member.name}</strong>
                      <div class="muted-xs">{member.email}</div>
                    </div>
                  </div>
                </td>
                <td><span class="badge">{member.role}</span></td>
                <td>
                  <sakuga-toggle
                    label={`${member.name} active`}
                    checked={member.active}
                    onchange={(e) => {
                      member.active = e.target.checked;
                      showToast(`${member.name}: ${member.active ? 'Active' : 'Paused'}`);
                    }}
                  ></sakuga-toggle>
                </td>
                <td>
                  <sakuga-rating
                    label={`${member.name} rating`}
                    value={member.rating}
                    onchange={(e) => (member.rating = Number(e.target.value))}
                  ></sakuga-rating>
                </td>
                <td>
                  <div class="row-actions">
                    <button type="button" class="pill" onclick={() => openEditMember(member)}>
                      <Icon name="edit" size={14} />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      class="pill danger"
                      aria-label={`Remove ${member.name}`}
                      onclick={() => askDelete('member', member.id, member.name)}
                    >
                      <Icon name="trash" size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </section>
</div>

<!-- Project Create / Edit Modal -->
<Modal
  bind:open={projectModalOpen}
  title={editingProjectId ? `Edit ${editingProjectId}` : 'New Project'}
  subtitle="Fill in the project details below and save."
>
  <form class="modal-form" onsubmit={saveProject}>
    <div class="field-group">
      <span class="field-label">Project Name *</span>
      <div class="input-full">
        <sakuga-input
          label="Project Name"
          value={pName}
          placeholder="e.g. Mecha Transformation Cut"
          oninput={(e) => {
            pName = e.target.value;
            if (pError) pError = '';
          }}
        ></sakuga-input>
      </div>
      {#if pError}
        <span class="field-error">{pError}</span>
      {/if}
    </div>

    <div class="field-row">
      <div class="field-group flex-1">
        <span class="field-label">Client / Studio</span>
        <div class="input-full">
          <sakuga-input
            label="Client"
            value={pClient}
            placeholder="e.g. Kyoto Works"
            oninput={(e) => (pClient = e.target.value)}
          ></sakuga-input>
        </div>
      </div>

      <div class="field-group flex-1">
        <span class="field-label">Budget</span>
        <div class="input-full">
          <sakuga-input
            label="Budget"
            value={pBudget}
            placeholder="$3,000"
            oninput={(e) => (pBudget = e.target.value)}
          ></sakuga-input>
        </div>
      </div>
    </div>

    <div class="field-group">
      <span class="field-label">Status</span>
      <sakuga-radio
        label="Project Status"
        value={pStatus}
        onchange={(e) => (pStatus = e.target.value)}
      >
        <option value="In Progress" selected={pStatus === 'In Progress'}>In Progress</option>
        <option value="Review" selected={pStatus === 'Review'}>Review</option>
        <option value="Completed" selected={pStatus === 'Completed'}>Completed</option>
      </sakuga-radio>
    </div>

    <div class="field-group slider-field">
      <span class="field-label">Progress ({pProgress}%)</span>
      <sakuga-slider
        label="Progress"
        value={pProgress}
        oninput={(e) => (pProgress = Number(e.target.value))}
      ></sakuga-slider>
    </div>

    <div class="card-footer">
      <sakuga-button type="submit">{editingProjectId ? 'Save Changes' : 'Create Project'}</sakuga-button>
      <button type="button" class="pill" onclick={() => (projectModalOpen = false)}>Cancel</button>
    </div>
  </form>
</Modal>

<!-- Team Member Create / Edit Modal -->
<Modal
  bind:open={memberModalOpen}
  title={editingMemberId !== null ? 'Edit Team Member' : 'Add Team Member'}
  subtitle="Manage animator profile, role, and active status."
>
  <form class="modal-form" onsubmit={saveMember}>
    <div class="field-group">
      <span class="field-label">Full Name *</span>
      <div class="input-full">
        <sakuga-input
          label="Full Name"
          value={mName}
          placeholder="e.g. Renji Tanaka"
          oninput={(e) => {
            mName = e.target.value;
            if (mError) mError = '';
          }}
        ></sakuga-input>
      </div>
      {#if mError}
        <span class="field-error">{mError}</span>
      {/if}
    </div>

    <div class="field-group">
      <span class="field-label">Email Address</span>
      <div class="input-full">
        <sakuga-input
          type="email"
          label="Email Address"
          value={mEmail}
          placeholder="renji@sakuga.studio"
          oninput={(e) => (mEmail = e.target.value)}
        ></sakuga-input>
      </div>
    </div>

    <div class="field-group">
      <span class="field-label">Role</span>
      <sakuga-radio
        label="Member Role"
        value={mRole}
        onchange={(e) => (mRole = e.target.value)}
      >
        <option value="Lead Animator" selected={mRole === 'Lead Animator'}>Lead Animator</option>
        <option value="FX Compositor" selected={mRole === 'FX Compositor'}>FX Compositor</option>
        <option value="Keyframer" selected={mRole === 'Keyframer'}>Keyframer</option>
        <option value="Colorist" selected={mRole === 'Colorist'}>Colorist</option>
      </sakuga-radio>
    </div>

    <div class="field-row align-center">
      <sakuga-toggle
        label="Active Member"
        checked={mActive}
        onchange={(e) => (mActive = e.target.checked)}
      ></sakuga-toggle>

      <sakuga-rating
        label="Performance Rating"
        value={mRating}
        onchange={(e) => (mRating = Number(e.target.value))}
      ></sakuga-rating>
    </div>

    <div class="card-footer">
      <sakuga-button type="submit">{editingMemberId !== null ? 'Update Member' : 'Add Member'}</sakuga-button>
      <button type="button" class="pill" onclick={() => (memberModalOpen = false)}>Cancel</button>
    </div>
  </form>
</Modal>

<!-- Delete Confirmation Modal -->
<Modal
  bind:open={deleteModalOpen}
  title="Confirm Delete"
  subtitle="This action removes the selected item from the current session."
>
  <p class="confirm-text">
    Apakah Anda yakin ingin menghapus <strong>{deleteTarget?.label}</strong>?
  </p>
  <div class="card-footer">
    <button type="button" class="pill danger-solid" onclick={confirmDelete}>Delete</button>
    <button type="button" class="pill" onclick={() => (deleteModalOpen = false)}>Cancel</button>
  </div>
</Modal>

<style>
  .table-card {
    gap: 12px;
  }

  .table-header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .table-controls {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
  }

  .adv-toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 12px;
    background: var(--surface-alt);
    border: 1px solid var(--line);
  }

  .toolbar-group {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
  }

  .col-picker {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .sm-pill {
    height: 28px;
    padding: 0 10px;
    font-size: 12px;
  }

  .col-active {
    border-color: var(--sk-soft, #b8b3ff);
    background: var(--surface-alt);
  }

  .th-sort {
    background: none;
    border: none;
    padding: 0;
    font: inherit;
    color: inherit;
    text-transform: inherit;
    letter-spacing: inherit;
    cursor: pointer;
  }

  .th-sort:hover {
    color: var(--text);
  }

  .data-table.dense :global(td) {
    padding: 6px 10px;
    font-size: 12.5px;
  }

  .muted {
    color: var(--mute);
  }

  .muted-xs {
    font-size: 12px;
    color: var(--mute);
  }

  .mini-progress {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 120px;
  }

  .mini-track {
    flex: 1;
    height: 8px;
    border-radius: 999px;
    background: var(--chip);
    border: 1px solid var(--line);
    overflow: hidden;
  }

  .mini-fill {
    height: 100%;
    background: var(--sk-pri, #8f8df7);
  }

  .member-cell {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .mini-avatar {
    width: 34px;
    height: 34px;
    border-radius: 999px;
    background: var(--chip);
    border: 1.5px solid var(--line);
    display: grid;
    place-items: center;
    font-size: 12px;
    font-weight: 800;
    flex-shrink: 0;
  }

  .row-actions {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .pagination-bar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding-top: 12px;
    border-top: 1.5px solid var(--line);
  }

  .page-size-wrap,
  .page-nav {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
  }

  .page-select {
    height: 32px;
    padding: 0 8px;
    border-radius: 10px;
    border: 1.5px solid var(--line);
    background: var(--surface);
    color: var(--text);
    font: inherit;
    font-size: 12.5px;
    font-weight: 600;
  }

  .pill:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  .field-row {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  .align-center {
    align-items: center;
    justify-content: space-between;
  }

  .flex-1 {
    flex: 1 1 180px;
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
