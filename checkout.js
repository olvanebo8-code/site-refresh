(() => {
  const storageKey = 'ana-yurt-cart';
  const list = document.getElementById('checkout-items');
  const emptyCart = document.getElementById('empty-cart');
  const summary = document.getElementById('checkout-summary');
  const totalElement = document.getElementById('checkout-total');
  const receipt = document.getElementById('receipt-print');
  const receiptItems = document.getElementById('receipt-items');
  const receiptTotal = document.getElementById('receipt-total');
  const nameInput = document.getElementById('receipt-customer-name');
  const phoneInput = document.getElementById('receipt-customer-phone');
  const euro = amount => Number(amount).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
  const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
  let cart;
  let receiptShown = false;
  try { cart = JSON.parse(localStorage.getItem(storageKey) || '[]'); }
  catch { cart = []; }

  function save() { localStorage.setItem(storageKey, JSON.stringify(cart)); render(); }
  function render() {
    cart = cart.filter(item => Number.isFinite(item.unitPrice) && item.quantity > 0);
    const isEmpty = cart.length === 0;
    list.classList.toggle('hidden', isEmpty);
    emptyCart.classList.toggle('hidden', !isEmpty);
    summary.classList.toggle('hidden', isEmpty);
    receipt.classList.toggle('hidden', isEmpty || !receiptShown);
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
    if (button.dataset.action === 'increase') item.quantity += 1;
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
  nameInput.addEventListener('input', render);
  phoneInput.addEventListener('input', render);
  document.getElementById('receipt-form-fields').addEventListener('submit', event => event.preventDefault());
  document.getElementById('print-receipt').addEventListener('click', () => window.print());

  window.addEventListener('storage', event => {
    if (event.key === storageKey) {
      try { cart = JSON.parse(event.newValue || '[]'); } catch { cart = []; }
      render();
    }
  });
  render();
})();
