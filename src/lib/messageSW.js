export const messageSW = async (payload = {}) => {
	try {
		const registration = await navigator.serviceWorker.ready;
		registration.active.postMessage(payload);
	} catch (error) {
		console.error('Error sending message to service worker:', error);
	}
};
