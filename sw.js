self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('v1.0.1').then(function(cache) {
      return cache.addAll([
        '/',
        '/css/app.css',
        '/js/app.js',
        '/logo.png',
      ]);
    }).catch(err => console.log(err))
  );
});

self.addEventListener('fetch', function(event) {
  if (event.request.url.match('/api/')) {
   event.respondWith(
    caches.open('v1').then(function(cache) {
      return cache.match(event.request).then(function (response) {
        return response || fetch(event.request).then(function(response) {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
   )
  }
});