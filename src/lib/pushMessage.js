import { pushMessageStore } from './pushMessageStore';
import { swStore } from './swStore';
import { PUBLIC_PUB_KEY_MSG } from '$env/static/public';
import { urlBase64ToUint8Array } from './urlBase64ToUint8Array';

let sw = null;
swStore.subscribe((value) => {
	sw = value;
});

let msgStore = null;
pushMessageStore.subscribe((value) => {
	msgStore = value;
});

export const pushMessage = (serviceWorker) => {
	console.log('serviceWorker :', serviceWorker);
	serviceWorker.pushManager.getSubscription().then((sub) => {
		pushMessageStore.setIsSubscribed(Boolean(sub));

		updateSubscriptionOnServer(sub);

		if (msgStore.isSubscribed) {
			console.log('User subscribed');
			updateBtn(true);
		} else {
			console.log('User unsubscribed');
			subscribeUser(serviceWorker);
			updateBtn(false);
		}
	});
};

const updateSubscriptionOnServer = (subscription) =>
	subscription
		? pushMessageStore.setButtonText(JSON.stringify(subscription))
		: pushMessageStore.setButtonText(null);

function subscribeUser(serviceWorker) {
	const applicationServerKey = urlBase64ToUint8Array(PUBLIC_PUB_KEY_MSG);
	serviceWorker.pushManager
		.subscribe({
			userVisibleOnly: true,
			applicationServerKey: applicationServerKey
		})
		.then((subscription) => {
			console.log('User subscribed');
			updateSubscriptionOnServer(subscription);
			pushMessageStore.setIsSubscribed(true);
			updateBtn(true);
		})
		.catch((error) => {
			console.error('Failed to subscribe: ', error);
			updateBtn(false);
		});
}

function unsubscribeUser(serviceWorker) {
	serviceWorker.pushManager
		.getSubscription()
		.then((subscription) => {
			if (subscription) {
				return subscription.unsubscribe();
			}
		})
		.catch((error) => {
			console.log('Error unsubscribing', error);
		})
		.then((subscription) => {
			updateSubscriptionOnServer(null);
			console.log('User unsubscribed', subscription);
			pushMessageStore.setIsSubscribed(false);
			updateBtn(false);
		});
}

export const activatePush = () => (msgStore.isSubscribed ? unsubscribeUser(sw) : subscribeUser(sw));

function updateBtn(subscribed) {
	if (Notification.permission === 'denied') {
		pushMessageStore.setButtonText('Push Blocked');
		updateSubscriptionOnServer(null);
		return;
	}

	if (subscribed) {
		pushMessageStore.setButtonText('Unsubscribe');
	} else {
		pushMessageStore.setButtonText('Subscribe');
	}
}
