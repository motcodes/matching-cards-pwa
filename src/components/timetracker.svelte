<script>
	import { onMount, onDestroy } from 'svelte';
	import { writable, derived } from 'svelte/store';
	import { formatTime } from '../lib/formateTime';
	import { gameStore } from '../lib/gameStore';

	let interval;

	function startTimer() {
		interval = setInterval(() => {
			gameStore.updateTime();
		}, 10);
	}

	function stopTimer() {
		clearInterval(interval);
	}

	// Derive a readable store to display the formatted time
	const formattedTime = derived(gameStore, ($gameStore) => formatTime($gameStore.elapsedTime));

	// Reset the elapsed time
	function resetTimer() {
		gameStore.resetTime();
	}

	onMount(() => {
		resetTimer();
	});

	onDestroy(() => {
		stopTimer();
	});

	export { stopTimer, startTimer, resetTimer };
</script>

<div>
	<p>Elapsed Time: <span class="time">{$formattedTime}</span></p>
	<button on:click={startTimer}>Start</button>
	<button on:click={stopTimer}>Stop</button>
	<button on:click={resetTimer}>Reset</button>
</div>

<style>
	.time {
		font-variant-numeric: tabular-nums;
	}
</style>
