<script>
  import { showToast, logEvent } from '../store.svelte.js';

  let yearly = $state(false);
  let activePlan = $state('pro');

  const PLANS = [
    {
      id: 'starter',
      name: 'Starter',
      monthly: 0,
      desc: 'For solo animators & personal prototypes.',
      features: ['All 12 Sakuga VFX controls', 'Hash routing & 4 themes', 'LocalStorage preferences'],
    },
    {
      id: 'pro',
      name: 'Pro Studio',
      monthly: 29,
      popular: true,
      desc: 'Best for production teams & studio dashboards.',
      features: ['Unlimited render queue shots', 'Advanced Analytics & CSV export', 'Kanban, Calendar & Priority UI'],
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      monthly: 79,
      desc: 'Multi-studio workspaces & custom pipelines.',
      features: ['Custom --sk-* brand tokens', 'Dedicated render farm presets', 'Audit logs & team permissions'],
    },
  ];

  const INVOICES = [
    { id: 'BILL-2026-11', date: '2026-11-01', plan: 'Pro Studio', amount: '$29.00', status: 'Paid' },
    { id: 'BILL-2026-10', date: '2026-10-01', plan: 'Pro Studio', amount: '$29.00', status: 'Paid' },
    { id: 'BILL-2026-09', date: '2026-09-01', plan: 'Starter', amount: '$0.00', status: 'Paid' },
  ];

  function priceFor(monthly) {
    if (monthly === 0) return '$0';
    const val = yearly ? Math.round(monthly * 0.8) : monthly;
    return `$${val}`;
  }

  function selectPlan(plan) {
    activePlan = plan.id;
    logEvent(`[Billing] Switched demo plan to ${plan.name}`);
    showToast(`Active plan set to ${plan.name} (UI demo)`, 'success');
  }

  function downloadReceipt(inv) {
    const text = `Invoice: ${inv.id}\nDate: ${inv.date}\nPlan: ${inv.plan}\nAmount: ${inv.amount}\nStatus: ${inv.status}\n`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${inv.id}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast(`Downloaded ${inv.id}.txt`, 'success');
  }
</script>

<div class="page-stack">
  <section class="card">
    <div class="billing-head">
      <div>
        <h2 class="card-title">Plans & Billing</h2>
        <p class="card-desc">Compare studio plans and manage simulated billing history.</p>
      </div>

      <div class="billing-toggle">
        <span class:active-cycle={!yearly}>Monthly</span>
        <sakuga-toggle
          label="Yearly billing (save 20%)"
          checked={yearly}
          onchange={(e) => (yearly = e.target.checked)}
        ></sakuga-toggle>
        <span class:active-cycle={yearly}>Yearly <span class="badge accent">-20%</span></span>
      </div>
    </div>
  </section>

  <section class="pricing-grid">
    {#each PLANS as plan (plan.id)}
      <div class="card price-card" class:featured={plan.popular} class:current={activePlan === plan.id}>
        <div class="price-top">
          <h3>{plan.name}</h3>
          {#if activePlan === plan.id}
            <span class="badge success">Current</span>
          {:else if plan.popular}
            <span class="badge accent">Recommended</span>
          {/if}
        </div>

        <div class="price-amount">
          <strong class="sakuga-title">{priceFor(plan.monthly)}</strong>
          <span>/ month</span>
        </div>

        <p class="card-desc">{plan.desc}</p>

        <ul class="feat-list">
          {#each plan.features as f}
            <li>✓ {f}</li>
          {/each}
        </ul>

        <div class="price-act">
          <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
          <sakuga-button
            variant={plan.popular ? undefined : 'secondary'}
            disabled={activePlan === plan.id}
            onclick={() => selectPlan(plan)}
          >
            {activePlan === plan.id ? 'Active Plan' : `Choose ${plan.name}`}
          </sakuga-button>
        </div>
      </div>
    {/each}
  </section>

  <section class="card">
    <div class="card-head">
      <div>
        <h2 class="card-title">Billing History</h2>
        <p class="card-desc">Simulated invoice receipts available for download.</p>
      </div>
    </div>

    <div class="table-scroll">
      <table class="data-table">
        <thead>
          <tr>
            <th>Invoice ID</th>
            <th>Date</th>
            <th>Plan</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Receipt</th>
          </tr>
        </thead>
        <tbody>
          {#each INVOICES as inv (inv.id)}
            <tr>
              <td class="mono">{inv.id}</td>
              <td class="mono">{inv.date}</td>
              <td><strong>{inv.plan}</strong></td>
              <td class="mono">{inv.amount}</td>
              <td><span class="badge success">{inv.status}</span></td>
              <td>
                <button type="button" class="pill" onclick={() => downloadReceipt(inv)}>Download</button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </section>
</div>

<style>
  .billing-head {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .billing-toggle {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    font-weight: 600;
    color: var(--mute);
  }

  .active-cycle {
    color: var(--text);
    font-weight: 700;
  }

  .pricing-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr));
    gap: 14px;
  }

  .price-card {
    gap: 12px;
  }

  .price-card.featured {
    border-color: var(--sk-soft, #b8b3ff);
    box-shadow: 4px 5px 0 var(--sk-soft, #b8b3ff);
  }

  .price-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .price-top h3 {
    font-size: 17px;
    font-weight: 700;
  }

  .price-amount {
    display: flex;
    align-items: baseline;
    gap: 6px;
  }

  .price-amount strong {
    font-size: 32px;
    line-height: 1;
  }

  .price-amount span {
    font-size: 13px;
    color: var(--mute);
  }

  .feat-list {
    list-style: none;
    margin: 4px 0 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 7px;
    font-size: 13px;
    flex: 1;
  }

  .price-act {
    padding-top: 10px;
    border-top: 1px solid var(--line);
  }
</style>
