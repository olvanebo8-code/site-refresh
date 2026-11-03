(() => {
  const { validTable, euro, uuid, escapeHtml, client, requireClient, showSetupMessage } = window.restaurantOrdering;
  const grid = document.getElementById('table-grid');
  const itemsElement = document.getElementById('order-items');
  const totalElement = document.getElementById('order-total');
  const submitButton = document.getElementById('submit-order');
  const errorElement = document.getElementById('order-error');
  const requestedTable = new URLSearchParams(location.search).get('table');
  const initialTable = validTable(requestedTable);
  let selectedTable = null;
  let cart = [];
  let productById = new Map();
  let submissionId = sessionStorage.getItem('site-refresh-submission-id');
  let submitted = false;

  function showError(message) {
    errorElement.textContent = message;
    errorElement.classList.remove('hidden');
  }

  function renderItems() {
    const lines = [];
    let total = 0;
    for (const item of cart) {
      const product = productById.get(item.productId);
      if (!product) continue;
      const lineTotal = product.price_cents * item.quantity;
      total += lineTotal;
      lines.push(`<div class="flex items-start justify-between gap-4 py-3 text-sm"><span>${escapeHtml(product.name)} <span class="text-stone-500">× ${item.quantity}</span></span><span class="shrink-0 font-semibold">${euro(lineTotal)}</span></div>`);
    }
    itemsElement.innerHTML = lines.join('');
    totalElement.textContent = euro(total);
    if (!cart.length) {
      itemsElement.innerHTML = '<p class="py-4 text-sm text-stone-500">Ihr Warenkorb ist leer. <a class="font-semibold text-[#8f5825] underline" href="index.html#menu">Zur Speisekarte</a></p>';
    }
    submitButton.disabled = submitted || !selectedTable || !cart.length || productById.size === 0;
  }

  function selectTable(number) {
    selectedTable = number;
    const url = new URL(location.href);
    url.searchParams.set('table', String(number));
    history.replaceState(null, '', url);
    document.getElementById('back-to-cart').href = `checkout.html?table=${number}`;
    document.getElementById('invalid-table').classList.add('hidden');
    grid.querySelectorAll('.table-choice').forEach(button => {
      button.setAttribute('aria-pressed', String(Number(button.dataset.table) === number));
    });
    document.getElementById('table-message').textContent = `Tisch ${number} ist ausgewählt. Prüfen Sie Ihre Bestellung und senden Sie sie an unsere Küche.`;
    renderItems();
  }

  async function initialize() {
    showSetupMessage(errorElement);
    if (!client) {
      submitButton.disabled = true;
      return;
    }
    if (requestedTable && !initialTable) document.getElementById('invalid-table').classList.remove('hidden');
    try {
      const supabase = requireClient();
      const { data: products, error: productError } = await supabase
        .from('products')
        .select('id,name,price_cents,active')
        .eq('active', true);
      if (productError) throw productError;
      const tables = Array.from({ length: 20 }, (_, index) => ({ number: index + 1, label: `Tisch ${index + 1}` }));
      productById = new Map((products || []).map(product => [product.id, product]));
      grid.innerHTML = tables.map(table =>
        `<button type="button" class="table-choice min-h-16 rounded-xl border border-stone-300 bg-white px-3 py-4 text-sm font-semibold transition hover:border-[#bd762d]" data-table="${table.number}" aria-pressed="false">${escapeHtml(table.label)}</button>`
      ).join('');
      grid.addEventListener('click', event => {
        const button = event.target.closest('.table-choice');
        if (button) selectTable(Number(button.dataset.table));
      });
      if (initialTable && tables.some(table => table.number === initialTable)) selectTable(initialTable);
      else if (initialTable) document.getElementById('invalid-table').classList.remove('hidden');

      try {
        const stored = JSON.parse(localStorage.getItem('site-refresh-cart') || '[]');
        if (!Array.isArray(stored)) throw new Error('Der Warenkorb ist ungültig.');
        cart = stored.reduce((items, item) => {
          if (typeof item.productId !== 'string' || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 20) {
            throw new Error('Bitte prüfen Sie die Artikel in Ihrem Warenkorb.');
          }
          const existing = items.find(row => row.productId === item.productId);
          if (existing) {
            existing.quantity += item.quantity;
            if (existing.quantity > 20) throw new Error('Pro Artikel sind höchstens 20 Portionen möglich.');
          }
          else items.push({ productId: item.productId, quantity: item.quantity });
          return items;
        }, []);
        if (cart.some(item => !productById.has(item.productId))) {
          throw new Error('Ein Artikel ist nicht mehr verfügbar. Bitte aktualisieren Sie Ihre Speisekartenauswahl.');
        }
      } catch (error) {
        showError(error.message || 'Der Warenkorb konnte nicht gelesen werden.');
        return;
      }

      if (!cart.length) showError('Ihr Warenkorb ist leer. Bitte wählen Sie zuerst Gerichte aus der Speisekarte.');
      else if (productById.size) errorElement.classList.add('hidden');
      renderItems();
    } catch (error) {
      showError(`Die Bestelldaten konnten nicht geladen werden: ${error.message || 'Verbindungsfehler'}`);
    }
  }

  submitButton.addEventListener('click', async () => {
    if (submitted || !selectedTable || !cart.length) return;
    submitButton.disabled = true;
    submitButton.textContent = 'Wird übermittelt …';
    errorElement.classList.add('hidden');
    try {
      let orderId;
      submissionId = submissionId || uuid();
      sessionStorage.setItem('site-refresh-submission-id', submissionId);
      const { data, error } = await requireClient().rpc('submit_order', {
        p_table_number: selectedTable,
        p_items: cart.map(item => ({ product_id: item.productId, quantity: item.quantity })),
        p_instructions: document.getElementById('instructions').value.trim(),
        p_submission_id: submissionId
      });
      if (error) throw error;
      orderId = data.id;
      sessionStorage.removeItem('site-refresh-submission-id');
      submitted = true;
      localStorage.removeItem('site-refresh-cart');
      document.getElementById('success-order-id').textContent = String(orderId).slice(0, 8).toUpperCase();
      document.getElementById('order-success').classList.remove('hidden');
      document.getElementById('instructions').disabled = true;
      submitButton.classList.add('hidden');
    } catch (error) {
      showError(`Die Bestellung konnte nicht übermittelt werden: ${error.message || 'Bitte versuchen Sie es erneut.'}`);
      submitButton.disabled = false;
      submitButton.textContent = 'Bestellung abschicken';
    }
  });

  initialize();
})();
