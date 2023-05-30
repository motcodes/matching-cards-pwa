export const formatTime = (ms) => {
	const milliseconds = Math.floor(ms / 10) % 100;
	const seconds = Math.floor(ms / 1000) % 60;
	const minutes = Math.floor(ms / 1000 / 60) % 60;
	return `${minutes.toString().padStart(2, '0')}:${seconds
		.toString()
		.padStart(2, '0')}:${milliseconds.toString().padStart(2, '0')}`;
};
