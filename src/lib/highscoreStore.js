import { writable } from 'svelte/store';

const createHighscoreStore = () => {
	const initialValue =
		typeof localStorage !== 'undefined' ? JSON.parse(localStorage.getItem('highscore')) || [] : [];
	const { subscribe, set, update } = writable(initialValue);

	const resetHighscores = () => {
		highscoreStore.set([]);
		localStorage.removeItem('highscore');
	};

	const setHighscore = (value) => {
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem('highscore', JSON.stringify(value));
		}
		set(value);
	};

	return {
		update,
		subscribe,
		set: setHighscore,
		reset: resetHighscores
	};
};

export const highscoreStore = createHighscoreStore();
