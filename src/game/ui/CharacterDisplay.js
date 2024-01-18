export const CharacterDisplay = ({ agent, pronunciatios }) => {
	const getEmoji = () => {
		if (pronunciatios[agent.key]) {
			const content = pronunciatios[agent.key].text
			const parts = content.split(":")
			const emoji = parts[1]
			return emoji
		}
		return ""
	}

	console.log("pronun", agent, pronunciatios)
	return (
		agent && (
			<div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
				<img
					className='media-object'
					src={`assets/characters/profile/${agent.spriteName}.png`}
					style={{ width: "2em" }}
				></img>
				<div>{agent.name}</div>
				<div>{getEmoji()}</div>
			</div>
		)
	)
}
