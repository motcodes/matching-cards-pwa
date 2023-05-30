<script>
	export let flipStatus = 'DEFAULT';
	export let hiddenValue = '';
	export let onClick;
</script>

<div class="card" data-flip-status={flipStatus}>
	<button class="front" on:click={onClick}>?</button>
	<div class="back">{hiddenValue}</div>
</div>

<style>
	.card {
		position: relative;
		transition: 0.3s;
		transform-style: preserve-3d;
		height: 100%;
	}

	.card .front,
	.card .back {
		border: none;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 0.7rem;
		font-size: 3rem;
		backface-visibility: hidden;
	}

	.card .front {
		background: var(--green50);
		color: var(--green50);
		z-index: 2;
		transform: rotateY(0deg);
	}

	.card .back {
		background: var(--green90);
	}

	.card[data-flip-status='FLIPPED'],
	.card[data-flip-status='MATCHED'],
	.back {
		transform: rotateY(180deg);
	}

	.card[data-flip-status='MATCHED'] .back {
		background-color: var(--yellow);
	}
</style>
