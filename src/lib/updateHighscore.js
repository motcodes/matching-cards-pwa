const MAX_HIGHSCORE_ENTRIES = 5;

export const updateHighscore = (newEntry = 0, highscore = []) => {
	if (newEntry === 0 || highscore.includes(newEntry)) {
		return { highscore, newHighscore: false, newEntry: false };
	}

	if (highscore.length < MAX_HIGHSCORE_ENTRIES) {
		highscore.push(newEntry);
		const _highscore = highscore.sort((a, b) => a - b);
		return {
			highscore: _highscore,
			newHighscore: isHighscore(newEntry, _highscore),
			newEntry: true
		};
	}

	// Sort the highscore array in ascending order
	const sortedHighscore = highscore.sort((a, b) => a - b);
	// Check if the new entry is shorter than any existing entry
	if (sortedHighscore.some((entry) => newEntry < entry)) {
		// Add the new entry to the sorted highscore array
		sortedHighscore.push(newEntry);

		// Sort the highscore array again
		const updatedHighscore = sortedHighscore.sort((a, b) => a - b);

		// Remove the last entry from the highscore array
		const _updatedHighscore = updatedHighscore.slice(0, MAX_HIGHSCORE_ENTRIES);
		return {
			highscore: _updatedHighscore,
			newHighscore: isHighscore(newEntry, _updatedHighscore),
			newEntry: true
		};
	}

	// If the new entry is not shorter than any existing entry,
	// return the original highscore array unchanged
	return { highscore, newHighscore: false, newEntry: false };
};

const isHighscore = (newEntry = 0, highscore = []) => newEntry === highscore[0];
