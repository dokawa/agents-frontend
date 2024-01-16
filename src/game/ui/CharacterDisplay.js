import { getInitials } from "../update/utils"
import { getTagIdName } from "../update/utils"

export const CharacterDisplay = ({ agent, onCharacterClick }) => {
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
				<div id={getTagIdName(agent.key, "pronunciatio")}></div>
				<div id={getTagIdName(agent.key, "position")} style={{ width: "6em" }}>
					{"(NA, NA)"}
				</div>
				<div className='' style={{ width: "20em" }}></div>
			</div>
		)
	)
}
