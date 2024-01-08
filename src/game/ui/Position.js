export const Position = ({ x, y }) => (
	<div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
		<div id='position-x'>{x}</div>
		<div id='position-y'>{y}</div>
	</div>
)
