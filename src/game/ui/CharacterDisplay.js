export const CharacterDisplay = ({ agent, pronunciatios, onCharacterClick }) => {
	const getEmoji = () => {
		if (pronunciatios[agent.key]) {
			const content = pronunciatios[agent.key].text
			const parts = content.split(":")
			const emoji = parts[1]
			return emoji
		}
		return ""
	}

	return (
		agent && (
			<div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
				<img
					className='media-object'
					src={`assets/characters/profile/${agent.spriteName}.png`}
					style={{ width: "2em" }}
					onClick={() => onCharacterClick(agent.character)}
				></img>
				<div>{agent.name}</div>
				<div>{`(${agent.currTile[0]}, ${agent.currTile[1]})`}</div>
				<div>{getEmoji()}</div>
			</div>
		)
	)
}
