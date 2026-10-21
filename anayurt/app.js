    // Vollständige Speisekarte nach der aktuellen Ana-Yurt-Karte.
    const dishes = [
      {category:'salads',name:'Rindfleischsalat',description:'Zartes Rindfleisch mit aromatischem Chiliöl und Gewürzen.',price:'7,90 €'},
      {category:'salads',name:'Hähnchensalat mit Chilisauce',description:'Zartes Hähnchenfleisch in würziger Chilisauce.',price:'6,90 €'},
      {category:'salads',name:'Auberginensalat',description:'Frischer Auberginensalat mit Gewürzen und Kräutern.',price:'4,90 €'},
      {category:'salads',name:'Gurkensalat',description:'Frischer Salat aus Gurken, fein und leicht gewürzt.',price:'4,90 €'},
      {category:'salads',name:'Uigurischer Salat',description:'Frischer Gemüsesalat mit würzigem Dressing nach uigurischer Art.',price:'4,90 €'},
      {category:'salads',name:'Karottensalat',description:'Frischer Karottensalat, leicht gewürzt.',price:'4,90 €'},
      {category:'noodles',name:'Gebratene Nudeln mit Bärlauch',description:'Gebratene Nudeln mit aromatischem Bärlauch und Gewürzen.',price:'13,90 €'},
      {category:'noodles',name:'Ana Yurt Leghmen',description:'Handgezogene Nudeln mit Gemüse und Fleisch nach uigurischer Art.',price:'14,90 €'},
      {category:'noodles',name:'Leghmen',description:'Handgezogene Nudeln mit Fleisch, Gemüse und würziger Sauce.',price:'12,90 €'},
      {category:'noodles',name:'Suyru Leghmen',description:'Uigurische Nudelsuppe mit Fleisch, Gemüse und handgezogenen Nudeln.',price:'13,90 €'},
      {category:'noodles',name:'Dindin-Nudeln',description:'Klein geschnittene Nudeln mit Rindfleisch, Gemüse und würziger Sauce.',price:'13,90 €'},
      {category:'noodles',name:'Gebratene Nudeln mit Gemüse',description:'Gebratene Nudeln mit frischem Gemüse und aromatischen Gewürzen.',price:'13,90 €'},
      {category:'mains',name:'Kung Pao Huhn',description:'Gebratenes Huhn mit Erdnüssen, Gemüse und würziger Chilisauce.',price:'15,90 €'},
      {category:'mains',name:'Großer Teller Hähnchen',description:'Gebratenes Hähnchen mit Gemüse und Gewürzen. Großer oder kleiner Teller.',price:'14,90 € / 39,90 €'},
      {category:'mains',name:'Gebratenes Hähnchen mit Nudeln',description:'Gebratenes Hähnchen mit Nudeln und Gemüse in würziger Sauce.',price:'17,90 €'},
      {category:'mains',name:'Gebratenes Lammfleisch mit Gemüse',description:'Zart gebratenes Lammfleisch mit frischem Gemüse und Gewürzen.',price:'15,90 €'},
      {category:'dumplings',name:'Gedämpfte Teigtaschen',description:'Gedämpfte Teigtaschen, gefüllt mit Fleisch und Gewürzen.',price:'7,90 €'},
      {category:'dumplings',name:'Gebratene Teigtaschen',description:'Knusprig gebratene Teigtaschen mit Fleischfüllung.',price:'7,90 €'},
      {category:'dumplings',name:'Göchnan',description:'Uigurisches gedämpftes Brot, serviert mit Fleisch und Gemüse.',price:'11,90 €'},
      {category:'dumplings',name:'Gekochte Teigtaschen',description:'Gekochte Teigtaschen, gefüllt mit Fleisch und Gewürzen.',price:'13,90 €'},
      {category:'mains',name:'Gebratenes Lammfleisch',description:'Zart gebratenes Lammfleisch mit aromatischen Gewürzen.',price:'20,90 €'},
      {category:'mains',name:'Lammspieße',description:'Gegrillte Lammspieße mit uigurischen Gewürzen. Wahlweise ohne Beilagen oder mit Salat und Reis.',price:'11,90 € / 14,90 €'},
      {category:'mains',name:'Tonur Kebab',description:'Uigurisches Lammfleisch aus dem Tonur-Ofen. Bitte einen Tag vorher bestellen.',price:'69,90 €'},
      {category:'mains',name:'Polo',description:'Uigurischer Reis mit Lammfleisch, Karotten und Gewürzen. Nur samstags erhältlich.',price:'14,90 €'},
      {category:'mains',name:'Gebratener Spinat mit Ei',description:'Frischer Spinat, gebraten mit Ei und Gewürzen.',price:'10,90 €'},
      {category:'noodles',name:'Nudelsuppe mit geschmortem Rindfleisch',description:'Kräftige Nudelsuppe mit geschmortem Rindfleisch und Gewürzen.',price:'13,90 €'},
      {category:'noodles',name:'Klassische Nudelsuppe',description:'Traditionelle Suppe mit Nudeln, Gemüse und aromatischen Gewürzen.',price:'12,90 €'},
      {category:'noodles',name:'Nudelsalat mit Lammfleisch',description:'Breite Nudeln mit zartem Fleisch, Gemüse und würziger Sauce.',price:'13,90 €'},
      {category:'noodles',name:'Bandnudeln mit Rindfleisch',description:'Bandnudeln mit Rindfleisch und würzigem Dressing.',price:'14,90 €'},
      {category:'mains',name:'Extra Nudeln oder Reis',description:'Portion Nudeln oder Reis als Beilage.',price:'2,50 €'},
      {category:'drinks',name:'Mineralwasser still / medium',description:'Mineralwasser, klein oder groß.',price:'3,00 € / 7,00 €'},
      {category:'drinks',name:'Fritz-Kola / Fritz-Kola Zero',description:'Fritz-Kola nach Wahl.',price:'3,00 €'},
      {category:'drinks',name:'Fritz-Rhabarber',description:'Erfrischende Rhabarberlimonade von Fritz.',price:'3,00 €'},
      {category:'drinks',name:'Fritz-Apfelschorle',description:'Apfelsaftschorle von Fritz.',price:'3,00 €'},
      {category:'drinks',name:'Fritz-Limo',description:'Fritz-Limonade.',price:'3,00 €'},
      {category:'drinks',name:'Fritz-Orange',description:'Orangenlimonade von Fritz.',price:'3,00 €'},
      {category:'drinks',name:'Fritz-Mischmasch',description:'Fritz-Kola mit Orange.',price:'3,00 €'},
      {category:'drinks',name:'Eistee',description:'Erfrischender Eistee.',price:'3,50 €'},
      {category:'drinks',name:'Uigurischer Tee',description:'Traditioneller uigurischer Tee, klein oder groß.',price:'2,50 € / 7,00 €'},
      {category:'drinks',name:'Ghulja-Tee',description:'Aromatischer Tee nach Ghulja-Art, klein oder groß.',price:'2,50 € / 7,00 €'},
      {category:'drinks',name:'Grüner Tee',description:'Grüner Tee, klein oder groß.',price:'2,50 € / 7,00 €'}
    ];
    const grid = document.getElementById('menu-grid');
    // Speisen erhalten passende, neutrale Food-Fotos statt unzugeordneter Restaurant-Galeriebilder.
    const menuPhotos = {
      salads:'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=85',
      noodles:'https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=500&q=85',
      dumplings:'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=500&q=85',
      meat:'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=85',
      chicken:'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=500&q=85',
      polo:'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=500&q=85',
      drinks:'https://images.unsplash.com/photo-1658238613850-fbd27df10421?auto=format&fit=crop&w=500&q=85',
      tea:'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=500&q=85',
      water:'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=500&q=85'
    };
    const restaurantDishPhotos = {
      'Klassische Nudelsuppe':'https://anayurtuyghur.com/wp-content/uploads/2026/03/Klassische-Nudelsuppe.png',
      'Gebratene Nudeln mit Bärlauch':'https://anayurtuyghur.com/wp-content/uploads/2026/03/Gebratene-Nudeln-mit-barlauch.png',
      'Gedämpfte Teigtaschen':'https://anayurtuyghur.com/wp-content/uploads/2026/03/Gedampfte-Teigtaschen.png',
      'Gebratenes Hähnchen mit Nudeln':'https://anayurtuyghur.com/wp-content/uploads/2026/03/Gebratene-Hahnchen-mit-Nudeln.png'
    };
    function menuPhoto(dish) {
      const name = dish.name.toLowerCase();
      if (dish.category === 'drinks') return /tee/.test(name) ? menuPhotos.tea : /wasser/.test(name) ? menuPhotos.water : menuPhotos.drinks;
      if (restaurantDishPhotos[dish.name]) return restaurantDishPhotos[dish.name];
      if (/polo/.test(name)) return menuPhotos.polo;
      if (/huhn|hähnchen/.test(name)) return menuPhotos.chicken;
      if (/lamm|kebab|spieße/.test(name)) return menuPhotos.meat;
      return menuPhotos[dish.category] || menuPhotos.noodles;
    }
    function escapeHtml(value) {
      return String(value).replace(/[&<>"']/g, character => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
      })[character]);
    }
    function renderMenu(category) {
      const items = category === 'all-food' ? dishes.filter(d => d.category !== 'drinks') : dishes.filter(d => d.category === category);
      grid.innerHTML = items.map((dish, index) => {
        const priceOptions = (dish.price.match(/\d+,\d{2}/g) || []).map(value => Number(value.replace(',', '.')));
        const priceSelector = priceOptions.length > 1
          ? `<label class="flex flex-col items-end gap-1 text-[10px] text-stone-500">Preisoption<select data-price-choice class="rounded border border-stone-300 bg-white px-2 py-1 text-xs text-stone-800">${priceOptions.map((price, option) => `<option value="${price}" ${option === 0 ? 'selected' : ''}>Option ${option + 1} · ${price.toFixed(2).replace('.', ',')} €</option>`).join('')}</select></label>`
          : `<span class="text-sm font-semibold text-[#985d26]">${escapeHtml(dish.price)}</span>`;
        return `<article class="dish-card flex gap-4 rounded-xl border border-stone-200 bg-[#faf9f5] p-3 sm:gap-5 sm:p-4" data-menu-index="${dishes.indexOf(dish)}" style="animation-delay:${index % 8 * 35}ms"><img class="h-24 w-24 shrink-0 rounded-lg object-cover sm:h-28 sm:w-28" src="${menuPhoto(dish)}" alt="${escapeHtml(dish.name)} – Serviervorschlag" loading="lazy" /><div class="flex min-w-0 flex-1 flex-col justify-center"><div class="flex items-start justify-between gap-2"><h3 class="serif text-lg leading-tight sm:text-xl">${escapeHtml(dish.name)}</h3><div class="flex shrink-0 flex-col items-end gap-2">${priceSelector}<div class="flex items-center gap-2 rounded-full border border-stone-300 bg-white p-1"><button type="button" class="grid h-7 w-7 place-items-center rounded-full text-lg font-semibold hover:bg-stone-100" data-cart-action="decrease" aria-label="${escapeHtml(dish.name)} entfernen">−</button><span class="min-w-5 text-center text-sm font-semibold" data-cart-quantity>0</span><button type="button" class="grid h-7 w-7 place-items-center rounded-full bg-[#292b24] text-lg font-semibold text-white hover:bg-[#44463e]" data-cart-action="increase" aria-label="${escapeHtml(dish.name)} hinzufügen">+</button></div></div></div><p class="mt-2 line-clamp-2 text-xs leading-5 text-stone-600">${escapeHtml(dish.description)}</p></div></article>`;
      }).join('');
      refreshMenuQuantities();
    }
    const cartStorageKey = 'ana-yurt-cart';
    let cart = JSON.parse(localStorage.getItem(cartStorageKey) || '[]');
    function saveCart() {
      localStorage.setItem(cartStorageKey, JSON.stringify(cart));
      refreshMenuQuantities();
      refreshCartLink();
    }
    function selectedCartKey(dish, price) { return `${dish.name}::${Number(price).toFixed(2)}`; }
    function refreshMenuQuantities() {
      grid.querySelectorAll('[data-menu-index]').forEach(card => {
        const dish = dishes[Number(card.dataset.menuIndex)];
        const selector = card.querySelector('[data-price-choice]');
        const price = selector ? Number(selector.value) : Number((dish.price.match(/\d+,\d{2}/) || ['0'])[0].replace(',', '.'));
        const item = cart.find(row => row.key === selectedCartKey(dish, price));
        card.querySelector('[data-cart-quantity]').textContent = item ? item.quantity : '0';
      });
    }
    function refreshCartLink() {
      const link = document.getElementById('cart-link');
      const count = cart.reduce((sum, item) => sum + item.quantity, 0);
      link.classList.toggle('hidden', count === 0);
      link.querySelector('[data-cart-count]').textContent = `${count} ${count === 1 ? 'Artikel' : 'Artikel'}`;
      link.querySelector('[data-cart-total]').textContent = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
    }
    grid.addEventListener('change', refreshMenuQuantities);
    grid.addEventListener('click', event => {
      const action = event.target.closest('[data-cart-action]');
      if (!action) return;
      const card = action.closest('[data-menu-index]');
      const dish = dishes[Number(card.dataset.menuIndex)];
      const selector = card.querySelector('[data-price-choice]');
      const price = selector ? Number(selector.value) : Number((dish.price.match(/\d+,\d{2}/) || ['0'])[0].replace(',', '.'));
      const key = selectedCartKey(dish, price);
      const item = cart.find(row => row.key === key);
      if (action.dataset.cartAction === 'increase') {
        if (item) item.quantity += 1;
        else cart.push({ key, name: dish.name, unitPrice: price, quantity: 1, image: menuPhoto(dish) });
      } else if (item) {
        item.quantity -= 1;
        if (!item.quantity) cart = cart.filter(row => row.key !== key);
      }
      saveCart();
    });
    refreshCartLink();
    document.querySelectorAll('.menu-tab[data-category]').forEach(tab => tab.addEventListener('click', () => {
      document.querySelectorAll('.menu-tab').forEach(item => item.setAttribute('aria-selected', 'false'));
      tab.setAttribute('aria-selected', 'true'); renderMenu(tab.dataset.category);
    }));
    renderMenu('all-food');

    // Mobile navigation toggle and close-on-navigation.
    const mobileButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    mobileButton.addEventListener('click', () => { const open = mobileButton.getAttribute('aria-expanded') === 'true'; mobileButton.setAttribute('aria-expanded', String(!open)); mobileMenu.classList.toggle('hidden', open); mobileButton.setAttribute('aria-label', open ? 'Navigation öffnen' : 'Navigation schließen'); });
    mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { mobileMenu.classList.add('hidden'); mobileButton.setAttribute('aria-expanded', 'false'); }));

    const dateInput = document.querySelector('input[name="date"]');
    const localDate = () => { const now = new Date(); now.setMinutes(now.getMinutes() - now.getTimezoneOffset()); return now.toISOString().slice(0, 10); };
    dateInput.min = localDate();
    const toast = document.getElementById('toast'); let toastTimer;
    function showToast() { toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 6500); }
    const reservationForm = document.getElementById('reservation-form');
    const reservationStatus = document.getElementById('reservation-status');
    reservationForm.addEventListener('submit', async event => {
      event.preventDefault();
      if (!reservationForm.reportValidity()) return;
      const submitButton = reservationForm.querySelector('[type="submit"]');
      submitButton.disabled = true;
      submitButton.classList.add('opacity-60', 'cursor-wait');
      reservationStatus.textContent = 'Ihre Anfrage wird gesendet …';
      reservationStatus.classList.remove('text-red-700');
      try {
        const response = await fetch('/api/reservations', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(Object.fromEntries(new FormData(reservationForm)))
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Die Anfrage konnte nicht gespeichert werden.');
        reservationStatus.textContent = 'Gespeichert! Wir melden uns zur Bestätigung bei Ihnen.';
        reservationForm.reset();
        dateInput.min = localDate();
        showToast();
      } catch (error) {
        reservationStatus.textContent = error.message || 'Verbindung fehlgeschlagen. Bitte versuchen Sie es erneut.';
        reservationStatus.classList.add('text-red-700');
      } finally {
        submitButton.disabled = false;
        submitButton.classList.remove('opacity-60', 'cursor-wait');
      }
    });
    document.getElementById('toast-close').addEventListener('click', () => toast.classList.remove('show'));
    document.getElementById('year').textContent = new Date().getFullYear();
