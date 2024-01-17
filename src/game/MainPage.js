import { CharacterEntry } from "./ui/CharacterEntry"
import { Position } from "./ui/Position"

export const MainPage = ({ agents, pronunciatios }) => {
	return (
		<div>
			<div id='game-container' style={{ textAlign: "center" }}></div>

			<div style={{ width: "55%", margin: "0 auto", marginTop: "4.5em" }}>
				<h3 style={{ marginBottom: "-0.5em", fontSize: "1.5em" }}>Current Time:</h3>
				<div className='row'>
					<div className='col-md-8' id='game-time' style={{}}>
						<h2>
							<span id='game-time-content'></span>
						</h2>
					</div>
					<div className='col-md-4'>
						<Position x={2} y={3} />
						<h2 style={{ textAlign: "right" }}>
							<button id='play_button' type='button' className='btn btn-default'>
								<strong style={{ fontSize: "1.2em" }}>
									<i className='glyphicon glyphicon-play'></i> &nbsp;Play
								</strong>
							</button>

							<button id='pause_button' type='button' className='btn btn-default'>
								<strong style={{ fontSize: "1.2em" }}>
									<i className='glyphicon glyphicon-pause'></i> &nbsp;Pause
								</strong>
							</button>
						</h2>
					</div>
					{agents &&
						agents.map((agent) => (
							<CharacterEntry key={agent.agentKey} agent={agent} pronunciatios={pronunciatios} />
						))}
				</div>
			</div>

			<hr style={{ borderColor: "#999999" }} />

			<div style={{ paddingBottom: "15em" }}></div>
		</div>
	)
}
