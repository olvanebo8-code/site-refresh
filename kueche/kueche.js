(() => {
  const { escapeHtml, client, requireClient, showSetupMessage } = window.restaurantOrdering;
  const loginPanel = document.getElementById('login-panel');
  const dashboard = document.getElementById('dashboard');
  const loginError = document.getElementById('login-error');
  const dashboardError = document.getElementById('dashboard-error');
  const orderList = document.getElementById('orders');
  const emptyOrders = document.getElementById('empty-orders');
  let knownOrders = new Set();
  let initialLoad = true;
  let refreshPending = false;
  let audioContext;
  let liveChannel;
  let activeUserId;

  function showLoginError(message) {
    loginError.textContent = message;
    loginError.classList.remove('hidden');
  }

  function statusLabel(status) {
    return ({
      new: 'NEU',
      accepted: 'ANGENOMMEN',
      preparing: 'IN ZUBEREITUNG',
      ready: 'FERTIG',
      completed: 'ABGESCHLOSSEN'
    })[status] || status;
  }

  function dateTime(value) {
    return new Date(value).toLocaleString('de-DE', {
      dateStyle: 'short',
      timeStyle: 'short'
    });
  }

  function nextAction(status) {
    return ({
      new: ['accepted', 'Bestellung annehmen'],
      accepted: ['preparing', 'In Zubereitung'],
      preparing: ['ready', 'Fertig'],
      ready: ['completed', 'Bestellung abgeschlossen']
    })[status] || null;
  }

  function playNotification() {
    if (!document.getElementById('sound-toggle').checked) return;
    audioContext = audioContext || new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.frequency.value = 880;
    gain.gain.setValueAtTime(0.001, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.16, audioContext.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.35);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.36);
  }

  function renderOrders(orders) {
    orderList.innerHTML = orders.map(order => {
      const action = nextAction(order.status);
      const items = (order.kitchen_order_items || []).map(item =>
        `<li class="flex justify-between gap-3 py-1"><span>${escapeHtml(item.product_name)}</span><strong class="shrink-0">${item.quantity}×</strong></li>`
      ).join('');
      return `<article class="rounded-2xl border-2 p-5 shadow-sm status-${order.status}">
        <div class="flex items-start justify-between gap-3">
          <div><p class="text-[11px] font-bold uppercase tracking-[.18em] text-stone-600">Bestellung #${escapeHtml(order.id.slice(0, 8).toUpperCase())}</p><h2 class="mt-2 serif text-2xl">Tisch ${order.table_number}</h2></div>
          <span class="rounded-full bg-white/80 px-3 py-1 text-[10px] font-bold tracking-wide">${statusLabel(order.status)}</span>
        </div>
        <p class="mt-3 text-xs text-stone-600">${dateTime(order.created_at)}</p>
        <ul class="mt-4 divide-y divide-black/10 text-sm">${items}</ul>
        ${order.instructions ? `<div class="mt-4 rounded-lg bg-white/75 p-3 text-xs leading-5"><strong>Hinweise:</strong> ${escapeHtml(order.instructions)}</div>` : ''}
        ${action ? `<button type="button" data-order-id="${order.id}" data-next-status="${action[0]}" class="mt-5 w-full rounded-full bg-[#292b24] px-4 py-3 text-sm font-semibold text-white hover:bg-black">${action[1]}</button>` : '<p class="mt-5 text-center text-xs font-semibold text-stone-600">Bestellung abgeschlossen</p>'}
      </article>`;
    }).join('');
    emptyOrders.classList.toggle('hidden', orders.length > 0);
  }

  async function refreshOrders() {
    if (refreshPending) return;
    refreshPending = true;
    try {
      const { data, error } = await requireClient()
        .from('kitchen_orders')
        .select('id,table_number,created_at,status,instructions,kitchen_order_items(id,product_name,quantity)')
        .neq('status', 'completed')
        .order('created_at', { ascending: false });
      if (error) throw error;
      const orders = data || [];
      if (!initialLoad && orders.some(order => !knownOrders.has(order.id) && order.status === 'new')) playNotification();
      knownOrders = new Set(orders.map(order => order.id));
      initialLoad = false;
      renderOrders(orders);
      dashboardError.classList.add('hidden');
    } catch (error) {
      dashboardError.textContent = `Bestellungen konnten nicht geladen werden: ${error.message || 'Verbindungsfehler'}`;
      dashboardError.classList.remove('hidden');
    } finally {
      refreshPending = false;
    }
  }

  async function openDashboard(user) {
    if (!user || !['kitchen', 'admin'].includes(user.app_metadata?.role)) {
      activeUserId = null;
      if (client) await client.auth.signOut();
      loginPanel.classList.remove('hidden');
      dashboard.classList.add('hidden');
      showLoginError('Dieses Konto hat keinen Küchenzugang.');
      return;
    }
    if (activeUserId === user.id) return;
    activeUserId = user.id;
    loginPanel.classList.add('hidden');
    dashboard.classList.remove('hidden');
    document.getElementById('logout').classList.remove('hidden');
    document.getElementById('connection-state').textContent = 'Live-Verbindung wird hergestellt …';
    await refreshOrders();
    if (client) {
      if (liveChannel) await client.removeChannel(liveChannel);
      liveChannel = client.channel('kitchen-live-orders')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'kitchen_orders' }, refreshOrders)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'kitchen_order_items' }, refreshOrders)
        .subscribe(status => {
          document.getElementById('connection-state').textContent =
            status === 'SUBSCRIBED' ? 'Live verbunden' : `Live-Status: ${status}`;
        });
    }
  }

  try {
    document.getElementById('sound-toggle').checked = localStorage.getItem('site-refresh-kitchen-sound') === 'true';
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

  orderList.addEventListener('click', async event => {
    const button = event.target.closest('[data-order-id]');
    if (!button) return;
    button.disabled = true;
    try {
      const { error } = await requireClient().rpc('update_order_status', {
        p_order_id: button.dataset.orderId,
        p_status: button.dataset.nextStatus
      });
      if (error) throw error;
      await refreshOrders();
    } catch (error) {
      dashboardError.textContent = `Status konnte nicht geändert werden: ${error.message || 'Verbindungsfehler'}`;
      dashboardError.classList.remove('hidden');
      button.disabled = false;
    }
  });

  document.getElementById('sound-toggle').addEventListener('change', event => {
    localStorage.setItem('site-refresh-kitchen-sound', String(event.target.checked));
    if (event.target.checked) playNotification();
  });

})();
