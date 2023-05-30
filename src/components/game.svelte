<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { gameStore } from '../lib/gameStore';
	import Card from './card.svelte';
	import Timetracker from './timetracker.svelte';

	// to get the fn and values from the timetracker component
	let startTimer, stopTimer, elapsedTime;

	let isTracking = false;

	let state = {};
	gameStore.subscribe((value) => {
		state = value;
	});

	const getCardFlipStatus = ({ key, emoji }) => {
		const { isMatched, flippedCards } = state;

		if (isMatched[emoji]) return 'MATCHED';

		if ([flippedCards.first.key, flippedCards.second.key].includes(key)) return 'FLIPPED';

		return 'DEFAULT';
	};

	const createCardClickListener = (card) => () => {
		flipCard(card);
	};

	const flipCard = (card) => {
		if (!isTracking) {
			isTracking = true;
			startTimer();
		}

		const { flippedCards } = state;

		const isFirstFlippedCard = Object.keys(flippedCards.first).length === 0;
		if (isFirstFlippedCard) {
			return gameStore.update((prev) => ({
				...prev,
				flippedCards: { ...flippedCards, first: card }
			}));
		}

		flipSecondCard(card);
	};

	const flipSecondCard = (card) => {
		const { flippedCards, isMatched, score } = state;

		gameStore.update((prev) => ({ ...prev, flippedCards: { ...flippedCards, second: card } }));
		setTimeout(() => {
			if (flippedCards.first.emoji === card.emoji) {
				gameStore.update((prev) => ({
					...prev,
					score: score + 1,
					isMatched: { ...isMatched, [card.emoji]: true }
				}));

				if (score === 5) {
					handleWin();
				}
			}

			// it's a mismatch, so flip the cards back
			gameStore.resetCards();
		}, 250);
	};

	const handleWin = () => {
		isTracking = false;
		stopTimer();
		setTimeout(() => {
			goto('/win');
		}, 500);
	};

	onMount(() => {
		gameStore.resetGame();
	});
</script>

<svelte:head>
	<title>About</title>
	<meta name="description" content="About this app" />
</svelte:head>

<div class="game">
	<header class="score">Score: {state.score}</header>
	<Timetracker {isTracking} bind:startTimer bind:stopTimer bind:elapsedTime />
	<div class="grid">
		{#each state.cards as card}
			<Card
				hiddenValue={card.emoji}
				flipStatus={getCardFlipStatus(card)}
				onClick={createCardClickListener(card)}
			/>
		{/each}
	</div>
</div>

<style>
	.game {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		padding-block: 2rem;
	}

	.score {
		text-align: center;
		font-size: 2rem;
		position: relative;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(3, 90px);
		grid-template-rows: repeat(4, 90px);
		grid-gap: 5px;
	}
</style>
