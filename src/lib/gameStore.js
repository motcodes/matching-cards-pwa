import { writable } from 'svelte/store';
import { generateGridCards } from './generateGridCards';

const DEFAULT_CARD = {};
const DEFAULT_GAME = {
	cards: generateGridCards(),
	flippedCards: {
		first: DEFAULT_CARD,
		second: DEFAULT_CARD
	},
	isMatched: {},
	score: 0,
	elapsedTime: 0
};

function createGame() {
	const { set, update, subscribe } = writable(DEFAULT_GAME);

	const resetCards = () =>
		update((state) => ({
			...state,
			flippedCards: {
				first: DEFAULT_CARD,
				second: DEFAULT_CARD
			}
		}));

	const updateTime = () => update((state) => ({ ...state, elapsedTime: state.elapsedTime + 10 }));
	const resetTime = () => update((state) => ({ ...state, elapsedTime: 0 }));

	const resetGame = () => set(DEFAULT_GAME);

	return {
		set,
		update,
		subscribe,
		resetCards,
		updateTime,
		resetTime,
		resetGame
	};
}

export const gameStore = createGame();
