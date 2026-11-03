(() => {
  const config = window.RESTAURANT_SUPABASE_CONFIG || {};
  const client = config.url && config.anonKey && window.supabase
    ? window.supabase.createClient(config.url, config.anonKey, {
      auth: { autoRefreshToken: true, persistSession: true, detectSessionInUrl: true }
    })
    : null;

  function requireClient() {
    if (!client) {
      throw new Error('Supabase ist noch nicht eingerichtet. Bitte Projekt-URL und anon/public key in supabase-config.js eintragen und database/supabase.sql im Supabase SQL Editor ausführen.');
    }
    return client;
  }

  function showSetupMessage(element) {
    if (client || !element) return;
    const hasConfig = Boolean(config.url && config.anonKey);
    element.textContent = hasConfig
      ? 'Die Supabase-Bibliothek konnte nicht geladen werden. Prüfen Sie Ihre Internetverbindung und ob das CDN erreichbar ist.'
      : 'Supabase ist noch nicht verbunden. Tragen Sie die Projekt-URL und den anon/public key in supabase-config.js ein und führen Sie database/supabase.sql im Supabase SQL Editor aus.';
    element.classList.remove('hidden');
  }

  function validTable(value) {
    return typeof value === 'string' && /^(?:[1-9]|1[0-9]|20)$/.test(value) ? Number(value) : null;
  }

  function euro(cents) {
    return (Number(cents || 0) / 100).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
  }

  function uuid() {
    if (crypto.randomUUID) return crypto.randomUUID();
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    bytes[6] = (bytes[6] & 15) | 64;
    bytes[8] = (bytes[8] & 63) | 128;
    const hex = [...bytes].map(byte => byte.toString(16).padStart(2, '0')).join('');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, character => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[character]);
  }

  window.restaurantOrdering = { client, requireClient, showSetupMessage, validTable, euro, uuid, escapeHtml };
})();
