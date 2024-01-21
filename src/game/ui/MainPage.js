import { CharacterDisplay } from "./CharacterDisplay"
import { Position } from "./Position"

export const MainPage = ({ agents, onCharacterClick }) => {
	return (
		<div>
			<div id='game-container' style={{ textAlign: "center" }}></div>
			<hr style={{ borderColor: "#999999" }} />
			<div style={{ width: "55%", margin: "0 auto", marginTop: "1em" }}>
				<h3 style={{ marginBottom: "-0.5em", fontSize: "1em" }}>Current Time:</h3>
				<div className='row'>
					<div className='col-md-8' id='game-time' style={{}}>
						<h2>
							<span id='game-time-content'></span>
						</h2>
					</div>

					<div className='col-md-4'>
						<Position x={2} y={3} />
						<h2 style={{ textAlign: "right" }}>
							<button id='play-button' type='button' className='btn btn-default'>
								<strong style={{ fontSize: "1.2em" }}>
									<i className='glyphicon glyphicon-play'></i> &nbsp;Play
								</strong>
							</button>

							<button id='pause-button' type='button' className='btn btn-default'>
								<strong style={{ fontSize: "1.2em" }}>
									<i className='glyphicon glyphicon-pause'></i> &nbsp;Pause
								</strong>
							</button>

							<button id='reset-button' type='button' className='btn btn-default'>
								<strong style={{ fontSize: "1.2em" }}>
									<i className='glyphicon glyphicon-pause'></i> &nbsp;Reset
								</strong>
							</button>
						</h2>
					</div>
					{agents &&
						agents.map((agent, index) => (
							<CharacterDisplay key={index} agent={agent} onCharacterClick={onCharacterClick} />
						))}
				</div>
			</div>
		</div>
	)
}
