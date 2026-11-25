<script>
  import Icon from '../Icon.svelte';
  import Modal from '../Modal.svelte';
  import { dashboard, showToast, logEvent } from '../store.svelte.js';

  let statusFilter = $state('all');
  let sortAsc = $state(true);

  let projects = $state([
    { id: 'INV-1042', name: 'Mecha Opening Cut 01', client: 'Studio Triggered', status: 'Completed', progress: 100, budget: '$4,200', selected: false },
    { id: 'INV-1043', name: 'Katana Slash VFX Pack', client: 'A-10 Pictures', status: 'In Progress', progress: 68, budget: '$2,850', selected: true },
    { id: 'INV-1044', name: 'Sakura Petal Compositing', client: 'Kyoto Works', status: 'Review', progress: 90, budget: '$3,100', selected: false },
    { id: 'INV-1045', name: 'Boss Impact Frame 4K', client: 'Mappa Lab', status: 'In Progress', progress: 42, budget: '$5,400', selected: false },
    { id: 'INV-1046', name: 'UI Sound Lettering Set', client: 'Indigo Games', status: 'Completed', progress: 100, budget: '$1,950', selected: false },
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

  // Member Add/Edit Modal state
  let memberModalOpen = $state(false);
  let editingMemberId = $state(null);
  let mName = $state('');
  let mEmail = $state('');
  let mRole = $state('Keyframer');
  let mActive = $state(true);
  let mRating = $state(5);

  let filteredProjects = $derived.by(() => {
    const q = dashboard.searchQuery.trim().toLowerCase();
    const list = projects.filter((p) => {
      if (statusFilter !== 'all' && p.status.toLowerCase() !== statusFilter) return false;
      if (q && !p.name.toLowerCase().includes(q) && !p.client.toLowerCase().includes(q) && !p.id.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
    return [...list].sort((a, b) => (sortAsc ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id)));
  });

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
    projectModalOpen = true;
  }

  function openEditProject(p) {
    editingProjectId = p.id;
    pName = p.name;
    pClient = p.client;
    pStatus = p.status;
    pProgress = p.progress;
    pBudget = p.budget;
    projectModalOpen = true;
  }

  function saveProject(e) {
    e.preventDefault();
    const cleanName = pName.trim() || 'Untitled Shot Project';
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
      showToast(`Updated ${editingProjectId}!`);
    } else {
      const nextNum = 1042 + projects.length;
      const newId = `INV-${nextNum}`;
      projects = [
        { id: newId, name: cleanName, client: cleanClient, status: pStatus, progress: finalProgress, budget: cleanBudget, selected: false },
        ...projects,
      ];
      logEvent(`Added project ${newId}: ${cleanName}`);
      showToast(`ドン! Added ${newId}`);
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
    memberModalOpen = true;
  }

  function openEditMember(m) {
    editingMemberId = m.id;
    mName = m.name;
    mEmail = m.email;
    mRole = m.role;
    mActive = m.active;
    mRating = m.rating;
    memberModalOpen = true;
  }

  function saveMember(e) {
    e.preventDefault();
    const cleanName = mName.trim() || 'New Animator';
    const cleanEmail = mEmail.trim() || 'member@sakuga.studio';

    if (editingMemberId !== null) {
      team = team.map((m) =>
        m.id === editingMemberId
          ? { ...m, name: cleanName, email: cleanEmail, role: mRole, active: mActive, rating: Number(mRating) }
          : m
      );
      logEvent(`Updated member ${cleanName}`);
      showToast(`Updated ${cleanName}`);
    } else {
      const newId = Date.now();
      team = [
        { id: newId, name: cleanName, email: cleanEmail, role: mRole, active: mActive, rating: Number(mRating) },
        ...team,
      ];
      logEvent(`Added team member ${cleanName}`);
      showToast(`ズザッ! Added ${cleanName}`);
    }
    memberModalOpen = false;
  }
</script>

<div class="page-stack">
  <section class="card table-card">
    <div class="table-header">
      <div>
        <h2 class="card-title">Projects & Invoices</h2>
        <p class="card-desc">Add or edit projects via modal pop-up, filter by status, or sort by ID.</p>
      </div>

      <div class="table-controls">
        <sakuga-tabs
          label="Project status filter"
          onchange={(e) => (statusFilter = (e.detail?.value || 'all').toLowerCase())}
        >
          <option value="all" selected>All</option>
          <option value="in progress">In Progress</option>
          <option value="review">Review</option>
          <option value="completed">Completed</option>
        </sakuga-tabs>

        <button type="button" class="pill" onclick={() => (sortAsc = !sortAsc)}>
          Sort ID {sortAsc ? '↑' : '↓'}
        </button>

        <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
        <sakuga-button onclick={openNewProject}>+ New Project</sakuga-button>
      </div>
    </div>

    <div class="table-scroll">
      <table class="data-table">
        <thead>
          <tr>
            <th>Pick</th>
            <th>ID</th>
            <th>Project</th>
            <th>Client</th>
            <th>Status</th>
            <th>Progress</th>
            <th>Budget</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {#each filteredProjects as p (p.id)}
            <tr>
              <td>
                <sakuga-checkbox
                  checked={p.selected}
                  onchange={(e) => toggleSelect(p.id, e.target.checked)}
                ></sakuga-checkbox>
              </td>
              <td class="mono">{p.id}</td>
              <td><strong>{p.name}</strong></td>
              <td class="muted">{p.client}</td>
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
              <td>
                <div class="mini-progress">
                  <div class="mini-track"><div class="mini-fill" style="width: {p.progress}%"></div></div>
                  <span class="mono">{p.progress}%</span>
                </div>
              </td>
              <td class="mono"><strong>{p.budget}</strong></td>
              <td>
                <button type="button" class="pill" onclick={() => openEditProject(p)}>
                  <Icon name="edit" size={14} />
                  <span>Edit</span>
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </section>

  <section class="card table-card">
    <div class="table-header">
      <div>
        <h2 class="card-title">Studio Team & Roles</h2>
        <p class="card-desc">Add or edit studio members via modal pop-up, toggle status, and rate.</p>
      </div>
      <div class="table-controls">
        <span class="badge">{team.filter((m) => m.active).length} Active</span>
        <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
        <sakuga-button variant="secondary" onclick={openNewMember}>+ Add Member</sakuga-button>
      </div>
    </div>

    <div class="table-scroll">
      <table class="data-table">
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
          {#each team as member (member.id)}
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
                <button type="button" class="pill" onclick={() => openEditMember(member)}>
                  <Icon name="edit" size={14} />
                  <span>Edit</span>
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
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
      <span class="field-label">Project Name</span>
      <div class="input-full">
        <sakuga-input
          label="Project Name"
          value={pName}
          placeholder="e.g. Mecha Transformation Cut"
          oninput={(e) => (pName = e.target.value)}
        ></sakuga-input>
      </div>
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
      <span class="field-label">Full Name</span>
      <div class="input-full">
        <sakuga-input
          label="Full Name"
          value={mName}
          placeholder="e.g. Renji Tanaka"
          oninput={(e) => (mName = e.target.value)}
        ></sakuga-input>
      </div>
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

<style>
  .table-card {
    gap: 16px;
  }

  .table-header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
  }

  .table-controls {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
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

  .modal-form {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .field-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .field-row {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
  }

  .align-center {
    align-items: center;
    justify-content: space-between;
  }

  .flex-1 {
    flex: 1 1 180px;
  }

  .field-label {
    font-size: 12.5px;
    font-weight: 700;
    color: var(--text);
  }

  .input-full {
    --sk-input-width: 100%;
    width: 100%;
  }

  .input-full :global(sakuga-input) {
    display: block;
    width: 100%;
  }

  .slider-field {
    --sk-slider-width: 100%;
    padding-top: 8px;
  }
</style>
