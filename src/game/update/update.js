import { useEffect } from "react"
import { STEP, SEC_PER_STEP, PLAY_SPEED } from "../../constants"
import { performExecutePhase } from "./performExecute"
import { moveCamera } from "./moveCamera"
import { useSimulations } from "../../hooks/useSimulations"
import SimulationsApi from "../../api/SimulationsApi"

let sec_per_step = SEC_PER_STEP

// <step> -- one full loop around all three phases determined by <phase> is
// a step. We use this to link the steps in the backend.
// let sim_code = "{{sim_code}}";
let step_size = sec_per_step * 1000 // 10 seconds = 10000
let requested
let movements

export const updateGenerator = (
	simulationId,
	personas,
	speech_bubbles,
	pronunciatios,
	setPronunciatios,
	playerRef,
	cameraModeRef,
	mapRef,
	stepRef,
	start_datetime,
	phase,
	executeCount,
	executeCountMax,
	decrementExecuteCount,
	finishExecuteCount,
	resetExecuteCount,
) =>
	function update(time, delta) {
		const step = stepRef.current

		const { height: canvasHeight, width: canvasWidth, tileWidth } = mapRef.current

		// console.log("executeCount", executeCount)
		const player = playerRef.current
		const inputKeyboard = this.input.keyboard

		let curr_maze = "the_ville"

		// TODO figure out what is this
		let sim_code = "ABCD"

		let play_context = this

		setupPlayAndPauseButtons(play_context)

		moveCamera(player, cameraModeRef, inputKeyboard, canvasWidth, canvasHeight, tileWidth)

		// TODO add forms to get current focus

		//   let curr_focused_persona = document.getElementById("temp_focus").textContent;
		//   if (curr_focused_persona != "") {
		//   	player.body.x = personas[curr_focused_persona].body.x;
		//   	player.body.y = personas[curr_focused_persona].body.y;
		//   	document.getElementById("temp_focus").innerHTML = "";
		//   }

		// *** MOVE PERSONAS ***
		// Moving personas take place in three distinct phases: "process," "update,"
		// and "execute." These phases are determined by the value of <phase>.
		// Only one of the three phases is incurred in each update cycle.
		if (phase == "process") {
			phase = performProcessPhase(simulationId, step, sim_code, personas, curr_maze, tileWidth, phase)
			console.log("process")
			// TODO fix update logic
		} else if (phase == "update") {
			// Update is where we * wait * for the backend server to finish
			// computing about what the personas will do next given their current
			// situation.

			phase = performUpdatePhase(step, phase, sim_code)
			console.log("update")
		} else {
			// This is where we actually move the personas in the visual world. Each
			// backend computation in currentMovements moves each persona by one tile
			// (or some personas might not move if they choose not to).
			// The executeCountMax is computed by tileWidth/movement_speed, which
			// defines a one step sequence in this world.
			// document.getElementById("game-time-content").innerHTML = currentMovements["meta"]["curr_time"]
			console.log("execute")
			if (!movements) {
				return
			}

			const currentMovements = movements[step]

			phase = performExecutePhase(
				personas,
				speech_bubbles,
				pronunciatios,
				setPronunciatios,
				currentMovements,
				executeCount,
				executeCountMax,
				tileWidth,
				phase,
				decrementExecuteCount,
				finishExecuteCount,
				resetExecuteCount,
				stepRef,
			)
		}
	}

const setupPlayAndPauseButtons = (play_context) => {
	var play_button = document.getElementById("play_button")
	var pause_button = document.getElementById("pause_button")

	if (play_button) {
		play_button.onclick = () => {
			play_context.scene.resume()
		}
	}

	if (pause_button) {
		pause_button.onclick = () => {
			play_context.scene.pause()
		}
	}
}

const performProcessPhase = async (
	simulationId,
	step,
	sim_code,
	personas,
	curr_maze,
	tileWidth,
	phase,
) => {
	// if (!requested && canMakeRequest(step)) {
	// 	requested = true
	// 	movements = await SimulationsApi.step(simulationId)

	// 	requested = false
	// }

	if (!movements || !(step in movements)) {
		SimulationsApi.step(simulationId).then((newMovements) => {
			movements = { ...movements, ...newMovements }
		})
	}

	console.log("movements", movements)

	phase = "update"
	return phase
}

function performUpdatePhase(step, phase, sim_code) {
	// We do this by continuously asking the backend server if it is ready.
	// The backend server is ready when it returns a json that has a key-val
	// pair with "<move>": true.
	// Note that we do not want to overburden the backend too much by
	// over-querying; so, we have a timer set so we only query it once every
	// timer_max cycles.
	// if (timer <= 0) {
	// 	var update_xobj = new XMLHttpRequest()
	// 	update_xobj.overrideMimeType("application/json")
	// 	update_xobj.open("POST", "{% url 'update_environment' %}", true)
	// 	update_xobj.addEventListener("load", function () {
	// 		if (this.readyState === 4) {
	// 			if (update_xobj.status === 200) {
	// 				if (JSON.parse(update_xobj.responseText)["<step>"] == step) {
	// 					currentMovements = JSON.parse(update_xobj.responseText)
	// 					phase = "execute"
	// 				}
	// 				timer = timer_max
	// 			}
	// 		}
	// 	})
	// 	update_xobj.send(JSON.stringify({ step: step, sim_code: sim_code }))
	// }
	// timer = timer - 1

	phase = "execute"
	return phase
}

const canMakeRequest = (step) => {
	// If our step is not past the movements length
	if (movements) {
		return step > Object.keys(movements).length
	}

	return true
}
