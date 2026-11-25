<script>
  import Icon from '../Icon.svelte';
  import Modal from '../Modal.svelte';
  import { showToast, logEvent } from '../store.svelte.js';

  const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  let year = $state(2026);
  let month = $state(10); // November (0-indexed)
  let selectedDay = $state(25);

  let events = $state([
    { id: 1, date: '2026-11-05', title: 'Episode 12 Keyframe Review', time: '10:00', type: 'Review' },
    { id: 2, date: '2026-11-14', title: 'Sakuga VFX Sprint Sync', time: '14:30', type: 'Meeting' },
    { id: 3, date: '2026-11-25', title: 'Cut 01–08 Master Export', time: '16:00', type: 'Deadline' },
    { id: 4, date: '2026-11-28', title: 'Client Delivery Package', time: '11:00', type: 'Deadline' },
  ]);

  let modalOpen = $state(false);
  let eTitle = $state('');
  let eTime = $state('09:00');
  let eType = $state('Deadline');
  let eError = $state('');

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function isoFor(day) {
    return `${year}-${pad(month + 1)}-${pad(day)}`;
  }

  let daysInMonth = $derived(new Date(year, month + 1, 0).getDate());
  let firstWeekday = $derived((new Date(year, month, 1).getDay() + 6) % 7); // Mon=0

  let cells = $derived.by(() => {
    const arr = [];
    for (let i = 0; i < firstWeekday; i++) arr.push(null);
    for (let d = 1; d <= daysInMonth; d++) arr.push(d);
    return arr;
  });

  let selectedIso = $derived(isoFor(selectedDay));
  let dayEvents = $derived(events.filter((ev) => ev.date === selectedIso));

  function prevMonth() {
    if (month === 0) {
      month = 11;
      year -= 1;
    } else {
      month -= 1;
    }
    selectedDay = 1;
  }

  function nextMonth() {
    if (month === 11) {
      month = 0;
      year += 1;
    } else {
      month += 1;
    }
    selectedDay = 1;
  }

  function openAddEvent() {
    eTitle = '';
    eTime = '10:00';
    eType = 'Deadline';
    eError = '';
    modalOpen = true;
  }

  function saveEvent(e) {
    e.preventDefault();
    if (!eTitle.trim()) {
      eError = 'Judul event wajib diisi.';
      return;
    }
    events = [
      ...events,
      { id: Date.now(), date: selectedIso, title: eTitle.trim(), time: eTime.trim() || '10:00', type: eType },
    ];
    logEvent(`[Calendar] Added "${eTitle.trim()}" on ${selectedIso}`);
    showToast(`Added event on ${selectedIso}`, 'success');
    modalOpen = false;
  }

  function removeEvent(id) {
    events = events.filter((ev) => ev.id !== id);
    showToast('Event removed', 'warning');
  }
</script>

<div class="cal-layout">
  <section class="card cal-main">
    <div class="cal-head">
      <div>
        <h2 class="card-title">{MONTHS[month]} {year}</h2>
        <p class="card-desc">Click any date to inspect or add schedule events.</p>
      </div>

      <div class="cal-nav">
        <button type="button" class="pill" onclick={prevMonth} aria-label="Previous month">
          <Icon name="chevron-left" size={15} />
        </button>
        <button
          type="button"
          class="pill"
          onclick={() => {
            year = 2026;
            month = 10;
            selectedDay = 25;
          }}
        >
          Today
        </button>
        <button type="button" class="pill" onclick={nextMonth} aria-label="Next month">
          <Icon name="chevron-right" size={15} />
        </button>
      </div>
    </div>

    <div class="weekdays">
      {#each WEEKDAYS as wd}
        <div class="wd">{wd}</div>
      {/each}
    </div>

    <div class="days-grid">
      {#each cells as day}
        {#if day === null}
          <div class="day-blank"></div>
        {:else}
          {@const iso = isoFor(day)}
          {@const count = events.filter((ev) => ev.date === iso).length}
          <button
            type="button"
            class="day-cell"
            class:selected={selectedDay === day}
            onclick={() => (selectedDay = day)}
          >
            <span class="day-num mono">{day}</span>
            {#if count > 0}
              <span class="event-dot">{count}</span>
            {/if}
          </button>
        {/if}
      {/each}
    </div>
  </section>

  <aside class="card cal-side">
    <div class="side-head">
      <div>
        <h3 class="card-title">Agenda</h3>
        <p class="card-desc mono">{selectedIso}</p>
      </div>
      <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
      <sakuga-button variant="secondary" onclick={openAddEvent}>+ Event</sakuga-button>
    </div>

    {#if dayEvents.length === 0}
      <div class="empty-state">
        <div class="empty-icon"><Icon name="calendar" size={18} /></div>
        <div class="empty-title">No events scheduled</div>
        <p class="empty-desc">Click + Event to schedule a deadline or review.</p>
      </div>
    {:else}
      <ul class="agenda-list">
        {#each dayEvents as ev (ev.id)}
          <li class="agenda-item">
            <div class="agenda-info">
              <div class="agenda-top">
                <span class="badge mono">{ev.time}</span>
                <span class="badge accent">{ev.type}</span>
              </div>
              <strong>{ev.title}</strong>
            </div>
            <button
              type="button"
              class="pill danger"
              aria-label={`Delete ${ev.title}`}
              onclick={() => removeEvent(ev.id)}
            >
              <Icon name="trash" size={13} />
            </button>
          </li>
        {/each}
      </ul>
    {/if}
  </aside>
</div>

<Modal bind:open={modalOpen} title="Add Schedule Event" subtitle={`Date: ${selectedIso}`}>
  <form class="modal-form" onsubmit={saveEvent}>
    <div class="field-group">
      <span class="field-label">Event Title *</span>
      <div class="input-full">
        <sakuga-input
          label="Event Title"
          value={eTitle}
          placeholder="e.g. Final VFX Check"
          oninput={(e) => {
            eTitle = e.target.value;
            if (eError) eError = '';
          }}
        ></sakuga-input>
      </div>
      {#if eError}
        <span class="field-error">{eError}</span>
      {/if}
    </div>

    <div class="field-group">
      <span class="field-label">Time</span>
      <div class="input-full">
        <sakuga-input
          label="Time"
          value={eTime}
          placeholder="10:00"
          oninput={(e) => (eTime = e.target.value)}
        ></sakuga-input>
      </div>
    </div>

    <div class="field-group">
      <span class="field-label">Type</span>
      <sakuga-radio label="Event Type" value={eType} onchange={(e) => (eType = e.target.value)}>
        <option value="Deadline" selected={eType === 'Deadline'}>Deadline</option>
        <option value="Review" selected={eType === 'Review'}>Review</option>
        <option value="Meeting" selected={eType === 'Meeting'}>Meeting</option>
      </sakuga-radio>
    </div>

    <div class="card-footer">
      <sakuga-button type="submit">Save Event</sakuga-button>
      <button type="button" class="pill" onclick={() => (modalOpen = false)}>Cancel</button>
    </div>
  </form>
</Modal>

<style>
  .cal-layout {
    display: grid;
    grid-template-columns: 1.5fr 1fr;
    gap: 14px;
    align-items: start;
  }

  .cal-head,
  .side-head {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 12px;
  }

  .cal-nav {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .weekdays,
  .days-grid {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    gap: 6px;
  }

  .wd {
    text-align: center;
    font-size: 11.5px;
    font-weight: 700;
    color: var(--mute);
    padding-bottom: 4px;
  }

  .day-blank {
    height: 52px;
  }

  .day-cell {
    position: relative;
    height: 52px;
    border-radius: 11px;
    border: 1.5px solid var(--line);
    background: var(--surface-alt);
    color: var(--text);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3px;
    cursor: pointer;
    transition: border-color 0.14s ease, background 0.14s ease;
  }

  .day-cell:hover {
    border-color: var(--sk-soft, #b8b3ff);
  }

  .day-cell.selected {
    background: var(--surface);
    border-color: var(--sk-ink, #1d1a4a);
    box-shadow: 2px 3px 0 var(--sk-soft, #b8b3ff);
  }

  .day-num {
    font-size: 13px;
    font-weight: 700;
  }

  .event-dot {
    font-size: 10px;
    font-weight: 800;
    padding: 0 6px;
    border-radius: 999px;
    background: var(--sk-acc, #ff5fa8);
    color: #fff;
  }

  .agenda-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .agenda-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 12px;
    background: var(--surface-alt);
    border: 1px solid var(--line);
  }

  .agenda-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 13px;
  }

  .agenda-top {
    display: flex;
    gap: 6px;
  }

  @media (max-width: 960px) {
    .cal-layout {
      grid-template-columns: 1fr;
    }
  }
</style>
