const cacheName = "mws-restaurant-cache-v1";
const cacheFiles = [
	'/index.html',
	'/restaurant.html',
  '/js/main.js',
  '/js/dbhelper.js',
	'/js/restaurant_info.js',
	'/css/styles.css',
	'/css/responsive.css',
	'/dist/img/1-320px.jpg',
	'/dist/img/1-480px.jpg',
	'/dist/img/1-640px.jpg',
	'/dist/img/2-320px.jpg',
	'/dist/img/2-480px.jpg',
	'/dist/img/2-640px.jpg',
	'/dist/img/3-320px.jpg',
	'/dist/img/3-480px.jpg',
	'/dist/img/3-640px.jpg',
	'/dist/img/4-320px.jpg',
	'/dist/img/4-480px.jpg',
	'/dist/img/4-640px.jpg',
	'/dist/img/5-320px.jpg',
	'/dist/img/5-480px.jpg',
	'/dist/img/5-640px.jpg',
	'/dist/img/6-320px.jpg',
	'/dist/img/6-480px.jpg',
	'/dist/img/6-640px.jpg',
	'/dist/img/7-320px.jpg',
	'/dist/img/7-480px.jpg',
	'/dist/img/7-640px.jpg',
	'/dist/img/8-320px.jpg',
	'/dist/img/8-480px.jpg',
	'/dist/img/8-640px.jpg',
	'/dist/img/9-320px.jpg',
	'/dist/img/9-480px.jpg',
	'/dist/img/9-640px.jpg',
	'/dist/img/10-320px.jpg',
	'/dist/img/10-480px.jpg',
	'/dist/img/10-640px.jpg'
]

// Install event
addEventListener('install', function(event){
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
	event.respondWith(
		caches.match(event.request).then(function(response){
			return response || fetch(event.request);
		})
	);
});

