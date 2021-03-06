const cacheName = "mws-restaurant-cache-v26";
const cacheFiles = [
	'/',
	'/css/styles.css',
	'/js/dbhelper.js',
  '/js/main.js',
  '/js/restaurant_info.js',
	'/dist/img/1-320px.webp',
	'/dist/img/1-480px.webp',
	'/dist/img/1-640px.webp',
	'/dist/img/2-320px.webp',
	'/dist/img/2-480px.webp',
	'/dist/img/2-640px.webp',
	'/dist/img/3-320px.webp',
	'/dist/img/3-480px.webp',
	'/dist/img/3-640px.webp',
	'/dist/img/4-320px.webp',
	'/dist/img/4-480px.webp',
	'/dist/img/4-640px.webp',
	'/dist/img/5-320px.webp',
	'/dist/img/5-480px.webp',
	'/dist/img/5-640px.webp',
	'/dist/img/6-320px.webp',
	'/dist/img/6-480px.webp',
	'/dist/img/6-640px.webp',
	'/dist/img/7-320px.webp',
	'/dist/img/7-480px.webp',
	'/dist/img/7-640px.webp',
	'/dist/img/8-320px.webp',
	'/dist/img/8-480px.webp',
	'/dist/img/8-640px.webp',
	'/dist/img/9-320px.webp',
	'/dist/img/9-480px.webp',
	'/dist/img/9-640px.webp',
	'/dist/img/10-320px.webp',
	'/dist/img/10-480px.webp',
	'/dist/img/10-640px.webp'
]

// Install event
addEventListener('install', function(event){
	console.log("Service Worker installed");
	event.waitUntil(
		caches.open(cacheName)
		.then(function(cache){
			console.log("Caching files");
			return cache.addAll(cacheFiles)
			.then(self.skipWaiting());
		})
	)
});

// Activate event
addEventListener('activate', function(event){
	console.log("Service worker activated");
	event.waitUntil(
		caches.keys().then(function(cacheNames){
			return Promise.all(cacheNames.map(function(thisCacheName){
				if(thisCacheName !== cacheName) {
					console.log("Removing cached files from", thisCacheName);
					return caches.delete(thisCacheName);
				}
			}))
		})
	)
});

// Fetch event
addEventListener('fetch', function(event){
	const url = event.request.url.split(/[?#]/)[0];
	event.respondWith(
		caches.match(event.request).then(cachedResponse => {
			if (cachedResponse) {
				return cachedResponse;
			}
			return caches.open(cacheName).then(cache => {
				return fetch(event.request).then(response => {
					return cache.put(url, response.clone()).then(() => {
						return response;
					});
				});
			});
		})
	);
});

