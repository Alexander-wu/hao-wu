// Load a verified snapshot from our own site; visitors never query Scholar directly.
(() => {
  const counter = document.querySelector('#scholar-citation-count');
  const badge = counter?.closest('.citation-counter');
  if (!counter || !badge) return;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  fetch('citation-data.json', { cache: 'no-store', signal: controller.signal })
    .then(response => {
      if (!response.ok) throw new Error('Citation snapshot unavailable');
      return response.json();
    })
    .then(data => {
      const updated = typeof data.updated_at === 'string' ? Date.parse(data.updated_at) : NaN;
      const fallbackUpdated = Date.parse(counter.dataset.updatedAt || '');
      if (data.scholar_id !== 'HdXMhfcAAAAJ' || !Number.isSafeInteger(data.citations) ||
          data.citations < 0 || !Number.isFinite(updated) ||
          (Number.isFinite(fallbackUpdated) && updated < fallbackUpdated)) return;

      counter.textContent = new Intl.NumberFormat('en-US').format(data.citations);
      counter.dataset.updatedAt = data.updated_at;
      badge.title = `Google Scholar citations · Last successful update: ${new Date(updated).toISOString().replace('T', ' ').replace('.000Z', ' UTC')}`;
    })
    // Keep the server-rendered count and its timestamp on network/validation failure.
    .catch(() => {})
    .finally(() => clearTimeout(timeout));
})();
