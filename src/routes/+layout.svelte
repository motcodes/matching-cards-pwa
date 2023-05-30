<script>
	import { onMount } from 'svelte';
	import { pwaInfo } from 'virtual:pwa-info';
	import { swStore } from '../lib/swStore';
	import { pushMessageStore } from '../lib/pushMessageStore';
	import { activatePush, pushMessage } from '../lib/pushMessage';
	import Header from './Header.svelte';
	import './styles.css';

	let messageStore;
	pushMessageStore.subscribe((value) => {
		messageStore = value;
	});

	let deferredPrompt = null;
	// https://vite-pwa-org.netlify.app/frameworks/sveltekit.html
	onMount(async () => {
		if (pwaInfo) {
			const { registerSW } = await import('virtual:pwa-register');
			registerSW({
				immediate: true,
				onRegistered(reg) {
					console.log(`SW Registered: `, reg);
					swStore.set(reg);
					pushMessage(reg);
				},
				onRegisterError(error) {
					console.log('SW registration error', error);
				}
			});
		}

		// install prompt
		window.addEventListener('beforeinstallprompt', function (e) {
			console.log('beforeinstallprompt Event fired');
			e.preventDefault();

			// Stash the event so it can be triggered later.
			deferredPrompt = e;
			console.log(deferredPrompt);

			return false;
		});
	});

	const installPrompt = () => {
		if (deferredPrompt !== null) {
			deferredPrompt.prompt();

			deferredPrompt.userChoice.then(function (choiceResult) {
				if (choiceResult.outcome === 'dismissed') {
					console.log('No install');
				} else {
					console.log('Add to homescreen');
				}
				deferredPrompt = null;
			});
		}
	};

	$: webManifest = pwaInfo ? pwaInfo.webManifest.linkTag : '';
</script>

<svelte:head>
	{@html webManifest}
</svelte:head>

<div class="app">
	<Header />
	<div class="buttonContainer">
		<button class="install" on:click={installPrompt}>install</button>
		<button class="push" on:click={activatePush}>{messageStore.buttonText}</button>
	</div>
	<main>
		<slot />
	</main>
</div>

<style>
	.buttonContainer {
		position: fixed;
		top: 0;
		right: 0;
		z-index: 100;
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 1rem;
	}
</style>
