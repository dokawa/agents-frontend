import { WIDTH, HEIGHT, STEP, SEC_PER_STEP, PLAY_SPEED } from "./constants"

const pre_anims_direction_dict = {}
let anims_direction = {}
let movement_speed = PLAY_SPEED
let movement_target = {}
let sec_per_step = SEC_PER_STEP

// <step> -- one full loop around all three phases determined by <phase> is
// a step. We use this to link the steps in the backend.
// let sim_code = "{{sim_code}}";
let step_size = sec_per_step * 1000 // 10 seconds = 10000

export const updateGenerator = (
	personas,
	all_movement,
	speech_bubbles,
	pronunciatios,
	playerRef,
	mapRef,
	start_datetime,
) =>
	function update(time, delta) {
		let step = STEP
		let phase = "execute"

		const { height: canvasHeight, width: canvasWidth, tileWidth } = mapRef.current
		const execute_count_max = tileWidth / movement_speed

		// # execute_movement["persona"][curr_persona_name]
		let execute_movement = {
			persona: {
				Abigail_Chen: {
					movement: [20, 20],
					description: "Something",
				},
			},
		}
		let execute_count = execute_count_max
		// console.log("execute_count", execute_count)
		const player = playerRef.current
		const inputKeyboard = this.input.keyboard

		let curr_maze = "the_ville"

		// TODO figure out what is this
		let sim_code = "ABCD"

		// *** SETUP PLAY AND PAUSE BUTTON ***
		let play_context = this
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
		} else if (phase == "update") {
			// Update is where we * wait * for the backend server to finish
			// computing about what the personas will do next given their current
			// situation.
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
			// 					execute_movement = JSON.parse(update_xobj.responseText)
			// 					phase = "execute"
			// 				}
			// 				timer = timer_max
			// 			}
			// 		}
			// 	})
			// 	update_xobj.send(JSON.stringify({ step: step, sim_code: sim_code }))
			// }
			// timer = timer - 1
		} else {
			// This is where we actually move the personas in the visual world. Each
			// backend computation in execute_movement moves each persona by one tile
			// (or some personas might not move if they choose not to).
			// The execute_count_max is computed by tileWidth/movement_speed, which
			// defines a one step sequence in this world.
			// document.getElementById("game-time-content").innerHTML = execute_movement["meta"]["curr_time"]
			for (let i = 0; i < Object.keys(personas).length; i++) {
				let curr_persona_name = Object.keys(personas)[i]
				let curr_persona = personas[curr_persona_name]
				let curr_pronunciatio = pronunciatios[Object.keys(personas)[i]]

				const personaAction = execute_movement["persona"][curr_persona_name]

				if (execute_count == execute_count_max) {
					let curr_x = personaAction["movement"][0]
					let curr_y = personaAction["movement"][1]
					movement_target[curr_persona_name] = [curr_x * tileWidth, curr_y * tileWidth]
					let pronunciatio_content = personaAction["pronunciatio"]
					// This is what gives the pronunciatio balloon the name initials. We
					// use regex to extract the initials of the personas.
					// E.g., "Dolores Murphy" -> "DM"
					let rgx = new RegExp(/(\p{L}{1})\p{L}+/, "gu")
					let initials = [...curr_persona_name.matchAll(rgx)] || []
					initials = ((initials.shift()?.[1] || "") + (initials.pop()?.[1] || "")).toUpperCase()
					pronunciatios[curr_persona_name].setText(initials + ": " + pronunciatio_content)
				}

				// console.log(curr_persona_name)
				if (execute_count > 0) {
					if (curr_persona.body.x < movement_target[curr_persona_name][0]) {
						curr_persona.body.x += movement_speed
						anims_direction = "r"
						pre_anims_direction_dict[curr_persona_name] = "r"
					} else if (curr_persona.body.x > movement_target[curr_persona_name][0]) {
						curr_persona.body.x -= movement_speed
						anims_direction = "l"
						pre_anims_direction_dict[curr_persona_name] = "l"
					} else if (curr_persona.body.y < movement_target[curr_persona_name][1]) {
						curr_persona.body.y += movement_speed
						anims_direction = "d"
						pre_anims_direction_dict[curr_persona_name] = "d"
					} else if (curr_persona.body.y > movement_target[curr_persona_name][1]) {
						curr_persona.body.y -= movement_speed
						anims_direction = "u"
						pre_anims_direction_dict[curr_persona_name] = "u"
					} else {
						anims_direction = ""
					}

					curr_pronunciatio.x = curr_persona.body.x - 6
					curr_pronunciatio.y = curr_persona.body.y - 42 - 32 // DEBUG 1 --- I added 32 offset on Dec 29.

					if (anims_direction == "l") {
						curr_persona.anims.play(curr_persona_name + "-left-walk", true)
					} else if (anims_direction == "r") {
						curr_persona.anims.play(curr_persona_name + "-right-walk", true)
					} else if (anims_direction == "u") {
						curr_persona.anims.play(curr_persona_name + "-up-walk", true)
					} else if (anims_direction == "d") {
						curr_persona.anims.play(curr_persona_name + "-down-walk", true)
					} else {
						curr_persona.anims.stop()

						// If we were moving, pick an idle frame to use
						if (pre_anims_direction_dict[curr_persona_name] == "l")
							curr_persona.setTexture(curr_persona_name, "left")
						else if (pre_anims_direction_dict[curr_persona_name] == "r")
							curr_persona.setTexture(curr_persona_name, "right")
						else if (pre_anims_direction_dict[curr_persona_name] == "u")
							curr_persona.setTexture(curr_persona_name, "up")
						else if (pre_anims_direction_dict[curr_persona_name] == "d")
							curr_persona.setTexture(curr_persona_name, "down")
						// console.log("curr_persona", curr_persona)
					}
				} else {
					// Once we are done moving the personas, we move on to the "process"
					// stage where we will send the current locations of all personas at the
					// end of the movemments to the frontend server, and then the backend.
					for (let i = 0; i < Object.keys(personas).length; i++) {
						let curr_persona_name = Object.keys(personas)[i]
						let curr_persona = personas[curr_persona_name]
						curr_persona.body.x = movement_target[curr_persona_name][0]
						curr_persona.body.y = movement_target[curr_persona_name][1]
					}
					phase = "process"
					execute_count = execute_count_max + 1
					step = step + 1
				}
			}

			// Filling in the action description.
			if (execute_count == execute_count_max) {
				for (let i = 0; i < Object.keys(personas).length; i++) {
					let action_description = ""
					let curr_persona_name = Object.keys(personas)[i]
					let curr_persona_name_os = curr_persona_name.replace(/ /g, "_")
					let description_content = execute_movement["persona"][curr_persona_name]["description"]
					let chat_content = ""

					if (execute_movement["persona"][curr_persona_name]["chat"] != null) {
						for (let j = 0; j < execute_movement["persona"][curr_persona_name]["chat"].length; j++) {
							chat_content +=
								execute_movement["persona"][curr_persona_name]["chat"][j][0] +
								": " +
								execute_movement["persona"][curr_persona_name]["chat"][j][1] +
								"<br>"
						}
					} else {
						chat_content = "<em>None at the moment</em>"
					}
					// action_description += description_content + "<br>";

					// document.getElementById("current_action__" + curr_persona_name_os).innerHTML =
					// 	description_content.split("@")[0]
					// document.getElementById("target_address__" + curr_persona_name_os).innerHTML =
					// 	description_content.split("@")[1]
					// document.getElementById("chat__" + curr_persona_name_os).innerHTML = chat_content
				}
			}

			execute_count = execute_count - 1
		}
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

	// TODO add if player is camera

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
