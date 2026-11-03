(() => {
  const { euro, escapeHtml, client, requireClient, showSetupMessage } = window.restaurantOrdering;
  const loginPanel = document.getElementById('login-panel');
  const dashboard = document.getElementById('dashboard');
  const loginError = document.getElementById('login-error');
  const dashboardError = document.getElementById('dashboard-error');
  const tableFilter = document.getElementById('table-filter');
  const ordersElement = document.getElementById('admin-orders');
  let allOrders = [];
  let activeUserId;
  let liveChannel;
  let currentView = 'all';

  function showLoginError(message) {
    loginError.textContent = message;
    loginError.classList.remove('hidden');
  }

  function dateTime(value) {
    return new Date(value).toLocaleString('de-DE', { dateStyle: 'medium', timeStyle: 'short' });
  }

  function mondayStart(date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
    return start;
  }

  function renderSummary(orders) {
    const now = new Date();
    const dayStart = new Date(now);
    dayStart.setHours(0, 0, 0, 0);
    const weekStart = mondayStart(now);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const paid = orders.filter(order => order.payment_status === 'paid');
    const revenue = list => list.reduce((sum, order) => sum + order.total_cents, 0);
    const metrics = [
      ['Gesamtumsatz', euro(revenue(paid)), 'Nur bezahlte Bestellungen'],
      ['Bestellungen', String(orders.length), `${orders.filter(order => order.payment_status === 'open').length} offen · ${paid.length} bezahlt`],
      ['Tagesumsatz', euro(revenue(paid.filter(order => new Date(order.created_at) >= dayStart))), 'Heute'],
      ['Wochenumsatz', euro(revenue(paid.filter(order => new Date(order.created_at) >= weekStart))), 'Diese Woche'],
      ['Monatsumsatz', euro(revenue(paid.filter(order => new Date(order.created_at) >= monthStart))), 'Dieser Monat']
    ];
    document.getElementById('financial-summary').innerHTML = metrics.map(metric =>
      `<article class="rounded-2xl border border-stone-200 bg-white p-5"><p class="text-xs font-semibold text-stone-500">${metric[0]}</p><p class="mt-2 serif text-2xl">${metric[1]}</p><p class="mt-1 text-[11px] text-stone-500">${metric[2]}</p></article>`
    ).join('');
  }

  function renderTableOverview(orders) {
    const overview = document.getElementById('table-overview');
    overview.innerHTML = Array.from({ length: 20 }, (_, index) => {
      const number = index + 1;
      const tableOrders = orders.filter(order => order.table_number === number);
      const openTotal = tableOrders.filter(order => order.payment_status === 'open')
        .reduce((sum, order) => sum + order.total_cents, 0);
      return `<article class="rounded-xl border border-stone-200 bg-[#faf9f5] p-4">
        <button type="button" data-select-table="${number}" class="w-full text-left">
          <span class="block text-xs font-semibold text-stone-500">Tisch ${number}</span>
          <strong class="mt-2 block text-sm">${euro(openTotal)}</strong>
          <span class="block text-[10px] text-stone-500">${openTotal ? 'Offener Betrag' : 'Kein offener Betrag'}</span>
          <span class="mt-1 block text-[11px] text-stone-500">${tableOrders.length} ${tableOrders.length === 1 ? 'Bestellung' : 'Bestellungen'}</span>
        </button>
        ${openTotal ? `<button type="button" data-mark-table-paid="${number}" class="mt-3 w-full rounded-full bg-emerald-700 px-3 py-2 text-[11px] font-semibold text-white hover:bg-emerald-800">Tisch bezahlt &amp; freigeben</button>` : ''}
      </article>`;
    }).join('');
  }

  function renderOrders() {
    const selected = tableFilter.value;
    const orders = allOrders.filter(order =>
      (selected === 'all' || order.table_number === Number(selected)) &&
      (currentView === 'all' || new Date(order.created_at).toDateString() === new Date().toDateString())
    );
    document.getElementById('order-count').textContent = `${orders.length} ${orders.length === 1 ? 'Bestellung' : 'Bestellungen'}`;
    document.getElementById('no-orders').classList.toggle('hidden', orders.length > 0);
    ordersElement.innerHTML = orders.map(order => {
      const items = (order.order_items || []).map(item =>
        `<li class="grid grid-cols-[1fr_auto_auto] gap-3 py-2 text-sm"><span>${escapeHtml(item.product_name)} <span class="text-stone-500">× ${item.quantity}</span></span><span class="text-right text-stone-600">${euro(item.unit_price_cents)}</span><strong class="text-right">${euro(item.line_total_cents)}</strong></li>`
      ).join('');
      const statusText = ({
        new: 'Neu',
        accepted: 'Angenommen',
        preparing: 'In Zubereitung',
        ready: 'Fertig',
        completed: 'Abgeschlossen'
      })[order.status] || order.status;
      return `<article class="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
        <div class="flex flex-wrap items-start justify-between gap-3"><div><p class="text-[11px] font-bold uppercase tracking-[.15em] text-[#bd762d]">Bestellung #${escapeHtml(order.id.slice(0, 8).toUpperCase())}</p><h3 class="mt-1 serif text-2xl">Tisch ${order.table_number}</h3></div><div class="text-right"><span class="rounded-full ${order.payment_status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'} px-3 py-1 text-[10px] font-bold">${order.payment_status === 'paid' ? 'Bezahlt' : 'Offen'}</span><p class="mt-2 text-xs text-stone-500">${statusText}</p></div></div>
        <p class="mt-3 text-xs text-stone-500">${dateTime(order.created_at)}</p>
        <ul class="mt-4 divide-y divide-stone-100 border-y border-stone-100">${items}</ul>
        <div class="mt-4 flex items-center justify-between font-bold"><span>Gesamtsumme</span><span>${euro(order.total_cents)}</span></div>
        ${order.payment_status === 'open' ? `<button type="button" data-mark-paid="${order.id}" class="mt-4 w-full rounded-full border border-emerald-700 px-4 py-3 text-sm font-semibold text-emerald-800 hover:bg-emerald-50">Als bezahlt markieren</button>` : ''}
      </article>`;
    }).join('');
  }

  async function loadOrders() {
    dashboardError.classList.add('hidden');
    try {
      const supabase = requireClient();
      allOrders = [];
      for (let from = 0; ; from += 1000) {
        const { data, error } = await supabase
          .from('orders')
          .select('id,table_number,created_at,status,payment_status,total_cents,order_items(id,product_name,quantity,unit_price_cents,line_total_cents)')
          .order('created_at', { ascending: false })
          .range(from, from + 999);
        if (error) throw error;
        allOrders.push(...(data || []));
        if (!data || data.length < 1000) break;
      }
      renderSummary(allOrders);
      renderTableOverview(allOrders);
      renderOrders();
    } catch (error) {
      dashboardError.textContent = `Finanzdaten konnten nicht geladen werden: ${error.message || 'Verbindungsfehler'}`;
      dashboardError.classList.remove('hidden');
    }
  }

  async function openDashboard(user) {
    if (!user || user.app_metadata?.role !== 'admin') {
      activeUserId = null;
      if (client) await client.auth.signOut();
      loginPanel.classList.remove('hidden');
      dashboard.classList.add('hidden');
      showLoginError('Dieses Konto hat keinen Administratorzugang.');
      return;
    }
    if (activeUserId === user.id) return;
    activeUserId = user.id;
    loginPanel.classList.add('hidden');
    dashboard.classList.remove('hidden');
    document.getElementById('logout').classList.remove('hidden');
    await loadOrders();
    if (client) {
      if (liveChannel) await client.removeChannel(liveChannel);
      liveChannel = client.channel('admin-orders-live')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, loadOrders)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'order_items' }, loadOrders)
        .subscribe();
    }
  }

  try {
    for (let table = 1; table <= 20; table += 1) {
      const option = document.createElement('option');
      option.value = String(table);
      option.textContent = `Tisch ${table}`;
      tableFilter.appendChild(option);
    }
    showSetupMessage(document.getElementById('supabase-setup'));
    if (client) {
      client.auth.getSession().then(({ data, error }) => {
        if (error) showLoginError(error.message);
        else if (data.session) openDashboard(data.session.user);
      });
      client.auth.onAuthStateChange((_event, session) => {
        if (session) openDashboard(session.user);
        else {
          activeUserId = null;
          loginPanel.classList.remove('hidden');
          dashboard.classList.add('hidden');
          document.getElementById('logout').classList.add('hidden');
          if (liveChannel) {
            client.removeChannel(liveChannel);
            liveChannel = null;
          }
        }
      });
    }
  } catch (error) {
    showLoginError(error.message);
  }

  document.getElementById('login-form').addEventListener('submit', async event => {
    event.preventDefault();
    loginError.classList.add('hidden');
    try {
      const supabase = requireClient();
      const form = new FormData(event.currentTarget);
      const { error } = await supabase.auth.signInWithPassword({
        email: form.get('email'),
        password: form.get('password')
      });
      if (error) throw error;
    } catch (error) {
      showLoginError(`Anmeldung fehlgeschlagen: ${error.message || 'Bitte prüfen Sie Ihre Zugangsdaten.'}`);
    }
  });

  document.getElementById('logout').addEventListener('click', async () => {
    const { error } = await requireClient().auth.signOut();
    if (error) showLoginError(`Abmelden fehlgeschlagen: ${error.message}`);
  });

  document.getElementById('refresh').addEventListener('click', loadOrders);
  tableFilter.addEventListener('change', renderOrders);
  document.getElementById('table-overview').addEventListener('click', async event => {
    const paidButton = event.target.closest('[data-mark-table-paid]');
    if (paidButton) {
      event.preventDefault();
      event.stopPropagation();
      paidButton.disabled = true;
      try {
        const { error } = await requireClient().rpc('mark_table_paid', {
          p_table_number: Number(paidButton.dataset.markTablePaid)
        });
        if (error) throw error;
        await loadOrders();
      } catch (error) {
        dashboardError.textContent = `Tisch konnte nicht abgerechnet werden: ${error.message || 'Verbindungsfehler'}`;
        dashboardError.classList.remove('hidden');
        paidButton.disabled = false;
      }
      return;
    }
    const button = event.target.closest('[data-select-table]');
    if (!button) return;
    tableFilter.value = button.dataset.selectTable;
    renderOrders();
    document.getElementById('admin-orders').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  ordersElement.addEventListener('click', async event => {
    const button = event.target.closest('[data-mark-paid]');
    if (!button) return;
    button.disabled = true;
    try {
      const { error } = await requireClient().rpc('mark_order_paid', { p_order_id: button.dataset.markPaid });
      if (error) throw error;
      await loadOrders();
    } catch (error) {
      dashboardError.textContent = `Zahlungsstatus konnte nicht gespeichert werden: ${error.message || 'Verbindungsfehler'}`;
      dashboardError.classList.remove('hidden');
      button.disabled = false;
    }
  });

  function setView(view) {
    currentView = view;
    const showingToday = view === 'today';
    const todayButton = document.getElementById('show-today-orders');
    const allButton = document.getElementById('show-all-orders');
    todayButton.setAttribute('aria-pressed', String(showingToday));
    allButton.setAttribute('aria-pressed', String(!showingToday));
    todayButton.className = showingToday
      ? 'rounded-full bg-[#292b24] px-5 py-3 text-sm font-semibold text-white'
      : 'rounded-full border border-stone-300 bg-white px-5 py-3 text-sm font-semibold hover:border-[#bd762d]';
    allButton.className = showingToday
      ? 'rounded-full border border-stone-300 bg-white px-5 py-3 text-sm font-semibold hover:border-[#bd762d]'
      : 'rounded-full bg-[#292b24] px-5 py-3 text-sm font-semibold text-white';
    renderOrders();
  }
  document.getElementById('show-all-orders').addEventListener('click', () => setView('all'));
  document.getElementById('show-today-orders').addEventListener('click', () => setView('today'));
})();
