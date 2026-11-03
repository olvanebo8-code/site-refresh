(() => {
  const storageKey = 'site-refresh-cart';
  const list = document.getElementById('checkout-items');
  const emptyCart = document.getElementById('empty-cart');
  const summary = document.getElementById('checkout-summary');
  const totalElement = document.getElementById('checkout-total');
  const receipt = document.getElementById('receipt-print');
  const receiptItems = document.getElementById('receipt-items');
  const receiptTotal = document.getElementById('receipt-total');
  const placeOrderLink = document.getElementById('checkout-bestellen');
  const nameInput = document.getElementById('receipt-customer-name');
  const phoneInput = document.getElementById('receipt-customer-phone');
  const euro = amount => Number(amount).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
  const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
  let cart;
  let receiptShown = false;
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
    cart = Array.isArray(stored) ? stored : [];
  }
  catch { cart = []; }

  const requestedTable = new URLSearchParams(location.search).get('table');
  const validTable = requestedTable && (/^[1-9]$|^1[0-9]$|^20$/).test(requestedTable);
  if (validTable) placeOrderLink.href = `tisch.html?table=${requestedTable}`;

  function save() { localStorage.setItem(storageKey, JSON.stringify(cart)); render(); }
  function render() {
    cart = cart.filter(item => item && Number.isFinite(item.unitPrice) && Number.isInteger(item.quantity) && item.quantity > 0);
    const isEmpty = cart.length === 0;
    list.classList.toggle('hidden', isEmpty);
    emptyCart.classList.toggle('hidden', !isEmpty);
    summary.classList.toggle('hidden', isEmpty);
    receipt.classList.toggle('hidden', isEmpty || !receiptShown);
    const hasProductIds = cart.every(item => typeof item.productId === 'string' && item.productId.length > 0);
    placeOrderLink.classList.toggle('pointer-events-none', !hasProductIds);
    placeOrderLink.classList.toggle('opacity-50', !hasProductIds);
    placeOrderLink.setAttribute('aria-disabled', String(!hasProductIds));
    if (!hasProductIds) placeOrderLink.href = 'index.html#menu';
    list.innerHTML = cart.map((item, index) => `
      <article class="flex items-center gap-4 p-4 sm:gap-5 sm:p-5">
        <img src="${escapeHtml(item.image)}" alt="" class="h-20 w-20 shrink-0 rounded-xl object-cover sm:h-24 sm:w-24" />
        <div class="min-w-0 flex-1">
          <h2 class="serif text-lg leading-tight sm:text-xl">${escapeHtml(item.name)}</h2>
          <p class="mt-1 text-sm text-stone-600">${euro(item.unitPrice)} pro Portion</p>
          <p class="mt-1 text-sm font-semibold text-[#985d26]">${euro(item.unitPrice * item.quantity)}</p>
        </div>
        <div class="flex items-center gap-2 rounded-full border border-stone-300 p-1" aria-label="Menge ändern">
          <button type="button" data-action="decrease" data-index="${index}" class="grid h-8 w-8 place-items-center rounded-full text-lg hover:bg-stone-100" aria-label="${escapeHtml(item.name)} entfernen">−</button>
          <span class="min-w-5 text-center text-sm font-semibold" aria-live="polite">${item.quantity}</span>
          <button type="button" data-action="increase" data-index="${index}" class="grid h-8 w-8 place-items-center rounded-full bg-[#292b24] text-lg text-white hover:bg-[#44463e]" aria-label="${escapeHtml(item.name)} hinzufügen">+</button>
        </div>
      </article>`).join('');
    const total = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    totalElement.textContent = euro(total);
    receiptItems.innerHTML = cart.map(item => `<tr><td class="py-3 pr-3">${escapeHtml(item.name)}</td><td class="px-3 py-3 text-center">${item.quantity}</td><td class="px-3 py-3 text-right">${euro(item.unitPrice)}</td><td class="py-3 pl-3 text-right">${euro(item.unitPrice * item.quantity)}</td></tr>`).join('');
    receiptTotal.textContent = euro(total);
    document.getElementById('receipt-date').textContent = new Date().toLocaleDateString('de-DE');
    document.getElementById('receipt-name-print').textContent = nameInput.value.trim() || '—';
    document.getElementById('receipt-phone-print').textContent = phoneInput.value.trim() || '—';
  }

  list.addEventListener('click', event => {
    const button = event.target.closest('[data-action]');
    if (!button) return;
    const item = cart[Number(button.dataset.index)];
    if (!item) return;
    if (button.dataset.action === 'increase') {
      if (item.quantity >= 20) {
        window.alert('Pro Artikel sind höchstens 20 Portionen möglich.');
        return;
      }
      item.quantity += 1;
    }
    else item.quantity -= 1;
    if (item.quantity <= 0) cart = cart.filter(row => row !== item);
    save();
  });

  document.getElementById('show-receipt').addEventListener('click', () => {
    receiptShown = true;
    render();
    receipt.scrollIntoView({ behavior: 'smooth', block: 'start' });
    document.getElementById('receipt-customer-name').focus({ preventScroll: true });
  });
  placeOrderLink.addEventListener('click', event => {
    if (placeOrderLink.getAttribute('aria-disabled') === 'true') {
      event.preventDefault();
      window.alert('Bitte fügen Sie die Gerichte über die aktuelle Speisekarte erneut hinzu.');
    }
  });
  nameInput.addEventListener('input', render);
  phoneInput.addEventListener('input', render);
  document.getElementById('receipt-form-fields').addEventListener('submit', event => event.preventDefault());
  document.getElementById('print-receipt').addEventListener('click', () => window.print());

  window.addEventListener('storage', event => {
    if (event.key === storageKey) {
      try {
        const stored = JSON.parse(event.newValue || '[]');
        cart = Array.isArray(stored) ? stored : [];
      } catch { cart = []; }
      render();
    }
  });
  render();
})();
