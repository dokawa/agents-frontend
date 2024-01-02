import { WIDTH, HEIGHT, STEP, SEC_PER_STEP, PLAY_SPEED } from "../../constants"
import { performExecutePhase } from "./performExecute"

const movement_speed = PLAY_SPEED

let sec_per_step = SEC_PER_STEP

// <step> -- one full loop around all three phases determined by <phase> is
// a step. We use this to link the steps in the backend.
// let sim_code = "{{sim_code}}";
let step_size = sec_per_step * 1000 // 10 seconds = 10000

export const updateGenerator = (
	personas,
	speech_bubbles,
	movements,
	pronunciatios,
	playerRef,
	mapRef,
	start_datetime,
) =>
	function update(time, delta) {
		let step = STEP
		let phase = "execute"

		const currentMovements = movements[step]

		const { height: canvasHeight, width: canvasWidth, tileWidth } = mapRef.current
		const execute_count_max = tileWidth / movement_speed

		let execute_count = execute_count_max
		// console.log("execute_count", execute_count)
		const player = playerRef.current
		const inputKeyboard = this.input.keyboard

		let curr_maze = "the_ville"

		// TODO figure out what is this
		let sim_code = "ABCD"

		let play_context = this

		setupPlayAndPauseButtons(play_context)

		moveCamera(player, inputKeyboard, canvasWidth, canvasHeight, tileWidth)

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
			phase = performProcessPhase(step, sim_code, personas, curr_maze, tileWidth, phase)

			// TODO fix update logic
		} else if (phase == "update") {
			// Update is where we * wait * for the backend server to finish
			// computing about what the personas will do next given their current
			// situation.

			const updateResult = performUpdatePhase(step, currentMovements, phase, sim_code)
			// currentMovements = updateResult.currentMovements
			phase = updateResult.phase
		} else {
			// This is where we actually move the personas in the visual world. Each
			// backend computation in currentMovements moves each persona by one tile
			// (or some personas might not move if they choose not to).
			// The execute_count_max is computed by tileWidth/movement_speed, which
			// defines a one step sequence in this world.
			// document.getElementById("game-time-content").innerHTML = currentMovements["meta"]["curr_time"]

			const executeResult = performExecutePhase(
				personas,
				speech_bubbles,
				pronunciatios,
				currentMovements,
				execute_count,
				execute_count_max,
				tileWidth,
				phase,
				step,
			)
			execute_count = executeResult.execute_count
			phase = executeResult.phase
			step = executeResult.step
		}
	}

const setupPlayAndPauseButtons = (play_context) => {
	// function game_resume() {
	// 	play_context.scene.resume();
	// }
	// play_button.onclick = function(){
	// 	game_resume();
	// };
	// function game_pause() {
	// 	play_context.scene.pause();
	// }
	// pause_button.onclick = function(){
	// 	game_pause();
	// };
}

const moveCamera = (player, inputKeyboard, canvasWidth, canvasHeight, tileWidth) => {
	// *** MOVE CAMERA ***
	// This is where we finish up the camera setting we started in the create()
	// function. We set the movement speed of the camera and wire up the keys to
	// map to the actual movement.
	const camera_speed = 800

	const cursors = inputKeyboard.createCursorKeys()

	// Stop any previous movement from the last frame
	player.body.setVelocity(0)

	const tileBoundaryXOffset = WIDTH / 2
	const tileBoundaryYOffset = HEIGHT / 2

	// TODO add if player is camera because we are restricting movement below

	const tileHeight = tileWidth
	if (
		(cursors.left.isDown || inputKeyboard.addKey("A").isDown) &&
		player.body.x > tileBoundaryXOffset
	) {
		player.body.setVelocityX(-camera_speed)
	}
	if (
		(cursors.up.isDown || inputKeyboard.addKey("W").isDown) &&
		player.body.y > tileBoundaryYOffset
	) {
		player.body.setVelocityY(-camera_speed)
	}
	if (
		(cursors.right.isDown || inputKeyboard.addKey("D").isDown) &&
		player.body.x < canvasWidth * tileWidth - tileBoundaryXOffset
	) {
		player.body.setVelocityX(camera_speed)
	}
	if (
		(cursors.down.isDown || inputKeyboard.addKey("S").isDown) &&
		player.body.y < canvasHeight * tileHeight - tileBoundaryYOffset
	) {
		player.body.setVelocityY(camera_speed)
	}
}

function performUpdatePhase(step, currentMovements, phase, sim_code) {
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
	// return { currentMovements, phase }
}

const performProcessPhase = (step, sim_code, personas, curr_maze, tileWidth, phase) => {
	// "process" takes all current locations of the personas and send them to
	// the frontend server in a json form. Here, we first create the json
	// file that records all persona locations:
	let data = { step: step, sim_code: sim_code, environment: {} }
	for (let i = 0; i < Object.keys(personas).length; i++) {
		let persona_name = Object.keys(personas)[i]
		data["environment"][persona_name] = {
			maze: curr_maze,
			x: Math.ceil(personas[persona_name].body.position.x / tileWidth),
			y: Math.ceil(personas[persona_name].body.position.y / tileWidth),
		}
	}
	var json = JSON.stringify(data)
	// We then send this to the frontend server:
	// TODO make request here
	// var retrieve_xobj = new XMLHttpRequest()
	// retrieve_xobj.overrideMimeType("application/json")
	// retrieve_xobj.open("POST", "{% url 'process_environment' %}", true)
	// retrieve_xobj.send(json)
	// Finally, we update the phase variable to start the "udpate" process.
	// Now that we sent all persona locations to the backend server, we need
	// to wait until the backend determines what the personas will do next.
	phase = "update"
	return phase
}
