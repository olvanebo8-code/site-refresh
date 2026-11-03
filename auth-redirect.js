(() => {
  const params = new URLSearchParams(window.location.hash.slice(1));
  const authType = params.get('type');
  const authError = params.has('error') || params.has('error_code');
  if (!['invite', 'recovery'].includes(authType) && !authError) return;

  const destination = new URL('admin/', window.location.href);
  destination.search = window.location.search;
  destination.hash = window.location.hash;
  window.location.replace(destination.href);
})();
