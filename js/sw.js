const cacheName = "mws-restaurant-cache-v1";
const cacheFiles = [
	'/',
	'/restaurant.html',
  '/js/main.js',
  '/js/dbhelper.js',
	'/js/restaurant_info.js',
	'/css/styles.css',
	'/css/responsive.css',
	'/dist/img/1-320.jpg',
	'/dist/img/1-480.jpg',
	'/dist/img/1-640.jpg',
	'/dist/img/2-320.jpg',
	'/dist/img/2-480.jpg',
	'/dist/img/2-640.jpg',
	'/dist/img/3-320.jpg',
	'/dist/img/3-480.jpg',
	'/dist/img/3-640.jpg',
	'/dist/img/4-320.jpg',
	'/dist/img/4-480.jpg',
	'/dist/img/4-640.jpg',
	'/dist/img/5-320.jpg',
	'/dist/img/5-480.jpg',
	'/dist/img/5-640.jpg',
	'/dist/img/6-320.jpg',
	'/dist/img/6-480.jpg',
	'/dist/img/6-640.jpg',
	'/dist/img/7-320.jpg',
	'/dist/img/7-480.jpg',
	'/dist/img/7-640.jpg',
	'/dist/img/8-320.jpg',
	'/dist/img/8-480.jpg',
	'/dist/img/8-640.jpg',
	'/dist/img/9-320.jpg',
	'/dist/img/9-480.jpg',
	'/dist/img/9-640.jpg',
	'/dist/img/10-320.jpg',
	'/dist/img/10-480.jpg',
	'/dist/img/10-640.jpg'
]

// Install event
self.addEventListener('install', function(event){
	console.log("Service Worker installed");
	event.waitUntil(
		caches.open(cacheName)
		.then(function(cache){
			console.log("Caching files");
			return cache.addAll(cacheFiles);
		})
	)
});

// Activate event
self.addEventListener('activate', function(event){
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
self.addEventListener('fetch', function(event){
	event.respondWith(
		caches.match(event.request).then(function(response){
			return response || fetch(event.request);
		})
	);
});