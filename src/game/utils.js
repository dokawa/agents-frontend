export const getPronunciatioContent = (emojiCode) => {
	const emojiValue = parseInt(emojiCode, 16)
	return !isNaN(emojiValue) ? String.fromCodePoint(emojiValue) : ""
}
