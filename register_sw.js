if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
      await navigator.serviceWorker.ready;

      const normalize = (url) => {
        const u = new URL(url, location.origin);
        u.hash = '';
        return u.href;
      };
      const isSameOrigin = (url) => {
        try {
          return new URL(url).origin === location.origin;
        } catch {
          return false;
        }
      };

      // Grab current page + resources loaded so far
      const urls = [
        normalize(location.href),
        ...performance.getEntriesByType('resource').map(r => normalize(r.name))
      ]
        .filter(isSameOrigin)
        .filter((v, i, a) => a.indexOf(v) === i);

      const sendToSW = (list) => {
        if (list.length === 0) return;
        const msg = { type: 'CACHE_URLS', payload: list };
        if (navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage(msg);
        } else if (reg.active) {
          reg.active.postMessage(msg);
        }
      };

      sendToSW(urls);

      // Watch for new game assets as they load
      if ('PerformanceObserver' in window) {
        const po = new PerformanceObserver((list) => {
          const newUrls = list.getEntries()
            .map(e => normalize(e.name))
            .filter(isSameOrigin);
          sendToSW([...new Set(newUrls)]);
        });
        po.observe({ type: 'resource', buffered: true });
      }

    } catch (err) {
      console.error('SW registration failed', err);
    }
  });
}
``
