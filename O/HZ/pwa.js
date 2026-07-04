/* PWA glue: registers the service worker.
   The browser's own address-bar install icon is used to install — no in-page button. */
(function () {
  if ('serviceWorker' in navigator) {
    addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function () {});
    });
  }
})();
