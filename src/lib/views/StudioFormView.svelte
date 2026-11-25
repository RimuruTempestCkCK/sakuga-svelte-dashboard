<script>
  import { logEvent, showToast } from '../store.svelte.js';

  let formEl = $state();
  let submitBtn = $state();
  let formSnapshot = $state({
    project: 'Sakuga Opening Cut 01',
    director: 'animator@studio.jp',
    resolution: '4k',
    fps: '24',
    smear: 'on',
    auto_publish: 'on',
    priority: '5',
  });

  function readForm() {
    if (!formEl) return;
    const fd = new FormData(formEl);
    const obj = {};
    for (const [k, v] of fd.entries()) {
      obj[k] = v;
    }
    formSnapshot = obj;
  }

  function handleSubmit(e) {
    e.preventDefault();
    readForm();
    logEvent(`Studio form submitted: ${formSnapshot.project || 'Untitled'}`);
    showToast('Studio configuration submitted!');
    setTimeout(() => submitBtn?.done?.(), 700);
  }
</script>

<div class="studio-grid">
  <form
    bind:this={formEl}
    class="card form-card"
    onsubmit={handleSubmit}
    oninput={readForm}
    onchange={readForm}
  >
    <div class="form-head">
      <div>
        <h2>Shot Production Form</h2>
        <p class="card-desc">Every Sakuga value control participates in native <code>FormData</code>.</p>
      </div>
      <sakuga-tooltip text="Submit the form to see FormData update and trigger the confirm impact burst." label="Form help"></sakuga-tooltip>
    </div>

    <div class="form-fields">
      <div class="field-row">
        <sakuga-input
          name="project"
          label="Project Title"
          value="Sakuga Opening Cut 01"
          placeholder="Enter shot name"
        ></sakuga-input>

        <sakuga-input
          name="director"
          type="email"
          label="Lead Animator Email"
          value="animator@studio.jp"
          placeholder="name@studio.jp"
        ></sakuga-input>
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
      <sakuga-button
        variant="secondary"
        onclick={() => {
          formEl?.reset?.();
          setTimeout(readForm, 30);
          showToast('Form reset');
        }}
      >
        Reset
      </sakuga-button>
    </div>
  </form>

  <div class="card inspector-card">
    <h2>Live FormData Output</h2>
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

  .form-head h2,
  .inspector-card h2 {
    font-size: 16px;
    font-weight: 700;
  }

  .card-desc {
    font-size: 13px;
    color: var(--mute);
    margin-top: 3px;
  }

  .card-desc code {
    background: var(--chip);
    padding: 1px 5px;
    border-radius: 5px;
    font-size: 12px;
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
    align-items: center;
  }

  .slider-block {
    padding-top: 10px;
    --sk-slider-width: 260px;
  }

  .toggles-row {
    gap: 18px;
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
    padding: 16px;
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
