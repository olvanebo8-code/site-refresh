(() => {
  const { euro, escapeHtml, client, requireClient, showSetupMessage } = window.restaurantOrdering;
  const loginPanel = document.getElementById('login-panel');
  const dashboard = document.getElementById('dashboard');
  const loginError = document.getElementById('login-error');
  const dashboardError = document.getElementById('dashboard-error');
  const tableGrid = document.getElementById('table-grid');
  let activeUserId;
  let liveChannel;
  let refreshing = false;
  let tables = [];
  let openOrders = [];

  function showLoginError(message) {
    loginError.textContent = message;
    loginError.classList.remove('hidden');
  }

  function getTableState(table) {
    const orders = openOrders.filter(order => order.table_number === table.number && order.payment_status === 'open');
    const outstanding = orders.reduce((sum, order) => sum + order.total_cents, 0);
    if (orders.some(order => order.status === 'new' || order.status === 'accepted' || order.status === 'preparing')) {
      return { key: 'ordering', label: 'In Bestellung', detail: `${orders.length} offene ${orders.length === 1 ? 'Bestellung' : 'Bestellungen'}`, outstanding };
    }
    if (orders.some(order => order.status === 'ready')) {
      return { key: 'ready', label: 'Bestellung fertig', detail: 'Wartet auf Abholung', outstanding };
    }
    if (outstanding > 0) {
      return { key: 'occupied', label: 'Besetzt', detail: `${orders.length} offene ${orders.length === 1 ? 'Rechnung' : 'Rechnungen'}`, outstanding };
    }
    if (table.occupancy_status === 'occupied') {
      return { key: 'occupied', label: 'Besetzt', detail: 'Manuell als besetzt markiert', outstanding: 0 };
    }
    return { key: 'free', label: 'Frei', detail: 'Keine offene Bestellung', outstanding: 0 };
  }

  function renderTables() {
    tableGrid.innerHTML = tables.map(table => {
      const state = getTableState(table);
      const canChangeOccupancy = state.key === 'free' || state.key === 'occupied';
      const nextState = table.occupancy_status === 'occupied' ? 'free' : 'occupied';
      const buttonText = nextState === 'occupied' ? 'Als besetzt markieren' : 'Als frei markieren';
      return `<article class="table-card table-${state.key} rounded-2xl border-2 p-4 sm:p-5">
        <div class="flex items-start justify-between gap-2">
          <h2 class="serif text-xl sm:text-2xl">${escapeHtml(table.label)}</h2>
          <span class="rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-bold sm:text-xs">${state.label}</span>
        </div>
        <p class="mt-3 text-xs text-stone-600">${state.detail}</p>
        ${state.outstanding > 0 ? `<p class="mt-3 serif text-xl font-semibold">${euro(state.outstanding)} <span class="font-sans text-[10px] font-medium text-stone-600">noch offen</span></p>` : ''}
        ${canChangeOccupancy ? `<button type="button" data-table-number="${table.number}" data-next-state="${nextState}" class="mt-4 w-full rounded-full border border-stone-400 bg-white/70 px-3 py-2 text-xs font-semibold transition hover:border-[#bd762d]">${buttonText}</button>` : '<p class="mt-4 text-center text-[11px] text-stone-600">Status wird durch die Küche aktualisiert</p>'}
      </article>`;
    }).join('');
  }

  async function refreshTables() {
    if (refreshing) return;
    refreshing = true;
    try {
      const supabase = requireClient();
      const [tableResult, orderResult] = await Promise.all([
        supabase.from('restaurant_tables').select('number,label,occupancy_status').order('number'),
        supabase.from('orders').select('id,table_number,status,payment_status,total_cents').eq('payment_status', 'open')
      ]);
      if (tableResult.error) throw tableResult.error;
      if (orderResult.error) throw orderResult.error;
      tables = tableResult.data || [];
      openOrders = orderResult.data || [];
      if (tables.length !== 20) throw new Error('Die Datenbank muss alle 20 Tische enthalten.');
      renderTables();
      dashboardError.classList.add('hidden');
    } catch (error) {
      dashboardError.textContent = `Tischstatus konnte nicht geladen werden: ${error.message || 'Verbindungsfehler'}`;
      dashboardError.classList.remove('hidden');
    } finally {
      refreshing = false;
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
    document.getElementById('connection-state').textContent = 'Live-Verbindung wird hergestellt …';
    await refreshTables();
    if (liveChannel) await client.removeChannel(liveChannel);
    if (client) {
      liveChannel = client.channel('admin-table-status')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'restaurant_tables' }, refreshTables)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, refreshTables)
        .subscribe(status => {
          document.getElementById('connection-state').textContent =
            status === 'SUBSCRIBED' ? 'Live verbunden' : `Live-Status: ${status}`;
        });
    }
  }

  try {
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

  document.getElementById('refresh').addEventListener('click', refreshTables);
  tableGrid.addEventListener('click', async event => {
    const button = event.target.closest('[data-table-number]');
    if (!button) return;
    button.disabled = true;
    try {
      const { error } = await requireClient().rpc('set_table_occupancy', {
        p_table_number: Number(button.dataset.tableNumber),
        p_occupancy_status: button.dataset.nextState
      });
      if (error) throw error;
      await refreshTables();
    } catch (error) {
      dashboardError.textContent = `Tischstatus konnte nicht geändert werden: ${error.message || 'Verbindungsfehler'}`;
      dashboardError.classList.remove('hidden');
      button.disabled = false;
    }
  });

})();
