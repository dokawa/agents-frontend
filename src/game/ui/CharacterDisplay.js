export const CharacterDisplay = ({ agent, pronunciatios }) => {
	console.log("pronun", pronunciatios)
	return (
		agent && (
			<div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
				<img
					className='media-object'
					src={`assets/characters/profile/${agent.spriteName}.png`}
					style={{ width: "2em" }}
				></img>
				<div>{agent.name}</div>
				<div>{pronunciatios[agent.agentKey]}</div>
			</div>
		)
	)
}
