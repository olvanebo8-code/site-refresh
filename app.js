    // Beispielkarte der fiktiven Trattoria Sorella.
    const dishes = [
      {category:"salads",name:"Caprese",description:"Tomaten, Mozzarella, Basilikum und Olivenöl.",price:"9,50 €"},
      {category:"salads",name:"Burrata mit Pfirsich",description:"Burrata, Pfirsich, Rucola und Balsamico.",price:"12,50 €"},
      {category:"salads",name:"Caesar Salad",description:"Römersalat, Parmesan, Croûtons und hausgemachtes Dressing.",price:"10,50 €"},
      {category:"salads",name:"Antipasti misti",description:"Gegrillte Zucchini, Paprika und Aubergine.",price:"11,00 €"},
      {category:"salads",name:"Bruschetta al pomodoro",description:"Geröstetes Brot mit Tomaten, Knoblauch und Basilikum.",price:"7,50 €"},
      {category:"noodles",name:"Tagliatelle al ragù",description:"Frische Bandnudeln mit Rinderragù und Parmesan.",price:"16,50 €"},
      {category:"noodles",name:"Spaghetti aglio e olio",description:"Spaghetti mit Knoblauch, Olivenöl, Petersilie und Chili.",price:"13,00 €"},
      {category:"noodles",name:"Pappardelle ai funghi",description:"Breite Eiernudeln mit Pilzen, Thymian und Parmesan.",price:"17,00 €"},
      {category:"noodles",name:"Penne all’arrabbiata",description:"Penne in Tomatensauce mit Knoblauch und Chili.",price:"14,00 €"},
      {category:"noodles",name:"Ravioli ricotta e spinaci",description:"Ravioli mit Ricotta und Spinat in Salbeibutter.",price:"17,50 €"},
      {category:"noodles",name:"Lasagne al forno",description:"Pasta mit Rinderragù, Béchamel und Parmesan.",price:"17,00 €"},
      {category:"mains",name:"Pollo alla griglia",description:"Gegrilltes Hähnchen mit Rosmarinkartoffeln und Kräutersalat.",price:"19,50 €"},
      {category:"mains",name:"Saltimbocca alla romana",description:"Kalbsschnitzel mit Parmaschinken und Salbei.",price:"24,00 €"},
      {category:"mains",name:"Branzino al forno",description:"Ofengebackener Wolfsbarsch mit Zitrone und Gemüse.",price:"25,50 €"},
      {category:"mains",name:"Melanzane alla parmigiana",description:"Aubergine mit Tomate, Mozzarella und Parmesan.",price:"18,00 €"},
      {category:"mains",name:"Bistecca al pepe verde",description:"Rindersteak mit Pfeffersauce und gegrilltem Gemüse.",price:"29,00 €"},
      {category:"mains",name:"Risotto ai funghi",description:"Cremiges Risotto mit Pilzen, Thymian und Parmesan.",price:"18,00 €"},
      {category:"mains",name:"Gnocchi al pesto",description:"Kartoffelgnocchi mit Basilikumpesto und Pinienkernen.",price:"16,50 €"},
      {category:"dumplings",name:"Focaccia al rosmarino",description:"Ofenbrot mit Rosmarin und Olivenöl.",price:"6,00 €"},
      {category:"dumplings",name:"Arancini",description:"Knusprige Risottobällchen mit Mozzarella und Tomate.",price:"8,50 €"},
      {category:"dumplings",name:"Calzone classico",description:"Teigtasche mit Mozzarella, Tomate und Basilikum.",price:"15,50 €"},
      {category:"dumplings",name:"Panzerotti",description:"Gebackene Teigtaschen mit Ricotta und Spinat.",price:"9,50 €"},
      {category:"drinks",name:"Acqua naturale / frizzante",description:"Italienisches Mineralwasser, still oder prickelnd.",price:"3,50 € / 6,50 €"},
      {category:"drinks",name:"Limonata",description:"Italienische Zitronenlimonade.",price:"4,00 €"},
      {category:"drinks",name:"Espresso",description:"Kräftiger Espresso aus frisch gemahlenen Bohnen.",price:"3,00 €"},
      {category:"drinks",name:"Cappuccino",description:"Espresso mit cremig aufgeschäumter Milch.",price:"4,50 €"},
      {category:"drinks",name:"Aperol Spritz",description:"Aperol, Prosecco und Soda mit Orangenscheibe.",price:"9,00 €"},
      {category:"drinks",name:"Primitivo",description:"Fruchtiger Rotwein aus Apulien.",price:"8,00 € / 26,00 €"},
      {category:"drinks",name:"Pinot Grigio",description:"Weißwein mit Noten von Birne und Zitrus.",price:"8,00 € / 26,00 €"}
    ];    const grid = document.getElementById('menu-grid');
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
    const restaurantDishPhotos = {};
    function menuPhoto(dish) {
      const name = dish.name.toLowerCase();
      if (dish.category === 'drinks') return /tee/.test(name) ? menuPhotos.tea : /wasser/.test(name) ? menuPhotos.water : menuPhotos.drinks;
      if (/risotto|ravioli|gnocchi|lasagne|arancini/.test(name)) return menuPhotos.dumplings;
      if (/pollo/.test(name)) return menuPhotos.chicken;
      if (/huhn|hähnchen/.test(name)) return menuPhotos.chicken;
      if (/bistecca|rag[uù]|saltimbocca/.test(name)) return menuPhotos.meat;
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
    const cartStorageKey = 'site-refresh-cart';
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
        const booking = Object.fromEntries(new FormData(reservationForm));
        const message = [
          'Hallo, ich möchte einen Tisch in der Trattoria Sorella reservieren.',
          `Name: ${booking.name}`, `E-Mail: ${booking.email}`, `Telefon: ${booking.phone}`,
          `Personen: ${booking.guests}`, `Datum: ${booking.date}`, `Uhrzeit: ${booking.time}`,
          booking.requests ? `Hinweise: ${booking.requests}` : ''
        ].filter(Boolean).join('\n');
        reservationStatus.textContent = 'Online-Speicherung ist in dieser Demo nicht verfügbar. Rufen Sie uns für eine Reservierung an: ';
        reservationStatus.classList.remove('text-red-700');
        const whatsappLink = document.createElement('a');
        whatsappLink.href = `tel:+493055501234`;
        whatsappLink.target = '_blank';
        whatsappLink.rel = 'noopener noreferrer';
        whatsappLink.className = 'font-semibold text-[#9f6227] underline';
        whatsappLink.textContent = 'Per WhatsApp senden';
        reservationStatus.appendChild(whatsappLink);
      } finally {
        submitButton.disabled = false;
        submitButton.classList.remove('opacity-60', 'cursor-wait');
      }
    });
    document.getElementById('toast-close').addEventListener('click', () => toast.classList.remove('show'));
    document.getElementById('year').textContent = new Date().getFullYear();
