/// <reference types="@sveltejs/kit" />
// svelte actually registers the service worker automatically
// https://kit.svelte.dev/docs/service-workers
import { build, files, version } from '$service-worker';

// Create a unique cache name for this deployment
const CACHE = `cache-${version}`;

const ASSETS = [
	...build, // the app itself
	...files // everything in `static`
];

self.addEventListener('install', (event) => {
	// Create a new cache and add all files to it
	async function addFilesToCache() {
		const cache = await caches.open(CACHE);
		await cache.addAll(ASSETS);
	}

	event.waitUntil(addFilesToCache());
});

self.addEventListener('activate', (event) => {
	// Remove previous cached data from disk
	async function deleteOldCaches() {
		for (const key of await caches.keys()) {
			if (key !== CACHE) await caches.delete(key);
		}
	}

	event.waitUntil(deleteOldCaches());
});

self.addEventListener('fetch', (event) => {
	// ignore POST requests etc
	if (event.request.method !== 'GET') return;
	if (!(event.request.url.indexOf('http') === 0)) return;

	async function respond() {
		const url = new URL(event.request.url);
		const cache = await caches.open(CACHE);

		// `build`/`files` can always be served from the cache
		if (ASSETS.includes(url.pathname)) {
			return cache.match(url.pathname);
		}

		// for everything else, try the network first, but
		// fall back to the cache if we're offline
		try {
			const response = await fetch(event.request);

			if (response.status === 200) {
				cache.put(event.request, response.clone());
			}

			return response;
		} catch {
			return cache.match(event.request);
		}
	}

	event.respondWith(respond());
});

self.addEventListener('push', function (event) {
	const title = 'Matching Cards';

	const notificationPromise = self.registration.showNotification(title);
	event.waitUntil(notificationPromise);

	console.log('[Service Worker] Mac doesn not like push notifiactions.');
	console.log(`[Service Worker]: "${event.data.text()}"`);
});

self.addEventListener('notificationclick', function (event) {
	// Handle notification click event
	event.notification.close();
});

self.addEventListener('message', (event) => {
	switch (event.data.action) {
		case 'newEntry':
			console.log(
				`Congrats on Rank ${event.data.entry.rank} with a time of ${event.data.entry.time}!`
			);
			break;
		case 'newHighscore':
			console.log(`Congrats on a new Highscore with a time of ${event.data.newHighscore}!`);
			break;
		case 'printHighscores':
			console.log(`Highscore Table:\n`, event.data.highscore);
			break;
		default:
			break;
	}
});
