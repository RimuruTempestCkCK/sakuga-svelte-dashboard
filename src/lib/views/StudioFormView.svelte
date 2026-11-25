<script>
  import { logEvent, showToast } from '../store.svelte.js';

  let formEl = $state();
  let submitBtn = $state();
  let projectVal = $state('Sakuga Opening Cut 01');
  let directorVal = $state('animator@studio.jp');
  let errors = $state({ project: '', director: '' });

  let formSnapshot = $state({
    project: 'Sakuga Opening Cut 01',
    director: 'animator@studio.jp',
    resolution: '4k',
    fps: '24',
    smear: 'on',
    auto_publish: 'on',
    priority: '5',
  });

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function readForm() {
    if (!formEl) return;
    const fd = new FormData(formEl);
    const obj = {};
    for (const [k, v] of fd.entries()) {
      obj[k] = v;
    }
    formSnapshot = obj;
  }

  function validate() {
    const next = { project: '', director: '' };
    if (!projectVal.trim()) {
      next.project = 'Project Title wajib diisi.';
    }
    if (!directorVal.trim()) {
      next.director = 'Lead Animator Email wajib diisi.';
    } else if (!EMAIL_RE.test(directorVal.trim())) {
      next.director = 'Format email tidak valid.';
    }
    errors = next;
    return !next.project && !next.director;
  }

  function handleSubmit(e) {
    e.preventDefault();
    readForm();
    if (!validate()) {
      showToast('Periksa field wajib terlebih dahulu');
      return;
    }
    logEvent(`Studio form submitted: ${formSnapshot.project}`);
    showToast('Studio configuration submitted!');
    setTimeout(() => submitBtn?.done?.(), 700);
  }

  function handleReset() {
    formEl?.reset?.();
    projectVal = 'Sakuga Opening Cut 01';
    directorVal = 'animator@studio.jp';
    errors = { project: '', director: '' };
    setTimeout(readForm, 30);
    showToast('Form reset');
  }
</script>

<div class="studio-grid">
  <form
    bind:this={formEl}
    class="card form-card"
    onsubmit={handleSubmit}
    oninput={readForm}
    onchange={readForm}
    novalidate
  >
    <div class="form-head">
      <div>
        <h2 class="card-title">Shot Production Form</h2>
        <p class="card-desc">Every Sakuga value control participates in native <code>FormData</code>.</p>
      </div>
      <sakuga-tooltip text="Submit the form to see FormData update and trigger the confirm impact burst." label="Form help"></sakuga-tooltip>
    </div>

    <div class="form-fields">
      <div class="field-row">
        <div class="field-group">
          <span class="field-label">Project Title *</span>
          <sakuga-input
            name="project"
            label="Project Title"
            value={projectVal}
            placeholder="Enter shot name"
            oninput={(e) => {
              projectVal = e.target.value;
              if (errors.project) errors = { ...errors, project: '' };
            }}
          ></sakuga-input>
          {#if errors.project}
            <span class="field-error">{errors.project}</span>
          {/if}
        </div>

        <div class="field-group">
          <span class="field-label">Lead Animator Email *</span>
          <sakuga-input
            name="director"
            type="email"
            label="Lead Animator Email"
            value={directorVal}
            placeholder="name@studio.jp"
            oninput={(e) => {
              directorVal = e.target.value;
              if (errors.director) errors = { ...errors, director: '' };
            }}
          ></sakuga-input>
          {#if errors.director}
            <span class="field-error">{errors.director}</span>
          {/if}
        </div>
      </div>

      <div class="field-block">
        <sakuga-radio name="resolution" label="Render Resolution">
          <option value="1080p">1080p HD</option>
          <option value="4k" selected>4K Master</option>
          <option value="8k">8K IMAX</option>
        </sakuga-radio>
      </div>

      <div class="field-block slider-block">
        <sakuga-slider
          name="fps"
          label="Target Frame Rate"
          min="12"
          max="60"
          step="12"
          value="24"
          unit=" fps"
        ></sakuga-slider>
      </div>

      <div class="field-row toggles-row">
        <sakuga-toggle name="smear" label="Smear Frames" checked></sakuga-toggle>
        <sakuga-checkbox name="auto_publish" checked>Auto-publish to gallery</sakuga-checkbox>
      </div>

      <div class="field-block">
        <sakuga-rating name="priority" label="Shot Priority" value="5"></sakuga-rating>
      </div>
    </div>

    <div class="form-actions">
      <sakuga-button bind:this={submitBtn} type="submit">Submit Shot</sakuga-button>
      <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
      <sakuga-button variant="secondary" onclick={handleReset}>
        Reset
      </sakuga-button>
    </div>
  </form>

  <div class="card inspector-card">
    <h2 class="card-title">Live FormData Output</h2>
    <p class="card-desc">Values collected directly via <code>new FormData(form)</code>:</p>
    <pre class="json-box mono">{JSON.stringify(formSnapshot, null, 2)}</pre>
  </div>
</div>

<style>
  .studio-grid {
    display: grid;
    grid-template-columns: 1.4fr 1fr;
    gap: 14px;
    align-items: start;
  }

  .form-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 14px;
  }

  .form-fields {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .field-row {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    align-items: flex-start;
  }

  .slider-block {
    padding-top: 10px;
    --sk-slider-width: 260px;
  }

  .toggles-row {
    gap: 18px;
    align-items: center;
  }

  .form-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 16px;
    padding-top: 12px;
    border-top: 1.5px solid var(--line);
  }

  .json-box {
    margin: 14px 0 0;
    padding: 14px;
    border-radius: 12px;
    background: var(--surface-alt);
    border: 1.5px solid var(--line);
    font-size: 13px;
    line-height: 1.5;
    overflow-x: auto;
    color: var(--text);
  }

  @media (max-width: 960px) {
    .studio-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
