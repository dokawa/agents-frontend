export const getPronunciatioContent = (emojiCode) => {
	const emojiValue = parseInt(emojiCode, 16)
	return !isNaN(emojiValue) ? String.fromCodePoint(emojiValue) : ""
}

export const getInitials = (curr_persona_name) => {
	// This is what gives the pronunciatio balloon the name initials. We
	// use regex to extract the initials of the personas.
	// E.g., "Dolores Murphy" -> "DM"
	return getInitialsFromCamelCase(curr_persona_name)
}

const getInitialsFromCamelCase = (curr_persona_name) => {
	const words = curr_persona_name.match(/[A-Z]*[^A-Z]*/g)

	// Extract the first letter from each word and concatenate them
	const initials = words.map((word) => word.charAt(0)).join("")

	return initials.toUpperCase()
}

// const getInitialsFromSnakeCase = (curr_persona_name) => {
// 	let rgx = new RegExp(/(\p{L}{1})\p{L}+/, "gu")
// 	let initials = [...curr_persona_name.matchAll(rgx)] || []
// 	initials = ((initials.shift()?.[1] || "") + (initials.pop()?.[1] || "")).toUpperCase()
// 	return initials
// }

// const camelCaseToName = (inputString) => {
// 	// Add a space before each uppercase letter that is not at the beginning
// 	const spacedString = inputString.replace(/([a-z])([A-Z])/g, "$1 $2")

// 	// Capitalize the first letter of each word
// 	const nameFormat = spacedString.replace(/\b\w/g, (char) => char.toUpperCase())

// 	return nameFormat
// }
