<script>
	import { get } from 'svelte/store';
	import { onMount } from 'svelte';

	import { formatTime } from '../../lib/formateTime';
	import { gameStore } from '../../lib/gameStore';
	import { highscoreStore } from '../../lib/highscoreStore';
	import { updateHighscore } from '../../lib/updateHighscore';
	import { messageSW } from '../../lib/messageSW';
	import { swStore } from '../../lib/swStore';

	let sw;
	swStore.subscribe((value) => {
		sw = value;
	});

	let isNewHighscore = false;
	let isNewEntry = false;

	const { elapsedTime } = get(gameStore);
	let highscores;
	if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
		highscoreStore.subscribe((value) => {
			highscores = value;
		});
	}
	const formattedTime = formatTime(elapsedTime);

	onMount(async () => {
		isNewEntry = false;
		isNewHighscore = false;
		if (typeof elapsedTime === 'number') {
			const { highscore, newEntry, newHighscore } = updateHighscore(elapsedTime, highscores);
			highscoreStore.set(highscore);

			if (newEntry) {
				isNewEntry = true;
				sw.showNotification('New Entry!', {
					body: `You made it into the highscore with ${formatTime(elapsedTime)}!`,
					icon: '/favicon.ico'
				});
				messageSW({
					entry: {
						time: formatTime(elapsedTime),
						rank: highscore.findIndex((a) => a === elapsedTime) + 1
					},
					action: 'newEntry'
				});
			}
			if (newHighscore) {
				isNewHighscore = true;
				sw.showNotification('New Highscore!', {
					body: `You beat the old highscore of ${formatTime(highscore[1])} with ${formatTime(
						elapsedTime
					)}!`,
					icon: '/favicon.ico'
				});
				messageSW({ newHighscore: formatTime(elapsedTime), action: 'newHighscore' });
			}
			messageSW({
				highscore: highscore.map((item, index) => `${index + 1}: ${formatTime(item)}\n`).join(''),
				action: 'printHighscores'
			});
		}
	});
</script>

<div class="container">
	<div class="win">
		<div class="head">
			<div class="emoji">🎉</div>
			{#if isNewHighscore}
				<h1>New Highscore!</h1>
			{:else if isNewEntry}
				<h1>New Entry!</h1>
			{/if}
			<p>Highscore: {formatTime(highscores[0])}</p>
			<h2>Time: {formattedTime}</h2>
		</div>
		<div class="buttonContainer">
			<a class="button" href="/game">New Game</a>
		</div>
	</div>
</div>

<style>
	.win {
		position: absolute;
		bottom: 2.5rem;
		left: 0;
		right: 0;
		color: var(--green10);
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		margin: 0 1.125rem;
		border-radius: 1rem;
		background-color: var(--yellow);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
	}

	.head {
		padding-bottom: 6rem;
		text-align: center;
		font-size: 1.2rem;
	}

	.emoji {
		font-size: 6rem;
	}

	.buttonContainer {
		padding: 2rem 1.125rem;
		width: 100%;
		flex-grow: 1;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.button {
		display: flex;
		justify-content: center;
		text-decoration: none;
		width: 100%;
		background-color: var(--green10);
		color: var(--yellow);
		border: none;
		border-radius: 0.5rem;
		padding: 0.625rem;
		font-family: JubileeSilver;
		font-size: 1.5rem;
		line-height: 100%;

		&:visited {
			color: var(--yellow);
		}
	}
</style>
