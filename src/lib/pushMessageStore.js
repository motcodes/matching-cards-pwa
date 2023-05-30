import { writable } from 'svelte/store';

const createPushMsgStore = () => {
	const { subscribe, set, update } = writable({
		isSubscribed: false,
		buttonText: 'subscribe'
	});

	const setIsSubscribed = (value) => update((state) => ({ ...state, isSubscribed: value }));
	const setButtonText = (value) => update((state) => ({ ...state, buttonText: value }));

	return {
		update,
		subscribe,
		set,
		setIsSubscribed,
		setButtonText
	};
};
export const pushMessageStore = createPushMsgStore();
