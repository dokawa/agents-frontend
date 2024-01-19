import { getInitials } from "../update/utils"

export const CharacterDisplay = ({ agent, onCharacterClick }) => {
	const getEmoji = () => {
		if (pronunciatios[agent.key]) {
			const content = pronunciatios[agent.key].text
			const parts = content.split(":")
			const emoji = parts[1]
			return emoji
		}
		return ""
	}

	const getPosition = () => {
		const tile = movements && movements[agent.key] && movements[agent.key].movement
		console.log("tile", tile)
		return tile ? `(${tile[0]}, ${tile[1]})` : "(NA, NA)"
	}

	return (
		agent && (
			<div style={{ display: "flex", flexDirection: "row", justifyContent: "left" }}>
				<img
					className='media-object'
					src={`assets/characters/profile/${agent.spriteName}.png`}
					style={{ width: "2em" }}
					onClick={() => onCharacterClick(agent.character)}
				></img>
				<div style={{ width: "2em" }}>{getInitials(agent.name)}</div>
				<div>{getEmoji()}</div>
				<div style={{ width: "6em" }}>{getPosition()}</div>
				<div style={{ width: "20em" }}>{agent.plan.description}</div>
			</div>
		)
	)
}
