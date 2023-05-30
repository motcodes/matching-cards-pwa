import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { defineConfig } from 'vite';

export default defineConfig({
	define: {
		'process.env.NODE_ENV': process.env.NODE_ENV === 'production' ? '"production"' : '"development"'
	},
	plugins: [
		sveltekit(),
		SvelteKitPWA({
			strategies: process.env.NODE_ENV !== 'production' ? 'injectManifest' : 'generateSW',
			srcDir: 'src',
			filename: 'service-worker.js',
			devOptions: {
				enabled: process.env.NODE_ENV !== 'production',
				type: 'module',
				navigateFallback: '/'
			}
		})
	]
});
