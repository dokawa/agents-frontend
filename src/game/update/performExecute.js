import { PLAY_SPEED } from "../../constants"

const movement_speed = PLAY_SPEED
const movement_target = {}
let anims_direction = {}
const pre_anims_direction_dict = {}

export const performExecutePhase = (
	personas,
	pronunciatios,
	execute_movement,
	execute_count,
	execute_count_max,
	tileWidth,
	phase,
	step,
) => {
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
	return { execute_count, phase, step }
}
