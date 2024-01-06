import {
	PLAY_SPEED,
	PRONUNCIATIO_X_OFFSET,
	PRONUNCIATIO_Y_OFFSET,
	SPEECH_BUBBLE_X_OFFSET,
	SPEECH_BUBBLE_Y_OFFSET,
} from "../../constants"

const movement_speed = PLAY_SPEED
const movement_target = {}
const pre_anims_direction_dict = {}

export const performExecutePhase = (
	personas,
	speech_bubbles,
	pronunciatios,
	execute_movement,
	executeCount,
	executeCountMax,
	tileWidth,
	phase,
	decrementExecuteCount,
	finishExecuteCount,
	resetExecuteCount,
	stepRef,
) => {
	const allFinished = () => {
		for (let personaName in executeCount) {
			if (executeCount[personaName] !== executeCountMax + 1) {
				return false
			}
		}
		return true
	}

	const isFirstIteration = (personaName) => {
		return executeCount[personaName] == executeCountMax
	}
	// console.log("executeCount", executeCount, stepRef.current)

	for (let i = 0; i < Object.keys(personas).length; i++) {
		let curr_persona_name = Object.keys(personas)[i]
		let curr_persona = personas[curr_persona_name]
		let curr_speech_bubble = speech_bubbles[Object.keys(personas)[i]]
		let curr_pronunciatio = pronunciatios[Object.keys(personas)[i]]

		if (!execute_movement || !execute_movement[curr_persona_name]) {
			finishExecuteCount(curr_persona_name)
		} else if (isFirstIteration(curr_persona_name)) {
			const personaAction = execute_movement[curr_persona_name]

			let curr_x = personaAction[0]
			let curr_y = personaAction[1]
			movement_target[curr_persona_name] = [curr_x * tileWidth, curr_y * tileWidth]
			let pronunciatio_content = personaAction["pronunciatio"]

			let initials = getInitials(curr_persona_name)
			pronunciatios[curr_persona_name].setText(initials + ": " + pronunciatio_content)
		}

		// console.log(curr_persona_name)
		if (executeCount[curr_persona_name] > 0) {
			playAnimation(curr_persona, curr_persona_name, movement_target)

			curr_pronunciatio.x = curr_persona.body.x + PRONUNCIATIO_X_OFFSET
			curr_pronunciatio.y = curr_persona.body.y + PRONUNCIATIO_Y_OFFSET
			curr_speech_bubble.x = curr_persona.body.x + SPEECH_BUBBLE_X_OFFSET
			curr_speech_bubble.y = curr_persona.body.y + SPEECH_BUBBLE_Y_OFFSET
		} else {
			// Once we are done moving the personas, we move on to the "process"
			// stage where we will send the current locations of all personas at the
			// end of the movemments to the frontend server, and then the backend.

			let curr_persona_name = Object.keys(personas)[i]
			let curr_persona = personas[curr_persona_name]
			// console.log("target", curr_persona_name, movement_target[curr_persona_name][0])
			// console.log(
			// 	"movement_target",
			// 	curr_persona_name,
			// 	movement_target,
			// 	movement_target[curr_persona_name],
			// )
			movement_target[curr_persona_name][0]
			curr_persona.x = movement_target[curr_persona_name][0]
			curr_persona.y = movement_target[curr_persona_name][1]

			finishExecuteCount(curr_persona_name)

			if (allFinished()) {
				phase = "process"
			}
			// console.log("finished")
		}

		if (curr_persona_name == "abigailChen") {
			console.log(
				"personaMovement",
				curr_persona_name,
				movement_target[curr_persona_name],
				[curr_persona.body.x, curr_persona.body.y],
				[curr_persona.x, curr_persona.y],
				executeCount[curr_persona_name],
			)
		}
	}

	// Filling in the action description.
	// if (executeCount == executeCountMax) {
	// 	for (let i = 0; i < Object.keys(personas).length; i++) {
	// 		// let action_description = ""
	// 		let curr_persona_name = Object.keys(personas)[i]
	// 		// let curr_persona_name_os = curr_persona_name.replace(/ /g, "_")
	// 		// let description_content = execute_movement["persona"][curr_persona_name]["description"]
	// 		let chat_content = ""

	// 		if (execute_movement[curr_persona_name]["chat"] != null) {
	// 			for (let j = 0; j < execute_movement[curr_persona_name]["chat"].length; j++) {
	// 				chat_content +=
	// 					execute_movement[curr_persona_name]["chat"][j][0] +
	// 					": " +
	// 					execute_movement[curr_persona_name]["chat"][j][1] +
	// 					"<br>"
	// 			}
	// 		} else {
	// 			chat_content = "<em>None at the moment</em>"
	// 		}
	// 		// action_description += description_content + "<br>";
	// 		// document.getElementById("current_action__" + curr_persona_name_os).innerHTML =
	// 		// 	description_content.split("@")[0]
	// 		// document.getElementById("target_address__" + curr_persona_name_os).innerHTML =
	// 		// 	description_content.split("@")[1]
	// 		// document.getElementById("chat__" + curr_persona_name_os).innerHTML = chat_content
	// 	}
	// }

	if (allFinished()) {
		stepRef.current = stepRef.current + 1
		// console.log("allfinished", executeCountMax)
		resetExecuteCount()
	} else {
		decrementExecuteCount()
	}
	return { executeCount, phase }
}

const getInitials = (curr_persona_name) => {
	// This is what gives the pronunciatio balloon the name initials. We
	// use regex to extract the initials of the personas.
	// E.g., "Dolores Murphy" -> "DM"
	return getInitialsFromCamelCase(curr_persona_name)
}

const getInitialsFromSnakeCase = (curr_persona_name) => {
	let rgx = new RegExp(/(\p{L}{1})\p{L}+/, "gu")
	let initials = [...curr_persona_name.matchAll(rgx)] || []
	initials = ((initials.shift()?.[1] || "") + (initials.pop()?.[1] || "")).toUpperCase()
	return initials
}

const getInitialsFromCamelCase = (curr_persona_name) => {
	const words = curr_persona_name.match(/[A-Z]*[^A-Z]*/g)

	// Extract the first letter from each word and concatenate them
	const initials = words.map((word) => word.charAt(0)).join("")

	return initials.toUpperCase()
}

const updateDirection = (curr_persona, curr_persona_name, direction) => {
	pre_anims_direction_dict[curr_persona_name] = direction
	curr_persona.anims.play(curr_persona_name + "-" + direction + "-walk", true)
}

const playAnimation = (curr_persona, curr_persona_name, movement_target) => {
	const personaMovement = movement_target[curr_persona_name]

	if (!personaMovement) {
		return
	}

	if (curr_persona.body.x < personaMovement[0]) {
		curr_persona.x += movement_speed
		updateDirection(curr_persona, curr_persona_name, "right")
	} else if (curr_persona.body.x > personaMovement[0]) {
		curr_persona.x -= movement_speed
		updateDirection(curr_persona, curr_persona_name, "left")
	} else if (curr_persona.body.y < personaMovement[1]) {
		curr_persona.y += movement_speed
		updateDirection(curr_persona, curr_persona_name, "down")
	} else if (curr_persona.body.y > personaMovement[1]) {
		curr_persona.y -= movement_speed
		updateDirection(curr_persona, curr_persona_name, "up")
	} else {
		curr_persona.anims.stop()

		const idleFrame = pre_anims_direction_dict[curr_persona_name]

		if (idleFrame) {
			curr_persona.setTexture(curr_persona_name, idleFrame)
		}
	}
}
