(() => {
  const grid = document.getElementById('qr-grid');
  const error = document.getElementById('qr-error');
  const rootUrl = new URL('../', location.href);

  if (!window.QRCode) {
    error.textContent = 'Der QR-Code-Generator konnte nicht geladen werden. Bitte prüfen Sie Ihre Internetverbindung und laden Sie die Seite erneut.';
    error.classList.remove('hidden');
    return;
  }

  grid.innerHTML = Array.from({ length: 20 }, (_, index) => {
    const table = index + 1;
    const url = new URL(rootUrl);
    url.searchParams.set('table', String(table));
    return `<article class="qr-card rounded-2xl border border-stone-200 bg-white p-5 text-center">
      <h2 class="serif text-xl">Tisch ${table}</h2>
      <div id="qr-${table}" class="qr-code mt-4 min-h-32"></div>
      <a href="${url.href}" class="mt-3 block break-all text-[10px] text-stone-500">${url.href}</a>
      <button type="button" data-download="${table}" class="print-actions mt-4 rounded-full border border-stone-300 px-4 py-2 text-xs font-semibold hover:border-[#bd762d]">QR-Code speichern</button>
    </article>`;
  }).join('');

  for (let table = 1; table <= 20; table += 1) {
    const url = new URL(rootUrl);
    url.searchParams.set('table', String(table));
    new QRCode(document.getElementById(`qr-${table}`), {
      text: url.href,
      width: 144,
      height: 144,
      colorDark: '#242720',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.H
    });
  }

  grid.addEventListener('click', event => {
    const button = event.target.closest('[data-download]');
    if (!button) return;
    const table = button.dataset.download;
    const canvas = document.querySelector(`#qr-${table} canvas`);
    if (!canvas) {
      error.textContent = `Der QR-Code für Tisch ${table} konnte nicht vorbereitet werden.`;
      error.classList.remove('hidden');
      return;
    }
    const link = document.createElement('a');
    link.download = `qr-tisch-${table}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  });
})();
